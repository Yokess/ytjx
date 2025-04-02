import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined, QqOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Login.module.scss';

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const onFinish = async (values: LoginFormValues) => {
    console.log('表单提交，尝试登录:', values);
    try {
      const success = await login({
        username: values.username,
        password: values.password
      });
      
      console.log('登录结果:', success);
      
      if (success) {
        message.success('登录成功！');
        // 延迟导航，确保状态更新完成
        setTimeout(() => {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');
          const username = localStorage.getItem('username');
          console.log('导航前检查存储状态:', { token, userId, username });
          navigate('/');
        }, 1000);
      } else {
        message.error('登录失败，请检查用户名和密码');
      }
    } catch (err) {
      console.error('登录过程中出错:', err);
      message.error('登录过程中出错，请稍后重试');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>登录</h2>
        <p className={styles.subtitle}>欢迎回来，请登录您的账号</p>
      </div>
      
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
        className={styles.form}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名/手机号/邮箱' }]}
        >
          <Input 
            prefix={<UserOutlined className={styles.inputIcon} />} 
            placeholder="用户名/手机号/邮箱" 
          />
        </Form.Item>
        
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password 
            prefix={<LockOutlined className={styles.inputIcon} />} 
            placeholder="密码" 
          />
        </Form.Item>
        
        <Form.Item>
          <div className={styles.formOptions}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              忘记密码?
            </Link>
          </div>
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className={styles.loginButton}
            loading={loading}
            block
          >
            登录
          </Button>
        </Form.Item>
        
        <Form.Item className={styles.registerLink}>
          <span>还没有账号? </span>
          <Link to="/register">立即注册</Link>
        </Form.Item>
        
        <Divider plain>其他登录方式</Divider>
        
        <div className={styles.socialLogin}>
          <Button 
            icon={<WechatOutlined />} 
            shape="circle" 
            size="large" 
            className={styles.wechatButton}
          />
          <Button 
            icon={<QqOutlined />} 
            shape="circle" 
            size="large" 
            className={styles.qqButton}
          />
        </div>
      </Form>
    </div>
  );
};

export default LoginPage; 