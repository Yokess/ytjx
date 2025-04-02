// 题目类型枚举
export enum QuestionType {
  SINGLE_CHOICE = 0, // 单选题
  MULTIPLE_CHOICE = 1, // 多选题
  JUDGE = 3, // 判断题
  FILL_BLANK = 2, // 填空题
  ESSAY = 4, // 简答题
}

// 题目难度枚举
export enum QuestionDifficulty {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
  VERY_HARD = 3,
  EXPERT = 4,
}

// 选项接口
export interface QuestionOption {
  id: string; // 选项ID，如 "A", "B", "C", "D"
  content: string; // 选项内容
}

// 知识点接口
export interface KnowledgePoint {
  id: number; // 知识点ID
  name: string; // 知识点名称
}

// 题目接口
export interface Question {
  questionId: number; // 题目ID
  type: QuestionType; // 题目类型
  content: string; // 题目内容
  options?: QuestionOption[]; // 选项，单选题和多选题必填
  difficulty: QuestionDifficulty; // 难度等级
  knowledgePoints: KnowledgePoint[]; // 知识点
  passRate?: number; // 通过率
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
}

// 题目详情接口，继承自题目接口，增加答案和解析
export interface QuestionDetail {
  questionId: number;
  questionText: string;
  questionType: number;
  difficultyLevel: number;
  knowledgePoint: string;
  knowledgePoints?: KnowledgePoint[]; // 知识点列表
  correctAnswer: string;
  analysis: string;
  explanation?: string;
  options?: {
    optionId: string;
    optionKey: string;
    optionValue: string;
  }[];
  createTime?: string;
  updateTime?: string;
  passRate?: number;
  usageCount?: number;
  creatorName?: string;
}

// 用户答题记录接口
export interface QuestionRecord {
  questionId: number; // 题目ID
  userAnswer: string; // 用户答案
  isCorrect: boolean; // 是否正确
  answerTime: string; // 答题时间
}

// 错题集中的题目接口
export interface WrongQuestion {
  questionId: number; // 题目ID
  type: QuestionType; // 题目类型
  content: string; // 题目内容
  difficulty: QuestionDifficulty; // 难度等级
  wrongTimes: number; // 错误次数
  lastWrongTime: string; // 最后一次错误时间
  knowledgePoints?: KnowledgePoint[]; // 知识点列表
  options?: any[]; // 选项列表
  passRate?: number; // 通过率
  usageCount?: number; // 使用次数
  correctAnswer?: string; // 正确答案
  analysis?: string; // 解析
  creatorName?: string; // 创建者
}

// 提交答案请求参数接口
export interface SubmitAnswerRequest {
  answer: string; // 用户答案
  spendTime?: number; // 答题耗时（秒）
}

// 提交答案响应接口
export interface SubmitAnswerResponse {
  isCorrect: boolean; // 是否正确
  correctAnswer: string; // 正确答案
  analysis: string; // 解析
  explanation?: string; // 可选的解析字段，与后端返回兼容
}

// 题目列表查询参数接口
export interface QuestionQueryParams {
  keyword?: string; // 关键词搜索
  type?: QuestionType; // 题目类型
  difficulty?: QuestionDifficulty; // 难度等级
  knowledgePoint?: number; // 知识点ID
  page?: number; // 页码，默认1
  size?: number; // 每页数量，默认20
}

// 分页数据接口
export interface PaginationData<T> {
  total: number; // 总数
  pages: number; // 总页数
  current: number; // 当前页
  size: number; // 每页数量
  records: T[]; // 数据
}

// 排行榜项接口
export interface LeaderboardItem {
  rank: number; // 排名
  userId: number; // 用户ID
  username: string; // 用户名
  avatar: string; // 头像
  count: number; // 做题数量
  accuracy: number; // 正确率
}

// 排行榜接口
export interface Leaderboard {
  type: string; // 排行类型，count-做题数量，accuracy-正确率
  period: string; // 时间段，day-日榜，week-周榜，month-月榜，all-总榜
  updateTime: string; // 更新时间
  leaderboard: LeaderboardItem[]; // 排行榜数据
} 