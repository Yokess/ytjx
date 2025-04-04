/**
 * 身份验证工具函数
 */

/**
 * 检查登录状态是否一致
 * 所有登录状态要么都存在，要么都不存在
 */
export const isAuthStateConsistent = (): boolean => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const userType = localStorage.getItem('userType');
  
  // 检查状态一致性 - 增加userType检查
  return Boolean((token && userId && username) || (!token && !userId && !username));
};

/**
 * 清理所有身份验证相关的状态
 */
export const clearAuthState = (): void => {
  console.log('清理所有身份验证状态');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userType'); // 确保清理userType
  // 可以在这里添加其他需要清理的身份验证相关状态
};

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = () => {
  if (!isAuthStateConsistent()) {
    clearAuthState();
    return null;
  }
  
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const userType = localStorage.getItem('userType');
  
  if (!userId || !username) {
    return null;
  }
  
  return {
    id: userId,
    username,
    userType: userType ? Number(userType) : 0
  };
};

/**
 * 检查是否已登录
 */
export const isLoggedIn = (): boolean => {
  if (!isAuthStateConsistent()) {
    clearAuthState();
    return false;
  }
  
  return !!localStorage.getItem('token');
}; 