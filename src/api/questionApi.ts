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
  Leaderboard
} from '../types/question';

// 模拟知识点数据
const knowledgePoints = [
  { id: 101, name: "高等数学" },
  { id: 102, name: "线性代数" },
  { id: 103, name: "概率论" },
  { id: 104, name: "数据结构" },
  { id: 105, name: "操作系统" },
  { id: 106, name: "计算机网络" },
  { id: 107, name: "数据库原理" },
  { id: 108, name: "软件工程" }
];

// 模拟题目数据
const mockQuestions: Question[] = [
  {
    questionId: 1001,
    type: QuestionType.SINGLE_CHOICE,
    content: "设函数f(x)=x^2-2x+1，则f(x)的最小值为（）",
    options: [
      { id: "A", content: "0" },
      { id: "B", content: "1" },
      { id: "C", content: "-1" },
      { id: "D", content: "2" }
    ],
    difficulty: QuestionDifficulty.EASY,
    knowledgePoints: [knowledgePoints[0]],
    passRate: 0.75,
    createTime: "2023-01-01T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1002,
    type: QuestionType.MULTIPLE_CHOICE,
    content: "下列关于线性代数的说法中，正确的有（）",
    options: [
      { id: "A", content: "矩阵的秩等于非零行的个数" },
      { id: "B", content: "对称矩阵的特征值都是实数" },
      { id: "C", content: "若矩阵A可逆，则A的行列式不为0" },
      { id: "D", content: "任意方阵都可以相似对角化" }
    ],
    difficulty: QuestionDifficulty.MEDIUM,
    knowledgePoints: [knowledgePoints[1]],
    passRate: 0.6,
    createTime: "2023-01-02T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1003,
    type: QuestionType.JUDGE,
    content: "在二项分布中，事件发生的概率p越大，方差越大。",
    difficulty: QuestionDifficulty.MEDIUM,
    knowledgePoints: [knowledgePoints[2]],
    passRate: 0.5,
    createTime: "2023-01-03T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1004,
    type: QuestionType.FILL_BLANK,
    content: "在快速排序算法中，最坏情况下的时间复杂度为_______。",
    difficulty: QuestionDifficulty.HARD,
    knowledgePoints: [knowledgePoints[3]],
    passRate: 0.4,
    createTime: "2023-01-04T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1005,
    type: QuestionType.ESSAY,
    content: "简述操作系统中的死锁产生的必要条件和预防措施。",
    difficulty: QuestionDifficulty.VERY_HARD,
    knowledgePoints: [knowledgePoints[4]],
    passRate: 0.3,
    createTime: "2023-01-05T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1006,
    type: QuestionType.SINGLE_CHOICE,
    content: "TCP协议的拥塞控制算法不包括（）",
    options: [
      { id: "A", content: "慢启动" },
      { id: "B", content: "拥塞避免" },
      { id: "C", content: "快速重传" },
      { id: "D", content: "选择确认" }
    ],
    difficulty: QuestionDifficulty.MEDIUM,
    knowledgePoints: [knowledgePoints[5]],
    passRate: 0.65,
    createTime: "2023-01-06T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1007,
    type: QuestionType.MULTIPLE_CHOICE,
    content: "关系数据库的规范化过程中，下列属于第二范式的条件有（）",
    options: [
      { id: "A", content: "消除了非主属性对主码的部分函数依赖" },
      { id: "B", content: "消除了非主属性对主码的传递函数依赖" },
      { id: "C", content: "所有属性都是原子的" },
      { id: "D", content: "消除了主属性对主码的部分函数依赖" }
    ],
    difficulty: QuestionDifficulty.HARD,
    knowledgePoints: [knowledgePoints[6]],
    passRate: 0.45,
    createTime: "2023-01-07T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1008,
    type: QuestionType.JUDGE,
    content: "软件生命周期包括需求分析、设计、编码、测试和维护五个阶段。",
    difficulty: QuestionDifficulty.EASY,
    knowledgePoints: [knowledgePoints[7]],
    passRate: 0.85,
    createTime: "2023-01-08T12:00:00Z",
    updateTime: "2023-01-10T08:30:00Z"
  }
];

