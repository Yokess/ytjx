import { User } from '../store/slices/authSlice';

// 扩展User接口，添加密码字段
interface UserWithPassword extends User {
  password: string;
}

// 模拟用户数据
const mockUsers: UserWithPassword[] = [
  {
    id: '1',
    username: 'zhang',
    password: '123456', // 实际项目中不应该存储明文密码
    avatar: 'https://joeschmoe.io/api/v1/random',
    email: 'zhang@example.com',
    role: 'user'
  },
  {
    id: '2',
    username: 'li',
    password: '123456',
    avatar: 'https://joeschmoe.io/api/v1/random',
    email: 'li@example.com',
    role: 'user'
  },
  {
    id: '3',
    username: 'wang',
    password: '123456',
    avatar: 'https://joeschmoe.io/api/v1/random',
    email: 'wang@example.com',
    role: 'teacher'
  }
];

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 登录接口参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  user: User;
  token: string;
}

// 模拟登录API
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  // 模拟网络延迟
  await delay(1000);
  
  // 查找用户
  const user = mockUsers.find(
    u => u.username === params.username && u.password === params.password
  );
  
  if (!user) {
    throw new Error('用户名或密码错误');
  }
  
  // 生成模拟token
  const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
  
  // 返回不包含密码的用户信息
  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
};

// 注册接口参数
export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
}

// 模拟注册API
export const register = async (params: RegisterParams): Promise<User> => {
  // 模拟网络延迟
  await delay(1500);
  
  // 检查用户名是否已存在
  const existingUser = mockUsers.find(u => u.username === params.username);
  
  if (existingUser) {
    throw new Error('用户名已存在');
  }
  
  // 创建新用户
  const newUser: UserWithPassword = {
    id: String(mockUsers.length + 1),
    username: params.username,
    password: params.password,
    email: params.email,
    avatar: 'https://joeschmoe.io/api/v1/random',
    role: 'user'
  };
  
  // 添加到模拟数据库
  mockUsers.push(newUser);
  
  // 返回不包含密码的用户信息
  const { password, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword;
};

// 验证token
export const verifyToken = async (token: string): Promise<User> => {
  // 模拟网络延迟
  await delay(500);
  
  // 在实际应用中，这里会解析JWT token并验证其有效性
  // 这里简单模拟，返回第一个用户
  if (!token || !token.startsWith('mock-jwt-token-')) {
    throw new Error('无效的token');
  }
  
  const user = mockUsers[0];
  const { password, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}; 