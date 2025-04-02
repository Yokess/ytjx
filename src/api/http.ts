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
    
    return response;
  },
  error => {
    console.error('响应错误:', error);
    
    // 如果是401错误，可能是token过期，清除本地存储
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      
      // 可以添加重定向到登录页的逻辑
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default http; 