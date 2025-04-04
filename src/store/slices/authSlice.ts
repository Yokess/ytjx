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
  userType?: number;  // 添加用户类型字段，用于区分学生-0和教师-1和管理员-2
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
    username: localStorage.getItem('username') || '',
    userType: localStorage.getItem('userType') ? Number(localStorage.getItem('userType')) : 0  // 确保正确读取并转换为数字
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
        
        // 确保用户类型被保存到localStorage
        if (action.payload.user.userType !== undefined) {
          const userType = Number(action.payload.user.userType);
          localStorage.setItem('userType', userType.toString());
          console.log('已保存userType到localStorage:', userType);
          console.log('用户角色:', userType === 0 ? '学生' : userType === 1 ? '教师' : userType === 2 ? '管理员' : '未知');
        }
      } else if (action.payload.data) {
        console.log('处理API直接返回的数据:', action.payload.data);
        
        // 直接从响应中获取userType
        let userType = 0; // 默认为学生
        if (action.payload.data.userType !== undefined) {
          userType = Number(action.payload.data.userType);
        } else if (action.payload.data.user_type !== undefined) {
          userType = Number(action.payload.data.user_type);
        }
        
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.data.userId?.toString() || action.payload.data.user_id?.toString(),
          username: action.payload.data.userName || action.payload.data.username,
          userType: userType  // 使用获取到的userType
        };
        state.token = action.payload.data.token;
        state.loading = false;
        state.error = null;
        
        // 保存userType到localStorage
        localStorage.setItem('userType', userType.toString());
        console.log('已保存userType到localStorage:', userType);
        console.log('用户角色:', userType === 0 ? '学生' : userType === 1 ? '教师' : userType === 2 ? '管理员' : '未知');
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
          username: action.payload.data.userName,
          userType: action.payload.data.userType || 0  // 从API响应中获取userType，默认为0
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
      localStorage.removeItem('userType');  // 清除userType
    },
    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<User>) => {
      // 保留现有的用户类型，如果传入的用户信息中没有指定
      const userType = action.payload.userType !== undefined 
        ? action.payload.userType 
        : state.user?.userType;
      
      // 将用户类型保存到localStorage
      if (userType !== undefined) {
        localStorage.setItem('userType', userType.toString());
        console.log('更新用户信息时保存userType到localStorage:', userType);
        console.log('用户角色:', userType === 0 ? '学生' : userType === 1 ? '教师' : userType === 2 ? '管理员' : '未知');
      }
      
      // 更新用户信息，确保包含userType
      state.user = {
        ...action.payload,
        userType: userType
      };
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