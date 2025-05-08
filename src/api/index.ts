// 导入所有依赖
import axios from 'axios';
import * as authApi from './authApi';
import * as userApi from './userApi';

// 导出API模块
export { authApi, userApi };
export * from './questionApi';
export * from './examApi';
export * from './communityApi';
export * from './aiApi';
export * from './questionSearchApi'

// API基础URL
const BASE_URL = process.env.REACT_APP_API_URL || '';

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    console.log('请求拦截器执行...');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('检测到token，添加到请求头:', token);
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['satoken'] = token;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('响应拦截器执行, 状态码:', response.status);
    
    // 如果接口返回401，说明token过期或无效
    if (response.data.code === 401) {
      console.warn('接收到401响应，清除登录状态');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      // 可以在这里添加重定向到登录页的逻辑
      window.location.href = '/login';
    }
    return response;
  },
  error => {
    console.error('响应错误:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      if (error.response.status === 401) {
        console.warn('接收到401错误，清除登录状态');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        // 可以在这里添加重定向到登录页的逻辑
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// 后续可以添加更多API模块的导出
// export * from './courseApi';
// export * from './examApi';
// 等等 