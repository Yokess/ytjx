import { User } from '../store/slices/authSlice';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: '张同学',
    avatar: 'https://joeschmoe.io/api/v1/random',
    email: 'zhang@example.com',
    role: 'user'
  },
  {
    id: '2',
    username: '李同学',
    avatar: 'https://joeschmoe.io/api/v1/random',
    email: 'li@example.com',
    role: 'user'
  },
  {
    id: '3',
    username: '王老师',
    avatar: 'https://joeschmoe.io/api/v1/random',
    email: 'wang@example.com',
    role: 'teacher'
  }
];

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟获取用户信息
export const getUserInfo = async (userId: string): Promise<User> => {
  // 模拟网络延迟
  await delay(800);
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  return user;
};

// 模拟更新用户信息
export const updateUserInfo = async (userId: string, userData: Partial<User>): Promise<User> => {
  // 模拟网络延迟
  await delay(1000);
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('用户不存在');
  }
  
  // 更新用户信息
  const updatedUser = {
    ...mockUsers[userIndex],
    ...userData
  };
  
  // 在真实环境中，这里会发送API请求更新服务器上的数据
  mockUsers[userIndex] = updatedUser;
  
  return updatedUser;
};

// 模拟获取用户学习统计数据
export interface UserStats {
  studyDays: number;
  questionCount: number;
  studyHours: number;
  learningProgress: {
    subject: string;
    progress: number;
  }[];
}

export const getUserStats = async (userId: string): Promise<UserStats> => {
  // 模拟网络延迟
  await delay(600);
  
  // 检查用户是否存在
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  // 返回模拟的学习统计数据
  return {
    studyDays: 128,
    questionCount: 1280,
    studyHours: 320,
    learningProgress: [
      { subject: '数学', progress: 75 },
      { subject: '英语', progress: 60 },
      { subject: '政治', progress: 45 },
      { subject: '专业课', progress: 80 },
    ]
  };
};

// 模拟获取用户学习目标
export interface UserGoal {
  targetSchool: string;
  targetMajor: string;
  examTime: string;
}

export const getUserGoal = async (userId: string): Promise<UserGoal> => {
  // 模拟网络延迟
  await delay(500);
  
  // 检查用户是否存在
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  // 返回模拟的学习目标数据
  return {
    targetSchool: '北京大学',
    targetMajor: '计算机科学与技术',
    examTime: '2024年12月'
  };
};

// 模拟更新用户学习目标
export const updateUserGoal = async (userId: string, goalData: Partial<UserGoal>): Promise<UserGoal> => {
  // 模拟网络延迟
  await delay(700);
  
  // 检查用户是否存在
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  // 在真实环境中，这里会发送API请求更新服务器上的数据
  // 这里只是返回更新后的数据
  return {
    targetSchool: goalData.targetSchool || '北京大学',
    targetMajor: goalData.targetMajor || '计算机科学与技术',
    examTime: goalData.examTime || '2024年12月'
  };
}; 