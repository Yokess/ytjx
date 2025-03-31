import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Modal,
  Popconfirm,
  Tooltip,
  Typography,
  Badge,
  DatePicker,
  InputNumber,
  Switch
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CopyOutlined,
  LockOutlined,
  UnlockOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 考试类型定义
interface ExamType {
  id: number;
  title: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  duration: number; // 分钟
  totalScore: number;
  passingScore: number;
  questionsCount: number;
  participants: number;
  status: 'draft' | 'published' | 'ongoing' | 'ended';
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  creator: string;
}

// 状态映射
const statusMap = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'blue' },
  ongoing: { text: '进行中', color: 'green' },
  ended: { text: '已结束', color: 'red' }
};

// 生成模拟考试数据
const generateMockExams = (count: number): ExamType[] => {
  const categories = ['政治', '英语', '数学', '专业课'];
  const statuses: ('draft' | 'published' | 'ongoing' | 'ended')[] = ['draft', 'published', 'ongoing', 'ended'];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = index + 1;
    const category = categories[id % categories.length];
    const status = statuses[id % statuses.length];
    
    return {
      id,
      title: `${category}考试${id}: ${['模拟测试', '期中考试', '期末考试', '专项训练'][id % 4]}`,
      description: `这是${category}考试的详细描述，包含考试范围、要求等信息...`,
      category,
      startTime: dayjs().add(id % 10, 'day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs().add((id % 10) + 7, 'day').format('YYYY-MM-DD HH:mm:ss'),
      duration: [60, 90, 120, 150][id % 4],
      totalScore: [100, 150, 200][id % 3],
      passingScore: [60, 90, 120][id % 3],
      questionsCount: 10 + (id % 20),
      participants: id * 12 + (id % 50),
      status,
      createdAt: dayjs().subtract(id % 30, 'day').format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().subtract(id % 15, 'day').format('YYYY-MM-DD HH:mm:ss'),
      isPublic: id % 3 !== 0,
      creator: `讲师${(id % 5) + 1}`
    };
  });
};

// 搜索参数接口
interface SearchParams {
  keyword?: string;
  category?: string;
  status?: string;
  timeRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  creator?: string;
}

