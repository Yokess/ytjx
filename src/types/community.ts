// 社区模块类型定义

// 作者信息
export interface Author {
  id: string;
  name: string;
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

// 帖子信息
export interface Post {
  id: number;
  title: string;
  content?: string;
  tags: string[];
  tagColors?: string[];
  author: Author;
  date: string;
  views: number;
  comments: number;
  likes: number;
  postTags?: string[];
  isOfficial?: boolean;
}

// 社区板块信息
export interface Section {
  name: string;
  icon: string;
  count: number;
  color: string;
}

// 用户信息
export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  points: number;
  major: string;
  posts: number;
  replies: number;
  favorites: number;
}

// 帖子详情
export interface PostDetail {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    title: string;
    postCount: number;
    followersCount: number;
  };
  createTime: string;
  updateTime: string;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  tags: string[];
  section: string;
  isLiked: boolean;
  isFavorited: boolean;
}

// 评论回复
export interface CommentReply {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  createTime: string;
  likeCount: number;
  isLiked: boolean;
  replyTo?: {
    id: string;
    name: string;
  };
}

// 评论信息
export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  createTime: string;
  likeCount: number;
  isLiked: boolean;
  replies: CommentReply[];
}

// 帖子查询参数
export interface PostsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'latest' | 'hot' | 'featured';
  section?: string;
  tag?: string;
  keyword?: string;
}

// 创建帖子参数
export interface CreatePostParams {
  title: string;
  content: string;
  section: string;
  tags: string[];
}

// 创建评论参数
export interface CreateCommentParams {
  content: string;
}

// 创建回复参数
export interface CreateReplyParams {
  content: string;
  replyToUserId?: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
} 