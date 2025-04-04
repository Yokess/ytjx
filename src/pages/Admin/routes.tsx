import React, { lazy, ComponentType } from 'react';
import { AppstoreOutlined, UserOutlined, ReadOutlined, BulbOutlined, FileTextOutlined, CommentOutlined, SettingOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';

// 懒加载组件
const AdminDashboard = lazy(() => import('./index'));
const UsersList = lazy(() => import('./Users/UsersList'));
const CoursesList = lazy(() => import('./Courses/CoursesList'));
const QuestionsList = lazy(() => import('./Questions/QuestionsList'));
const ExamsList = lazy(() => import('./Exams/ExamsList'));
const ExamCreate = lazy(() => import('./Exams/ExamCreate'));
const ExamDetail = lazy(() => import('./Exams/ExamDetail'));
const CommentsManager = lazy(() => import('./Community/CommentsManager'));

// 修正导入路径
const PostsList = lazy(() => import('./Community/PostsList'));
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
    icon: <FileTextOutlined />,
    name: '考试管理',
    children: [
      {
        path: '',
        element: <Navigate to="/admin/exams/list" replace />,
        exact: true,
        name: '考试列表重定向',
      },
      {
        path: 'list',
        component: ExamsList,
        element: <ExamsList />,
        name: '考试列表',
        exact: true,
      },
      {
        path: 'new',
        component: ExamCreate,
        element: <ExamCreate />,
        name: '创建考试',
        exact: true,
      },
      {
        path: 'detail/:examId',
        component: ExamDetail,
        element: <ExamDetail />,
        name: '考试详情',
        exact: true,
      },
      {
        path: 'create',
        component: ExamCreate,
        element: <ExamCreate />,
        name: '创建考试',
        exact: true,
      },
      {
        path: 'edit/:examId',
        component: ExamCreate,
        element: <ExamCreate />,
        name: '编辑考试',
        exact: true,
      },
    ],
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
        component: PostsList,
        element: <PostsList />,
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