import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import questionReducer from './slices/questionSlice';
// import courseReducer from './slices/courseSlice';
// import examReducer from './slices/examSlice';
// import communityReducer from './slices/communitySlice';

// 配置Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    question: questionReducer,
    // course: courseReducer,
    // exam: examReducer,
    // community: communityReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // 开发环境下启用Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

// 导出RootState和AppThunk类型，用于类型检查
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>; 