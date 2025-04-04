import {
  ApiResponse,
  Author,
  Column,
  Post,
  Section,
  UserInfo,
  PostDetail,
  Comment,
  CommentReply,
  PostsQueryParams,
  CreatePostDTO,
  CreateCommentDTO,
  CreateReportDTO,
  PostReport,
  PageResult
} from '../types/community';
import http from './http';

/**
 * 获取社区板块列表
 * @returns 社区板块列表
 */
export const getSections = async (): Promise<ApiResponse<Section[]>> => {
  try {
    const response = await http.get('/community/sections');
    return response.data;
  } catch (error) {
    console.error('获取社区板块失败:', error);
    throw error;
  }
};

/**
 * 创建社区板块
 * @param sectionData 板块数据
 * @returns 创建结果
 */
export const createSection = async (sectionData: { sectionName: string; sectionDescription: string }): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        message: '未登录状态'
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const response = await http.post('/admin/community/sections', sectionData, config);
    
    return response.data;
  } catch (error: any) {
    console.error('创建板块失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '创建板块失败'
    };
  }
};

/**
 * 更新社区板块
 * @param sectionId 板块ID
 * @param sectionData 板块数据
 * @returns 更新结果
 */
export const updateSection = async (sectionId: number, sectionData: { sectionName: string; sectionDescription: string }): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        message: '未登录状态'
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const response = await http.put(`/admin/community/sections/${sectionId}`, sectionData, config);
    
    return response.data;
  } catch (error: any) {
    console.error('更新板块失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '更新板块失败'
    };
  }
};

/**
 * 删除社区板块
 * @param sectionId 板块ID
 * @returns 删除结果
 */
export const deleteSection = async (sectionId: number): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        message: '未登录状态'
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const response = await http.delete(`/admin/community/sections/${sectionId}`, config);
    
    return response.data;
  } catch (error: any) {
    console.error('删除板块失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '删除板块失败'
    };
  }
};

/**
 * 获取帖子列表
 * @param params 查询参数
 * @returns 分页的帖子列表
 */
