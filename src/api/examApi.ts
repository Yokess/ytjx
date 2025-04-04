import { 
  ApiResponse, 
  Exam, 
  ExamDetail, 
  ExamQuestion, 
  ExamResult, 
  ExamStatus, 
  LeaderboardItem, 
  PaginationData, 
  SubmitAnswer, 
  UserExam,
  UserExamAnswerDTO,
  QuestionAnswerDTO
} from '../types/exam';
import http from './http';

/**
 * 获取考试列表
 * @param params 查询参数
 * @returns 分页的考试列表
 */
export const getExams = async (params: {
  keyword?: string;
  status?: ExamStatus;
  page?: number;
  size?: number;
}): Promise<ApiResponse<PaginationData<Exam>>> => {
  try {
    const { keyword, status, page = 1, size = 10 } = params;
    const response = await http.get('/exams', {
      params: { keyword, status, page, size }
    });
    return response.data;
  } catch (error) {
    console.error('获取考试列表失败:', error);
    throw error;
  }
};

/**
 * 获取考试详情
 * @param examId 考试ID
 * @returns 考试详情
 */
export const getExamDetail = async (examId: number): Promise<ApiResponse<ExamDetail>> => {
  try {
    const response = await http.get(`/exams/${examId}`);
    return response.data;
  } catch (error) {
    console.error('获取考试详情失败:', error);
    throw error;
  }
};

/**
 * 获取考试题目
 * @param examId 考试ID
 * @returns 考试题目列表
 */
export const getExamQuestions = async (examId: number): Promise<ApiResponse<{ examId: number; questions: ExamQuestion[] }>> => {
  try {
    const response = await http.get(`/exams/${examId}/questions`);
    // 调整返回格式以符合前端期望的结构
    return {
      code: response.data.code,
      message: response.data.message,
      data: {
        examId,
        questions: response.data.data || []
      }
    };
  } catch (error) {
    console.error('获取考试题目失败:', error);
    throw error;
  }
};

/**
 * 参加考试（开始考试）
 * @param examId 考试ID
 * @returns 用户考试记录
 */
export const participateExam = async (examId: number): Promise<ApiResponse<UserExam>> => {
  try {
    const response = await http.post(`/exams/${examId}/start`);
    const userExamId = response.data.data.userExamId;
    
    // 根据后端返回的数据构造UserExam对象
    // 由于后端可能没有返回完整的UserExam对象，需要获取考试详情补充信息
    const examDetailResponse = await http.get(`/exams/${examId}`);
    const examDetail = examDetailResponse.data.data;
    
    const now = new Date().toISOString();
    const remainingTime = examDetail.duration * 60; // 转换为秒
    
    const userExam: UserExam = {
      userExamId,
      startTime: now,
      endTime: examDetail.endTime,
      remainingTime
    };
    
    return {
      code: response.data.code,
      message: response.data.message,
      data: userExam
    };
  } catch (error) {
    console.error('参加考试失败:', error);
    throw error;
  }
};

/**
 * 提交考试答案
 * @param examId 考试ID
 * @param answers 答案数组
 * @returns 提交结果
 */
export const submitExamAnswers = async (examId: number, answers: SubmitAnswer[]): Promise<ApiResponse<{ userExamId: number; submitTime: string }>> => {
  try {
    // 构造提交数据对象，符合后端UserExamAnswerDTO格式
    // 将SubmitAnswer转换为QuestionAnswerDTO
    const questionAnswers: QuestionAnswerDTO[] = answers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer
    }));
    
    const userExamAnswerDTO: UserExamAnswerDTO = {
      examId,
      answers: questionAnswers
    };
    
    const response = await http.post('/exams/submit', userExamAnswerDTO);
    
    // 从响应数据中提取所需信息
    return {
      code: response.data.code,
      message: response.data.message,
      data: {
        userExamId: response.data.data.userExamId || 0,
        submitTime: response.data.data.submitTime || new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('提交考试答案失败:', error);
    throw error;
  }
};

