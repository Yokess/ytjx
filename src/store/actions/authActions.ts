import { AppThunk } from '../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction
} from '../slices/authSlice';
import * as authApi from '../../api/authApi';
import { fetchUserInfo } from './userActions';

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 */
export const login = (username: string, password: string): AppThunk => async (dispatch) => {
  try {
    // 设置登录开始状态
    dispatch(loginStart());
    
    console.log('开始登录请求');
    
    // 调用登录API
    const response = await authApi.login({ username, password });
    
    if (response.success) {
      console.log('登录成功');
      
      // 分发登录成功action
      dispatch(loginSuccess(response));
      
      // 获取用户详细信息
      if (response.user && response.user.id) {
        dispatch(fetchUserInfo(response.user.id));
      }
      
      return {
        success: true,
        message: '登录成功'
      };
    } else {
      console.error('登录失败:', response.message);
      
      // 分发登录失败action
      dispatch(loginFailure(response.message));
      
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    console.error('登录错误:', error);
    
    // 分发登录失败action
    dispatch(loginFailure(error.message || '登录发生错误'));
    
    return {
      success: false,
      message: error.message || '登录失败，请稍后再试'
    };
  }
};

/**
 * 用户注册
 * @param userData 注册信息
 */
export const register = (userData: authApi.RegisterParams): AppThunk => async (dispatch) => {
  try {
    // 设置注册开始状态
    dispatch(registerStart());
    
    console.log('开始注册请求');
    
    // 调用注册API
    const response = await authApi.register(userData);
    
    if (response.success) {
      console.log('注册成功');
      
      // 分发注册成功action
      dispatch(registerSuccess(response));
      
      return {
        success: true,
        data: response.data,
        message: '注册成功'
      };
    } else {
      console.error('注册失败:', response.message);
      
      // 分发注册失败action
      dispatch(registerFailure(response.message));
      
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    console.error('注册错误:', error);
    
    // 分发注册失败action
    dispatch(registerFailure(error.message || '注册发生错误'));
    
    return {
      success: false,
      message: error.message || '注册失败，请稍后再试'
    };
  }
};

/**
 * 退出登录
 */
export const logout = (): AppThunk => async (dispatch) => {
  try {
    console.log('开始退出登录请求');
    
    // 调用退出登录API
    const response = await authApi.logout();
    
    // 无论API是否成功，都清除本地状态
    dispatch(logoutAction());
    
    console.log('已成功退出登录');
    
    return {
      success: true,
      message: response.message || '已退出登录'
    };
  } catch (error: any) {
    console.error('退出登录错误:', error);
    
    // 即使API失败，也清除本地状态
    dispatch(logoutAction());
    
    return {
      success: false,
      message: error.message || '退出登录请求失败，但已清除本地登录状态'
    };
  }
};

/**
 * 检查登录状态
 */
export const checkAuth = (): AppThunk => async (dispatch) => {
  try {
    console.log('检查登录状态');
    
    // 调用检查登录状态API
    const response = await authApi.checkLoginStatus();
    
    console.log('登录状态检查结果:', response);
    
    if (response.success && response.isLoggedIn) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        // 如果已登录，获取用户详细信息
        dispatch(fetchUserInfo(userId));
      }
      
      return {
        success: true,
        isLoggedIn: true
      };
    } else {
      // 如果未登录，清除本地状态
      if (!response.isLoggedIn) {
        dispatch(logoutAction());
      }
      
      return {
        success: true,
        isLoggedIn: false
      };
    }
  } catch (error: any) {
    console.error('检查登录状态错误:', error);
    
    // 发生错误时，认为未登录
    dispatch(logoutAction());
    
    return {
      success: false,
      isLoggedIn: false,
      message: error.message || '检查登录状态失败'
    };
  }
}; 