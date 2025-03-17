import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import examReducer from './slices/examSlice';

// 配置Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    // 可以在这里添加更多的reducer
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