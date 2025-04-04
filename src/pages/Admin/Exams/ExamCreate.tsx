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
import { createExam, getQuestionsList } from '../../../api/adminApi';
import { QuestionType as QuestionTypeEnum, ExamStatus } from '../../../types/exam';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 题目选项类型
interface QuestionOption {
  optionKey: string;
  optionValue: string;
  isCorrect: boolean;
}

// 题目类型定义
interface QuestionType {
  questionId: number;
  questionText: string;
  questionType: QuestionTypeEnum;
  difficulty: 'easy' | 'medium' | 'hard';
  options: QuestionOption[];
  answer: string;
  analysis: string;
  tags: string[];
  createTime: string;
  updateTime: string;
  source: string;
  knowPoints: string[];
  questionScore?: number; // 题目分数，用于考试
}

// 考试题目类型
interface ExamQuestionType extends QuestionType {
  examId: number;
  questionScore: number;
  sort: number;
}

// 题目类型映射
const questionTypeMap: Record<number, { text: string; color: string }> = {
  [QuestionTypeEnum.SINGLE_CHOICE]: { text: '单选题', color: 'blue' },
  [QuestionTypeEnum.MULTIPLE_CHOICE]: { text: '多选题', color: 'purple' },
  [QuestionTypeEnum.JUDGE]: { text: '判断题', color: 'cyan' },
  [QuestionTypeEnum.FILL_BLANK]: { text: '填空题', color: 'orange' },
  [QuestionTypeEnum.ESSAY]: { text: '问答题', color: 'green' }
};

