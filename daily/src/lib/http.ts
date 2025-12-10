import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { LocalStorage } from '@/constants/storage';
import router from '@/router/index';
import { useAuthStore } from '@/storage/auth';

let service: AxiosInstance | null = null;

// 错误消息缓存和防重复机制
const errorCache = new Map<string, number>();
const ERROR_CACHE_DURATION = 5000; // 5秒内相同错误只显示一次

/**
 * 检查并显示错误消息（防重复）
 */
const showErrorOnce = (errorMessage: string): void => {
  const now = Date.now();
  const lastShowTime = errorCache.get(errorMessage);

  // 如果相同错误在5秒内已经显示过，则不再重复显示
  if (lastShowTime && (now - lastShowTime) < ERROR_CACHE_DURATION) {
    return;
  }

  // 记录当前错误消息和时间戳
  errorCache.set(errorMessage, now);

  // 清理过期的错误缓存
  setTimeout(() => {
    errorCache.delete(errorMessage);
  }, ERROR_CACHE_DURATION);

  // 显示错误消息
  alert(errorMessage);

  // 定期清理整个缓存（避免内存泄漏）
  if (errorCache.size > 50) {
    const cutoff = now - ERROR_CACHE_DURATION;
    for (const [key, timestamp] of errorCache.entries()) {
      if (timestamp < cutoff) {
        errorCache.delete(key);
      }
    }
  }
};

// 导出一个函数，用于初始化 axios 实例
export function initHttp(): AxiosInstance {
  if (service) {
    return service;
  }

  service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '',
  });

  service.interceptors.request.use(
    (config) => {
      // 确保 headers 存在
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      // 获取 token
      const auth = useAuthStore();
      let token = '';

      if (auth.token) {
        token = (auth.token as any).value || auth.token;
      }

      // 备用方案：从 localStorage 直接获取
      if (!token) {
        token = localStorage.getItem(LocalStorage.TOKEN) || '';
      }

      // 调试日志
      console.log('HTTP Request Token Check:', {
        tokenValue: token,
        hasToken: !!token
      });

      // 动态设置 satoken 认证头
      if (token) {
        const authHeader = `Bearer ${token}`;
        console.log('Setting satoken header:', authHeader);
        (config.headers as AxiosRequestHeaders)['satoken'] = authHeader;
      } else {
        console.log('No token found, satoken header not set');
        delete (config.headers as AxiosRequestHeaders)['satoken'];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  service.interceptors.response.use(
    (response) => {
      // 检查响应数据结构
      const responseData = response.data;

      // 如果响应数据有 code 字段，进行错误码处理
      if (responseData && typeof responseData === 'object' && 'code' in responseData) {
        const code = responseData.code;
        const message = responseData.message || '请求失败';

        // 判断错误码范围
        if (code >= 400 && code < 600) {
          // 4xx, 5xx 错误码，使用防重复机制显示错误弹窗
          showErrorOnce(`错误 ${code}: ${message}`);

          // 特殊错误码处理
          if (code === 401) {
            // Token 无效，清除登录状态并跳转到登录页
            const auth = useAuthStore();
            auth.logout();
            localStorage.removeItem(LocalStorage.TOKEN);
            // 使用Vue Router进行路由跳转
            router.push('/login')
            console.log('Token无效，清除登录状态');
          }
        }
      }

      return response;
    },
    (error) => {
      // 处理 HTTP 状态码错误
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message || '网络请求失败';

        // 根据 HTTP 状态码显示错误
        if (status >= 400 && status < 600) {
          // 使用防重复机制显示错误
          showErrorOnce(`错误 ${status}: ${message}`);

          // 401 状态码特殊处理
          if (status === 401) {
            console.log('HTTP 401错误，清除登录状态');
            const auth = useAuthStore();
            auth.logout();
            localStorage.removeItem(LocalStorage.TOKEN);
            // 使用Vue Router进行路由跳转
            router.push('/login').catch(err => {
              console.error('路由跳转失败:', err);
              // 如果router跳转失败，降级使用window.location
              window.location.href = '/login';
            });
          }
        }
      } else if (error.request) {
        // 网络错误
        showErrorOnce('网络连接失败，请检查网络设置');
      } else {
        // 其他错误
        showErrorOnce(`请求错误: ${error.message}`);
      }

      return Promise.reject(error);
    }
  );

  return service;
}

// 为了方便，也可以导出一个获取实例的函数
export function getHttp(): AxiosInstance {
    if (!service) {
        return initHttp();
    }
    return service;
}