// 模拟题目详情数据
const mockQuestionDetails: QuestionDetail[] = [
  {
    ...mockQuestions[0],
    answer: "A",
    analysis: "函数f(x)=x^2-2x+1=(x-1)^2，当x=1时取得最小值0。"
  },
  {
    ...mockQuestions[1],
    answer: "ABC",
    analysis: "A正确：矩阵的秩等于非零行的个数。\nB正确：对称矩阵的特征值都是实数。\nC正确：若矩阵A可逆，则A的行列式不为0。\nD错误：并非任意方阵都可以相似对角化，需要满足特定条件。"
  },
  {
    ...mockQuestions[2],
    answer: "0",
    analysis: "在二项分布中，方差为np(1-p)，当p=0.5时，方差取得最大值。因此，p越大，方差不一定越大。"
  },
  {
    ...mockQuestions[3],
    answer: "O(n²)",
    analysis: "快速排序在最坏情况下（如已经排好序的数组）的时间复杂度为O(n²)。"
  },
  {
    ...mockQuestions[4],
    answer: "死锁产生的必要条件：互斥条件、请求与保持条件、不剥夺条件、循环等待条件。预防措施：破坏互斥条件、破坏请求与保持条件、破坏不剥夺条件、破坏循环等待条件。",
    analysis: "死锁是指两个或多个进程在执行过程中，由于竞争资源或彼此通信而造成的一种阻塞现象。\n\n死锁产生的必要条件：\n1. 互斥条件：资源不能被共享，只能由一个进程使用。\n2. 请求与保持条件：进程已获得的资源在未使用完之前，不能被强行剥夺。\n3. 不剥夺条件：进程已获得的资源在未使用完之前，不能被强行剥夺。\n4. 循环等待条件：若干进程之间形成头尾相接的循环等待资源关系。\n\n预防措施：\n1. 破坏互斥条件：允许进程同时访问某些资源。\n2. 破坏请求与保持条件：进程在运行前一次性地申请全部所需资源。\n3. 破坏不剥夺条件：允许进程在等待过程中被剥夺资源。\n4. 破坏循环等待条件：实行资源有序分配策略。"
  },
  {
    ...mockQuestions[5],
    answer: "D",
    analysis: "TCP协议的拥塞控制算法包括慢启动、拥塞避免、快速重传和快速恢复。选择确认（SACK）是TCP的一个选项，不是拥塞控制算法。"
  },
  {
    ...mockQuestions[6],
    answer: "A",
    analysis: "第二范式是在第一范式的基础上，消除了非主属性对主码的部分函数依赖。\nA正确：这正是第二范式的定义。\nB错误：消除非主属性对主码的传递函数依赖是第三范式的条件。\nC错误：所有属性都是原子的是第一范式的条件。\nD错误：第二范式只要求消除非主属性对主码的部分函数依赖，不要求消除主属性对主码的部分函数依赖。"
  },
  {
    ...mockQuestions[7],
    answer: "1",
    analysis: "软件生命周期确实包括需求分析、设计、编码、测试和维护五个阶段，所以这个说法是正确的。"
  }
];

// 模拟错题集数据
const mockWrongQuestions: WrongQuestion[] = [
  {
    questionId: 1002,
    type: QuestionType.MULTIPLE_CHOICE,
    content: "下列关于线性代数的说法中，正确的有（）",
    difficulty: QuestionDifficulty.MEDIUM,
    wrongTimes: 2,
    lastWrongTime: "2023-01-10T08:30:00Z"
  },
  {
    questionId: 1003,
    type: QuestionType.JUDGE,
    content: "在二项分布中，事件发生的概率p越大，方差越大。",
    difficulty: QuestionDifficulty.MEDIUM,
    wrongTimes: 3,
    lastWrongTime: "2023-01-09T08:30:00Z"
  },
  {
    questionId: 1007,
    type: QuestionType.MULTIPLE_CHOICE,
    content: "关系数据库的规范化过程中，下列属于第二范式的条件有（）",
    difficulty: QuestionDifficulty.HARD,
    wrongTimes: 1,
    lastWrongTime: "2023-01-08T08:30:00Z"
  }
];

