import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Space,
  message,
  Table,
  Tag,
  Row,
  Col,
  Typography,
  Divider,
  Modal,
  Tabs,
  Radio,
  Checkbox,
  Tooltip
} from 'antd';
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  SortAscendingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 题目选项类型
interface QuestionOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

// 题目类型定义
interface QuestionType {
  id: number;
  content: string;
  type: 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  options: QuestionOption[];
  answer: string;
  analysis: string;
  tags: string[];
  createTime: string;
  updateTime: string;
  source: string;
  knowPoints: string[];
  score?: number; // 题目分数，用于考试
}

// 考试题目类型
interface ExamQuestionType extends QuestionType {
  examId: number;
  score: number;
  sort: number;
}

// 题目类型映射
const questionTypeMap: Record<'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay', { text: string; color: string }> = {
  single: { text: '单选题', color: 'blue' },
  multiple: { text: '多选题', color: 'purple' },
  judge: { text: '判断题', color: 'cyan' },
  fillBlank: { text: '填空题', color: 'orange' },
  essay: { text: '问答题', color: 'green' }
};

// 难度级别映射
const difficultyMap: Record<'easy' | 'medium' | 'hard', { text: string; color: string }> = {
  easy: { text: '简单', color: 'success' },
  medium: { text: '中等', color: 'success' },
  hard: { text: '困难', color: 'error' }
};

// 生成模拟题目数据
const generateMockQuestions = (): QuestionType[] => {
  // 生成题目数量
  const count = 80; 
  return Array.from({ length: count }).map((_, index) => {
    const qid = index + 1;
    const type = ['single', 'multiple', 'judge', 'fillBlank', 'essay'][Math.floor(Math.random() * 5)] as 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay';
    const difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard';
    
    let options: QuestionOption[] = [];
    let answer = '';
    
    switch (type) {
      case 'single':
        options = [
          { id: 'A', content: `选项A-${qid}`, isCorrect: true },
          { id: 'B', content: `选项B-${qid}`, isCorrect: false },
          { id: 'C', content: `选项C-${qid}`, isCorrect: false },
          { id: 'D', content: `选项D-${qid}`, isCorrect: false }
        ];
        answer = 'A';
        break;
      case 'multiple':
        options = [
          { id: 'A', content: `选项A-${qid}`, isCorrect: true },
          { id: 'B', content: `选项B-${qid}`, isCorrect: true },
          { id: 'C', content: `选项C-${qid}`, isCorrect: false },
          { id: 'D', content: `选项D-${qid}`, isCorrect: false }
        ];
        answer = 'A,B';
        break;
      case 'judge':
        options = [
          { id: 'T', content: '正确', isCorrect: Math.random() > 0.5 },
          { id: 'F', content: '错误', isCorrect: !options[0]?.isCorrect }
        ];
        answer = options[0]?.isCorrect ? 'T' : 'F';
        break;
      case 'fillBlank':
        answer = `答案${qid}`;
        break;
      case 'essay':
        answer = `这是问答题${qid}的标准答案，包含关键点1、关键点2和关键点3。`;
        break;
    }
    
    return {
      id: qid,
      content: `这是第${qid}题。这是一道${difficulty}难度的${type === 'single' ? '单选题' : type === 'multiple' ? '多选题' : type === 'judge' ? '判断题' : type === 'fillBlank' ? '填空题' : '问答题'}`,
      type,
      difficulty,
      options,
      answer,
      analysis: `这是第${qid}题的解析，解释了为什么选择${answer}是正确的。`,
      tags: [`标签${qid}-1`, `标签${qid}-2`],
      createTime: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      updateTime: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      source: `来源${Math.floor(Math.random() * 5) + 1}`,
      knowPoints: [`知识点${qid}-1`, `知识点${qid}-2`]
    };
  });
};

const ExamCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [questionPoolVisible, setQuestionPoolVisible] = useState(false);
  const [questionPreviewVisible, setQuestionPreviewVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestionType[]>([]);
  
  // 所有题目
  const [allQuestions, setAllQuestions] = useState<QuestionType[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  
  // 选择的题目
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  
  // 搜索条件
  const [searchForm] = Form.useForm();
  
  // 初始化数据
  useEffect(() => {
    fetchQuestions();
  }, []);
  
  // 获取题目列表
  const fetchQuestions = () => {
    setQuestionLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const questions = generateMockQuestions();
      setAllQuestions(questions);
      setFilteredQuestions(questions);
      setQuestionLoading(false);
    }, 500);
  };
  
  // 过滤题目
  const filterQuestions = (values: any) => {
    let result = [...allQuestions];
    
    if (values.keyword) {
      const keyword = values.keyword.toLowerCase();
      result = result.filter(q => 
        q.content.toLowerCase().includes(keyword) || 
        q.analysis.toLowerCase().includes(keyword)
      );
    }
    
    if (values.type) {
      result = result.filter(q => q.type === values.type);
    }
    
    if (values.difficulty) {
      result = result.filter(q => q.difficulty === values.difficulty);
    }
    
    if (values.tags && values.tags.length > 0) {
      result = result.filter(q => 
        q.tags.some(tag => values.tags.includes(tag))
      );
    }
    
    setFilteredQuestions(result);
  };
  
  // 处理搜索题目
  const handleSearchQuestions = (values: any) => {
    filterQuestions(values);
  };
  
  // 重置搜索条件
  const handleResetSearch = () => {
    searchForm.resetFields();
    setFilteredQuestions(allQuestions);
  };
  
  // 打开题目选择对话框
  const handleOpenQuestionPool = () => {
    setQuestionPoolVisible(true);
    // 更新已选择的题目ID列表
    setSelectedQuestionIds(examQuestions.map(q => q.id));
  };
  
  // 关闭题目选择对话框
  const handleCloseQuestionPool = () => {
    setQuestionPoolVisible(false);
  };
  
  // 选择题目
  const handleSelectQuestions = () => {
    // 获取选中的题目
    const selectedQuestions = allQuestions.filter(q => selectedQuestionIds.includes(q.id));
    
    // 添加到考试题目中
    const newExamQuestions: ExamQuestionType[] = selectedQuestions.map((q, index) => {
      // 如果题目已经在考试中，保留原来的分数和排序
      const existingQuestion = examQuestions.find(eq => eq.id === q.id);
      
      if (existingQuestion) {
        return existingQuestion;
      }
      
      // 新题目，根据类型设置默认分数
      let defaultScore = 0;
      switch (q.type) {
        case 'single':
          defaultScore = 2;
          break;
        case 'multiple':
          defaultScore = 4;
          break;
        case 'judge':
          defaultScore = 1;
          break;
        case 'fillBlank':
          defaultScore = 3;
          break;
        case 'essay':
          defaultScore = 10;
          break;
      }
      
      return {
        ...q,
        examId: 0, // 新考试，暂时用0
        score: defaultScore,
        sort: examQuestions.length + index + 1
      };
    });
    
    setExamQuestions(newExamQuestions);
    setQuestionPoolVisible(false);
    
    // 更新总分
    updateTotalScore(newExamQuestions);
  };
  
  // 更新总分
  const updateTotalScore = (questions: ExamQuestionType[]) => {
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
    form.setFieldsValue({ totalScore });
  };
  
  // 移除题目
  const handleRemoveQuestion = (questionId: number) => {
    const newExamQuestions = examQuestions.filter(q => q.id !== questionId);
    setExamQuestions(newExamQuestions);
    
    // 更新排序
    const reorderedQuestions = newExamQuestions.map((q, index) => ({
      ...q,
      sort: index + 1
    }));
    
    setExamQuestions(reorderedQuestions);
    updateTotalScore(reorderedQuestions);
  };
  
  // 修改题目分数
  const handleScoreChange = (questionId: number, score: number) => {
    const newExamQuestions = examQuestions.map(q => 
      q.id === questionId ? { ...q, score } : q
    );
    
    setExamQuestions(newExamQuestions);
    updateTotalScore(newExamQuestions);
  };
  
  // 预览题目
  const handlePreviewQuestion = (question: QuestionType) => {
    setSelectedQuestion(question);
    setQuestionPreviewVisible(true);
  };
  
  // 提交表单
  const handleSubmit = (values: any) => {
    if (examQuestions.length === 0) {
      message.error('请至少添加一道题目');
      return;
    }
    
    setLoading(true);
    
    // 构建考试数据
    const examData = {
      ...values,
      questions: examQuestions,
      startTime: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
      status: values.isPublished ? 'published' : 'draft',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      creator: '管理员',
      questionsCount: examQuestions.length
    };
    
    // 模拟API请求
    setTimeout(() => {
      console.log('考试数据:', examData);
      setLoading(false);
      message.success('考试创建成功');
      navigate('/admin/exams');
    }, 1000);
  };
  
  // 返回考试列表
  const handleBack = () => {
    navigate('/admin/exams');
  };
  
  // 题目列表列配置
  const questionColumns: ColumnsType<QuestionType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '题型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay') => (
        <Tag color={questionTypeMap[type].color}>
          {questionTypeMap[type].text}
        </Tag>
      ),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty: 'easy' | 'medium' | 'hard') => (
        <Tag color={difficultyMap[difficulty].color}>
          {difficultyMap[difficulty].text}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewQuestion(record)}
          />
        </Space>
      ),
    },
  ];
  
  // 已选题目列配置
  const selectedQuestionColumns: ColumnsType<ExamQuestionType> = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: '题型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay') => (
        <Tag color={questionTypeMap[type].color}>
          {questionTypeMap[type].text}
        </Tag>
      ),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty: 'easy' | 'medium' | 'hard') => (
        <Tag color={difficultyMap[difficulty].color}>
          {difficultyMap[difficulty].text}
        </Tag>
      ),
    },
    {
      title: '分值',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score, record) => (
        <InputNumber
          min={1}
          max={100}
          value={score}
          onChange={(value) => handleScoreChange(record.id, value as number)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewQuestion(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveQuestion(record.id)}
          />
        </Space>
      ),
    },
  ];
  
  // 渲染题目预览
  const renderQuestionPreview = () => {
    if (!selectedQuestion) return null;
    
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Tag color={questionTypeMap[selectedQuestion.type].color}>
              {questionTypeMap[selectedQuestion.type].text}
            </Tag>
            <Tag color={difficultyMap[selectedQuestion.difficulty].color}>
              {difficultyMap[selectedQuestion.difficulty].text}
            </Tag>
          </Space>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Text strong>题目：</Text>
          <div>{selectedQuestion.content}</div>
        </div>
        
        {['single', 'multiple', 'judge'].includes(selectedQuestion.type) && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>选项：</Text>
            <div>
              {selectedQuestion.options.map((option) => (
                <div key={option.id} style={{ margin: '8px 0' }}>
                  <Space>
                    {option.isCorrect && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    <Text strong>{option.id}.</Text>
                    <Text>{option.content}</Text>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: 16 }}>
          <Text strong>答案：</Text>
          <div>{selectedQuestion.answer}</div>
        </div>
        
        <div>
          <Text strong>解析：</Text>
          <div>{selectedQuestion.analysis}</div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>创建考试</Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
          >
            保存
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            title: '',
            description: '',
            category: undefined,
            duration: 60,
            totalScore: 0,
            passingScore: 60,
            timeRange: [dayjs(), dayjs().add(7, 'day')],
            isPublished: false,
            isPublic: true,
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="考试标题"
                rules={[{ required: true, message: '请输入考试标题' }]}
              >
                <Input placeholder="请输入考试标题" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="考试分类"
                rules={[{ required: true, message: '请选择考试分类' }]}
              >
                <Select placeholder="请选择考试分类">
                  <Option value="政治">政治</Option>
                  <Option value="英语">英语</Option>
                  <Option value="数学">数学</Option>
                  <Option value="专业课">专业课</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="考试说明"
          >
            <TextArea rows={4} placeholder="请输入考试说明" />
          </Form.Item>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="timeRange"
                label="考试时间范围"
                rules={[{ required: true, message: '请选择考试时间范围' }]}
              >
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="duration"
                label="考试时长(分钟)"
                rules={[{ required: true, message: '请输入考试时长' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="passingScore"
                label="及格分数"
                rules={[{ required: true, message: '请输入及格分数' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="totalScore"
                label="总分"
              >
                <InputNumber min={0} style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isPublished"
                label="是否立即发布"
                valuePropName="checked"
              >
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isPublic"
                label="是否公开"
                valuePropName="checked"
              >
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        
        <Divider orientation="left">考试题目</Divider>
        
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenQuestionPool}
            >
              添加题目
            </Button>
            <Text>
              已选择 <Text strong>{examQuestions.length}</Text> 道题目，
              总分 <Text strong>{examQuestions.reduce((sum, q) => sum + q.score, 0)}</Text> 分
            </Text>
          </Space>
        </div>
        
        <Table
          columns={selectedQuestionColumns}
          dataSource={examQuestions}
          rowKey="id"
          pagination={false}
          bordered
        />
      </Card>
      
      {/* 题库选择弹窗 */}
      <Modal
        title="选择题目"
        open={questionPoolVisible}
        onCancel={handleCloseQuestionPool}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleCloseQuestionPool}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSelectQuestions}
          >
            确定 ({selectedQuestionIds.length})
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearchQuestions}
          >
            <Form.Item name="keyword">
              <Input placeholder="关键词搜索" allowClear />
            </Form.Item>
            <Form.Item name="type">
              <Select
                placeholder="题目类型"
                style={{ width: 120 }}
                allowClear
              >
                <Option value="single">单选题</Option>
                <Option value="multiple">多选题</Option>
                <Option value="judge">判断题</Option>
                <Option value="fillBlank">填空题</Option>
                <Option value="essay">问答题</Option>
              </Select>
            </Form.Item>
            <Form.Item name="difficulty">
              <Select
                placeholder="难度"
                style={{ width: 100 }}
                allowClear
              >
                <Option value="easy">简单</Option>
                <Option value="medium">中等</Option>
                <Option value="hard">困难</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleResetSearch}>重置</Button>
            </Form.Item>
          </Form>
        </div>
        
        <Table
          rowSelection={{
            selectedRowKeys: selectedQuestionIds,
            onChange: (selectedRowKeys) => {
              setSelectedQuestionIds(selectedRowKeys as number[]);
            },
          }}
          columns={questionColumns}
          dataSource={filteredQuestions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={questionLoading}
          size="small"
        />
      </Modal>
      
      {/* 题目预览弹窗 */}
      <Modal
        title="题目预览"
        open={questionPreviewVisible}
        onCancel={() => setQuestionPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQuestionPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {renderQuestionPreview()}
      </Modal>
    </AdminLayout>
  );
};

export default ExamCreate; 