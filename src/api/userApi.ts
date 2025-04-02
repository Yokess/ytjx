import { User } from '../store/slices/authSlice';
import http from './http';

// API基础URL
const BASE_URL = process.env.REACT_APP_API_URL || '';

// 更新用户信息参数
export interface ProfileUpdateParams {
  userId: number;
  gender?: number;   // 性别：1-男性，0-女性，2-其他
  major?: string;    // 专业
  target?: string;   // 考研目标
  email?: string;    // 邮箱
  phone?: string;    // 手机号
}

// 密码修改参数
export interface PasswordUpdateParams {
  oldPassword: string;
  newPassword: string;
}

/**
 * 获取用户信息
 * @param userId 用户ID
 */
export const getUserInfo = async (userId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    console.log('获取用户信息, userId:', userId);
    
    if (!token) {
      return {
        success: false,
        message: '未登录'
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const response = await http.get(`/users/${userId}`, config);
    console.log('获取用户信息响应:', response.data);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取用户信息失败'
      };
    }
  } catch (error: any) {
    console.error('获取用户信息错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取用户信息失败'
    };
  }
};

/**
 * 更新用户信息
 * @param params 更新参数
 */
export const updateUserInfo = async (params: ProfileUpdateParams): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    console.log('更新用户信息, 参数:', params);
    
    if (!token) {
      return {
        success: false,
        message: '未登录状态，无法更新个人信息'
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    // 构建请求数据，确保字段名与后端接口一致
    const requestData = {
      gender: params.gender,
      major: params.major,
      target: params.target, // 后端接收的是target字段，但存储为goal字段
      email: params.email,
      phone: params.phone
    };
    
    console.log('发送更新用户信息请求, 数据:', requestData);
    
    const response = await http.put(`/users/${params.userId}`, requestData, config);
    console.log('更新用户信息响应:', response.data);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: '用户信息更新成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '用户信息更新失败'
      };
    }
  } catch (error: any) {
    console.error('更新用户信息错误:', error);
    console.error('错误详情:', error.response || error.message);
    return {
      success: false,
      message: error.response?.data?.msg || '更新用户信息失败'
    };
  }
};

/**
 * 修改密码
 * @param userId 用户ID
 * @param params 密码参数
 */
export const updatePassword = async (userId: string, params: PasswordUpdateParams): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        message: '未登录状态，无法修改密码'
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const response = await http.put(`/users/${userId}/password`, params, config);
    console.log('修改密码响应:', response.data);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: response.data.msg || '密码修改成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '密码修改失败'
      };
    }
  } catch (error: any) {
    console.error('修改密码错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '修改密码失败'
    };
  }
};

/**
 * 上传头像
 * @param userId 用户ID
 * @param file 文件对象
 */
export const uploadAvatar = async (userId: string, file: File): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        message: '未登录状态，无法上传头像'
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token,
        'Content-Type': 'multipart/form-data'
      }
    };
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await http.post(`/users/${userId}/avatar`, formData, config);
    console.log('上传头像响应:', response.data);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: '头像上传成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '头像上传失败'
      };
    }
  } catch (error: any) {
    console.error('上传头像错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '上传头像失败'
    };
  }
};

// 统计数据接口
export interface UserStats {
  studyDays: number;
  questionCount: number;
  studyHours: number;
  learningProgress: {
    subject: string;
    progress: number;
  }[];
}

// 暂时保留模拟统计数据，后续可替换为实际API
export const getUserStats = async (userId: string): Promise<any> => {
  // 模拟统计数据
  const mockStats: UserStats = {
    studyDays: 128,
    questionCount: 1280,
    studyHours: 320,
    learningProgress: [
      { subject: '数学', progress: 75 },
      { subject: '英语', progress: 60 },
      { subject: '政治', progress: 45 },
      { subject: '专业课', progress: 80 },
    ]
  };
  
  return {
    success: true,
    data: mockStats
  };
}; 