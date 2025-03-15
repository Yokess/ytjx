import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';

// 创建一个空的reducer，后续会添加实际的reducer
const rootReducer = combineReducers({
  auth: authReducer,
  // 后续会添加各个功能模块的reducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // 只持久化auth相关状态
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 启用RTK Query的监听器
setupListeners(store.dispatch);

export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
