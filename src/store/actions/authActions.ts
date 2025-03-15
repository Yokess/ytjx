import { AppThunk } from '../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout
} from '../slices/authSlice';
import { login, register, LoginParams, RegisterParams } from '../../api/authApi';

// 登录异步action
export const loginUser = (credentials: LoginParams): AppThunk => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await login(credentials);
    dispatch(loginSuccess(response));
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登录失败';
    dispatch(loginFailure(errorMessage));
    throw error;
  }
};

// 注册异步action
export const registerUser = (userData: RegisterParams): AppThunk => async (dispatch) => {
  try {
    dispatch(registerStart());
    const user = await register(userData);
    dispatch(registerSuccess());
    return user;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '注册失败';
    dispatch(registerFailure(errorMessage));
    throw error;
  }
};

// 退出登录action
export const logoutUser = (): AppThunk => (dispatch) => {
  dispatch(logout());
}; 