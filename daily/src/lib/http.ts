import axios, { AxiosInstance, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import { LocalStorage } from '@/constants/storage';
import router from '@/router/index';
import { useAuthStore } from '@/storage/auth';
import { refeshToken } from '@/services/request';

let service: AxiosInstance | null = null;

// Token 刷新状态管理
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * 处理等待刷新 token 的队列
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};



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

  // 请求拦截器
  service.interceptors.request.use(
    (config) => {
    
      // 确保 headers 存在
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      // 获取 access_token
      const auth = useAuthStore();
      let accessToken = '';

      if (auth.accessToken) {
        accessToken = (auth.accessToken as any).value || auth.accessToken;
      }

  

      // 动态设置 accessToken 认证头
    
      if (accessToken) {
        const authHeader = `Bearer ${accessToken}`;
        (config.headers as AxiosRequestHeaders)['ACCESS_TOKEN'] = authHeader;
      } else {
        console.log('No token found, satoken header not set');
        delete (config.headers as AxiosRequestHeaders)['ACCESS_TOKEN'];
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
          if(code==410){
            const auth = useAuthStore();
            const originalRequest = response.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // 如果已经在重试，直接跳转登录页
            if (originalRequest._retry) {
              auth.logout();
              localStorage.removeItem(LocalStorage.TOKEN);
              router.push('/login');
              return Promise.reject(new Error('Token 刷新失败，请重新登录'));
            }

            // 如果正在刷新 token，将请求加入队列
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  if (originalRequest.headers) {
                    (originalRequest.headers as AxiosRequestHeaders)['ACCESS_TOKEN'] = `Bearer ${token}`;
                  }
                  return service!(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            // 开始刷新 token
            isRefreshing = true;

            return refeshToken()
              .then((newAccessToken) => {
                // 更新 store 中的 accessToken
                auth.setAccessToken(newAccessToken);

                // 处理队列中的请求
                processQueue(null, newAccessToken);

                // 更新请求头并重放当前请求
                if (originalRequest.headers) {
                  (originalRequest.headers as AxiosRequestHeaders)['ACCESS_TOKEN'] = `Bearer ${newAccessToken}`;
                }
                return service!(originalRequest);
              })
              .catch((err) => {
                // 刷新失败，处理队列中的请求
                processQueue(err, null);
                auth.logout();
                localStorage.removeItem(LocalStorage.TOKEN);
                router.push('/login');
                return Promise.reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
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
        const code=error.response.data.code|| '';


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

  
           if(code==410){
            const auth = useAuthStore();
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // 如果已经在重试，直接跳转登录页
            if (originalRequest?._retry) {
              auth.logout();
              localStorage.removeItem(LocalStorage.TOKEN);
              router.push('/login');
              return Promise.reject(new Error('Token 刷新失败，请重新登录'));
            }

            // 如果正在刷新 token，将请求加入队列
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  if (originalRequest?.headers) {
                    (originalRequest.headers as AxiosRequestHeaders)['ACCESS_TOKEN'] = `Bearer ${token}`;
                  }
                  return getHttp()(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            // 开始刷新 token
            isRefreshing = true;

            return refeshToken()
              .then((newAccessToken) => {
                console.log("刷新成功")
                // 更新 store 中的 accessToken
                auth.setAccessToken(newAccessToken);

                // 处理队列中的请求
                processQueue(null, newAccessToken);

                // 更新请求头并重放当前请求
                if (originalRequest?.headers) {
                  (originalRequest.headers as AxiosRequestHeaders)['ACCESS_TOKEN'] = `Bearer ${newAccessToken}`;
                }
                return getHttp()(originalRequest);
              })
              .catch((err) => {
                // 刷新失败，处理队列中的请求
                processQueue(err, null);
                auth.logout();
                localStorage.removeItem(LocalStorage.TOKEN);
                router.push('/login');
                return Promise.reject(err);
              })
              .finally(() => {
                isRefreshing = false;
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
