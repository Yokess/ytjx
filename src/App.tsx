import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { store } from './store/store';
import { RootState, AppDispatch } from './store/store';
import AppRoutes from './routes';
import './App.css';
import { isAuthStateConsistent, clearAuthState } from './utils/auth';
import * as moment from 'moment';
import 'moment/locale/zh-cn';

// 设置moment的语言为中文
moment.locale('zh-cn');

// 认证状态监控组件
const AuthMonitor: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    console.log('认证状态:', { isAuthenticated, user });
    
    // 检查本地存储中的token和用户数据
    const localToken = localStorage.getItem('token');
    const localUserId = localStorage.getItem('userId');
    const localUsername = localStorage.getItem('username');
    
    console.log('本地存储状态:', {
      token: localToken ? '存在' : '不存在',
      userId: localUserId,
      username: localUsername
    });
    
    // 如果存储状态不一致，则清理所有状态
    if (!isAuthStateConsistent()) {
      console.log('检测到存储状态不一致，清理认证信息');
      // 清理本地存储
      clearAuthState();
      
      // 重置Redux状态
      import('./store/slices/authSlice').then(({ logout }) => {
        dispatch(logout());
      });
    }
  }, [isAuthenticated, user, dispatch]);
  
  return null; // 这是一个监控组件，不渲染任何内容
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN} theme={{
        token: {
          colorPrimary: '#5B5CFF',
          borderRadius: 4,
        },
      }}>
        <Router>
          <AuthMonitor />
          <AppRoutes />
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
