import http from './http';
import { User } from '../store/slices/authSlice';

// 登录接口参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  code: number;
  msg: string;
  data: {
    userId: number;
    username: string;
    token: string;
    expiresIn: number;
    refreshToken: string;
  };
}

// 注册接口参数
export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  gender?: number;   // 性别：1-男性，0-女性，2-其他
  major?: string;    // 专业
  target?: string;   // 考研目标
}

// 用户补充信息参数
export interface ProfileUpdateParams {
  userId: number;
  gender?: number;   // 性别：1-男性，0-女性，2-其他
  major?: string;    // 专业
  target?: string;   // 考研目标
}

// 注册响应
export interface RegisterResponse {
  code: number;
  msg: string;
  data: {
    userId: number;
    userName: string;
  };
}

// API基础URL
const BASE_URL = process.env.REACT_APP_API_URL || '';
console.log('API基础URL:', BASE_URL);

// 登录API
export const login = async (params: LoginParams): Promise<any> => {
  try {
    console.log('登录请求参数:', params);
    
    const response = await http.post<LoginResponse>('/auth/login', params);
    
    console.log('登录响应数据:', response.data);
    
    // 后端返回的code为200表示成功
    if (response.data.code === 200) {
      // 登录成功，保存token到localStorage
      console.log('登录成功，保存token和用户信息到localStorage');
      
      const { token, userId, username } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('username', username);
      
      // 返回成功响应，使用一致的数据结构
      return {
        success: true,
        message: response.data.msg,
        user: {
          id: userId.toString(),
          username: username
        },
        token: token,
        data: response.data.data
      };
    } else {
      // 登录失败
      console.error('登录失败:', response.data.msg);
      return {
        success: false,
        message: response.data.msg || '用户名或密码错误'
      };
    }
  } catch (error: any) {
    console.error('登录请求异常:', error);
    console.error('错误详情:', error.response || error.message);
    return {
      success: false,
      message: error.response?.data?.msg || '登录失败，请稍后再试'
    };
  }
};

// 注册API
export const register = async (userData: RegisterParams): Promise<any> => {
  try {
    console.log('注册请求, API地址:', BASE_URL, '请求数据:', userData);
    
    // 构建请求数据，将所有信息一次性发送给后端
    const registerData = {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      major: userData.major,
      target: userData.target
    };
    
    console.log('开始注册请求, 数据:', registerData);
    const response = await http.post(`/auth/register`, registerData);
    
    console.log('注册响应:', response.data);
    
    if (response.data.code === 200) {
      // 注册成功，获取到用户ID
      const userId = response.data.data.userId;
      const userName = response.data.data.userName;
      
      console.log('注册成功，用户ID:', userId, '用户名:', userName);
      
      // 保存登录状态
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('username', userData.username);
      }
      
      // 返回成功结果
      return {
        success: true,
        data: {
          userId: userId,
          userName: userName
        },
        message: '注册成功'
      };
    } else {
      // 注册失败
      return {
        success: false,
        message: response.data.msg || '注册失败'
      };
    }
  } catch (error: any) {
    console.error('注册错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '注册失败，请稍后再试'
    };
  }
};

// 退出登录
export const logout = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const response = await http.post('/auth/logout', {}, config);
    console.log('退出登录响应:', response.data);
    
    // 检查响应状态
    if (response.data.code === 200) {
      // 无论成功失败，都清除本地存储的登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      
      return {
        success: true,
        message: response.data.msg || '退出成功'
      };
    } else {
      console.error('退出登录失败:', response.data.msg);
      return {
        success: false,
        message: response.data.msg || '退出失败'
      };
    }
  } catch (error: any) {
    console.error('退出登录错误:', error);
    // 即使API调用失败，也清除本地登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    return {
      success: false,
      message: error.response?.data?.msg || '退出失败，但已清除本地登录信息'
    };
  }
};

// 检查登录状态
export const checkLoginStatus = async (): Promise<any> => {
  try {
    // 先检查本地存储中是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('本地无token，用户未登录');
      return {
        success: false,
        isLoggedIn: false,
        message: '未登录'
      };
    }
    
    // 调用后端接口验证登录状态
    const response = await http.get('/auth/check');
    console.log('检查登录状态响应:', response.data);
    
    if (response.data.code === 200) {
      // 根据后端返回的布尔值确定登录状态
      const isLoggedIn = response.data.data === true;
      
      if (!isLoggedIn) {
        // 如果后端返回未登录，清除本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
      }
      
      return {
        success: true,
        isLoggedIn,
        message: isLoggedIn ? '已登录' : '未登录'
      };
    } else {
      console.error('检查登录状态失败:', response.data.msg);
      return {
        success: false,
        isLoggedIn: false,
        message: response.data.msg || '检查登录状态失败'
      };
    }
  } catch (error: any) {
    console.error('检查登录状态错误:', error);
    // 发生错误时认为未登录
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    return {
      success: false,
      isLoggedIn: false,
      message: error.response?.data?.msg || '检查登录状态失败'
    };
  }
}; 