export const getPosts = async (params: PostsQueryParams): Promise<ApiResponse<PageResult<Post>>> => {
  try {
    console.log('[API] getPosts 被调用，原始参数:', params);
    
    // 删除值为undefined或空字符串的参数
    const cleanParams = Object.entries(params).reduce((acc: any, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    console.log('[API] getPosts 清理后的参数:', cleanParams);
    console.log('[API] 请求URL:', '/community/posts');
    
    const response = await http.get('/community/posts', { params: cleanParams });
    
    console.log('[API] getPosts 响应状态:', response.status);
    console.log('[API] getPosts 响应数据:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[API] getPosts 请求失败:', error);
    throw error;
  }
};

/**
 * 获取帖子详情
 * @param postId 帖子ID
 * @param userId 用户ID (可选)
 * @returns 帖子详情
 */
export const getPostById = async (postId: number, userId?: number): Promise<ApiResponse<PostDetail>> => {
  try {
    const response = await http.get(`/community/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    throw error;
  }
};

/**
 * 创建帖子
 * @param postDto 帖子数据
 * @returns 创建的帖子
 */
export const createPost = async (postDto: CreatePostDTO): Promise<ApiResponse<Post>> => {
  try {
    const response = await http.post('/community/posts', postDto);
    return response.data;
  } catch (error) {
    console.error('创建帖子失败:', error);
    throw error;
  }
};

/**
 * 更新帖子
 * @param postId 帖子ID
 * @param postDto 帖子数据
 * @returns 更新后的帖子
 */
export const updatePost = async (postId: number, postDto: CreatePostDTO): Promise<ApiResponse<Post>> => {
  try {
    const response = await http.put(`/community/posts/${postId}`, postDto);
    return response.data;
  } catch (error) {
    console.error('更新帖子失败:', error);
    throw error;
  }
};

/**
 * 删除帖子
 * @param postId 帖子ID
 * @returns 操作结果
 */
export const deletePost = async (postId: number): Promise<ApiResponse<null>> => {
  try {
    // 获取token
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        code: 401,
        message: '未登录状态',
        data: null
      };
    }
    
    // 设置请求头
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const response = await http.delete(`/community/posts/${postId}`, config);
    console.log('[API] deletePost 响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('删除帖子失败:', error);
    throw error;
  }
};

/**
 * 点赞帖子
 * @param postId 帖子ID
 * @returns 操作结果
 */
export const likePost = async (postId: number): Promise<ApiResponse<null>> => {
  try {
    const response = await http.post(`/community/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('点赞帖子失败:', error);
    throw error;
  }
};

/**
 * 取消点赞帖子
 * @param postId 帖子ID
 * @returns 操作结果
 */
export const unlikePost = async (postId: number): Promise<ApiResponse<null>> => {
  try {
    const response = await http.post(`/community/posts/${postId}/unlike`);
    return response.data;
  } catch (error) {
    console.error('取消点赞帖子失败:', error);
    throw error;
  }
};

/**
 * 获取评论列表
 * @param postId 帖子ID
 * @param pageNum 页码
 * @param pageSize 每页数量
 * @returns 分页的评论列表
 */
export const getComments = async (postId: number, pageNum: number, pageSize: number): Promise<ApiResponse<PageResult<Comment>>> => {
  try {
    const response = await http.get('/community/comments', {
      params: { postId, pageNum, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('获取评论列表失败:', error);
    throw error;
  }
};

/**
 * 获取评论回复列表
 * @param commentId 评论ID
 * @returns 评论回复列表
 */
export const getCommentReplies = async (commentId: number): Promise<ApiResponse<CommentReply[]>> => {
  try {
    const response = await http.get(`/community/comments/${commentId}/replies`);
    return response.data;
  } catch (error) {
    console.error('获取评论回复失败:', error);
    throw error;
  }
};

/**
 * 创建评论
 * @param commentDto 评论数据
 * @returns 创建的评论
 */
export const createComment = async (commentDto: CreateCommentDTO): Promise<ApiResponse<Comment>> => {
  try {
    const response = await http.post('/community/comments', commentDto);
    return response.data;
  } catch (error) {
    console.error('创建评论失败:', error);
    throw error;
  }
};

/**
 * 删除评论
 * @param commentId 评论ID
 * @returns 操作结果
 */
export const deleteComment = async (commentId: number): Promise<ApiResponse<null>> => {
  try {
    const response = await http.delete(`/community/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('删除评论失败:', error);
    throw error;
  }
};

/**
 * 点赞评论
 * @param commentId 评论ID
 * @returns 操作结果
 */
export const likeComment = async (commentId: number): Promise<ApiResponse<null>> => {
  try {
    const response = await http.post(`/community/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    console.error('点赞评论失败:', error);
    throw error;
  }
};

/**
 * 取消点赞评论
 * @param commentId 评论ID
 * @returns 操作结果
 */
export const unlikeComment = async (commentId: number): Promise<ApiResponse<null>> => {
  try {
    const response = await http.post(`/community/comments/${commentId}/unlike`);
    return response.data;
  } catch (error) {
    console.error('取消点赞评论失败:', error);
    throw error;
  }
};

/**
 * 举报帖子
 * @param reportDto 举报数据
 * @returns 操作结果
 */
export const reportPost = async (reportDto: CreateReportDTO): Promise<ApiResponse<null>> => {
  try {
    const response = await http.post('/community/reports', reportDto);
    return response.data;
  } catch (error) {
    console.error('举报帖子失败:', error);
    throw error;
  }
};

/**
 * 获取帖子举报列表
 * @param postId 帖子ID
 * @param pageNum 页码
 * @param pageSize 每页数量
 * @returns 分页的举报列表
 */
export const getReportsByPostId = async (postId: number, pageNum: number, pageSize: number): Promise<ApiResponse<PageResult<PostReport>>> => {
  try {
    const response = await http.get(`/community/reports/post/${postId}`, {
      params: { pageNum, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('获取帖子举报列表失败:', error);
    throw error;
  }
};

/**
 * 设置帖子置顶状态
 * @param postId 帖子ID
 * @param isTop 是否置顶
 * @returns 操作结果
 */
export const setPostTopStatus = async (postId: number, isTop: boolean): Promise<ApiResponse<null>> => {
  try {
    console.log('[API] 设置帖子置顶状态, postId:', postId, 'isTop:', isTop);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('[API] setPostTopStatus 未找到token');
      return {
        code: 401,
        message: '未登录状态',
        data: null
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      },
      params: { isTop }
    };
    
    console.log('[API] setPostTopStatus 请求配置:', config);
    const response = await http.put(`/community/posts/${postId}/top`, null, config);
    console.log('[API] setPostTopStatus 响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] 设置帖子置顶状态失败:', error);
    throw error;
  }
};

/**
 * 设置帖子精华状态
 * @param postId 帖子ID
 * @param isEssence 是否精华
 * @returns 操作结果
 */
export const setPostEssenceStatus = async (postId: number, isEssence: boolean): Promise<ApiResponse<null>> => {
  try {
    console.log('[API] 设置帖子精华状态, postId:', postId, 'isEssence:', isEssence);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('[API] setPostEssenceStatus 未找到token');
      return {
        code: 401,
        message: '未登录状态',
        data: null
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      },
      params: { isEssence }
    };
    
    console.log('[API] setPostEssenceStatus 请求配置:', config);
    const response = await http.put(`/community/posts/${postId}/essence`, null, config);
    console.log('[API] setPostEssenceStatus 响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] 设置帖子精华状态失败:', error);
    throw error;
  }
};

/**
 * 禁止帖子回复
 * @param postId 帖子ID
 * @param isLocked 是否禁止回复
 * @returns 操作结果
 */
export const setPostLockStatus = async (postId: number, isLocked: boolean): Promise<ApiResponse<null>> => {
  try {
    console.log('[API] 设置帖子锁定状态, postId:', postId, 'isLocked:', isLocked);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('[API] setPostLockStatus 未找到token');
      return {
        code: 401,
        message: '未登录状态',
        data: null
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      },
      params: { isLocked }
    };
    
    console.log('[API] setPostLockStatus 请求配置:', config);
    
    // 使用管理员接口
    const response = await http.put(`/admin/community/posts/${postId}/lock`, null, config);
    console.log('[API] setPostLockStatus 响应:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[API] 设置帖子禁止回复状态失败:', error);
    // 自定义错误响应，以便前端统一处理
    if (error.response?.status === 403) {
      return {
        code: 403,
        message: '您没有操作权限',
        data: null
      };
    }
    throw error;
  }
};

/**
 * 隐藏帖子
 * @param postId 帖子ID
 * @param isHidden 是否隐藏
 * @returns 操作结果
 */
export const setPostHiddenStatus = async (postId: number, isHidden: boolean): Promise<ApiResponse<null>> => {
  try {
    console.log('[API] 设置帖子隐藏状态, postId:', postId, 'isHidden:', isHidden);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('[API] setPostHiddenStatus 未找到token');
      return {
        code: 401,
        message: '未登录状态',
        data: null
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      },
      params: { isHidden }
    };
    
    console.log('[API] setPostHiddenStatus 请求配置:', config);
    
    // 使用管理员接口
    const response = await http.put(`/admin/community/posts/${postId}/hide`, null, config);
    console.log('[API] setPostHiddenStatus 响应:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[API] 设置帖子隐藏状态失败:', error);
    // 自定义错误响应，以便前端统一处理
    if (error.response?.status === 403) {
      return {
        code: 403,
        message: '您没有操作权限',
        data: null
      };
    }
    throw error;
  }
};

/**
 * 处理帖子举报
 * @param reportId 举报ID
 * @param status 处理状态：1-已处理，2-已驳回
 * @param remark 处理备注
 * @returns 操作结果
 */
export const handlePostReport = async (reportId: number, status: number, remark: string): Promise<ApiResponse<null>> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        code: 401,
        message: '未登录状态',
        data: null
      };
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token
      }
    };
    
    const data = {
      status,
      remark
    };
    
    const response = await http.put(`/admin/community/reports/${reportId}`, data, config);
    return response.data;
  } catch (error) {
    console.error('处理帖子举报失败:', error);
    throw error;
  }
};

// 导出所有API
const communityApi = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getComments,
  getCommentReplies,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
  reportPost,
  getReportsByPostId,
  setPostTopStatus,
  setPostEssenceStatus,
  setPostLockStatus,
  setPostHiddenStatus,
  handlePostReport
};

export default communityApi;