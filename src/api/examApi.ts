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
  UserExam 
} from '../types/exam';
import { QuestionType } from '../types/question';

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 随机生成当前时间前后几天的日期
const randomDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// 模拟数据 - 考试列表
const mockExams: Exam[] = [
  {
    examId: 1001,
    name: '2025考研计算机专业基础模拟考试（一）',
    description: '本次考试涵盖计算机组成原理、操作系统、数据结构、计算机网络等考研专业课核心内容，帮助考生检测自身备考情况。',
    startTime: randomDate(5),  // 5天后开始
    endTime: randomDate(5.125),  // 考试3小时（约0.125天）
    duration: 180,
    totalScore: 150,
    status: ExamStatus.UPCOMING,
    questionCount: 50,
    participantCount: 1253
  },
  {
    examId: 1002,
    name: '政治理论基础测试',
    description: '本测试主要针对考研政治的马原、毛中特、当代史等内容，测试考生对基础知识点的掌握程度。',
    // 设置固定的开始和结束时间，确保考试始终处于进行中状态
    startTime: (() => {
      const date = new Date();
      date.setHours(date.getHours() - 1);
      return date.toISOString();
    })(),
    endTime: (() => {
      const date = new Date();
      date.setHours(date.getHours() + 3);
      return date.toISOString();
    })(),
    duration: 120,
    totalScore: 100,
    status: ExamStatus.ONGOING,
    questionCount: 40,
    participantCount: 875
  },
  {
    examId: 1003,
    name: '英语词汇能力测试',
    description: '测试考研英语核心词汇掌握情况，重点考察高频词汇和短语的理解和运用能力。',
    startTime: randomDate(-5),  // 5天前的考试
    endTime: randomDate(-4.9),
    duration: 60,
    totalScore: 100,
    status: ExamStatus.ENDED,
    questionCount: 100,
    participantCount: 2150
  },
  {
    examId: 1004,
    name: '2025高等数学考研模拟测试',
    description: '针对数学一/二/三的考研模拟测试，包含高数、线代、概率论等内容，难度接近真题。',
    startTime: randomDate(2),  // 2天后开始
    endTime: randomDate(2.125),
    duration: 180,
    totalScore: 150,
    status: ExamStatus.UPCOMING,
    questionCount: 20,
    participantCount: 1580
  },
  {
    examId: 1005,
    name: '人工智能专业知识测试',
    description: '针对CS/AI专业考生，测试机器学习、深度学习、NLP等领域的核心概念和算法原理掌握程度。',
    startTime: randomDate(-2),  // 2天前的考试
    endTime: randomDate(-1.9),
    duration: 120,
    totalScore: 100,
    status: ExamStatus.ENDED,
    questionCount: 30,
    participantCount: 580
  }
];

// 模拟数据 - 考试题目
const mockExamQuestions: { [key: number]: ExamQuestion[] } = {
  1001: [
    {
      questionId: 2001,
      type: QuestionType.SINGLE_CHOICE,
      content: '以下哪项不是操作系统的基本功能？',
      options: [
        { id: 'A', content: '处理机管理' },
        { id: 'B', content: '存储器管理' },
        { id: 'C', content: '文件管理' },
        { id: 'D', content: '数据库管理' }
      ],
      score: 3
    },
    {
      questionId: 2002,
      type: QuestionType.SINGLE_CHOICE,
      content: '下列关于数据结构的叙述中，错误的是：',
      options: [
        { id: 'A', content: '栈是一种后进先出的线性结构' },
        { id: 'B', content: '队列是一种先进先出的线性结构' },
        { id: 'C', content: '树是一种非线性结构' },
        { id: 'D', content: '有向图一定不存在环' }
      ],
      score: 3
    },
    {
      questionId: 2003,
      type: QuestionType.MULTIPLE_CHOICE,
      content: '下列哪些算法的平均时间复杂度为O(nlogn)？',
      options: [
        { id: 'A', content: '快速排序' },
        { id: 'B', content: '冒泡排序' },
        { id: 'C', content: '归并排序' },
        { id: 'D', content: '堆排序' }
      ],
      score: 4
    },
    {
      questionId: 2004,
      type: QuestionType.JUDGE,
      content: '在TCP/IP协议中，IP地址的长度为4个字节，共32位。',
      score: 2
    },
    {
      questionId: 2005,
      type: QuestionType.FILL_BLANK,
      content: '在计算机网络中，负责将域名转换为IP地址的协议是____。',
      score: 3
    }
  ],
  1002: [
    {
      questionId: 2006,
      type: QuestionType.SINGLE_CHOICE,
      content: '马克思主义认为，物质和意识的关系问题是：',
      options: [
        { id: 'A', content: '哲学的基本问题' },
        { id: 'B', content: '认识论的基本问题' },
        { id: 'C', content: '辩证法的基本问题' },
        { id: 'D', content: '历史观的基本问题' }
      ],
      score: 2
    },
    {
      questionId: 2007,
      type: QuestionType.SINGLE_CHOICE,
      content: '中国共产党成立的时间是：',
      options: [
        { id: 'A', content: '1919年5月4日' },
        { id: 'B', content: '1921年7月1日' },
        { id: 'C', content: '1921年7月23日' },
        { id: 'D', content: '1922年7月1日' }
      ],
      score: 2
    },
    {
      questionId: 2008,
      type: QuestionType.SINGLE_CHOICE,
      content: '毛泽东思想形成的标志是：',
      options: [
        { id: 'A', content: '《中国社会各阶级的分析》' },
        { id: 'B', content: '《星星之火，可以燎原》' },
        { id: 'C', content: '《论持久战》' },
        { id: 'D', content: '《〈共产党人〉发刊词》' }
      ],
      score: 2
    },
    {
      questionId: 2009,
      type: QuestionType.MULTIPLE_CHOICE,
      content: '习近平新时代中国特色社会主义思想的核心要义包括：',
      options: [
        { id: 'A', content: '坚持和发展中国特色社会主义' },
        { id: 'B', content: '实现中华民族伟大复兴' },
        { id: 'C', content: '推动构建人类命运共同体' },
        { id: 'D', content: '建立市场经济体制' }
      ],
      score: 4
    },
    {
      questionId: 2010,
      type: QuestionType.JUDGE,
      content: '改革开放是中国特色社会主义事业的重要组成部分。',
      score: 2
    }
  ]
};

