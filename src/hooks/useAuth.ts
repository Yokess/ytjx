import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loginUser, registerUser, logoutUser } from '../store/actions/authActions';
import { LoginParams, RegisterParams } from '../api/authApi';

// 自定义Hook，用于处理认证相关操作
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // 登录方法
  const login = useCallback(
    async (credentials: LoginParams) => {
      try {
        await dispatch(loginUser(credentials));
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  // 注册方法
  const register = useCallback(
    async (userData: RegisterParams) => {
      try {
        await dispatch(registerUser(userData));
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  // 退出登录方法
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
}; 