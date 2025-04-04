import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button, Space, Badge, message } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  LogoutOutlined,
  DashboardOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  KeyOutlined,
  CommentOutlined,
  BarsOutlined,
  FormOutlined,
  ClusterOutlined,
  SecurityScanOutlined,
  FileOutlined,
  SaveOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // 检查用户类型，确保只有管理员能访问
  useEffect(() => {
    // 从localStorage获取userType保证最新值
    const userType = localStorage.getItem('userType');
    console.log('AdminLayout - 用户类型检查:', { 
      reduxUserType: user?.userType, 
      localStorageUserType: userType,
      userId: user?.id,
      username: user?.username
    });
    
    if (userType !== '2') {
      console.log('非管理员用户，重定向到首页');
      message.error('您没有管理员权限');
      navigate('/');
    }
  }, [navigate, user]);

  // 面包屑映射
  const breadcrumbNameMap: Record<string, string> = {
    '/admin': '控制台',
    '/admin/users': '用户管理',
    '/admin/users/roles': '角色管理',
    '/admin/exams': '考试管理',
    '/admin/exams/new': '创建考试',
    '/admin/exams/detail': '考试详情',
    '/admin/questions': '题库管理',
    '/admin/questions/list': '题目列表',
    '/admin/courses': '课程管理',
    '/admin/community': '社区管理',
    '/admin/stats': '统计分析',
    '/admin/settings': '系统设置',
  };

  // 获取面包屑项
  const breadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[url] || url.split('/').pop()}</Link>
        </Breadcrumb.Item>
      );
    });
    
    return [
      <Breadcrumb.Item key="home">
        <Link to="/admin">控制台</Link>
      </Breadcrumb.Item>,
      ...extraBreadcrumbItems,
    ];
  };

  // 处理登出
  const handleLogout = () => {
    dispatch(logout() as any);
    message.success('已退出登录');
    navigate('/login');
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        账号设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 菜单项配置
  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: '控制台',
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: '/admin/users/list',
          label: '用户列表',
        },
      ],
    },
    {
      key: 'course',
      icon: <BookOutlined />,
      label: '课程管理',
      children: [
        {
          key: '/admin/courses',
          label: '课程列表',
        },
      ],
    },
    {
      key: 'exam',
      icon: <FormOutlined />,
      label: '考试管理',
      children: [
        {
          key: '/admin/exams',
          label: '考试列表',
        },
        {
          key: '/admin/questions',
          label: '题库管理',
        },
      ],
    },
    {
      key: 'community',
      icon: <CommentOutlined />,
      label: '社区管理',
      children: [
        {
          key: '/admin/community/sections',
          label: '板块管理',
        },
        {
          key: '/admin/community/posts',
          label: '帖子管理',
        },
        {
          key: '/admin/community/comments',
          label: '评论管理',
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={200}
      >
        <div className="logo">
          <img
            src="/ytjx.png"
            alt="Logo"
            style={{
              height: 32,
              margin: 16,
              display: collapsed ? 'none' : 'block',
            }}
          />
          {collapsed ? (
            <div
              style={{
                height: 32,
                margin: 16,
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 6,
              }}
            />
          ) : null}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={['user', 'course', 'exam', 'community']}
          mode="inline"
        >
          <Menu.Item key="/admin" icon={<DashboardOutlined />}>
            <Link to="/admin">控制台</Link>
          </Menu.Item>

          <Menu.SubMenu key="user" icon={<UserOutlined />} title="用户管理">
            <Menu.Item key="/admin/users/list">
              <Link to="/admin/users/list">用户列表</Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="course" icon={<BookOutlined />} title="课程管理">
            <Menu.Item key="/admin/courses">
              <Link to="/admin/courses">课程列表</Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="exam" icon={<FormOutlined />} title="考试管理">
            <Menu.Item key="/admin/exams/list">
              <Link to="/admin/exams/list">考试列表</Link>
            </Menu.Item>
            <Menu.Item key="/admin/questions">
              <Link to="/admin/questions">题库管理</Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="community" icon={<CommentOutlined />} title="社区管理">
            <Menu.Item key="/admin/community/sections">
              <Link to="/admin/community/sections">板块管理</Link>
            </Menu.Item>
            <Menu.Item key="/admin/community/posts">
              <Link to="/admin/community/posts">帖子管理</Link>
            </Menu.Item>
            <Menu.Item key="/admin/community/comments">
              <Link to="/admin/community/comments">评论管理</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', paddingRight: 24 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Space size={16}>
              <Badge count={5} dot>
                <BellOutlined style={{ fontSize: 16 }} />
              </Badge>
              <Dropdown overlay={userMenu} placement="bottomRight">
                <span style={{ cursor: 'pointer' }}>
                  <Space>
                    <Avatar src="https://api.ytjx.com/static/avatars/admin.jpg" icon={<UserOutlined />} />
                    <span>管理员</span>
                  </Space>
                </span>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <div style={{ padding: '0 24px', background: '#fff', marginBottom: 2 }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbItems()}
          </Breadcrumb>
        </div>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 