// 模拟数据 - 考试结果
const mockExamResults: { [key: number]: ExamResult } = {
  1003: {
    userExamId: 3001,
    examId: 1003,
    examName: '英语词汇能力测试',
    score: 85,
    totalScore: 100,
    correctCount: 85,
    totalCount: 100,
    accuracy: 0.85,
    startTime: randomDate(-5),
    submitTime: randomDate(-4.95),
    rank: 235,
    participantCount: 2150,
    percentile: 89.1,
    details: [
      {
        questionId: 2010,
        userAnswer: 'A',
        correctAnswer: 'A',
        isCorrect: true,
        score: 1,
        analysis: 'approach意为"接近，靠近"，符合句意。'
      },
      {
        questionId: 2011,
        userAnswer: 'C',
        correctAnswer: 'B',
        isCorrect: false,
        score: 0,
        analysis: 'determine意为"决定，确定"，符合句意。'
      },
      // 更多题目详情...
    ]
  }
};

// 模拟数据 - 排行榜
const mockLeaderboard: LeaderboardItem[] = [
  {
    rank: 1,
    userId: 10005,
    username: '王同学',
    avatar: 'https://joeschmoe.io/api/v1/random',
    score: 95,
    totalScore: 100,
    accuracy: 0.95,
    submitTime: randomDate(-4.93)
  },
  {
    rank: 2,
    userId: 10008,
    username: '李同学',
    avatar: 'https://joeschmoe.io/api/v1/random',
    score: 93,
    totalScore: 100,
    accuracy: 0.93,
    submitTime: randomDate(-4.94)
  },
  {
    rank: 3,
    userId: 10012,
    username: '张同学',
    avatar: 'https://joeschmoe.io/api/v1/random',
    score: 92,
    totalScore: 100,
    accuracy: 0.92,
    submitTime: randomDate(-4.95)
  },
  // 更多排名...
];

// 更新考试状态函数，根据时间判断实际状态
const getActualExamStatus = (exam: Exam): ExamStatus => {
  const now = new Date();
  const startTime = new Date(exam.startTime);
  const endTime = new Date(exam.endTime);
  
  if (now < startTime) {
    return ExamStatus.UPCOMING;
  } else if (now > endTime) {
    return ExamStatus.ENDED;
  } else {
    return ExamStatus.ONGOING;
  }
};

// 刷新考试状态
const refreshExamStatus = () => {
  mockExams.forEach(exam => {
    exam.status = getActualExamStatus(exam);
  });
};

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
  await delay(500); // 模拟网络延迟
  
  // 先刷新所有考试状态
  refreshExamStatus();

  const { keyword, status, page = 1, size = 10 } = params;
  
  // 过滤考试
  let filteredExams = [...mockExams];
  
  if (keyword) {
    filteredExams = filteredExams.filter(exam => 
      exam.name.toLowerCase().includes(keyword.toLowerCase()) || 
      exam.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  if (status) {
    filteredExams = filteredExams.filter(exam => exam.status === status);
  }
  
  // 计算分页
  const total = filteredExams.length;
  const pages = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = start + size;
  const records = filteredExams.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total,
      pages,
      current: page,
      size,
      records
    }
  };
};

/**
 * 获取考试详情
 * @param examId 考试ID
 * @returns 考试详情
 */
