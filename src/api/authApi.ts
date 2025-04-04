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
    userType?: number;   // 添加可选的用户类型字段
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

// 刷新Token接口参数
export interface RefreshTokenParams {
  refreshToken?: string;
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
      
      // 保存userType (如果存在)
      // 尝试从响应数据中获取 userType
      let userType = 0; // 默认为学生(0)
      // 使用类型断言来处理可能不在接口中定义的属性
      const responseData = response.data.data as any;
      
      if (responseData.userType !== undefined) {
        userType = Number(responseData.userType);
        console.log('从响应中获取到userType:', userType);
      } else if (responseData.user_type !== undefined) {
        userType = Number(responseData.user_type);
        console.log('从响应中获取到user_type:', userType);
      }
      
      // 保存登录信息到localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('username', username);
      localStorage.setItem('userType', userType.toString());
      
      console.log('已保存用户类型到localStorage:', userType);
      console.log('用户类型:', userType === 0 ? '学生' : userType === 1 ? '教师' : userType === 2 ? '管理员' : '未知');
      
      // 返回成功响应，使用一致的数据结构
      return {
        success: true,
        message: response.data.msg,
        user: {
          id: userId.toString(),
          username: username,
          userType: userType
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
      localStorage.removeItem('userType'); // 确保清理userType
      
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
    localStorage.removeItem('userType'); // 确保清理userType
    
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
    
    try {
      console.log('开始验证token有效性...');
      // 调用后端接口验证登录状态
      const response = await http.get('/auth/check');
      console.log('检查登录状态响应:', response.data);
      
      if (response.data.code === 200) {
        // 根据后端返回的布尔值确定登录状态
        const isLoggedIn = response.data.data === true;
        
        if (!isLoggedIn) {
          // 如果后端返回未登录，清除本地存储
          console.log('后端返回未登录状态，清除本地存储');
          clearLocalStorage();
          return {
            success: true,
            isLoggedIn: false,
            message: '登录已失效，请重新登录'
          };
        }
        
        return {
          success: true,
          isLoggedIn: true,
          message: '已登录'
        };
      } else {
        console.error('检查登录状态失败:', response.data.msg);
        clearLocalStorage();
        return {
          success: false,
          isLoggedIn: false,
          message: response.data.msg || '检查登录状态失败'
        };
      }
    } catch (error: any) {
      console.error('检查登录状态请求错误:', error);
      
      // 检查是否是token无效错误
      if (error.response) {
        console.error('错误状态码:', error.response.status);
        console.error('错误详情:', error.response.data);
        
        // 对于401错误，尝试刷新token
        if (error.response.status === 401 || 
            (error.response.data && error.response.data.msg && error.response.data.msg.includes('token'))) {
          console.log('检测到token可能已过期或无效，尝试刷新token');
          const refreshResult = await refreshToken();
          
          if (refreshResult.success) {
            // token刷新成功，重试检查登录状态
            return {
              success: true,
              isLoggedIn: true,
              message: '登录状态已刷新'
            };
          } else {
            // 刷新token失败，清除本地存储
            console.error('刷新token失败, 清除登录状态');
            clearLocalStorage();
            return {
              success: false,
              isLoggedIn: false,
              message: '登录已过期，请重新登录'
            };
          }
        }
      }
      
      // 其他类型的错误，清除登录状态
      console.error('未知错误，清除登录状态');
      clearLocalStorage();
      
      return {
        success: false,
        isLoggedIn: false,
        message: error.response?.data?.msg || '检查登录状态失败'
      };
    }
  } catch (error: any) {
    console.error('检查登录状态错误:', error);
    // 发生错误时认为未登录
    clearLocalStorage();
    
    return {
      success: false,
      isLoggedIn: false,
      message: error.response?.data?.msg || '检查登录状态失败'
    };
  }
};

// 刷新Token
export const refreshToken = async (params?: RefreshTokenParams): Promise<any> => {
  try {
    // 获取当前token (可能已过期)
    const currentToken = localStorage.getItem('token') || '';
    const userId = localStorage.getItem('userId') || '';
    const username = localStorage.getItem('username') || '';
    
    console.log('尝试刷新token');
    
    if (!currentToken) {
      console.error('无token可刷新，直接清除登录状态');
      clearLocalStorage();
      return {
        success: false,
        message: '无token可刷新'
      };
    }
    
    try {
      // 调用刷新token的API
      const response = await http.post('/auth/refresh', {
        refreshToken: params?.refreshToken || currentToken
      });
      
      console.log('刷新token响应:', response.data);
      
      if (response.data.code === 200) {
        // 刷新成功，更新localStorage
        const { token, refreshToken } = response.data.data;
        
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        console.log('token刷新成功');
        
        return {
          success: true,
          message: '刷新token成功'
        };
      } else {
        console.error('刷新token失败:', response.data.msg);
        clearLocalStorage();
        return {
          success: false,
          message: response.data.msg || '刷新token失败'
        };
      }
    } catch (error: any) {
      // 如果刷新token请求本身失败，可能是网络问题或后端异常
      console.error('刷新token请求失败:', error);
      
      // 检查是否是401错误（token无效）
      if (error.response && error.response.status === 401) {
        console.error('token已失效，清除登录状态');
        clearLocalStorage();
        return {
          success: false,
          message: 'token已失效，需要重新登录'
        };
      }
      
      // 其他错误可能是临时的，不一定要清除登录状态
      // 但由于我们无法确认token的有效性，保守起见还是清除
      clearLocalStorage();
      return {
        success: false,
        message: error.response?.data?.msg || '刷新token请求失败'
      };
    }
  } catch (error: any) {
    console.error('刷新token错误:', error);
    clearLocalStorage();
    return {
      success: false,
      message: error.response?.data?.msg || '刷新token失败'
    };
  }
};

// 清除本地存储
const clearLocalStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userType');
}; 