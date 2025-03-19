// AI助手角色类型
export type AIRole = 'tutor' | 'solver' | 'planner' | 'assistant';

// AI消息类型
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 对话历史记录
export interface ChatHistory {
  id: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  title: string;
}

// AI回答响应
export interface AIResponse {
  code: number;
  message: string;
  data: {
    content: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

// 解题请求参数
export interface SolveProblemParams {
  subject: string;
  question: string;
  image?: File;
}

// 学习规划请求参数
export interface StudyPlanParams {
  targetSchool: string;
  targetMajor: string;
  currentLevel: string;
  availableTime: number; // 每天可用学习时间（小时）
  startDate: string;
  examDate: string;
}

// 笔记整理请求参数
export interface NotesParams {
  content: string;
  subject: string;
  format: 'markdown' | 'outline' | 'mindmap';
}

// API配置
export interface AIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

// 系统角色设定
export interface SystemRole {
  role: AIRole;
  prompt: string;
}

// 文生图请求参数类型
export interface TextToImageParams {
  description: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  sampler_index?: string;
  seed?: number;
  enhance_prompt?: boolean;
}

// 文生图响应类型
export interface TextToImageResponse {
  imageBase64: string;
  imageUrl?: string; // 临时生成的图片URL
  parameters: {
    prompt: string;
    negative_prompt: string;
    width: number;
    height: number;
    steps: number;
    cfg_scale: number;
    sampler_index: string;
    seed: number;
  };
}

// 检查服务状态响应
export interface ServiceStatusResponse {
  isRunning: boolean;
  message: string;
} 