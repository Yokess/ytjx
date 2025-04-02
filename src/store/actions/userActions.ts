import { AppThunk } from '../store';
import { 
  updateUserInfo as updateUserInfoAction, 
  updateProfile as updateProfileAction,
  updateAvatar as updateAvatarAction,
  User
} from '../slices/authSlice';
import * as userApi from '../../api/userApi';

/**
 * 获取用户信息
 * @param userId 用户ID
 */
export const fetchUserInfo = (userId: string): AppThunk => async (dispatch) => {
  try {
    console.log('开始获取用户信息, userId:', userId);
    
    const response = await userApi.getUserInfo(userId);
    
    if (response.success) {
      console.log('获取用户信息成功:', response.data);
      
      // 转换后端返回的用户数据格式为前端需要的格式
      const userData: User = {
        id: userId,
        username: response.data.userName,
        avatar: response.data.avatar,
        email: response.data.email,
        phone: response.data.phone,
        gender: response.data.gender,
        major: response.data.major,
        target: response.data.target,
        role: response.data.role || 'user'
      };
      
      // 更新Redux中的用户信息
      dispatch(updateUserInfoAction(userData));
      
      return {
        success: true,
        data: userData
      };
    } else {
      console.error('获取用户信息失败:', response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    console.error('获取用户信息错误:', error);
    return {
      success: false,
      message: error.message || '获取用户信息失败'
    };
  }
};

/**
 * 更新用户个人资料
 * @param params 更新参数
 */
export const updateUserProfile = (params: userApi.ProfileUpdateParams): AppThunk => async (dispatch) => {
  try {
    console.log('开始更新用户资料, params:', params);
    
    const response = await userApi.updateUserInfo(params);
    
    if (response.success) {
      console.log('更新用户资料成功');
      
      // 更新Redux中的用户信息
      dispatch(updateProfileAction({
        gender: params.gender,
        major: params.major,
        target: params.target
      }));
      
      // 如果需要，重新获取完整的用户信息
      dispatch(fetchUserInfo(params.userId.toString()));
      
      return {
        success: true,
        message: '个人资料更新成功'
      };
    } else {
      console.error('更新用户资料失败:', response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    console.error('更新用户资料错误:', error);
    return {
      success: false,
      message: error.message || '更新用户资料失败'
    };
  }
};

/**
 * 修改密码
 * @param userId 用户ID 
 * @param params 密码参数
 */
export const changePassword = (userId: string, params: userApi.PasswordUpdateParams): AppThunk => async () => {
  try {
    console.log('开始修改密码');
    
    const response = await userApi.updatePassword(userId, params);
    
    if (response.success) {
      console.log('密码修改成功');
      return {
        success: true,
        message: '密码修改成功'
      };
    } else {
      console.error('密码修改失败:', response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    console.error('密码修改错误:', error);
    return {
      success: false,
      message: error.message || '密码修改失败'
    };
  }
};

/**
 * 上传头像
 * @param userId 用户ID
 * @param file 文件对象
 */
export const uploadUserAvatar = (userId: string, file: File): AppThunk => async (dispatch) => {
  try {
    console.log('开始上传头像');
    
    const response = await userApi.uploadAvatar(userId, file);
    
    if (response.success) {
      console.log('头像上传成功:', response.data);
      
      // 更新Redux中的用户头像
      if (response.data && response.data.avatarUrl) {
        dispatch(updateAvatarAction(response.data.avatarUrl));
      }
      
      return {
        success: true,
        data: response.data,
        message: '头像上传成功'
      };
    } else {
      console.error('头像上传失败:', response.message);
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error: any) {
    console.error('头像上传错误:', error);
    return {
      success: false,
      message: error.message || '头像上传失败'
    };
  }
};

/**
 * 获取用户学习统计数据
 * @param userId 用户ID
 */
export const fetchUserStats = (userId: string): AppThunk => async () => {
  try {
    console.log('开始获取用户学习统计数据');
    
    const response = await userApi.getUserStats(userId);
    
    if (response.success) {
      console.log('获取用户学习统计数据成功:', response.data);
      return {
        success: true,
        data: response.data
      };
    } else {
      console.error('获取用户学习统计数据失败');
      return {
        success: false,
        message: '获取学习统计数据失败'
      };
    }
  } catch (error: any) {
    console.error('获取用户学习统计数据错误:', error);
    return {
      success: false,
      message: error.message || '获取学习统计数据失败'
    };
  }
}; 