import axios, { AxiosInstance } from 'axios';

let service: AxiosInstance | null = null;
let userStore: any = null;

// 导出一个函数，用于初始化 axios 实例
export function initHttp(store: any): AxiosInstance {
  if (service) {
    return service;
  }

  service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });

  // 保存 userStore 引用
  userStore = store;

  service.interceptors.request.use(
    (config) => {
      // 确保 headers 存在
      if (!config.headers) {
        config.headers = {};
      }

      // 获取 token，支持多种方式
      let token = '';

      // 方式 1：从 userStore 获取（支持 ref）
      if (userStore?.token) {
        const raw = userStore.token;
        token = (raw && typeof raw === 'object' && 'value' in raw) ? raw.value : raw;
      }

      // 方式 2：从 localStorage 直接获取（备用方案）
      if (!token) {
        token = localStorage.getItem('token') || '';
      }

      // 调试日志
      console.log('HTTP Request Token Check:', {
        userStoreExists: !!userStore,
        tokenFromStore: userStore?.token,
        tokenValue: token,
        hasToken: !!token
      });

      // 动态设置 satoken 认证头
      if (token) {
        const authHeader = `Bearer ${token}`;
        console.log('Setting satoken header:', authHeader);
        config.headers['satoken'] = authHeader;
      } else {
        console.log('No token found, satoken header not set');
        delete config.headers['satoken'];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return service;
}

// 为了方便，也可以导出一个获取实例的函数
export function getHttp(): AxiosInstance {
    if (!service) {
        throw new Error('Http service has not been initialized. Please call initHttp(store) first.');
    }
    return service;
}
