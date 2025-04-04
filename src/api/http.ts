import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 创建axios实例
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    // 如果token存在，则添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['satoken'] = token;
    }
    
    console.log('发送请求:', {
      url: config.url, 
      method: config.method, 
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    console.log('接收响应:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
    // 检查响应中是否有token无效的信息
    if (response.data && response.data.code === 401) {
      console.error('响应中检测到401错误码，token可能已失效');
      // 清除登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      
      // 跳转到登录页
      window.location.href = '/login';
      return Promise.reject(new Error('登录状态已失效，请重新登录'));
    }
    
    return response;
  },
  error => {
    console.error('响应错误:', error);
    
    // 如果是401错误，可能是token过期，清除本地存储
    if (error.response && error.response.status === 401) {
      console.error('检测到401状态码，token已失效，清除登录状态并跳转登录页');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      
      // 检查当前是否不在登录页
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // 重定向到登录页的逻辑
        console.log('重定向到登录页...');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default http; 