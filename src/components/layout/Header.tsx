import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Dropdown, Avatar, Badge, message } from 'antd';
import { 
  MenuOutlined, 
  UserOutlined, 
  DownOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';
import styles from './Header.module.scss';
import { useAuth } from '../../hooks/useAuth';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 使用自定义Hook获取认证状态和方法
  const { isAuthenticated, user, logout } = useAuth();

  // 模拟通知数量
  const notificationCount = 3;

  // 监听滚动事件，添加背景色
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // 处理退出登录
  const handleLogout = () => {
    logout();
    message.success('退出登录成功');
    navigate('/');
  };

  // 处理头像点击
  const handleAvatarClick = () => {
    navigate('/user');
  };

  // 处理通知点击
  const handleNotificationClick = () => {
    message.info('通知功能正在开发中...');
  };

  // 导航菜单项
  const menuItems = [
    { key: '/', label: '首页' },
    { key: '/courses', label: '精品课程' },
    { key: '/exams', label: '在线题库' },
    { key: '/ai-assistant', label: '智能助手' },
    { key: '/community', label: '学习社区' },
  ];

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/user">个人中心</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/user/settings">账号设置</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <span className={styles.logoText}>研途九霄</span>
          </Link>
        </div>

        {/* 桌面端导航 */}
        <div className={styles.desktopNav}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className={styles.menu}
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>

        {/* 用户操作区 */}
        <div className={styles.actions}>
          {isAuthenticated && user ? (
            <>
              {/* 通知图标 */}
              <Badge count={notificationCount} className={styles.notificationBadge}>
                <BellOutlined 
                  className={styles.notificationIcon} 
                  onClick={handleNotificationClick}
                />
              </Badge>
              
              {/* 用户信息 */}
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className={styles.userInfo}>
                  {user.avatar ? (
                    <Avatar 
                      src={user.avatar} 
                      size="small" 
                      className={styles.avatar} 
                      onClick={handleAvatarClick}
                    />
                  ) : (
                    <Avatar 
                      icon={<UserOutlined />} 
                      size="small" 
                      className={styles.avatar} 
                      onClick={handleAvatarClick}
                    />
                  )}
                  <span className={styles.userName}>{user.username}</span>
                  <DownOutlined className={styles.downIcon} />
                </div>
              </Dropdown>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login">
                <Button type="primary" shape="round" className={styles.loginButton}>
                  登录
                </Button>
              </Link>
              <Link to="/register" className={styles.registerLink}>
                注册
              </Link>
            </div>
          )}
        </div>

        {/* 移动端菜单按钮 */}
        <div className={styles.mobileMenuBtn}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
          />
        </div>

        {/* 移动端抽屉菜单 */}
        <Drawer
          title="菜单"
          placement="right"
          onClose={() => setVisible(false)}
          visible={visible}
          className={styles.mobileDrawer}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            className={styles.mobileMenu}
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key}>
                <Link to={item.key} onClick={() => setVisible(false)}>
                  {item.label}
                </Link>
              </Menu.Item>
            ))}
            {!isAuthenticated ? (
              <>
                <Menu.Divider />
                <Menu.Item key="login">
                  <Link to="/login" onClick={() => setVisible(false)}>
                    登录
                  </Link>
                </Menu.Item>
                <Menu.Item key="register">
                  <Link to="/register" onClick={() => setVisible(false)}>
                    注册
                  </Link>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Divider />
                <Menu.Item key="profile" icon={<UserOutlined />}>
                  <Link to="/user" onClick={() => setVisible(false)}>
                    个人中心
                  </Link>
                </Menu.Item>
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                  退出登录
                </Menu.Item>
              </>
            )}
          </Menu>
        </Drawer>
      </div>
    </AntHeader>
  );
};

export default Header; 