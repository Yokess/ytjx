import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// 布局组件
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';

// 页面组件
import HomePage from '../pages/Home';
import LoginPage from '../pages/Auth/Login';
import RegisterPage from '../pages/Auth/Register';
import CoursesListPage from '../pages/Courses/CoursesList';
import CourseDetailPage from '../pages/Courses/CourseDetail';
import VideoPlayerPage from '../pages/Courses/VideoPlayer';
import ExamDetailPage from '../pages/Exams/ExamDetail';
import ExamMockPage from '../pages/Exams/ExamMock';
import ErrorBookPage from '../pages/Exams/ErrorBook';
import ExamResultPage from '../pages/Exams/ExamResult';
import UserCenterPage from '../pages/User';
import NotFoundPage from '../pages/Home';
import AIAssistantPage from '../pages/AIAssistant';
import CommunityPage from '../pages/Community';
import PostDetailPage from '../pages/Community/PostDetail';
import CreatePostPage from '../pages/Community/CreatePost';
import QuestionsPage from '../pages/Questions';
import QuestionDetailPage from '../pages/Questions/QuestionDetail';

// Admin模块路由
import adminRoutes from '../pages/Admin/routes';

// 临时重定向组件，用于重定向到首页
const RedirectToHome = () => <Navigate to="/" replace />;

// 加载中组件
const LoadingFallback = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>加载中...</div>;

// 需要登录的路由保护组件
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  console.log('路由保护检查 - 认证状态:', isAuthenticated, '路径:', location.pathname);
  
  if (!isAuthenticated) {
    // 未登录，重定向到登录页面，并记录尝试访问的URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 首页路由 */}
      <Route path="/" element={<HomePage />} />
      
      {/* 认证相关路由 */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      {/* 课程相关路由 - 需要登录 */}
      <Route path="/courses" element={<CoursesListPage />} />
      <Route path="/courses/:id" element={
        <ProtectedRoute>
          <CourseDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/courses/:courseId/video/:videoId" element={
        <ProtectedRoute>
          <VideoPlayerPage />
        </ProtectedRoute>
      } />
      
      {/* 考试相关路由 - 需要登录 */}
      <Route path="/exams/mock" element={
        <ProtectedRoute>
          <ExamMockPage />
        </ProtectedRoute>
      } />
      <Route path="/exams/error-book" element={
        <ProtectedRoute>
          <ErrorBookPage />
        </ProtectedRoute>
      } />
      <Route path="/exams/detail/:examId" element={
        <ProtectedRoute>
          <ExamDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/exams/result/:examId" element={
        <ProtectedRoute>
          <ExamResultPage />
        </ProtectedRoute>
      } />
      <Route path="/exams/history" element={
        <ProtectedRoute>
          <ExamMockPage />
        </ProtectedRoute>
      } />
      
      {/* 题库相关路由 */}
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/questions/wrong" element={<Navigate to="/exams/error-book" replace />} />
      <Route path="/questions/:questionId" element={<QuestionDetailPage />} />
      
      {/* 社区相关路由 - 创建帖子需要登录 */}
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/post/:postId" element={<PostDetailPage />} />
      <Route path="/community/create" element={
        <ProtectedRoute>
          <CreatePostPage />
        </ProtectedRoute>
      } />
      
      {/* AI助手路由 */}
      <Route path="/ai-assistant" element={<AIAssistantPage />} />
      
      {/* 用户中心路由 - 需要登录 */}
      <Route path="/user" element={
        <ProtectedRoute>
          <UserCenterPage />
        </ProtectedRoute>
      } />
      
      {/* 管理后台路由 - 需要登录 */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="" element={adminRoutes[0].element} />
              {adminRoutes.slice(1).map((route, index) => {
                // 获取主路径部分
                const mainPath = route.path.split('/').pop() || '';
                return (
                  <Route
                    key={index}
                    path={mainPath + "/*"}
                    element={route.element}
                  >
                    {route.children && route.children.length > 0 && (
                      route.children.map((childRoute, childIndex) => (
                        <Route
                          key={`${index}-${childIndex}`}
                          path={childRoute.path}
                          element={childRoute.element}
                        />
                      ))
                    )}
                  </Route>
                );
              })}
            </Routes>
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* 404页面 */}
      <Route path="/404" element={<NotFoundPage />} />
      
      {/* 重定向到404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes; 