import { AppThunk } from '../store';
import * as adminApi from '../../api/adminApi';
import { message } from 'antd';

/**
 * 获取用户列表
 */
export const fetchUserList = (params: {
  page: number;
  size: number;
  keyword?: string;
  userType?: number;
  status?: number;
}): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.getUserList(params);
    
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '获取用户列表失败');
    return {
      success: false,
      message: error.message || '获取用户列表失败'
    };
  }
};

/**
 * 获取用户详情
 */
export const fetchUserDetail = (userId: number): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.getUserDetail(userId);
    
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '获取用户详情失败');
    return {
      success: false,
      message: error.message || '获取用户详情失败'
    };
  }
};

/**
 * 更新用户信息
 */
export const updateUser = (userId: number, data: any): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.updateUser(userId, data);
    
    if (response.success) {
      message.success('用户信息更新成功');
      return {
        success: true
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '更新用户信息失败');
    return {
      success: false,
      message: error.message || '更新用户信息失败'
    };
  }
};

/**
 * 重置用户密码
 */
export const resetUserPassword = (userId: number): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.resetUserPassword(userId);
    
    if (response.success) {
      message.success(response.message);
      return {
        success: true,
        message: response.message
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '重置密码失败');
    return {
      success: false,
      message: error.message || '重置密码失败'
    };
  }
};

/**
 * 更新用户状态
 */
export const updateUserStatus = (userId: number, status: number): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.updateUserStatus(userId, status);
    
    if (response.success) {
      message.success(response.message);
      return {
        success: true
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '更新用户状态失败');
    return {
      success: false,
      message: error.message || '更新用户状态失败'
    };
  }
};

/**
 * 更新用户类型
 */
export const updateUserType = (userId: number, userType: number): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.updateUserType(userId, userType);
    
    if (response.success) {
      message.success('用户类型更新成功');
      return {
        success: true
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '更新用户类型失败');
    return {
      success: false,
      message: error.message || '更新用户类型失败'
    };
  }
};

/**
 * 删除用户
 */
export const deleteUser = (userId: number): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.deleteUser(userId);
    
    if (response.success) {
      message.success('用户删除成功');
      return {
        success: true
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '删除用户失败');
    return {
      success: false,
      message: error.message || '删除用户失败'
    };
  }
};

/**
 * 获取用户统计数据
 */
export const fetchUserStats = (): AppThunk => async (dispatch) => {
  try {
    const response = await adminApi.getUserStats();
    
    if (response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      message.error(response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    message.error(error.message || '获取用户统计数据失败');
    return {
      success: false,
      message: error.message || '获取用户统计数据失败'
    };
  }
}; 