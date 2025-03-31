import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, List, Typography, DatePicker, Space, Dropdown, Menu, Button } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  EllipsisOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import ReactECharts from 'echarts-for-react';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

// 模拟数据
const dashboardData = {
  overview: {
    totalUsers: 12345,
    userGrowth: 12.5,
    activeUsers: 5678,
    activeGrowth: 8.3,
    totalCourses: 356,
    courseGrowth: 5.6,
    totalExams: 128,
    examGrowth: 15.2
  },
  userActivity: [
    { date: '1月', activeUsers: 3200, newUsers: 1400 },
    { date: '2月', activeUsers: 3500, newUsers: 1600 },
    { date: '3月', activeUsers: 3700, newUsers: 1800 },
    { date: '4月', activeUsers: 4000, newUsers: 2000 },
    { date: '5月', activeUsers: 4200, newUsers: 1900 },
    { date: '6月', activeUsers: 4500, newUsers: 2200 },
  ],
  recentUsers: [
    { id: 1, username: '张三', role: 'student', status: 'active', registerTime: '2023-01-01 12:00:00' },
    { id: 2, username: '李四', role: 'teacher', status: 'active', registerTime: '2023-01-02 14:30:00' },
    { id: 3, username: '王五', role: 'student', status: 'active', registerTime: '2023-01-03 09:15:00' },
    { id: 4, username: '赵六', role: 'student', status: 'inactive', registerTime: '2023-01-04 16:45:00' },
    { id: 5, username: '钱七', role: 'teacher', status: 'pending', registerTime: '2023-01-05 10:30:00' },
  ],
  popularCourses: [
    { id: 1, title: '高等数学精讲', category: '数学', students: 1200, rating: 4.9 },
    { id: 2, title: '英语词汇速记', category: '英语', students: 980, rating: 4.7 },
    { id: 3, title: '政治理论精讲', category: '政治', students: 850, rating: 4.8 },
    { id: 4, title: '专业课辅导班', category: '专业课', students: 750, rating: 4.6 },
    { id: 5, title: '计算机基础', category: '专业课', students: 680, rating: 4.5 },
  ],
  userDistribution: [
    { type: '学生', value: 10000, name: '学生' },
    { type: '教师', value: 2000, name: '教师' },
    { type: '管理员', value: 50, name: '管理员' },
  ],
  recentActions: [
    { id: 1, user: '管理员A', action: '审核通过教师认证申请', target: '李四', time: '5分钟前' },
    { id: 2, user: '管理员B', action: '删除违规帖子', target: '如何快速通过考试', time: '10分钟前' },
    { id: 3, user: '管理员A', action: '添加新课程分类', target: '人工智能', time: '30分钟前' },
    { id: 4, user: '管理员C', action: '禁用用户账号', target: '用户XYZ', time: '1小时前' },
    { id: 5, user: '管理员B', action: '发布系统公告', target: '系统升级通知', time: '2小时前' },
  ]
};

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(30, 'day'), dayjs()]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 用户列表列配置
  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        let text = '学生';
        if (role === 'teacher') {
          color = 'green';
          text = '教师';
        } else if (role === 'admin') {
          color = 'purple';
          text = '管理员';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        let text = '正常';
        if (status === 'inactive') {
          color = 'red';
          text = '禁用';
        } else if (status === 'pending') {
          color = 'orange';
          text = '待审核';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
    },
  ];

  // 课程列表列配置
  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '学生数',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
    },
  ];

  // 更多菜单
  const moreMenu = (
    <Menu>
      <Menu.Item key="1">导出数据</Menu.Item>
      <Menu.Item key="2">打印报表</Menu.Item>
      <Menu.Item key="3">数据分析</Menu.Item>
    </Menu>
  );

  // 视图切换菜单
  const viewMenu = (
    <Menu onClick={(e) => setViewMode(e.key as 'month' | 'week' | 'day')}>
      <Menu.Item key="day">日视图</Menu.Item>
      <Menu.Item key="week">周视图</Menu.Item>
      <Menu.Item key="month">月视图</Menu.Item>
    </Menu>
  );

  // 用户活跃度趋势图表配置
  const getBarChartOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['活跃用户', '新增用户']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dashboardData.userActivity.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '活跃用户',
          type: 'bar',
          data: dashboardData.userActivity.map(item => item.activeUsers),
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '新增用户',
          type: 'bar',
          data: dashboardData.userActivity.map(item => item.newUsers),
          itemStyle: {
            color: '#2fc25b'
          }
        }
      ]
    };
  };

  // 用户分布饼图配置
  const getPieChartOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        data: dashboardData.userDistribution.map(item => item.name)
      },
      series: [
        {
          name: '用户分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: dashboardData.userDistribution.map(item => ({
            value: item.value,
            name: item.name
          }))
        }
      ]
    };
  };

  return (
    <AdminLayout>
      <div style={{ padding: '0 12px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={4}>管理后台仪表盘</Title>
            <Text type="secondary">欢迎回来，管理员。这里是系统概览。</Text>
          </Col>
          <Col>
            <Space>
              <RangePicker 
                locale={locale}
                value={timeRange} 
                onChange={(dates) => setTimeRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} 
              />
              <Dropdown overlay={moreMenu} trigger={['click']}>
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>
            </Space>
          </Col>
        </Row>

        {/* 概览统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title="总用户数"
                value={dashboardData.overview.totalUsers}
                prefix={<UserOutlined />}
                suffix={
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    <span style={{ color: dashboardData.overview.userGrowth >= 0 ? '#3f8600' : '#cf1322' }}>
                      {dashboardData.overview.userGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(dashboardData.overview.userGrowth)}%
                    </span>
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title="活跃用户"
                value={dashboardData.overview.activeUsers}
                prefix={<TeamOutlined />}
                suffix={
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    <span style={{ color: dashboardData.overview.activeGrowth >= 0 ? '#3f8600' : '#cf1322' }}>
                      {dashboardData.overview.activeGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(dashboardData.overview.activeGrowth)}%
                    </span>
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title="总课程数"
                value={dashboardData.overview.totalCourses}
                prefix={<BookOutlined />}
                suffix={
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    <span style={{ color: dashboardData.overview.courseGrowth >= 0 ? '#3f8600' : '#cf1322' }}>
                      {dashboardData.overview.courseGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(dashboardData.overview.courseGrowth)}%
                    </span>
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title="总考试数"
                value={dashboardData.overview.totalExams}
                prefix={<FileTextOutlined />}
                suffix={
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    <span style={{ color: dashboardData.overview.examGrowth >= 0 ? '#3f8600' : '#cf1322' }}>
                      {dashboardData.overview.examGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(dashboardData.overview.examGrowth)}%
                    </span>
                  </Text>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={16}>
            <Card 
              loading={loading} 
              title="用户活跃度趋势" 
              extra={
                <Dropdown overlay={viewMenu} trigger={['click']}>
                  <a onClick={e => e.preventDefault()}>
                    <Space>
                      {viewMode === 'month' ? '月视图' : viewMode === 'week' ? '周视图' : '日视图'}
                      <EllipsisOutlined />
                    </Space>
                  </a>
                </Dropdown>
              }
            >
              <ReactECharts
                option={getBarChartOption()}
                style={{ height: 300 }}
                notMerge={true}
                lazyUpdate={true}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card 
              loading={loading} 
              title="用户分布" 
              extra={<PieChartOutlined />}
            >
              <ReactECharts
                option={getPieChartOption()}
                style={{ height: 300 }}
                notMerge={true}
                lazyUpdate={true}
              />
            </Card>
          </Col>
        </Row>

        {/* 列表区域 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card 
              loading={loading} 
              title="最近注册用户" 
              extra={<a href="/admin/users/list">查看全部</a>}
            >
              <Table 
                columns={userColumns} 
                dataSource={dashboardData.recentUsers} 
                rowKey="id" 
                pagination={false} 
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              loading={loading} 
              title="热门课程" 
              extra={<a href="/admin/courses/list">查看全部</a>}
            >
              <Table 
                columns={courseColumns} 
                dataSource={dashboardData.popularCourses} 
                rowKey="id" 
                pagination={false} 
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* 最近操作记录 */}
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card 
              loading={loading} 
              title="最近操作记录" 
              extra={<a href="#">更多</a>}
            >
              <List
                size="small"
                dataSource={dashboardData.recentActions}
                renderItem={item => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div>
                        <Text strong>{item.user}</Text>
                        <Text> {item.action} </Text>
                        <Text type="secondary">{item.target}</Text>
                      </div>
                      <Text type="secondary">{item.time}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 