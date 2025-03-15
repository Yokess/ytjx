import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message, Tabs, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Register.module.scss';

const { TabPane } = Tabs;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const { register, loading, error, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
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

  // 处理注册表单提交
  const handleSubmit = async (values: any) => {
    try {
      const success = await register({
        username: values.username,
        password: values.password,
        email: values.email
      });
      
      if (success) {
        message.success('注册成功，请登录');
        navigate('/login');
      }
    } catch (error) {
      console.error('注册错误:', error);
    }
  };

  // 验证密码一致性
  const validatePassword = (_: any, value: string) => {
    const password = form.getFieldValue('password');
    if (!value || password === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次输入的密码不一致'));
  };

  // 验证手机号
  const validatePhone = (_: any, value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!value || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入有效的手机号码'));
  };

  // 验证邮箱
  const validateEmail = (_: any, value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value || emailRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入有效的邮箱地址'));
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>注册账号</h2>
        <p className={styles.subtitle}>创建您的研途九霄账号，开启学习之旅</p>
      </div>
      
      <Tabs defaultActiveKey="email" centered className={styles.tabs}>
        <TabPane tab="邮箱注册" key="email">
          <Form
            form={form}
            name="register_email"
            initialValues={{ prefix: '86' }}
            onFinish={handleSubmit}
            size="large"
            className={styles.form}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined className={styles.inputIcon} />} 
                placeholder="用户名" 
              />
            </Form.Item>
            
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { validator: validateEmail }
              ]}
            >
              <Input 
                prefix={<MailOutlined className={styles.inputIcon} />} 
                placeholder="邮箱" 
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码长度不能小于8位' }
              ]}
              hasFeedback
            >
              <Input.Password 
                prefix={<LockOutlined className={styles.inputIcon} />} 
                placeholder="密码" 
              />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: '请确认密码' },
                { validator: validatePassword }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className={styles.inputIcon} />} 
                placeholder="确认密码" 
              />
            </Form.Item>
            
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { 
                  validator: (_, value) => 
                    value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议和隐私政策')) 
                }
              ]}
            >
              <Checkbox>
                我已阅读并同意 <Link to="/terms">用户协议</Link> 和 <Link to="/privacy">隐私政策</Link>
              </Checkbox>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className={styles.registerButton}
                loading={loading}
                block
              >
                注册
              </Button>
            </Form.Item>
            
            <Form.Item className={styles.loginLink}>
              <span>已有账号? </span>
              <Link to="/login">立即登录</Link>
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane tab="手机注册" key="phone">
          <Form
            form={form}
            name="register_phone"
            initialValues={{ prefix: '86' }}
            onFinish={handleSubmit}
            size="large"
            className={styles.form}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined className={styles.inputIcon} />} 
                placeholder="用户名" 
              />
            </Form.Item>
            
            <Form.Item>
              <Input.Group compact>
                <Form.Item
                  name="prefix"
                  noStyle
                >
                  <Select style={{ width: '20%' }}>
                    <Option value="86">+86</Option>
                    <Option value="87">+87</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="phone"
                  noStyle
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { validator: validatePhone }
                  ]}
                >
                  <Input 
                    style={{ width: '80%' }}
                    prefix={<PhoneOutlined className={styles.inputIcon} />} 
                    placeholder="手机号" 
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码长度不能小于8位' }
              ]}
              hasFeedback
            >
              <Input.Password 
                prefix={<LockOutlined className={styles.inputIcon} />} 
                placeholder="密码" 
              />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: '请确认密码' },
                { validator: validatePassword }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className={styles.inputIcon} />} 
                placeholder="确认密码" 
              />
            </Form.Item>
            
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { 
                  validator: (_, value) => 
                    value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议和隐私政策')) 
                }
              ]}
            >
              <Checkbox>
                我已阅读并同意 <Link to="/terms">用户协议</Link> 和 <Link to="/privacy">隐私政策</Link>
              </Checkbox>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className={styles.registerButton}
                loading={loading}
                block
              >
                注册
              </Button>
            </Form.Item>
            
            <Form.Item className={styles.loginLink}>
              <span>已有账号? </span>
              <Link to="/login">立即登录</Link>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RegisterPage; 