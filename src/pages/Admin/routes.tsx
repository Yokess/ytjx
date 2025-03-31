import React, { lazy, ComponentType } from 'react';
import { AppstoreOutlined, UserOutlined, ReadOutlined, BulbOutlined, FileTextOutlined, CommentOutlined, SettingOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';

// 懒加载组件
const AdminDashboard = lazy(() => import('./index'));
const UsersList = lazy(() => import('./Users/UsersList'));
const UserRoles = lazy(() => import('./Users/UserRoles'));
const CoursesList = lazy(() => import('./Courses/CoursesList'));
const QuestionsList = lazy(() => import('./Questions/QuestionsList'));
const ExamsList = lazy(() => import('./Exams/ExamsList'));
const CommentsManager = lazy(() => import('./Community/CommentsManager'));

// 修正导入路径
const PostsManager = lazy(() => import('./Community/PostsManager'));
const SectionsList = lazy(() => import('./Community/SectionsList'));


export interface RouteConfig {
  path: string;
  component?: React.LazyExoticComponent<ComponentType<any>>;
  element?: React.ReactNode;
  exact?: boolean;
  icon?: React.ReactNode;
  name: string;
  children?: RouteConfig[];
  index?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: '/admin',
    component: AdminDashboard,
    element: <AdminDashboard />,
    exact: true,
    icon: <AppstoreOutlined />,
    name: '管理控制台',
  },
  {
    path: '/admin/users',
    icon: <UserOutlined />,
    name: '用户管理',
    children: [
      {
        path: '',
        element: <Navigate to="/admin/users/list" replace />,
        exact: true,
        name: '用户列表重定向',
      },
      {
        path: 'list',
        component: UsersList,
        element: <UsersList />,
        name: '用户列表',
        exact: true,
      },
      {
        path: 'roles',
        component: UserRoles,
        element: <UserRoles />,
        name: '角色权限',
        exact: true
      },
    ],
  },
  {
    path: '/admin/courses',
    component: CoursesList,
    element: <CoursesList />,
    icon: <ReadOutlined />,
    name: '课程管理',
    exact: true,
  },
  {
    path: '/admin/questions',
    component: QuestionsList,
    element: <QuestionsList />,
    icon: <BulbOutlined />,
    name: '题库管理',
    exact: true,
  },
  {
    path: '/admin/exams',
    component: ExamsList,
    element: <ExamsList />,
    icon: <FileTextOutlined />,
    name: '考试管理',
    exact: true,
  },
  {
    path: '/admin/community',
    icon: <CommentOutlined />,
    name: '社区管理',
    children: [
      {
        path: '',
        element: <Navigate to="/admin/community/posts" replace />,
        exact: true,
        name: '帖子管理重定向',
      },
      {
        path: 'sections',
        component: SectionsList,
        element: <SectionsList />,
        name: '板块管理',
        exact: true,
      },
      {
        path: 'posts',
        component: PostsManager,
        element: <PostsManager />,
        name: '帖子管理',
        exact: true,
      },
      {
        path: 'comments',
        component: CommentsManager,
        element: <CommentsManager />,
        name: '评论管理',
        exact: true
      },
    ],
  },
];

export default routes; 