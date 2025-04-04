import http from './http';
import axios from 'axios';

// 配置axios基础URL
axios.defaults.baseURL = 'http://localhost:8080';

// 配置请求拦截器统一添加token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['satoken'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// API基础URL
const BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns Promise
 */
export const getUserList = async (params: {
  page: number;
  size: number;
  keyword?: string;
  userType?: number;
  status?: number;
}): Promise<any> => {
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
      },
      params
    };
    
    const response = await http.get('/admin/users', config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取用户列表失败'
      };
    }
  } catch (error: any) {
    console.error('获取用户列表错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取用户列表失败'
    };
  }
};

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns Promise
 */
export const getUserDetail = async (userId: number): Promise<any> => {
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
    
    const response = await http.get(`/admin/users/${userId}`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取用户详情失败'
      };
    }
  } catch (error: any) {
    console.error('获取用户详情错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取用户详情失败'
    };
  }
};

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param data 更新数据
 * @returns Promise
 */
export const updateUser = async (userId: number, data: any): Promise<any> => {
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
    
    const response = await http.put(`/admin/users/${userId}`, data, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '用户信息更新成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '用户信息更新失败'
      };
    }
  } catch (error: any) {
    console.error('更新用户信息错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '更新用户信息失败'
    };
  }
};

/**
 * 重置用户密码
 * @param userId 用户ID
 * @returns Promise
 */
export const resetUserPassword = async (userId: number): Promise<any> => {
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
    
    const response = await http.put(`/admin/users/${userId}/reset-password`, {}, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: response.data.data || '密码重置成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '密码重置失败'
      };
    }
  } catch (error: any) {
    console.error('重置密码错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '重置密码失败'
    };
  }
};

/**
 * 更新用户状态
 * @param userId 用户ID
 * @param status 状态(0-启用, 1-禁用)
 * @returns Promise
 */
export const updateUserStatus = async (userId: number, status: number): Promise<any> => {
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
      },
      params: { status }
    };
    
    const response = await http.put(`/admin/users/${userId}/status`, {}, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: status === 0 ? '用户已启用' : '用户已禁用'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '更新用户状态失败'
      };
    }
  } catch (error: any) {
    console.error('更新用户状态错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '更新用户状态失败'
    };
  }
};

/**
 * 更新用户类型
 * @param userId 用户ID
 * @param userType 用户类型(0-学生, 1-教师, 2-管理员)
 * @returns Promise
 */
export const updateUserType = async (userId: number, userType: number): Promise<any> => {
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
      },
      params: { userType }
    };
    
    const response = await http.put(`/admin/users/${userId}/type`, {}, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '用户类型更新成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '用户类型更新失败'
      };
    }
  } catch (error: any) {
    console.error('更新用户类型错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '更新用户类型失败'
    };
  }
};

/**
 * 删除用户
 * @param userId 用户ID
 * @returns Promise
 */
export const deleteUser = async (userId: number): Promise<any> => {
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
    
    const response = await http.delete(`/admin/users/${userId}`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '用户删除成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '用户删除失败'
      };
    }
  } catch (error: any) {
    console.error('删除用户错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '删除用户失败'
    };
  }
};

/**
 * 获取用户统计数据
 * @returns Promise
 */
export const getUserStats = async (): Promise<any> => {
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
    
    const response = await http.get('/admin/users/stats', config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取用户统计数据失败'
      };
    }
  } catch (error: any) {
    console.error('获取用户统计数据错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取用户统计数据失败'
    };
  }
};

/**
 * 获取题目列表（管理端）
 * @param params 查询参数
 * @returns Promise
 */
export const getQuestionsList = async (params: {
  page: number;
  size: number;
  keyword?: string;
  type?: string;
  difficulty?: string;
  knowledgePoints?: string[];
}): Promise<any> => {
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
      },
      params
    };
    
    const response = await http.get('/admin/questions', config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取题目列表失败'
      };
    }
  } catch (error: any) {
    console.error('获取题目列表错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取题目列表失败'
    };
  }
};

/**
 * 获取题目详情（管理端）
 * @param questionId 题目ID
 * @returns Promise
 */
export const getQuestionDetail = async (questionId: number): Promise<any> => {
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
    
    const response = await http.get(`/admin/questions/${questionId}`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取题目详情失败'
      };
    }
  } catch (error: any) {
    console.error('获取题目详情错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取题目详情失败'
    };
  }
};

/**
 * 创建题目（管理端）
 * @param data 题目数据
 * @returns Promise
 */
export const createQuestion = async (data: any): Promise<any> => {
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
    
    const response = await http.post('/admin/questions', data, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: '题目创建成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '题目创建失败'
      };
    }
  } catch (error: any) {
    console.error('创建题目错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '题目创建失败'
    };
  }
};

/**
 * 更新题目（管理端）
 * @param questionId 题目ID
 * @param data 更新数据
 * @returns Promise
 */
export const updateQuestion = async (questionId: number, data: any): Promise<any> => {
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
    
    const response = await http.put(`/admin/questions/${questionId}`, data, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '题目更新成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '题目更新失败'
      };
    }
  } catch (error: any) {
    console.error('更新题目错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '更新题目失败'
    };
  }
};

