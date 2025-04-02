import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 用户信息接口
export interface User {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
  phone?: string;
  gender?: number;
  major?: string;
  target?: string;
  role?: string;
}

// 认证状态接口
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  needProfileCompletion: boolean; // 是否需要完善个人信息
}

// 初始状态
const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('token') && localStorage.getItem('userId') && localStorage.getItem('username') ? true : false,
  user: localStorage.getItem('userId') && localStorage.getItem('username') ? {
    id: localStorage.getItem('userId') || '',
    username: localStorage.getItem('username') || ''
  } : null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  needProfileCompletion: false
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
    loginSuccess: (state, action: PayloadAction<any>) => {
      console.log('登录成功，获取的响应:', action.payload);
      
      // 直接检查payload的结构，判断是来自API的响应还是已处理的数据
      if (action.payload.user && action.payload.token) {
        console.log('处理已格式化的用户数据:', action.payload.user);
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      } else if (action.payload.data) {
        console.log('处理API直接返回的数据:', action.payload.data);
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.data.userId.toString(),
          username: action.payload.data.username
        };
        state.token = action.payload.data.token;
        state.loading = false;
        state.error = null;
      } else {
        console.error('无法识别的登录成功数据格式:', action.payload);
      }
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
    registerSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      
      // 新的注册流程中，直接设置用户信息和认证状态
      if (action.payload?.user) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.needProfileCompletion = false;
      } 
      // 兼容旧的注册流程
      else if (action.payload?.data?.userId) {
        state.needProfileCompletion = true;
        state.user = {
          id: action.payload.data.userId.toString(),
          username: action.payload.data.userName
        };
      }
    },
    // 注册失败
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 设置需要完善个人信息标志
    setNeedProfileCompletion: (state, action: PayloadAction<boolean>) => {
      state.needProfileCompletion = action.payload;
    },
    // 更新用户个人信息
    updateProfile: (state, action: PayloadAction<{
      gender?: number;
      major?: string;
      target?: string;
    }>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          gender: action.payload.gender || 1,    // 默认值为1
          major: action.payload.major || '',     // 默认值为空字符串
          target: action.payload.target || ''    // 默认值为空字符串
        };
        state.needProfileCompletion = false;
      }
    },
    // 退出登录
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.needProfileCompletion = false;
    },
    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // 更新头像
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          avatar: action.payload
        };
      }
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
  setNeedProfileCompletion,
  updateProfile,
  updateAvatar,
} = authSlice.actions;

// 导出reducer
export default authSlice.reducer; 