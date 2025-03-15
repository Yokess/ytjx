import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 用户信息接口
export interface User {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
  role?: string;
}

// 认证状态接口
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// 创建认证切片
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 登录请求开始
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 登录成功
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    // 登录失败
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 注册请求开始
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 注册成功
    registerSuccess: (state) => {
      state.loading = false;
    },
    // 注册失败
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 退出登录
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

// 导出actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUserInfo,
} = authSlice.actions;

// 导出reducer
export default authSlice.reducer; 