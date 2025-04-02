import { 
  Question, 
  QuestionDetail, 
  QuestionType, 
  QuestionDifficulty, 
  WrongQuestion, 
  SubmitAnswerRequest, 
  SubmitAnswerResponse, 
  QuestionQueryParams, 
  PaginationData,
  Leaderboard,
  KnowledgePoint
} from '../types/question';
import http from './http';

// 获取题目列表
export const getQuestions = async (params: QuestionQueryParams): Promise<PaginationData<Question>> => {
  try {
    const { data } = await http.get('/questions', { params });
    
    // 处理后端返回的数据格式
    if (data && data.code === 200 && data.data) {
      // 转换题目数据格式
      const records = data.data.list.map((item: any) => ({
        questionId: item.questionId,
        content: item.questionText,
        type: item.questionType,
        difficulty: item.difficultyLevel,
        passRate: item.passRate,
        usageCount: item.usageCount,
        createTime: item.createTime,
        updateTime: item.updateTime,
        options: item.options?.map((opt: any) => ({
          id: opt.optionId,
          key: opt.optionKey,
          content: opt.optionValue
        })) || [],
        knowledgePoints: item.knowledgePoints 
          ? item.knowledgePoints.map((kp: any) => ({
              id: kp.knowledgePointId,
              name: kp.name
            })) 
          : (item.knowledgePoint ? item.knowledgePoint.split(',').map((name: string) => ({
              id: 0, // 临时ID
              name: name.trim()
            })) : []),
        analysis: item.analysis,
        correctAnswer: item.correctAnswer
      }));

      return {
        total: data.data.total || 0,
        pages: Math.ceil((data.data.total || 0) / (params.size || 10)),
        current: params.page || 1,
        size: params.size || 10,
        records
      };
    }
    
    // 如果返回数据格式不符合预期，返回空结果
    return {
      total: 0,
      pages: 0,
      current: params.page || 1,
      size: params.size || 10,
      records: []
    };
  } catch (error) {
    console.error('获取题目列表出错:', error);
    return {
      total: 0,
      pages: 0,
      current: params.page || 1,
      size: params.size || 10,
      records: []
    };
  }
};

// 获取题目详情
export const getQuestionDetail = async (questionId: number): Promise<QuestionDetail> => {
  const { data } = await http.get(`/questions/${questionId}`);
  return data.data;
};

// 提交答案
export const submitAnswer = async (questionId: number, answerData: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
  try {
    const { data } = await http.post(`/questions/${questionId}/answer`, answerData);
    if (data.code === 200) {
      return {
        isCorrect: data.data.isCorrect,
        correctAnswer: data.data.correctAnswer,
        analysis: data.data.analysis
      };
    }
    throw new Error(data.message || '提交答案失败');
  } catch (error) {
    console.error('提交答案失败:', error);
    throw error;
  }
};

// 获取错题集
export const getWrongQuestions = async (page: number = 1, size: number = 20): Promise<PaginationData<WrongQuestion>> => {
  try {
    const { data } = await http.get('/questions/wrong-book', { 
      params: { page, size } 
    });
    
    if (data.code === 200 && data.data) {
      // 转换后端返回的题目数据为前端所需的WrongQuestion格式
      const records = data.data.questions.map((item: any) => ({
        questionId: item.questionId,
        type: item.questionType,  // 后端是questionType，前端需要type
        content: item.questionText, // 后端是questionText，前端需要content
        difficulty: item.difficultyLevel, // 后端是difficultyLevel，前端需要difficulty
        wrongTimes: 1, // 这个字段后端可能没有，默认为1
        lastWrongTime: item.updateTime || new Date().toISOString(), // 使用更新时间作为最后错误时间
        knowledgePoints: item.knowledgePoints || [],
        options: item.options || [],
        passRate: item.passRate,
        usageCount: item.usageCount,
        correctAnswer: item.correctAnswer,
        analysis: item.analysis,
        creatorName: item.creatorName
      }));
      
      return {
        total: data.data.total || 0,
        pages: Math.ceil((data.data.total || 0) / size),
        current: data.data.page || page,
        size: data.data.size || size,
        records
      };
    }
    
    // 如果返回数据格式不符合预期，返回空结果
    return {
      total: 0,
      pages: 0,
      current: page,
      size: size,
      records: []
    };
  } catch (error) {
    console.error('获取错题本数据出错:', error);
    return {
      total: 0,
      pages: 0,
      current: page,
      size: size,
      records: []
    };
  }
};

// 获取做题排行榜
export const getLeaderboard = async (limit: number = 10): Promise<Leaderboard> => {
  try {
    const { data } = await http.get('/questions/ranking', { 
      params: { limit } 
    });
    
    // 确保data.data是数组，如果不是，尝试其他可能的路径
    let rankingData = [];
    if (Array.isArray(data.data)) {
      rankingData = data.data;
    } else if (data.data && Array.isArray(data.data.list)) {
      rankingData = data.data.list;
    } else if (data.data && data.data.leaderboard && Array.isArray(data.data.leaderboard)) {
      rankingData = data.data.leaderboard;
    }
    
    return {
      type: "count",
      period: "all",
      updateTime: new Date().toISOString(),
      leaderboard: rankingData.map((item: any) => ({
        rank: item.rank || 0,
        userId: item.userId || 0,
        username: item.username || '匿名用户',
        avatar: item.avatar && item.avatar.trim() !== '' ? item.avatar : null,
        count: item.completeCount || 0,
        accuracy: item.correctRate || 0
      }))
    };
  } catch (error) {
    console.error('获取排行榜出错:', error);
    return {
      type: "count",
      period: "all",
      updateTime: new Date().toISOString(),
      leaderboard: []
    };
  }
};

// 添加题目到错题本
export const addToWrongBook = async (questionId: number): Promise<boolean> => {
  const { data } = await http.post('/questions/wrong-book/add', { 
    questionId 
  });
  return data.code === 200;
};

// 从错题本移除题目
export const removeFromWrongBook = async (questionId: number): Promise<boolean> => {
  const { data } = await http.delete('/questions/wrong-book/remove', { 
    data: { questionId } 
  });
  return data.code === 200;
};

// 检查题目是否在错题本中
export const isInWrongBook = async (questionId: number): Promise<boolean> => {
  const { data } = await http.get(`/questions/${questionId}/is-in-wrong-book`);
  return data.data.inWrongBook;
};

// 导出API接口
const questionApi = {
  getQuestions,
  getQuestionDetail,
  submitAnswer,
  getWrongQuestions,
  getLeaderboard,
  addToWrongBook,
  removeFromWrongBook,
  isInWrongBook
};

export default questionApi; 