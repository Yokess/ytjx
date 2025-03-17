// 考试状态枚举
export enum ExamStatus {
  UPCOMING = 'upcoming', // 即将开始
  ONGOING = 'ongoing',   // 进行中
  ENDED = 'ended'        // 已结束
}

// 题目类型枚举（与question.ts中保持一致）
export enum QuestionType {
  SINGLE_CHOICE = 1,  // 单选题
  MULTIPLE_CHOICE = 2, // 多选题
  JUDGE = 3,           // 判断题
  FILL_BLANK = 4,      // 填空题
  ESSAY = 5            // 简答题
}

// 题目选项接口
export interface QuestionOption {
  id: string;          // 选项ID（如A, B, C, D）
  content: string;     // 选项内容
}

// 考试题目接口（简化版，不包含答案和解析）
export interface ExamQuestion {
  questionId: number;           // 题目ID
  type: QuestionType;           // 题目类型
  content: string;              // 题目内容
  options?: QuestionOption[];   // 题目选项（选择题必须有）
  score: number;                // 题目分值
}

// 考试题目详情接口（包含答案和解析）
export interface ExamQuestionDetail extends ExamQuestion {
  correctAnswer: string;        // 正确答案
  analysis: string;             // 解析
}

// 考试创建者信息
export interface ExamCreator {
  userId: number;               // 用户ID
  username: string;             // 用户名
  avatar: string;               // 头像URL
}

// 考试基本信息接口
export interface Exam {
  examId: number;               // 考试ID
  name: string;                 // 考试名称
  description: string;          // 考试描述
  startTime: string;            // 开始时间
  endTime: string;              // 结束时间
  duration: number;             // 考试时长（分钟）
  totalScore: number;           // 总分
  status: ExamStatus;           // 考试状态
  questionCount?: number;       // 题目数量
  participantCount?: number;    // 参与人数
}

// 考试详情接口
export interface ExamDetail extends Exam {
  creator: ExamCreator;         // 创建者信息
  createTime: string;           // 创建时间
}

// 用户考试记录接口
export interface UserExam {
  userExamId: number;           // 用户考试记录ID
  startTime: string;            // 开始时间
  endTime: string;              // 结束时间
  remainingTime: number;        // 剩余时间（秒）
}

// 考试提交的答案
export interface SubmitAnswer {
  questionId: number;           // 题目ID
  answer: string;               // 用户答案
}

// 考试结果题目详情
export interface ExamResultQuestionDetail {
  questionId: number;           // 题目ID
  userAnswer: string;           // 用户答案
  correctAnswer: string;        // 正确答案
  isCorrect: boolean;           // 是否正确
  score: number;                // 得分
  analysis: string;             // 解析
}

// 考试结果接口
export interface ExamResult {
  userExamId: number;           // 用户考试记录ID
  examId: number;               // 考试ID
  examName: string;             // 考试名称
  score: number;                // 得分
  totalScore: number;           // 总分
  correctCount: number;         // 正确题目数
  totalCount: number;           // 题目总数
  accuracy: number;             // 正确率
  startTime: string;            // 开始时间
  submitTime: string;           // 提交时间
  rank?: number;                // 排名
  participantCount?: number;    // 参与人数
  percentile?: number;          // 百分位（表示超过了多少百分比的人）
  details: ExamResultQuestionDetail[]; // 题目详情
}

// 排行榜项目
export interface LeaderboardItem {
  rank: number;                 // 排名
  userId: number;               // 用户ID
  username: string;             // 用户名
  avatar: string;               // 头像URL
  score: number;                // 得分
  totalScore: number;           // 总分
  accuracy: number;             // 正确率
  submitTime: string;           // 提交时间
}

// 分页数据
export interface PaginationData<T> {
  total: number;                // 总数
  pages: number;                // 总页数
  current: number;              // 当前页
  size: number;                 // 每页大小
  records: T[];                 // 数据记录
}

// API请求参数
export interface ExamQueryParams {
  keyword?: string;             // 关键词搜索
  status?: ExamStatus;          // 考试状态
  page?: number;                // 页码
  size?: number;                // 每页大小
}

// API响应数据格式
export interface ApiResponse<T> {
  code: number;                 // 状态码
  message: string;              // 消息
  data: T;                      // 数据
} 