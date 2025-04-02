import React, { useState, useEffect } from 'react';
import { Typography, Layout, Avatar, Button, Form, Input, Select, Progress, Tabs, Card, Row, Col, Divider, message, Spin, Upload, Modal } from 'antd';
import { UserOutlined, BookOutlined, SettingOutlined, HeartOutlined, BarChartOutlined, UploadOutlined, KeyOutlined, EditOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUserInfo as updateUserInfoAction, updateAvatar as updateAvatarAction } from '../../store/slices/authSlice';
import http from '../../api/http';
import { userApi } from '../../api';
import styles from './UserCenter.module.scss';
import type { UploadProps, RcFile } from 'antd/es/upload';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

// 模拟用户学习统计数据
const mockUserStats = {
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

const UserCenterPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(mockUserStats);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // 获取用户详细信息
  useEffect(() => {
    const fetchUserDetail = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const response = await http.get(`/users/${user.id}`);
          console.log('获取用户详情响应:', response.data);
          
          if (response.data.code === 200 && response.data.data) {
            setUserDetail(response.data.data);
            
            // 设置表单初始值
            form.setFieldsValue({
              name: response.data.data.userName || '',
              gender: response.data.data.gender !== undefined ? response.data.data.gender : 1,
              phone: response.data.data.phone || '',
              email: response.data.data.email || '',
            });
            
            goalForm.setFieldsValue({
              targetSchool: response.data.data.target?.split('·')[0]?.trim() || '',
              targetMajor: response.data.data.target?.split('·')[1]?.trim() || response.data.data.major || '',
            });
          }
        } catch (error) {
          console.error('获取用户详情失败:', error);
          message.error('获取用户信息失败');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserDetail();
  }, [user?.id, form, goalForm]);

  // 上传头像前检查文件
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
      return false;
    }
    
    return true;
  };

  // 处理头像上传
  const handleAvatarUpload: UploadProps['customRequest'] = async (options) => {
    if (!user?.id) {
      message.error('用户未登录');
      return;
    }
    
    const { file, onSuccess, onError } = options;
    
    if (!(file instanceof File)) {
      message.error('文件格式错误');
      return;
    }

    setUploadLoading(true);
    try {
      // 调用上传头像API
      const response = await userApi.uploadAvatar(user.id, file);
      
      console.log('上传头像响应:', response);
      
      if (response.success && response.data?.avatarUrl) {
        // 更新Redux中的用户头像
        dispatch(updateAvatarAction(response.data.avatarUrl));
        
        // 更新本地状态
        setUserDetail({
          ...userDetail,
          avatar: response.data.avatarUrl
        });
        
        message.success('头像上传成功');
        onSuccess && onSuccess(response);
      } else {
        message.error(response.message || '头像上传失败');
        onError && onError(new Error(response.message || '头像上传失败'));
      }
    } catch (error: any) {
      console.error('上传头像错误:', error);
      message.error('头像上传失败: ' + (error.message || '未知错误'));
      onError && onError(error);
    } finally {
      setUploadLoading(false);
    }
  };

  // 保存用户基本信息
  const handleSaveProfile = async (values: any) => {
    if (!user?.id) {
      message.error('用户未登录');
      return;
    }

    setSavingProfile(true);
    try {
      // 构建提交数据
      const updateData = {
        userId: parseInt(user.id),
        gender: values.gender,
        email: values.email,
        phone: values.phone
      };
      
      console.log('更新个人信息，提交数据:', updateData);
      
      // 使用userApi调用更新API
      const response = await userApi.updateUserInfo(updateData);
      console.log('更新个人信息响应:', response);
      
      if (response.success) {
        // 更新Redux中的用户信息
        dispatch(updateUserInfoAction({
          ...user,
          gender: values.gender,
          email: values.email,
          phone: values.phone
        }));
        
        // 更新本地状态
        setUserDetail({
          ...userDetail,
          gender: values.gender,
          email: values.email,
          phone: values.phone
        });
        
        message.success('个人资料更新成功');
      } else {
        message.error(response.message || '更新个人资料失败');
      }
    } catch (error: any) {
      console.error('更新个人资料错误:', error);
      message.error('更新个人资料失败: ' + (error.message || '未知错误'));
    } finally {
      setSavingProfile(false);
    }
  };

  // 保存用户学习目标
  const handleSaveGoal = async (values: any) => {
    if (!user?.id) {
      message.error('用户未登录');
      return;
    }

    setSavingGoal(true);
    try {
      // 构建目标字符串
      const targetString = `${values.targetSchool}·${values.targetMajor}`;
      
      // 构建提交数据
      const updateData = {
        userId: parseInt(user.id),
        target: targetString,
        major: values.targetMajor
      };
      
      console.log('更新学习目标，提交数据:', updateData);
      
      // 使用userApi调用更新API
      const response = await userApi.updateUserInfo(updateData);
      console.log('更新学习目标响应:', response);
      
      if (response.success) {
        // 更新Redux中的用户信息
        dispatch(updateUserInfoAction({
          ...user,
          target: targetString,
          major: values.targetMajor
        }));
        
        // 更新本地状态
        setUserDetail({
          ...userDetail,
          target: targetString,
          major: values.targetMajor
        });
        
        message.success('学习目标更新成功');
      } else {
        message.error(response.message || '更新学习目标失败');
      }
    } catch (error: any) {
      console.error('更新学习目标错误:', error);
      message.error('更新学习目标失败: ' + (error.message || '未知错误'));
    } finally {
      setSavingGoal(false);
    }
  };

  // 处理修改密码
  const handleChangePassword = async (values: any) => {
    if (!user?.id) {
      message.error('用户未登录');
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }

    setChangingPassword(true);
    try {
      // 调用修改密码API
      const response = await userApi.updatePassword(user.id, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      
      console.log('修改密码响应:', response);
      
      if (response.success) {
        message.success('密码修改成功');
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        message.error(response.message || '密码修改失败');
      }
    } catch (error: any) {
      console.error('修改密码错误:', error);
      message.error('密码修改失败: ' + (error.message || '未知错误'));
    } finally {
      setChangingPassword(false);
    }
  };

  // 加载中或未登录时显示加载状态
  if (loading && !userDetail) {
    return (
      <div className={styles.loadingContainer}>
        <Spin tip="加载用户信息中..." />
      </div>
    );
  }

  return (
    <div className={styles.userCenterContainer}>
      {/* 个人信息头部 */}
      <div className={styles.userHeader}>
        <div className={styles.userHeaderContent}>
          <div className={styles.userAvatar}>
            <Avatar 
              size={96} 
              src={userDetail?.avatar || user?.avatar} 
              icon={(!userDetail?.avatar && !user?.avatar) && <UserOutlined />} 
            />
            <div className={styles.avatarUpload}>
              <Upload
                customRequest={handleAvatarUpload}
                showUploadList={false}
                beforeUpload={beforeUpload}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  size="small" 
                  type="primary" 
                  loading={uploadLoading}
                >
                  更换头像
                </Button>
              </Upload>
            </div>
          </div>
          <div className={styles.userInfo}>
            <Title level={2} className={styles.userName}>{userDetail?.userName || user?.username || '未登录用户'}</Title>
            <Text className={styles.userSchool}>
              {userDetail?.target || user?.target || '暂无目标设置'}
            </Text>
            <div className={styles.userStats}>
              {userStats ? (
                <>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>学习天数</div>
                    <div className={styles.statValue}>{userStats.studyDays}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>做题数量</div>
                    <div className={styles.statValue}>{userStats.questionCount}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>学习时长</div>
                    <div className={styles.statValue}>{userStats.studyHours}h</div>
                  </div>
                </>
              ) : (
                <Spin size="small" />
              )}
            </div>
          </div>
          <div className={styles.userActions}>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => setActiveTab('profile')}
            >
              编辑资料
            </Button>
            <Button 
              type="default" 
              icon={<KeyOutlined />} 
              onClick={() => setPasswordModalVisible(true)}
              style={{ marginLeft: 8 }}
            >
              修改密码
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <Content className={styles.mainContent}>
        <Row gutter={24}>
          {/* 左侧导航 */}
          <Col xs={24} md={6}>
            <Card className={styles.sideNav}>
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab} 
                tabPosition="left"
                className={styles.navTabs}
              >
                <TabPane 
                  tab={
                    <span className={styles.tabItem}>
                      <UserOutlined />
                      个人资料
                    </span>
                  } 
                  key="profile" 
                />
                <TabPane 
                  tab={
                    <span className={styles.tabItem}>
                      <BarChartOutlined />
                      学习记录
                    </span>
                  } 
                  key="records" 
                />
                <TabPane 
                  tab={
                    <span className={styles.tabItem}>
                      <BookOutlined />
                      我的课程
                    </span>
                  } 
                  key="courses" 
                />
                <TabPane 
                  tab={
                    <span className={styles.tabItem}>
                      <HeartOutlined />
                      我的收藏
                    </span>
                  } 
                  key="favorites" 
                />
                <TabPane 
                  tab={
                    <span className={styles.tabItem}>
                      <SettingOutlined />
                      账号设置
                    </span>
                  } 
                  key="settings" 
                />
              </Tabs>
            </Card>
          </Col>

          {/* 右侧内容 */}
          <Col xs={24} md={18}>
            {activeTab === 'profile' && (
              <>
                {/* 基本资料卡片 */}
                <Card className={styles.contentCard} title="基本资料">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveProfile}
                  >
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                          <Input placeholder="请输入姓名" disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="gender" label="性别">
                          <Select>
                            <Option value={1}>男</Option>
                            <Option value={0}>女</Option>
                            <Option value={2}>其他</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="phone" label="手机号">
                          <Input placeholder="请输入手机号" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="email" label="邮箱">
                          <Input placeholder="请输入邮箱" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider />
                    <div className={styles.formActions}>
                      <Button type="primary" htmlType="submit" loading={savingProfile}>
                        保存个人资料
                      </Button>
                    </div>
                  </Form>
                </Card>

                {/* 学习目标卡片 */}
                <Card className={styles.contentCard} title="学习目标">
                  <Form
                    form={goalForm}
                    layout="vertical"
                    onFinish={handleSaveGoal}
                  >
                    <Form.Item name="targetSchool" label="目标院校" rules={[{ required: true, message: '请输入目标院校' }]}>
                      <Input placeholder="请输入目标院校" />
                    </Form.Item>
                    <Form.Item name="targetMajor" label="目标专业" rules={[{ required: true, message: '请输入目标专业' }]}>
                      <Input placeholder="请输入目标专业" />
                    </Form.Item>
                    <Divider />
                    <div className={styles.formActions}>
                      <Button type="primary" htmlType="submit" loading={savingGoal}>
                        保存学习目标
                      </Button>
                    </div>
                  </Form>
                </Card>

                {/* 学习进度卡片 */}
                <Card className={styles.contentCard} title="学习进度">
                  {loading || !userStats ? (
                    <div className={styles.loadingContainer}>
                      <Spin />
                    </div>
                  ) : (
                    <div className={styles.progressList}>
                      {userStats.learningProgress.map((item, index) => (
                        <div key={index} className={styles.progressItem}>
                          <div className={styles.progressHeader}>
                            <Text strong>{item.subject}</Text>
                            <Text type="secondary">{item.progress}%</Text>
                          </div>
                          <Progress percent={item.progress} strokeColor="#5B5CFF" />
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}

            {activeTab === 'records' && (
              <Card className={styles.contentCard} title="学习记录">
                <div className={styles.emptyContent}>
                  <Text type="secondary">学习记录功能正在开发中...</Text>
                </div>
              </Card>
            )}

            {activeTab === 'courses' && (
              <Card className={styles.contentCard} title="我的课程">
                <div className={styles.emptyContent}>
                  <Text type="secondary">我的课程功能正在开发中...</Text>
                </div>
              </Card>
            )}

            {activeTab === 'favorites' && (
              <Card className={styles.contentCard} title="我的收藏">
                <div className={styles.emptyContent}>
                  <Text type="secondary">我的收藏功能正在开发中...</Text>
                </div>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className={styles.contentCard} title="账号设置">
                <div className={styles.settingsContent}>
                  <Title level={4}>密码设置</Title>
                  <Button 
                    type="primary" 
                    icon={<KeyOutlined />} 
                    onClick={() => setPasswordModalVisible(true)}
                  >
                    修改密码
                  </Button>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Content>

      {/* 修改密码对话框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[
              { required: true, message: '请输入当前密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[
              { required: true, message: '请确认新密码' },
              { min: 6, message: '密码长度不能少于6位' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <div className={styles.formActions}>
            <Button onClick={() => setPasswordModalVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={changingPassword}>
              确认修改
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserCenterPage; 