/**
 * 获取考试结果
 * @param examId 考试ID
 * @returns 考试结果
 */
export const getExamResult = async (examId: number): Promise<ApiResponse<ExamResult>> => {
  try {
    const response = await http.get(`/exams/${examId}/result`);
    return response.data;
  } catch (error) {
    console.error('获取考试结果失败:', error);
    throw error;
  }
};

/**
 * 获取考试排行榜
 * @param examId 考试ID
 * @param params 查询参数
 * @returns 排行榜
 */
export const getExamLeaderboard = async (
  examId: number,
  params: { page?: number; size?: number }
): Promise<ApiResponse<PaginationData<LeaderboardItem>>> => {
  try {
    const { page = 1, size = 10 } = params;
    const response = await http.get(`/exams/${examId}/ranking`, {
      params: { limit: size }
    });
    
    // 调整响应格式以符合前端期望
    // 因为后端可能返回的是列表而非分页数据
    const records = response.data.data || [];
    
    return {
      code: response.data.code,
      message: response.data.message,
      data: {
        total: records.length,
        pages: 1,
        current: page,
        size,
        records
      }
    };
  } catch (error) {
    console.error('获取考试排行榜失败:', error);
    throw error;
  }
};

/**
 * 获取考试统计数据
 * @param examId 考试ID
 * @returns 考试统计数据
 */
export const getExamStatistics = async (examId: number): Promise<ApiResponse<any>> => {
  try {
    const response = await http.get(`/exams/${examId}/statistics`);
    return response.data;
  } catch (error) {
    console.error('获取考试统计数据失败:', error);
    throw error;
  }
};

/**
 * 获取考试及格率
 * @param examId 考试ID
 * @returns 考试及格率
 */
export const getExamPassRate = async (examId: number): Promise<ApiResponse<{ passRate: number }>> => {
  try {
    const response = await http.get(`/exams/${examId}/pass-rate`);
    return response.data;
  } catch (error) {
    console.error('获取考试及格率失败:', error);
    throw error;
  }
};

/**
 * 获取考试平均分
 * @param examId 考试ID
 * @returns 考试平均分
 */
export const getExamAverageScore = async (examId: number): Promise<ApiResponse<{ averageScore: number }>> => {
  try {
    const response = await http.get(`/exams/${examId}/average-score`);
    return response.data;
  } catch (error) {
    console.error('获取考试平均分失败:', error);
    throw error;
  }
};

/**
 * 创建考试
 * @param examData 考试数据
 * @returns 创建结果
 */
export const createExam = async (examData: any): Promise<ApiResponse<{ examId: number }>> => {
  try {
    const response = await http.post('/exams', examData);
    return response.data;
  } catch (error) {
    console.error('创建考试失败:', error);
    throw error;
  }
};

/**
 * 更新考试
 * @param examId 考试ID
 * @param examData 考试数据
 * @returns 更新结果
 */
export const updateExam = async (examId: number, examData: any): Promise<ApiResponse<void>> => {
  try {
    const response = await http.put(`/exams/${examId}`, examData);
    return response.data;
  } catch (error) {
    console.error('更新考试失败:', error);
    throw error;
  }
};

/**
 * 删除考试
 * @param examId 考试ID
 * @returns 删除结果
 */
export const deleteExam = async (examId: number): Promise<ApiResponse<void>> => {
  try {
    const response = await http.delete(`/exams/${examId}`);
    return response.data;
  } catch (error) {
    console.error('删除考试失败:', error);
    throw error;
  }
};

/**
 * 更新考试题目
 * @param examId 考试ID
 * @param questions 题目列表
 * @returns 更新结果
 */
export const updateExamQuestions = async (examId: number, questions: any[]): Promise<ApiResponse<void>> => {
  try {
    const response = await http.put(`/exams/${examId}/questions`, questions);
    return response.data;
  } catch (error) {
    console.error('更新考试题目失败:', error);
    throw error;
  }
}; 