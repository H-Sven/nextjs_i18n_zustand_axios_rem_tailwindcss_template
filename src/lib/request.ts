import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// 定义通用响应结构
export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
}

// 防止重复请求
const pendingMap = new Map<string, AbortController>();

/**
 * 生成唯一的请求 Key
 * @param config 请求配置
 */
const getPendingKey = (config: InternalAxiosRequestConfig) => {
  return [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&');
};

/**
 * 添加请求到 pendingMap
 * @param config 请求配置
 */
const addPending = (config: InternalAxiosRequestConfig) => {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const controller = pendingMap.get(pendingKey);
    controller?.abort();
    pendingMap.delete(pendingKey);
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(pendingKey, controller);
};

/**
 * 移除请求
 * @param config 请求配置
 */
const removePending = (config: InternalAxiosRequestConfig) => {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    pendingMap.delete(pendingKey);
  }
};

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 自动取消重复请求
    removePending(config);
    addPending(config);

    // 从 localStorage 或 store 获取 token
    if (typeof window !== 'undefined') {
      const storage = localStorage.getItem('user-storage');
      if (storage) {
        try {
          const { state } = JSON.parse(storage);
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        } catch (e) {
          console.error('Failed to parse user token', e);
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    removePending(response.config as InternalAxiosRequestConfig);
    return response.data;
  },
  (error: AxiosError) => {
    if (error.config) {
      removePending(error.config as InternalAxiosRequestConfig);
    }

    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    } else {
      // 统一错误处理
      const status = error.response?.status;
      switch (status) {
        case 401:
          console.error('Unauthorized');
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Not Found');
          break;
        case 500:
          console.error('Server Error');
          break;
        default:
          console.error('Network Error', error.message);
          break;
      }
    }
    return Promise.reject(error);
  },
);

/**
 * 封装 GET 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 其他配置
 */
export function get<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<Result<T>> {
  return service.get(url, { params, ...config });
}

/**
 * 封装 POST 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 其他配置
 */
export function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<Result<T>> {
  return service.post(url, data, config);
}

/**
 * 封装 PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 其他配置
 */
export function put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<Result<T>> {
  return service.put(url, data, config);
}

/**
 * 封装 DELETE 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 其他配置
 */
export function del<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<Result<T>> {
  return service.delete(url, { params, ...config });
}

/**
 * 封装 PATCH 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 其他配置
 */
export function patch<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<Result<T>> {
  return service.patch(url, data, config);
}

export default service;
