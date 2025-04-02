import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login, register, logout, checkAuth } from '../store/actions/authActions';
import { updateUserProfile } from '../store/actions/userActions';
import { authApi, userApi } from '../api';
import { store } from '../store/store';

// 自定义Hook，用于处理认证相关操作
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error, needProfileCompletion } = useSelector(
    (state: RootState) => state.auth
  );

  // 登录方法
  const loginUser = useCallback(
    async (credentials: authApi.LoginParams) => {
      try {
        console.log('useAuth.login - 开始登录过程');
        const result = await dispatch(login(credentials.username, credentials.password));
        console.log('useAuth.login - 登录结果:', result);
        
        // 等待状态更新
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 登录后检查认证状态
        const authState = (state: RootState) => state.auth;
        const currentState = authState(store.getState());
        console.log('登录后认证状态:', {
          isAuthenticated: currentState.isAuthenticated,
          user: currentState.user
        });
        
        // 检查本地存储
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        
        console.log('本地存储状态:', { token, userId, username });
        
        return Boolean(token && userId && username);
      } catch (error) {
        console.error('useAuth.login - 登录过程发生错误:', error);
        return false;
      }
    },
    [dispatch]
  );

  // 注册方法
  const registerUser = useCallback(
    async (userData: authApi.RegisterParams): Promise<{ userId?: number; userName?: string } | null> => {
      try {
        console.log('useAuth.register - 开始注册请求');
        await dispatch(register(userData));
        console.log('useAuth.register - 注册请求已发送');
        
        // 从store中读取最新状态
        const currentState = store.getState().auth;
        console.log('useAuth.register - 注册后的认证状态:', currentState);
        
        // 如果store中有用户数据，说明注册成功
        if (currentState.user) {
          console.log('useAuth.register - 从Redux获取用户数据:', currentState.user);
          return { 
            userId: parseInt(currentState.user.id),
            userName: currentState.user.username
          };
        }
        
        console.log('useAuth.register - 没有找到有效的用户数据');
        return null;
      } catch (error) {
        console.error('useAuth.register - 注册过程发生错误:', error);
        return null;
      }
    },
    [dispatch]
  );

  // 更新个人信息
  const updateProfile = useCallback(
    async (profileData: userApi.ProfileUpdateParams) => {
      try {
        const result = await dispatch(updateUserProfile(profileData));
        return result;
      } catch (error) {
        console.error('useAuth.updateProfile - 更新个人信息发生错误:', error);
        return false;
      }
    },
    [dispatch]
  );

  // 退出登录方法
  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // 检查登录状态
  const checkLoginStatus = useCallback(() => {
    return dispatch(checkAuth());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    needProfileCompletion,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    updateProfile,
    checkLoginStatus,
  };
}; 