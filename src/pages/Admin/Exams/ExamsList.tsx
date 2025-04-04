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
import { getExamsList, deleteExam } from '../../../api/adminApi';
import { ExamStatus } from '../../../types/exam';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 从后端返回的考试数据结构
interface BackendExamType {
  examId: number;
  examName: string;
  examDesc: string;
  examStartTime: string;
  examEndTime: string;
  duration: number; // 分钟
  totalScore: number;
  passScore: number;
  status: ExamStatus;
  createAt: string;
  updateAt: string;
  creatorId: number;
  creatorName: string;
  participantCount: number;
  questions?: any[];
}

// 组件使用的考试数据结构
interface ExamType {
  examId: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // 分钟
  totalScore: number;
  status: ExamStatus;
  questionCount?: number;
  participantCount?: number;
  createTime?: string;
  updateTime?: string;
  creatorName?: string;
  passScore?: number;
}

// 状态映射
const statusMap = {
  [ExamStatus.UPCOMING]: { text: '即将开始', color: 'blue' },
  [ExamStatus.ONGOING]: { text: '进行中', color: 'green' },
  [ExamStatus.ENDED]: { text: '已结束', color: 'red' }
};

// 搜索参数接口
interface SearchParams {
  keyword?: string;
  status?: ExamStatus;
  timeRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
}

const ExamsList: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();

  // 初始加载
  useEffect(() => {
    fetchExams();
  }, [pagination.current, pagination.pageSize]);

  // 获取考试列表
  const fetchExams = async (params?: SearchParams) => {
    setLoading(true);
    try {
      const requestParams = {
        page: pagination.current,
        size: pagination.pageSize,
        keyword: params?.keyword || searchParams.keyword,
        status: params?.status !== undefined ? params.status : searchParams.status
      };
      
      const result = await getExamsList(requestParams);
      
      if (result.success) {
        // 正确解析后端返回的数据结构
        const { list, total } = result.data;
        
        // 转换为组件所需的数据结构
        const formattedExams: ExamType[] = list.map((item: BackendExamType) => ({
          examId: item.examId,
          name: item.examName,
          description: item.examDesc,
          startTime: item.examStartTime,
          endTime: item.examEndTime,
          duration: item.duration,
          totalScore: item.totalScore,
          status: item.status,
          questionCount: item.questions?.length || 0,
          participantCount: item.participantCount,
          createTime: item.createAt,
          updateTime: item.updateAt,
          creatorName: item.creatorName,
          passScore: item.passScore
        }));
        
        setExams(formattedExams);
        setPagination(prev => ({
          ...prev,
          total
        }));
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('获取考试列表失败:', error);
      message.error('获取考试列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    const params = {
      keyword: values.keyword,
      status: values.status
    };
    
    setSearchParams(params);
    setPagination(prev => ({
      ...prev,
      current: 1 // 重置为第一页
    }));
    
    fetchExams(params);
  };

  // 处理表格变化
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({});
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    fetchExams({});
  };

  // 创建新考试
  const handleCreateExam = () => {
    navigate('/admin/exams/create');
  };

  // 编辑考试
  const handleEditExam = (id: number) => {
    navigate(`/admin/exams/edit/${id}`);
  };

  // 查看考试详情
  const handleViewExam = (id: number) => {
    navigate(`/admin/exams/detail/${id}`);
  };

  // 删除考试确认
  const handleConfirmDelete = (exam: ExamType) => {
    setSelectedExam(exam);
    setConfirmVisible(true);
  };

  // 删除考试
  const handleDelete = async () => {
    if (!selectedExam) return;
    
    setLoading(true);
    try {
      const result = await deleteExam(selectedExam.examId);
      
      if (result.success) {
        message.success('删除成功');
        setConfirmVisible(false);
        fetchExams();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('删除考试失败:', error);
      message.error('删除考试失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<ExamType> = [
    {
      title: '考试名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <a onClick={() => handleViewExam(record.examId)}>{text}</a>
          <div>
            <Tag color={statusMap[record.status]?.color}>
              {statusMap[record.status]?.text}
            </Tag>
          </div>
        </div>
      )
    },
    {
      title: '考试时间',
      key: 'examTime',
      render: (_, record) => (
        <div>
          <div>开始: {dayjs(record.startTime).format('YYYY-MM-DD HH:mm')}</div>
          <div>结束: {dayjs(record.endTime).format('YYYY-MM-DD HH:mm')}</div>
          <div>时长: {record.duration}分钟</div>
        </div>
      )
    },
    {
      title: '题目/分数',
      key: 'questions',
      render: (_, record) => (
        <div>
          <div>题目数: {record.questionCount || 0}</div>
          <div>总分: {record.totalScore}分</div>
          <div>及格分: {record.passScore || Math.floor(record.totalScore * 0.6)}分</div>
        </div>
      )
    },
    {
      title: '参与情况',
      dataIndex: 'participantCount',
      key: 'participantCount',
      render: (text) => `${text || 0}人参加`
    },
    {
      title: '创建者',
      dataIndex: 'creatorName',
      key: 'creatorName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewExam(record.examId)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditExam(record.examId)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleConfirmDelete(record)}
          />
          <Button 
            type="text" 
            icon={<BarChartOutlined />} 
            onClick={() => navigate(`/admin/exams/statistics/${record.examId}`)}
          />
        </Space>
      )
    }
  ];

  return (
    <AdminLayout>
      <Card
        title="考试管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateExam}>
            创建考试
          </Button>
        }
      >
        {/* 搜索表单 */}
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="keyword">
                <Input prefix={<SearchOutlined />} placeholder="考试名称" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status">
                <Select placeholder="考试状态" allowClear>
                  <Option value={ExamStatus.UPCOMING}>即将开始</Option>
                  <Option value={ExamStatus.ONGOING}>进行中</Option>
                  <Option value={ExamStatus.ENDED}>已结束</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 考试列表 */}
        <Table
          columns={columns}
          dataSource={exams}
          rowKey="examId"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      {/* 删除确认对话框 */}
      <Modal
        title="删除考试"
        open={confirmVisible}
        onOk={handleDelete}
        onCancel={() => setConfirmVisible(false)}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>
          确定要删除考试 <Text strong>{selectedExam?.name}</Text> 吗？<br />
          删除后无法恢复，且将删除所有相关的题目和学生作答记录。
        </p>
      </Modal>
    </AdminLayout>
  );
};

export default ExamsList; 