/**
 * 删除题目（管理端）
 * @param questionId 题目ID
 * @returns Promise
 */
export const deleteQuestion = async (questionId: number): Promise<any> => {
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
    
    const response = await http.delete(`/admin/questions/${questionId}`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '题目删除成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '题目删除失败'
      };
    }
  } catch (error: any) {
    console.error('删除题目错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '删除题目失败'
    };
  }
};

/**
 * 批量导入题目（管理端）
 * @param file 题目文件
 * @returns Promise
 */
export const importQuestions = async (file: File): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        message: '未登录状态'
      };
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        satoken: token,
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await http.post('/admin/questions/import', formData, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: '题目导入成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '题目导入失败'
      };
    }
  } catch (error: any) {
    console.error('导入题目错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '导入题目失败'
    };
  }
};

/**
 * 导出题目（管理端）
 * @param params 查询参数
 * @returns Promise
 */
export const exportQuestions = async (params: {
  type?: string;
  difficulty?: string;
  knowledgePoints?: string[];
}): Promise<any> => {
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
      },
      params,
      responseType: 'blob' as const
    };
    
    const response = await http.get('/admin/questions/export', config);
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `题目导出_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return {
      success: true,
      message: '题目导出成功'
    };
  } catch (error: any) {
    console.error('导出题目错误:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '导出题目失败'
    };
  }
};

/**
 * 获取考试列表
 * @param params 查询参数
 * @returns 考试列表数据
 */
export const getExamsList = async (params: {
  page: number;
  size: number;
  keyword?: string;
  status?: number;
}): Promise<any> => {
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
      },
      params
    };
    
    const response = await http.get('/admin/exams', config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取考试列表失败'
      };
    }
  } catch (error: any) {
    console.error('获取考试列表失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取考试列表失败'
    };
  }
};

/**
 * 获取考试详情
 * @param examId 考试ID
 * @returns 考试详情
 */
export const getExamDetail = async (examId: number): Promise<any> => {
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
    
    const response = await http.get(`/admin/exams/${examId}`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取考试详情失败'
      };
    }
  } catch (error: any) {
    console.error('获取考试详情失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取考试详情失败'
    };
  }
};

/**
 * 创建考试
 * @param examData 考试数据
 * @returns 创建结果
 */
export const createExam = async (examData: any): Promise<any> => {
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
    
    const response = await http.post('/admin/exams', examData, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: '考试创建成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '考试创建失败'
      };
    }
  } catch (error: any) {
    console.error('创建考试失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '考试创建失败'
    };
  }
};

/**
 * 更新考试
 * @param examId 考试ID
 * @param examData 考试数据
 * @returns 更新结果
 */
export const updateExam = async (examId: number, examData: any): Promise<any> => {
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
    
    const response = await http.put(`/admin/exams/${examId}`, examData, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '考试更新成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '考试更新失败'
      };
    }
  } catch (error: any) {
    console.error('更新考试失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '考试更新失败'
    };
  }
};

/**
 * 删除考试
 * @param examId 考试ID
 * @returns 删除结果
 */
export const deleteExam = async (examId: number): Promise<any> => {
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
    
    const response = await http.delete(`/admin/exams/${examId}`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '考试删除成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '考试删除失败'
      };
    }
  } catch (error: any) {
    console.error('删除考试失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '考试删除失败'
    };
  }
};

/**
 * 获取考试题目列表
 * @param examId 考试ID
 * @returns 考试题目列表
 */
export const getExamQuestions = async (examId: number): Promise<any> => {
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
    
    const response = await http.get(`/admin/exams/${examId}/questions`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取考试题目失败'
      };
    }
  } catch (error: any) {
    console.error('获取考试题目失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取考试题目失败'
    };
  }
};

/**
 * 更新考试题目
 * @param examId 考试ID
 * @param questionsData 题目数据
 * @returns 更新结果
 */
export const updateExamQuestions = async (examId: number, questionsData: any[]): Promise<any> => {
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
    
    const response = await http.put(`/admin/exams/${examId}/questions`, questionsData, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        message: '考试题目更新成功'
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '考试题目更新失败'
      };
    }
  } catch (error: any) {
    console.error('更新考试题目失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '更新考试题目失败'
    };
  }
};

/**
 * 获取考试统计数据
 * @param examId 考试ID
 * @returns 统计数据
 */
export const getExamStatistics = async (examId: number): Promise<any> => {
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
    
    const response = await http.get(`/admin/exams/${examId}/statistics`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取考试统计数据失败'
      };
    }
  } catch (error: any) {
    console.error('获取考试统计数据失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取考试统计数据失败'
    };
  }
};

/**
 * 获取考试排名
 * @param examId 考试ID
 * @param params 查询参数
 * @returns 排名数据
 */
export const getExamRanking = async (examId: number, params?: any): Promise<any> => {
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
      },
      params
    };
    
    const response = await http.get(`/admin/exams/${examId}/ranking`, config);
    
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '获取考试排名失败'
      };
    }
  } catch (error: any) {
    console.error('获取考试排名失败:', error);
    return {
      success: false,
      message: error.response?.data?.msg || '获取考试排名失败'
    };
  }
}; 