// 难度级别映射
const difficultyMap: Record<string, { text: string; color: string }> = {
  easy: { text: '简单', color: 'success' },
  medium: { text: '中等', color: 'warning' },
  hard: { text: '困难', color: 'error' }
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
  const fetchQuestions = async () => {
    setQuestionLoading(true);
    try {
      // 从API获取题目列表
      const response = await getQuestionsList({
        page: 1,
        size: 1000 // 获取更多题目以确保能显示所有题目
      });
      
      if (response.success && response.data) {
        const questions = response.data.list || [];
        setAllQuestions(questions);
        setFilteredQuestions(questions);
        console.log('获取题目列表成功:', questions);
      } else {
        message.error(response.message || '获取题目列表失败');
        console.error('获取题目列表返回错误:', response);
      }
    } catch (error) {
      console.error('获取题目列表失败:', error);
      message.error('获取题目列表失败');
    } finally {
      setQuestionLoading(false);
    }
  };
  
  // 过滤题目
  const filterQuestions = (values: any) => {
    let result = [...allQuestions];
    
    if (values.keyword) {
      const keyword = values.keyword.toLowerCase();
      result = result.filter(q => 
        q.questionText.toLowerCase().includes(keyword) || 
        q.analysis?.toLowerCase().includes(keyword) ||
        q.tags?.some(tag => tag.toLowerCase().includes(keyword))
      );
    }
    
    if (values.type !== undefined && values.type !== null) {
      result = result.filter(q => q.questionType === Number(values.type));
    }
    
    if (values.difficulty) {
      result = result.filter(q => q.difficulty === values.difficulty);
    }
    
    if (values.tags && values.tags.length > 0) {
      result = result.filter(q => 
        q.tags && q.tags.some(tag => values.tags.includes(tag))
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
    setSelectedQuestionIds(examQuestions.map(q => q.questionId));
  };
  
  // 关闭题目选择对话框
  const handleCloseQuestionPool = () => {
    setQuestionPoolVisible(false);
    // 清空已选择的题目ID
    setSelectedQuestionIds([]);
  };
  
  // 选择题目
  const handleSelectQuestions = () => {
    console.log('选择的题目ID:', selectedQuestionIds);
    
    // 获取选中的题目
    const selectedQuestions = allQuestions.filter(q => selectedQuestionIds.includes(q.questionId));
    console.log('选择的题目详情:', selectedQuestions);
    
    // 已添加的题目ID
    const existingIds = examQuestions.map(q => q.questionId);
    
    // 过滤掉已添加的题目
    const newQuestions = selectedQuestions.filter(q => !existingIds.includes(q.questionId));
    
    if (newQuestions.length === 0) {
      message.info('所选题目都已添加到考试中');
      return;
    }
    
    // 添加到考试题目列表
    const newExamQuestions = newQuestions.map((q, index) => {
      // 按题目类型设置默认分数
      let defaultScore = 2; // 基础分数
      if (q.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) defaultScore = 3;
      if (q.questionType === QuestionTypeEnum.ESSAY) defaultScore = 5;
      
      return {
        ...q,
        examId: 0, // 创建新考试，暂时设为0
        questionScore: defaultScore,
        sort: examQuestions.length + index + 1
      };
    });
    
    setExamQuestions([...examQuestions, ...newExamQuestions]);
    setQuestionPoolVisible(false);
    message.success(`已添加 ${newQuestions.length} 道题目`);
    
    // 更新总分
    updateTotalScore([...examQuestions, ...newExamQuestions]);
    
    // 清空选择
    setSelectedQuestionIds([]);
  };
  
  // 更新考试总分
  const updateTotalScore = (questions: ExamQuestionType[]) => {
    const totalScore = questions.reduce((sum, q) => sum + q.questionScore, 0);
    form.setFieldsValue({ totalScore });
  };
  
  // 删除题目
  const handleRemoveQuestion = (questionId: number) => {
    const newQuestions = examQuestions.filter(q => q.questionId !== questionId);
    
    // 重新排序
    const sortedQuestions = newQuestions.map((q, index) => ({
      ...q,
      sort: index + 1
    }));
    
    setExamQuestions(sortedQuestions);
    updateTotalScore(sortedQuestions);
  };
  
  // 修改题目分数
  const handleScoreChange = (questionId: number, score: number) => {
    const newQuestions = examQuestions.map(q => 
      q.questionId === questionId ? { ...q, questionScore: score } : q
    );
    setExamQuestions(newQuestions);
    updateTotalScore(newQuestions);
  };
  
  // 预览题目
  const handlePreviewQuestion = (question: QuestionType) => {
    setSelectedQuestion(question);
    setQuestionPreviewVisible(true);
  };
  
  // 提交表单
  const handleSubmit = async (values: any) => {
    if (examQuestions.length === 0) {
      message.error('请至少添加一道题目');
      return;
    }
    
    setLoading(true);
    
    // 处理时间 - 使用ISO格式以符合Java的LocalDateTime要求
    const startTime = values.timeRange[0].toISOString();
    const endTime = values.timeRange[1].toISOString();
    
    // 构建考试数据
    const examData = {
      examName: values.name,
      examDesc: values.description,
      examStartTime: startTime,
      examEndTime: endTime,
      duration: values.duration,
      totalScore: values.totalScore,
      passScore: values.passScore,
      questions: examQuestions.map(q => ({
        examQuestionId: null, // 新增题目，examQuestionId为null
        examId: null, // 新增考试，examId为null
        questionId: q.questionId,
        questionScore: q.questionScore
      }))
    };
    
    console.log('提交的考试数据:', examData);
    
    try {
      const result = await createExam(examData);
      
      if (result.success) {
        message.success('考试创建成功');
        navigate('/admin/exams');
      } else {
        message.error(result.message || '创建考试失败');
      }
    } catch (error) {
      console.error('提交表单错误:', error);
      message.error('创建考试失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 返回考试列表
  const handleBack = () => {
    navigate('/admin/exams');
  };
  
  // 题目表格列
  const questionColumns: ColumnsType<ExamQuestionType> = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
    },
    {
      title: '题型',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 100,
      render: (type) => (
        <Tag color={questionTypeMap[type]?.color}>
          {questionTypeMap[type]?.text}
        </Tag>
      )
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty) => (
        <Tag color={difficultyMap[difficulty]?.color}>
          {difficultyMap[difficulty]?.text}
        </Tag>
      )
    },
    {
      title: '题目内容',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
      render: (text, record) => (
        <a onClick={() => handlePreviewQuestion(record)}>{text}</a>
      )
    },
    {
      title: '分值',
      dataIndex: 'questionScore',
      key: 'questionScore',
      width: 100,
      render: (score, record) => (
        <InputNumber
          min={1}
          value={score}
          onChange={(value) => handleScoreChange(record.questionId, value as number)}
          style={{ width: 60 }}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleRemoveQuestion(record.questionId)}
        />
      ),
    },
  ];
  
  // 题库题目表格列
  const poolQuestionColumns: ColumnsType<QuestionType> = [
    {
      title: '题型',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 100,
      render: (type) => (
        <Tag color={questionTypeMap[type]?.color}>
          {questionTypeMap[type]?.text}
        </Tag>
      )
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty) => (
        <Tag color={difficultyMap[difficulty]?.color}>
          {difficultyMap[difficulty]?.text}
        </Tag>
      )
    },
    {
      title: '题目内容',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
      render: (text, record) => (
        <a onClick={() => handlePreviewQuestion(record)}>{text}</a>
      )
    },
  ];
  
  // 渲染题目预览
  const renderQuestionPreview = () => {
    if (!selectedQuestion) return null;
    
    const { questionType, questionText, options, answer, analysis } = selectedQuestion;
    
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Tag color={questionTypeMap[questionType]?.color}>
            {questionTypeMap[questionType]?.text}
          </Tag>
          <Tag color={difficultyMap[selectedQuestion.difficulty]?.color}>
            {difficultyMap[selectedQuestion.difficulty]?.text}
          </Tag>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <div dangerouslySetInnerHTML={{ __html: questionText }} />
        </div>
        
        {(questionType === QuestionTypeEnum.SINGLE_CHOICE || questionType === QuestionTypeEnum.MULTIPLE_CHOICE) && (
          <div style={{ marginBottom: 16 }}>
            {options?.map((option) => (
              <div key={option.optionKey} style={{ marginBottom: 8 }}>
                {questionType === QuestionTypeEnum.SINGLE_CHOICE ? (
                  <Radio 
                    checked={option.isCorrect} 
                    disabled
                    style={{ marginRight: 8 }}
                  />
                ) : (
                  <Checkbox
                    checked={option.isCorrect}
                    disabled
                    style={{ marginRight: 8 }}
                  />
                )}
                {option.optionKey}. {option.optionValue}
              </div>
            ))}
          </div>
        )}
        
        {questionType === QuestionTypeEnum.JUDGE && (
          <div style={{ marginBottom: 16 }}>
            <Radio.Group disabled value={answer === 'T' ? 'T' : 'F'}>
              <Radio value="T">正确</Radio>
              <Radio value="F">错误</Radio>
            </Radio.Group>
          </div>
        )}
        
        {questionType === QuestionTypeEnum.FILL_BLANK && (
          <div style={{ marginBottom: 16 }}>
            <Input placeholder="填空题答案" disabled value={answer} />
          </div>
        )}
        
        {questionType === QuestionTypeEnum.ESSAY && (
          <div style={{ marginBottom: 16 }}>
            <TextArea placeholder="问答题答案" disabled value={answer} rows={4} />
          </div>
        )}
        
        <Divider orientation="left">参考答案</Divider>
        <div style={{ marginBottom: 16 }}>
          <Text strong>答案：</Text>
          <Text>{answer}</Text>
        </div>
        
        <div>
          <Text strong>解析：</Text>
          <div dangerouslySetInnerHTML={{ __html: analysis }} />
        </div>
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <Card 
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
            <span>创建考试</span>
          </Space>
        }
        extra={
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            <SaveOutlined /> 保存考试
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            duration: 120,
            passScore: 60,
            totalScore: 100,
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="考试名称"
                rules={[{ required: true, message: '请输入考试名称' }]}
              >
                <Input placeholder="请输入考试名称" maxLength={50} />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name="description"
                label="考试描述"
                rules={[{ required: true, message: '请输入考试描述' }]}
              >
                <TextArea 
                  placeholder="请输入考试描述，包括考试范围、注意事项等" 
                  rows={4} 
                  maxLength={500} 
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
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
            
            <Col xs={24} md={12}>
              <Form.Item
                name="duration"
                label="考试时长（分钟）"
                rules={[{ required: true, message: '请输入考试时长' }]}
                tooltip="学生进入考试后的答题时间限制"
              >
                <InputNumber min={1} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="totalScore"
                label="考试总分"
                rules={[{ required: true, message: '请输入考试总分' }]}
              >
                <InputNumber 
                  min={1} 
                  disabled 
                  style={{ width: '100%' }} 
                  addonAfter="分"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="passScore"
                label="及格分数"
                rules={[{ required: true, message: '请输入及格分数' }]}
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }} 
                  addonAfter="分"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">考试题目</Divider>
          
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenQuestionPool}
              >
                从题库添加题目
              </Button>
              <Text>已选择 {examQuestions.length} 道题目</Text>
              <Text>总分: {examQuestions.reduce((sum, q) => sum + q.questionScore, 0)} 分</Text>
            </Space>
          </div>
          
          <Table
            columns={questionColumns}
            dataSource={examQuestions}
            rowKey="questionId"
            pagination={false}
            scroll={{ y: 400 }}
            loading={loading}
            locale={{ emptyText: '请点击上方按钮从题库添加题目' }}
          />
        </Form>
      </Card>
      
      {/* 选择题目对话框 */}
      <Modal
        title="从题库选择题目"
        open={questionPoolVisible}
        width={900}
        onCancel={handleCloseQuestionPool}
        footer={[
          <Button key="cancel" onClick={handleCloseQuestionPool}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSelectQuestions}
            disabled={selectedQuestionIds.length === 0}
          >
            添加所选题目 ({selectedQuestionIds.length})
          </Button>,
        ]}
      >
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearchQuestions}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword">
            <Input
              placeholder="搜索题目内容"
              allowClear
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="type">
            <Select placeholder="题目类型" allowClear style={{ width: 120 }}>
              <Option value={QuestionTypeEnum.SINGLE_CHOICE}>单选题</Option>
              <Option value={QuestionTypeEnum.MULTIPLE_CHOICE}>多选题</Option>
              <Option value={QuestionTypeEnum.JUDGE}>判断题</Option>
              <Option value={QuestionTypeEnum.FILL_BLANK}>填空题</Option>
              <Option value={QuestionTypeEnum.ESSAY}>问答题</Option>
            </Select>
          </Form.Item>
          <Form.Item name="difficulty">
            <Select placeholder="难度" allowClear style={{ width: 120 }}>
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleResetSearch}>
              重置
            </Button>
          </Form.Item>
        </Form>
        
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedQuestionIds,
            onChange: (selectedRowKeys) => {
              setSelectedQuestionIds(selectedRowKeys as number[]);
            },
            getCheckboxProps: (record) => ({
              disabled: examQuestions.some(q => q.questionId === record.questionId),
            }),
          }}
          columns={poolQuestionColumns}
          dataSource={filteredQuestions}
          rowKey="questionId"
          loading={questionLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 400 }}
          size="small"
        />
      </Modal>
      
      {/* 预览题目对话框 */}
      <Modal
        title="题目预览"
        open={questionPreviewVisible}
        onCancel={() => setQuestionPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQuestionPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {renderQuestionPreview()}
      </Modal>
    </AdminLayout>
  );
};

export default ExamCreate; 