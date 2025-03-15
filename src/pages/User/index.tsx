import React, { useState, useEffect } from 'react';
import { Typography, Layout, Avatar, Button, Form, Input, Select, Progress, Tabs, Card, Row, Col, Divider, message, Spin } from 'antd';
import { UserOutlined, BookOutlined, SettingOutlined, HeartOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUserInfo as updateUserInfoAction } from '../../store/slices/authSlice';
import { getUserInfo, getUserStats, getUserGoal, updateUserInfo, updateUserGoal, UserStats, UserGoal } from '../../api/userApi';
import styles from './UserCenter.module.scss';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const UserCenterPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userGoal, setUserGoal] = useState<UserGoal | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);

  // 获取用户统计数据
  useEffect(() => {
    const fetchUserStats = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const stats = await getUserStats(user.id);
          setUserStats(stats);
        } catch (error) {
          message.error('获取用户统计数据失败');
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserStats();
  }, [user?.id]);

  // 获取用户学习目标
  useEffect(() => {
    const fetchUserGoal = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const goal = await getUserGoal(user.id);
          setUserGoal(goal);
          goalForm.setFieldsValue(goal);
        } catch (error) {
          message.error('获取用户学习目标失败');
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserGoal();
  }, [user?.id, goalForm]);

  // 保存用户基本信息
  const handleSaveProfile = async (values: any) => {
    if (!user?.id) {
      message.error('用户未登录');
      return;
    }

    setSavingProfile(true);
    try {
      const updatedUser = await updateUserInfo(user.id, {
        username: values.name,
        email: values.email
      });
      
      // 更新Redux中的用户信息
      dispatch(updateUserInfoAction(updatedUser));
      message.success('个人资料更新成功');
    } catch (error) {
      message.error('更新个人资料失败');
      console.error(error);
    } finally {
      setSavingProfile(false);
    }
  };

  // 保存用户学习目标
  const handleSaveGoal = async (values: UserGoal) => {
    if (!user?.id) {
      message.error('用户未登录');
      return;
    }

    setSavingGoal(true);
    try {
      const updatedGoal = await updateUserGoal(user.id, values);
      setUserGoal(updatedGoal);
      message.success('学习目标更新成功');
    } catch (error) {
      message.error('更新学习目标失败');
      console.error(error);
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <div className={styles.userCenterContainer}>
      {/* 个人信息头部 */}
      <div className={styles.userHeader}>
        <div className={styles.userHeaderContent}>
          <div className={styles.userAvatar}>
            <Avatar 
              size={96} 
              src={user?.avatar} 
              icon={!user?.avatar && <UserOutlined />} 
            />
          </div>
          <div className={styles.userInfo}>
            <Title level={2} className={styles.userName}>{user?.username || '未登录用户'}</Title>
            <Text className={styles.userSchool}>
              {userGoal ? `${userGoal.targetSchool} · ${userGoal.targetMajor}` : '加载中...'}
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
            <Button type="primary">编辑资料</Button>
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
                    initialValues={{
                      name: user?.username || '',
                      gender: '男',
                      phone: '138****6666',
                      email: user?.email || 'example@mail.com',
                    }}
                    onFinish={handleSaveProfile}
                  >
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                          <Input placeholder="请输入姓名" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="gender" label="性别">
                          <Select>
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                            <Option value="保密">保密</Option>
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
                  {loading ? (
                    <div className={styles.loadingContainer}>
                      <Spin />
                    </div>
                  ) : (
                    <Form
                      form={goalForm}
                      layout="vertical"
                      initialValues={userGoal || {
                        targetSchool: '',
                        targetMajor: '',
                        examTime: '',
                      }}
                      onFinish={handleSaveGoal}
                    >
                      <Form.Item name="targetSchool" label="目标院校" rules={[{ required: true, message: '请输入目标院校' }]}>
                        <Input placeholder="请输入目标院校" />
                      </Form.Item>
                      <Form.Item name="targetMajor" label="目标专业" rules={[{ required: true, message: '请输入目标专业' }]}>
                        <Input placeholder="请输入目标专业" />
                      </Form.Item>
                      <Form.Item name="examTime" label="考试时间" rules={[{ required: true, message: '请输入考试时间' }]}>
                        <Input placeholder="请输入考试时间" />
                      </Form.Item>
                      <Divider />
                      <div className={styles.formActions}>
                        <Button type="primary" htmlType="submit" loading={savingGoal}>
                          保存学习目标
                        </Button>
                      </div>
                    </Form>
                  )}
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
                <div className={styles.emptyContent}>
                  <Text type="secondary">账号设置功能正在开发中...</Text>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default UserCenterPage; 