// 模拟排行榜数据
const mockLeaderboard: Leaderboard = {
  type: "count",
  period: "week",
  updateTime: "2023-01-10T08:30:00Z",
  leaderboard: [
    {
      rank: 1,
      userId: 10001,
      username: "student001",
      avatar: "https://api.ytjx.com/static/avatars/10001.jpg",
      count: 500,
      accuracy: 0.85
    },
    {
      rank: 2,
      userId: 10002,
      username: "student002",
      avatar: "https://api.ytjx.com/static/avatars/10002.jpg",
      count: 480,
      accuracy: 0.82
    },
    {
      rank: 3,
      userId: 10003,
      username: "student003",
      avatar: "https://api.ytjx.com/static/avatars/10003.jpg",
      count: 450,
      accuracy: 0.88
    }
  ]
};

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取题目列表
export const getQuestions = async (params: QuestionQueryParams): Promise<PaginationData<Question>> => {
  await delay(500); // 模拟网络延迟

  let filteredQuestions = [...mockQuestions];

  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredQuestions = filteredQuestions.filter(q => 
      q.content.toLowerCase().includes(keyword)
    );
  }

  // 题目类型筛选
  if (params.type !== undefined) {
    filteredQuestions = filteredQuestions.filter(q => q.type === params.type);
  }

  // 难度等级筛选
  if (params.difficulty !== undefined) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === params.difficulty);
  }

  // 知识点筛选
  if (params.knowledgePoint !== undefined) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.knowledgePoints.some(kp => kp.id === params.knowledgePoint)
    );
  }

  // 分页
  const page = params.page || 1;
  const size = params.size || 20;
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedQuestions = filteredQuestions.slice(start, end);

  return {
    total: filteredQuestions.length,
    pages: Math.ceil(filteredQuestions.length / size),
    current: page,
    size: size,
    records: paginatedQuestions
  };
};

// 获取题目详情
export const getQuestionDetail = async (questionId: number): Promise<QuestionDetail> => {
  await delay(500); // 模拟网络延迟

  const question = mockQuestionDetails.find(q => q.questionId === questionId);
  if (!question) {
    throw new Error(`题目不存在: ${questionId}`);
  }

  return question;
};

// 提交答案
export const submitAnswer = async (questionId: number, data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
  await delay(500); // 模拟网络延迟

  const question = mockQuestionDetails.find(q => q.questionId === questionId);
  if (!question) {
    throw new Error(`题目不存在: ${questionId}`);
  }

  const isCorrect = data.answer === question.answer;

  return {
    isCorrect,
    correctAnswer: question.answer,
    analysis: question.analysis
  };
};

// 获取错题集
export const getWrongQuestions = async (userId: number, page: number = 1, size: number = 20): Promise<PaginationData<WrongQuestion>> => {
  await delay(500); // 模拟网络延迟

  // 这里忽略userId参数，直接返回模拟数据
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedWrongQuestions = mockWrongQuestions.slice(start, end);

  return {
    total: mockWrongQuestions.length,
    pages: Math.ceil(mockWrongQuestions.length / size),
    current: page,
    size: size,
    records: paginatedWrongQuestions
  };
};

// 获取做题排行榜
export const getLeaderboard = async (type: string = "count", period: string = "week", limit: number = 20): Promise<Leaderboard> => {
  await delay(500); // 模拟网络延迟

  // 这里忽略参数，直接返回模拟数据
  return mockLeaderboard;
};

// 导出API接口
const questionApi = {
  getQuestions,
  getQuestionDetail,
  submitAnswer,
  getWrongQuestions,
  getLeaderboard
};

export default questionApi; 