const ExamsList: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamType[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 初始加载
  useEffect(() => {
    fetchExams();
  }, []);

  // 搜索条件变化时过滤考试
  useEffect(() => {
    filterExams();
  }, [searchParams, exams]);

  // 获取考试列表
  const fetchExams = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockExams = generateMockExams(50);
      setExams(mockExams);
      setFilteredExams(mockExams);
      setPagination(prev => ({
        ...prev,
        total: mockExams.length
      }));
      setLoading(false);
    }, 500);
  };

  // 根据条件过滤考试
  const filterExams = () => {
    let result = [...exams];
    
    // 关键词搜索 (标题、描述)
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase();
      result = result.filter(
        exam => exam.title.toLowerCase().includes(keyword) || 
        exam.description.toLowerCase().includes(keyword)
      );
    }
    
    // 分类筛选
    if (searchParams.category) {
      result = result.filter(exam => exam.category === searchParams.category);
    }
    
    // 状态筛选
    if (searchParams.status) {
      result = result.filter(exam => exam.status === searchParams.status);
    }
    
    // 创建者筛选
    if (searchParams.creator) {
      result = result.filter(exam => exam.creator === searchParams.creator);
    }
    
    // 时间范围筛选
    if (searchParams.timeRange && searchParams.timeRange[0] && searchParams.timeRange[1]) {
      const startDate = searchParams.timeRange[0].valueOf();
      const endDate = searchParams.timeRange[1].valueOf();
      
      result = result.filter(exam => {
        const examDate = dayjs(exam.createdAt).valueOf();
        return examDate >= startDate && examDate <= endDate;
      });
    }
    
    setFilteredExams(result);
    setPagination(prev => ({
      ...prev,
      total: result.length
    }));
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({});
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // 创建新考试
  const handleCreateExam = () => {
    navigate('/admin/exams/new');
  };

  // 编辑考试
  const handleEditExam = (id: number) => {
    navigate(`/admin/exams/${id}/edit`);
  };

  // 查看考试详情
  const handleViewExam = (id: number) => {
    navigate(`/admin/exams/${id}`);
  };

  // 确认删除考试
  const handleConfirmDelete = (exam: ExamType) => {
    setSelectedExam(exam);
    setConfirmVisible(true);
  };

  // 执行删除考试
  const handleDelete = () => {
    if (!selectedExam) return;
    
    // 模拟删除请求
    setTimeout(() => {
      setExams(prevExams => prevExams.filter(exam => exam.id !== selectedExam.id));
      message.success(`考试 "${selectedExam.title}" 已删除`);
      setConfirmVisible(false);
      setSelectedExam(null);
    }, 500);
  };

  // 复制考试
  const handleDuplicateExam = (exam: ExamType) => {
    // 模拟复制请求
    const newExam: ExamType = {
      ...exam,
      id: exams.length + 1,
      title: `${exam.title} (副本)`,
      status: 'draft',
      participants: 0,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
    
    setExams(prevExams => [newExam, ...prevExams]);
    message.success(`已复制考试 "${exam.title}"`);
  };

  // 表格列定义
  const columns: ColumnsType<ExamType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '考试名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <span>
          <a onClick={() => handleViewExam(record.id)}>{text}</a>
          {!record.isPublic && <Tag style={{ marginLeft: 8 }}>私有</Tag>}
        </span>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 'draft' | 'published' | 'ongoing' | 'ended') => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      )
    },
    {
      title: '题目数',
      dataIndex: 'questionsCount',
      key: 'questionsCount',
      width: 80,
    },
    {
      title: '满分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 80,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration) => `${duration}分钟`
    },
    {
      title: '考试时间',
      key: 'examTime',
      width: 180,
      render: (_, record) => (
        <span>
          {dayjs(record.startTime).format('MM-DD HH:mm')} 至<br />
          {dayjs(record.endTime).format('MM-DD HH:mm')}
        </span>
      )
    },
    {
      title: '参与人数',
      dataIndex: 'participants',
      key: 'participants',
      width: 100,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => handleViewExam(record.id)} 
            />
          </Tooltip>
          
          {record.status === 'draft' && (
            <Tooltip title="编辑">
              <Button 
                icon={<EditOutlined />} 
                size="small" 
                onClick={() => handleEditExam(record.id)} 
              />
            </Tooltip>
          )}
          
          <Tooltip title="复制">
            <Button 
              icon={<CopyOutlined />} 
              size="small" 
              onClick={() => handleDuplicateExam(record)} 
            />
          </Tooltip>
          
          <Tooltip title="删除">
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => handleConfirmDelete(record)}
              disabled={record.status !== 'draft' && record.participants > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 获取分类列表
  const getCategoryOptions = () => {
    const categories = Array.from(new Set(exams.map(exam => exam.category)));
    return categories.map(category => (
      <Option key={category} value={category}>{category}</Option>
    ));
  };

  // 获取创建者列表
  const getCreatorOptions = () => {
    const creators = Array.from(new Set(exams.map(exam => exam.creator)));
    return creators.map(creator => (
      <Option key={creator} value={creator}>{creator}</Option>
    ));
  };

  return (
    <AdminLayout>
      <Card
        title="考试管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateExam}>
            新建考试
          </Button>
        }
      >
        <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item name="keyword" style={{ width: '100%' }}>
                <Input 
                  prefix={<SearchOutlined />} 
                  placeholder="搜索考试名称或描述" 
                  allowClear
                />
              </Form.Item>
            </Col>
            
            <Col span={4}>
              <Form.Item name="category" style={{ width: '100%' }}>
                <Select placeholder="选择分类" allowClear>
                  {getCategoryOptions()}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={4}>
              <Form.Item name="status" style={{ width: '100%' }}>
                <Select placeholder="选择状态" allowClear>
                  <Option value="draft">草稿</Option>
                  <Option value="published">已发布</Option>
                  <Option value="ongoing">进行中</Option>
                  <Option value="ended">已结束</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={4}>
              <Form.Item name="creator" style={{ width: '100%' }}>
                <Select placeholder="创建者" allowClear>
                  {getCreatorOptions()}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item name="timeRange">
                <RangePicker 
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        
        <Table
          columns={columns}
          dataSource={filteredExams}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Card>
      
      {/* 删除确认弹窗 */}
      <Modal
        title="删除确认"
        visible={confirmVisible}
        onOk={handleDelete}
        onCancel={() => setConfirmVisible(false)}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 22, marginRight: 16 }} />
          <Text>你确定要删除以下考试吗？此操作无法撤销。</Text>
        </div>
        
        {selectedExam && (
          <div style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 2 }}>
            <p><Text strong>{selectedExam.title}</Text></p>
            <p>分类: {selectedExam.category}</p>
            <p>状态: {statusMap[selectedExam.status].text}</p>
            <p>创建时间: {dayjs(selectedExam.createdAt).format('YYYY-MM-DD HH:mm')}</p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default ExamsList; 