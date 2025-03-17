import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import QuestionsPage from '../pages/Questions';
import QuestionDetailPage from '../pages/Questions/QuestionDetail';

// 临时重定向组件，用于重定向到首页
const RedirectToHome = () => <Navigate to="/" replace />;

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
      
      {/* 课程相关路由 */}
      <Route path="/courses" element={<CoursesListPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/courses/:courseId/video/:videoId" element={<VideoPlayerPage />} />
      
      {/* 考试相关路由 */}
      <Route path="/exams/mock" element={<ExamMockPage />} />
      <Route path="/exams/error-book" element={<ErrorBookPage />} />
      <Route path="/exams/detail/:examId" element={<ExamDetailPage />} />
      <Route path="/exams/result/:examId" element={<ExamResultPage />} />
      <Route path="/exams/history" element={<ExamMockPage />} />
      
      {/* 题库相关路由 - 注意：具体路径要放在参数路径之前 */}
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/questions/wrong" element={<Navigate to="/exams/error-book" replace />} />
      <Route path="/questions/:questionId" element={<QuestionDetailPage />} />
      
      {/* 社区相关路由 */}
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/post/:postId" element={<PostDetailPage />} />
      
      {/* AI助手路由 */}
      <Route path="/ai-assistant" element={<AIAssistantPage />} />
      
      {/* 用户中心路由 */}
      <Route path="/user" element={<UserCenterPage />} />
      
      {/* 404页面 */}
      <Route path="/404" element={<NotFoundPage />} />
      
      {/* 重定向到404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes; 