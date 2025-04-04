// 社区模块类型定义

// 作者信息
export interface Author {
  userId: number;
  username: string;
  avatar: string;
  title?: string;
  level?: number;
  postCount?: number;
  followersCount?: number;
}

// 专栏信息
export interface Column {
  id: number;
  title: string;
  cover: string;
  author: Author;
  description: string;
  articles: number;
  views: number;
}

// 社区板块信息
export interface Section {
  sectionId: number;
  sectionName: string;
  sectionDescription: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

// 用户信息
export interface UserInfo {
  userId: number;
  username: string;
  avatar: string;
  points: number;
  major: string;
  posts: number;
  replies: number;
  favorites: number;
}

// 帖子列表项
export interface Post {
  postId: number;
  sectionId: number;
  sectionName: string;
  userId: number;
  username: string;
  userAvatar: string;
  postTitle: string;
  postContent?: string;
  postSummary?: string;
  postStatus: number; // 0-正常，1-禁用，2-已删除
  postViews: number;
  postLikes: number;
  postComments: number;
  knowledgePoints?: KnowledgePoint[];
  isTop: boolean;
  isEssence: boolean;
  hasLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 知识点
export interface KnowledgePoint {
  knowledgePointId: number;
  knowledgePointName: string;
}

// 帖子详情
export interface PostDetail {
  postId: number;
  sectionId: number;
  sectionName: string;
  userId: number;
  username: string;
  userAvatar: string;
  postTitle: string;
  postContent: string;
  postStatus: number;
  postViews: number;
  postLikes: number;
  postComments: number;
  knowledgePoints: KnowledgePoint[];
  isTop: boolean;
  isEssence: boolean;
  hasLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

// 评论回复
export interface CommentReply {
  commentId: number;
  postId: number;
  userId: number;
  username: string;
  userAvatar: string;
  parentCommentId: number;
  commentContent: string;
  likeCount: number;
  hasLiked: boolean;
  createdAt: string;
}

// 评论信息
export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  username: string;
  userAvatar: string;
  commentContent: string;
  likeCount: number;
  hasLiked: boolean;
  createdAt: string;
  replies: CommentReply[];
}

// 帖子举报
export interface PostReport {
  reportId: number;
  postId: number;
  userId: number;
  reportReason: string;
  reportStatus: number; // 0-待处理，1-已处理，2-已驳回
  createdAt: string;
  resolvedAt?: string;
}

// 帖子查询参数
export interface PostsQueryParams {
  pageNum?: number;
  pageSize?: number;
  sortBy?: 'latest' | 'hot' | 'featured';
  sectionId?: number;
  keyword?: string;
}

// 创建帖子参数
export interface CreatePostDTO {
  sectionId: number;
  postTitle: string;
  postContent: string;
  knowledgePointIds?: number[];
}

// 创建评论参数
export interface CreateCommentDTO {
  postId: number;
  commentContent: string;
  parentCommentId?: number;
}

// 举报帖子参数
export interface CreateReportDTO {
  postId: number;
  reportReason: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页结果
export interface PageResult<T> {
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
  list: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} 