export const getExamDetail = async (examId: number): Promise<ApiResponse<ExamDetail>> => {
  await delay(300); // 模拟网络延迟
  
  const exam = mockExams.find(e => e.examId === examId);
  
  if (!exam) {
    return {
      code: 404,
      message: '考试不存在',
      data: null as any
    };
  }
  
  const examDetail: ExamDetail = {
    ...exam,
    creator: {
      userId: 20001,
      username: '张教授',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    createTime: randomDate(-10) // 10天前创建
  };
  
  return {
    code: 200,
    message: '获取成功',
    data: examDetail
  };
};

/**
 * 参加考试
 * @param examId 考试ID
 * @returns 用户考试记录
 */
export const participateExam = async (examId: number): Promise<ApiResponse<UserExam>> => {
  await delay(500); // 模拟网络延迟
  
  // 先刷新所有考试状态
  refreshExamStatus();
  
  const exam = mockExams.find(e => e.examId === examId);
  
  if (!exam) {
    return {
      code: 404,
      message: '考试不存在',
      data: null as any
    };
  }
  
  // 使用最新的状态判断
  if (exam.status !== ExamStatus.ONGOING) {
    return {
      code: 400,
      message: exam.status === ExamStatus.UPCOMING ? '考试尚未开始' : '考试已结束',
      data: null as any
    };
  }
  
  const userExam: UserExam = {
    userExamId: 30000 + examId,
    startTime: new Date().toISOString(),
    endTime: exam.endTime,
    remainingTime: exam.duration * 60 // 转换为秒
  };
  
  return {
    code: 200,
    message: '参加成功',
    data: userExam
  };
};

/**
 * 获取考试题目
 * @param examId 考试ID
 * @returns 考试题目列表
 */
export const getExamQuestions = async (examId: number): Promise<ApiResponse<{ examId: number; questions: ExamQuestion[] }>> => {
  await delay(800); // 模拟网络延迟
  
  const questions = mockExamQuestions[examId];
  
  if (!questions) {
    return {
      code: 404,
      message: '考试题目不存在',
      data: null as any
    };
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      examId,
      questions
    }
  };
};

/**
 * 提交考试答案
 * @param examId 考试ID
 * @param answers 答案数组
 * @returns 提交结果
 */
export const submitExamAnswers = async (examId: number, answers: SubmitAnswer[]): Promise<ApiResponse<{ userExamId: number; submitTime: string }>> => {
  await delay(1000); // 模拟网络延迟
  
  const exam = mockExams.find(e => e.examId === examId);
  
  if (!exam) {
    return {
      code: 404,
      message: '考试不存在',
      data: null as any
    };
  }
  
  return {
    code: 200,
    message: '提交成功',
    data: {
      userExamId: 30000 + examId,
      submitTime: new Date().toISOString()
    }
  };
};

/**
 * 获取考试结果
 * @param examId 考试ID
 * @returns 考试结果
 */
export const getExamResult = async (examId: number): Promise<ApiResponse<ExamResult>> => {
  await delay(600); // 模拟网络延迟
  
  const result = mockExamResults[examId];
  
  if (!result) {
    // 如果没有预设的结果，生成一个随机结果
    const exam = mockExams.find(e => e.examId === examId);
    
    if (!exam) {
      return {
        code: 404,
        message: '考试不存在',
        data: null as any
      };
    }
    
    if (exam.status !== ExamStatus.ENDED) {
      return {
        code: 400,
        message: '考试尚未结束，无法获取结果',
        data: null as any
      };
    }
    
    // 模拟计算随机结果
    const score = Math.floor(Math.random() * (exam.totalScore * 0.6) + exam.totalScore * 0.3);
    const correctCount = Math.floor(score / (exam.totalScore / exam.questionCount!));
    
    return {
      code: 200,
      message: '获取成功',
      data: {
        userExamId: 30000 + examId,
        examId,
        examName: exam.name,
        score,
        totalScore: exam.totalScore,
        correctCount,
        totalCount: exam.questionCount!,
        accuracy: correctCount / exam.questionCount!,
        startTime: exam.startTime,
        submitTime: new Date(new Date(exam.startTime).getTime() + Math.random() * 1000 * 60 * exam.duration).toISOString(),
        rank: Math.floor(Math.random() * 500) + 1,
        participantCount: exam.participantCount,
        percentile: Math.random() * 30 + 70, // 70-100之间的随机数
        details: [] // 这里简化处理，实际应该有详细题目信息
      }
    };
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: result
  };
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
  await delay(500); // 模拟网络延迟
  
  const { page = 1, size = 10 } = params;
  
  // 计算分页
  const total = 100; // 模拟总数
  const pages = Math.ceil(total / size);
  const start = (page - 1) * size;
  const end = Math.min(start + size, mockLeaderboard.length);
  const records = mockLeaderboard.slice(start, end);
  
  // 如果记录不足，随机生成一些
  while (records.length < size && records.length < total) {
    const rank = records.length > 0 ? records[records.length - 1].rank + 1 : start + 1;
    records.push({
      rank,
      userId: 10000 + rank,
      username: `考生${rank}`,
      avatar: 'https://joeschmoe.io/api/v1/random',
      score: Math.floor(Math.random() * 40) + 60, // 60-100之间的随机分数
      totalScore: 100,
      accuracy: (Math.floor(Math.random() * 40) + 60) / 100,
      submitTime: new Date(new Date().getTime() - Math.random() * 1000 * 60 * 60).toISOString()
    });
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total,
      pages,
      current: page,
      size,
      records
    }
  };
}; 