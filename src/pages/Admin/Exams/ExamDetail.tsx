import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Descriptions,
  Table,
  Tag,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  Row,
  Col,
  Divider,
  message,
  Tabs,
  Tooltip,
  Typography,
  Popconfirm
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  PrinterOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import { 
  getExamDetail, 
  getExamQuestions, 
  updateExamQuestions, 
  getExamStatistics 
} from '../../../api/adminApi';
import { QuestionType as QuestionTypeEnum, ExamStatus } from '../../../types/exam';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

// 考试类型定义
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

// 考试题目类型
interface ExamQuestionType {
  id: number;
  examId: number;
  questionId: number;
  score: number;
  sort: number;
  type: QuestionTypeEnum;
  content: string;
  answer: string;
  options?: { id: string; content: string }[];
  analysis?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 候选题目类型
interface QuestionType {
  questionId: number;
  questionText: string;
  questionType: QuestionTypeEnum;
  options?: { optionKey: string; optionValue: string; isCorrect: boolean }[];
  answer: string;
  analysis?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createTime?: string;
  updateTime?: string;
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

// 状态映射
const statusMap: Record<number, { text: string; color: string }> = {
  [ExamStatus.UPCOMING]: { text: '即将开始', color: 'blue' },
  [ExamStatus.ONGOING]: { text: '进行中', color: 'green' },
  [ExamStatus.ENDED]: { text: '已结束', color: 'red' }
};

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
  status: number;
  createAt: string;
  updateAt: string;
  creatorId: number;
  creatorName: string;
  participantCount: number;
  questions?: BackendQuestionType[];
}

// 从后端返回的题目数据结构
interface BackendQuestionType {
  examQuestionId: number | null;
  questionId: number;
  knowledgePoint: string;
  questionText: string;
  questionType: number;
  difficultyLevel: number;
  knowledgePoints?: {
    knowledgePointId: number;
    name: string;
    description: string;
  }[];
  questionScore: number;
  options?: {
    optionId: number;
    questionId: number;
    optionKey: string;
    optionValue: string;
    createdAt: string;
    updatedAt: string;
  }[];
  userAnswer: string | null;
  isCorrect: boolean | null;
}

const ExamDetail: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const examIdNum = parseInt(examId || '1');
  
  const [exam, setExam] = useState<ExamType | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  
  // 添加题目相关状态
  const [addQuestionVisible, setAddQuestionVisible] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionType[]>([]);
  const [availableQuestionsLoading, setAvailableQuestionsLoading] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [questionDefaultScore, setQuestionDefaultScore] = useState(3);
  
  // 编辑题目相关状态
  const [editScoreVisible, setEditScoreVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<ExamQuestionType | null>(null);
  const [scoreForm] = Form.useForm();

  useEffect(() => {
    fetchExamDetail();
    fetchExamQuestions();
  }, [examIdNum]);

  // 获取考试详情
  const fetchExamDetail = async () => {
    setLoading(true);
    try {
      const result = await getExamDetail(examIdNum);
      if (result.success) {
        const backendData = result.data as BackendExamType;
        
        // 转换为组件需要的数据格式
        const formattedExam: ExamType = {
          examId: backendData.examId,
          name: backendData.examName,
          description: backendData.examDesc,
          startTime: backendData.examStartTime,
          endTime: backendData.examEndTime,
          duration: backendData.duration,
          totalScore: backendData.totalScore,
          status: backendData.status,
          questionCount: backendData.questions?.length || 0,
          participantCount: backendData.participantCount,
          createTime: backendData.createAt,
          updateTime: backendData.updateAt,
          creatorName: backendData.creatorName,
          passScore: backendData.passScore
        };
        
        setExam(formattedExam);
        
        // 如果后端直接返回了题目数据，直接处理
        if (backendData.questions && backendData.questions.length > 0) {
          const formattedQuestions = formatBackendQuestions(backendData.questions);
          setExamQuestions(formattedQuestions);
          setQuestionsLoading(false);
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('获取考试详情失败:', error);
      message.error('获取考试详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 将后端题目数据转换为组件需要的格式
  const formatBackendQuestions = (backendQuestions: BackendQuestionType[]): ExamQuestionType[] => {
    return backendQuestions.map((q, index) => ({
      id: q.questionId,
      examId: examIdNum,
      questionId: q.questionId,
      score: q.questionScore,
      sort: index + 1,
      type: q.questionType,
      content: q.questionText,
      answer: '', // 后端返回中似乎没有正确答案
      options: q.options?.map(o => ({ id: o.optionKey, content: o.optionValue })),
      analysis: '',
      difficulty: mapDifficultyLevel(q.difficultyLevel)
    }));
  };

  // 难度级别映射函数
  const mapDifficultyLevel = (level: number): 'easy' | 'medium' | 'hard' => {
    switch (level) {
      case 0: return 'easy';
      case 1: return 'medium';
      case 2:
      case 3:
      case 4:
      default: return 'hard';
    }
  };

  // 获取考试题目
  const fetchExamQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const result = await getExamQuestions(examIdNum);
      if (result.success) {
        setExamQuestions(result.data || []);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('获取考试题目失败:', error);
      message.error('获取考试题目失败');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // 加载可用题目
  const loadAvailableQuestions = () => {
    setAvailableQuestionsLoading(true);
    // TODO: 从API获取可用题目
    setTimeout(() => {
      const mockQuestions = getMockAvailableQuestions();
      setAvailableQuestions(mockQuestions);
      setAvailableQuestionsLoading(false);
    }, 500);
  };

  // 打开添加题目对话框
  const handleOpenAddQuestion = () => {
    setAddQuestionVisible(true);
    loadAvailableQuestions();
    setSelectedQuestionIds([]);
  };

  // 确认添加题目
  const handleConfirmAddQuestions = async () => {
    if (selectedQuestionIds.length === 0) {
      message.warning('请选择至少一道题目');
      return;
    }

    setQuestionsLoading(true);
    
    try {
      // 构建要添加的题目
      const selectedQuestions = availableQuestions.filter(q => 
        selectedQuestionIds.includes(q.questionId)
      );
      
      const newExamQuestions = [
        ...examQuestions,
        ...selectedQuestions.map((q, index) => ({
          id: Math.max(...examQuestions.map(eq => eq.id), 0) + index + 1,
          examId: examIdNum,
          questionId: q.questionId,
          score: questionDefaultScore,
          sort: examQuestions.length + index + 1,
          type: q.questionType,
          content: q.questionText,
          answer: q.answer || '',
          options: q.options?.map(o => ({ id: o.optionKey, content: o.optionValue })),
          analysis: q.analysis || '',
          difficulty: q.difficulty || 'medium'
        }))
      ];
      
      // 调用API更新考试题目
      const result = await updateExamQuestions(examIdNum, newExamQuestions);
      
      if (result.success) {
        message.success('题目添加成功');
        setAddQuestionVisible(false);
        fetchExamQuestions(); // 重新获取题目列表
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('添加题目失败:', error);
      message.error('添加题目失败');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // 删除题目
  const handleDeleteQuestion = async (questionId: number) => {
    try {
      setQuestionsLoading(true);
      
      // 过滤掉要删除的题目
      const updatedQuestions = examQuestions.filter(q => q.id !== questionId);
      
      // 重新排序
      const sortedQuestions = updatedQuestions.map((q, index) => ({
        ...q,
        sort: index + 1
      }));
      
      // 调用API更新考试题目
      const result = await updateExamQuestions(examIdNum, sortedQuestions);
      
      if (result.success) {
        message.success('题目删除成功');
        setExamQuestions(sortedQuestions);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('删除题目失败:', error);
      message.error('删除题目失败');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // 打开编辑分数对话框
  const handleEditScore = (question: ExamQuestionType) => {
    setCurrentQuestion(question);
    scoreForm.setFieldsValue({ score: question.score });
    setEditScoreVisible(true);
  };

  // 保存题目分数
  const handleSaveScore = async () => {
    try {
      const values = await scoreForm.validateFields();
      if (!currentQuestion) return;
      
      setQuestionsLoading(true);
      
      // 更新当前题目分数
      const updatedQuestions = examQuestions.map(q => 
        q.id === currentQuestion.id ? { ...q, score: values.score } : q
      );
      
      // 调用API更新考试题目
      const result = await updateExamQuestions(examIdNum, updatedQuestions);
      
      if (result.success) {
        message.success('分数更新成功');
        setEditScoreVisible(false);
        setExamQuestions(updatedQuestions);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('更新分数失败:', error);
      message.error('更新分数失败');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // 发布考试
  const handlePublishExam = () => {
    if (!exam) return;
    
    // 检查考试是否有题目
    if (examQuestions.length === 0) {
      message.warning('考试还没有添加题目，无法发布');
      return;
    }
    
    // 确认对话框
    Modal.confirm({
      title: '发布考试',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>确定要发布这个考试吗？发布后考生将可以看到此考试。</p>
          <p>考试名称: {exam.name}</p>
          <p>开始时间: {dayjs(exam.startTime).format('YYYY-MM-DD HH:mm')}</p>
          <p>结束时间: {dayjs(exam.endTime).format('YYYY-MM-DD HH:mm')}</p>
          <p>考试时长: {exam.duration}分钟</p>
          <p>题目数量: {examQuestions.length}</p>
          <p>总分值: {examQuestions.reduce((sum, q) => sum + q.score, 0)}</p>
        </div>
      ),
      okText: '发布',
      cancelText: '取消',
      onOk() {
        // TODO: 调用API发布考试
        message.success('考试已发布');
      }
    });
  };

  // 返回考试列表
  const handleBack = () => {
    navigate('/admin/exams');
  };

  // 考试题目表格列定义
  const questionsColumns: ColumnsType<ExamQuestionType> = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={questionTypeMap[type]?.color}>
          {questionTypeMap[type]?.text}
        </Tag>
      )
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '选项/答案',
      key: 'options',
      width: 200,
      render: (_, record) => {
        if (record.type === QuestionTypeEnum.SINGLE_CHOICE || record.type === QuestionTypeEnum.MULTIPLE_CHOICE) {
          return (
            <div>
              {record.options?.map(option => (
                <div key={option.id}>
                  {option.id}: {option.content}
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">答案: {record.answer}</Text>
              </div>
            </div>
          );
        } else if (record.type === QuestionTypeEnum.JUDGE) {
          return <Text type="secondary">答案: {record.answer === 'T' ? '正确' : '错误'}</Text>;
        } else {
          return <Text type="secondary">答案: {record.answer}</Text>;
        }
      }
    },
    {
      title: '分值',
      dataIndex: 'score',
      key: 'score',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditScore(record)}
          />
          <Popconfirm
            title="确定要删除这道题目吗？"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 可用题目表格列定义
  const availableQuestionsColumns: ColumnsType<QuestionType> = [
    {
      title: '类型',
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
      title: '题目内容',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty) => (
        difficulty ? (
          <Tag color={difficultyMap[difficulty]?.color}>
            {difficultyMap[difficulty]?.text}
          </Tag>
        ) : null
      )
    }
  ];

  return (
    <AdminLayout>
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
            <span>{exam?.name || '考试详情'}</span>
          </Space>
        }
        loading={loading}
        extra={
          exam?.status === ExamStatus.UPCOMING && (
            <Space>
              <Button onClick={() => navigate(`/admin/exams/edit/${examIdNum}`)}>
                <EditOutlined /> 编辑考试
              </Button>
              <Button type="primary" onClick={handlePublishExam}>
                <SaveOutlined /> 发布考试
              </Button>
            </Space>
          )
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="考试信息" key="info">
            {exam && (
              <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="考试名称">{exam.name}</Descriptions.Item>
                <Descriptions.Item label="创建者">{exam.creatorName}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{dayjs(exam.createTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={statusMap[exam.status]?.color}>
                    {statusMap[exam.status]?.text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="开始时间">{dayjs(exam.startTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="结束时间">{dayjs(exam.endTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="考试时长">{exam.duration}分钟</Descriptions.Item>
                <Descriptions.Item label="参与人数">{exam.participantCount || 0}人</Descriptions.Item>
                <Descriptions.Item label="题目数量">{examQuestions.length}题</Descriptions.Item>
                <Descriptions.Item label="总分值">{examQuestions.reduce((sum, q) => sum + q.score, 0)}分</Descriptions.Item>
                <Descriptions.Item label="及格分数">{exam.passScore || Math.floor(examQuestions.reduce((sum, q) => sum + q.score, 0) * 0.6)}分</Descriptions.Item>
                <Descriptions.Item label="考试描述" span={4}>
                  {exam.description}
                </Descriptions.Item>
              </Descriptions>
            )}
          </TabPane>
          
          <TabPane tab="题目管理" key="questions">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleOpenAddQuestion}
                  disabled={exam?.status !== ExamStatus.UPCOMING}
                >
                  添加题目
                </Button>
                <span>总题数: {examQuestions.length}</span>
                <span>总分值: {examQuestions.reduce((sum, q) => sum + q.score, 0)}分</span>
              </Space>
            </div>
            
            <Table
              columns={questionsColumns}
              dataSource={examQuestions}
              rowKey="id"
              loading={questionsLoading}
              pagination={false}
            />
          </TabPane>
          
          <TabPane tab="统计分析" key="statistics">
            <div style={{ padding: 24, background: '#f0f2f5', minHeight: 300 }}>
              {/* TODO: 统计图表 */}
              <p>本考试尚未有学生参加或尚未统计数据。</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 添加题目对话框 */}
      <Modal
        title="添加题目"
        open={addQuestionVisible}
        width={800}
        onCancel={() => setAddQuestionVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddQuestionVisible(false)}>取消</Button>,
          <Button 
            key="add" 
            type="primary" 
            onClick={handleConfirmAddQuestions}
            disabled={selectedQuestionIds.length === 0}
          >
            添加选中的{selectedQuestionIds.length}道题目
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="每题分值" required tooltip="为所有选中的题目设置相同的分值">
            <InputNumber 
              min={1} 
              value={questionDefaultScore} 
              onChange={val => setQuestionDefaultScore(val || 1)} 
            />
          </Form.Item>
        </Form>
        
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedQuestionIds,
            onChange: keys => setSelectedQuestionIds(keys as number[])
          }}
          columns={availableQuestionsColumns}
          dataSource={availableQuestions}
          rowKey="questionId"
          loading={availableQuestionsLoading}
          pagination={{ pageSize: 10 }}
        />
      </Modal>

      {/* 编辑分数对话框 */}
      <Modal
        title="编辑题目分值"
        open={editScoreVisible}
        onCancel={() => setEditScoreVisible(false)}
        onOk={handleSaveScore}
        okText="保存"
        cancelText="取消"
      >
        <Form form={scoreForm} layout="vertical">
          <Form.Item
            name="score"
            label="分值"
            rules={[{ required: true, message: '请输入分值' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

// 获取候选题目（临时使用，后续应从API获取）
const getMockAvailableQuestions = (): QuestionType[] => {
  return Array.from({ length: 20 }).map((_, index) => {
    const qid = 200 + index;
    const type = [QuestionTypeEnum.SINGLE_CHOICE, QuestionTypeEnum.MULTIPLE_CHOICE, QuestionTypeEnum.JUDGE, QuestionTypeEnum.FILL_BLANK, QuestionTypeEnum.ESSAY][index % 5];
    const difficulty = ['easy', 'medium', 'hard'][index % 3] as 'easy' | 'medium' | 'hard';
    
    let options;
    if (type === QuestionTypeEnum.SINGLE_CHOICE || type === QuestionTypeEnum.MULTIPLE_CHOICE) {
      options = [
        { optionKey: 'A', optionValue: `选项A-${qid}`, isCorrect: true },
        { optionKey: 'B', optionValue: `选项B-${qid}`, isCorrect: type === QuestionTypeEnum.MULTIPLE_CHOICE },
        { optionKey: 'C', optionValue: `选项C-${qid}`, isCorrect: false },
        { optionKey: 'D', optionValue: `选项D-${qid}`, isCorrect: false }
      ];
    } else if (type === QuestionTypeEnum.JUDGE) {
      options = [
        { optionKey: 'T', optionValue: '正确', isCorrect: true },
        { optionKey: 'F', optionValue: '错误', isCorrect: false }
      ];
    }
    
    return {
      questionId: qid,
      questionText: `这是题库中的第${qid}题，${type === QuestionTypeEnum.SINGLE_CHOICE ? '单选题' : type === QuestionTypeEnum.MULTIPLE_CHOICE ? '多选题' : type === QuestionTypeEnum.JUDGE ? '判断题' : type === QuestionTypeEnum.FILL_BLANK ? '填空题' : '问答题'}。题目内容示例...`,
      questionType: type,
      difficulty,
      options,
      answer: type === QuestionTypeEnum.SINGLE_CHOICE ? 'A' : type === QuestionTypeEnum.MULTIPLE_CHOICE ? 'A,B' : type === QuestionTypeEnum.JUDGE ? 'T' : `答案${qid}`,
      analysis: `本题的解析说明...`,
      tags: [`标签${index % 5 + 1}`, `标签${index % 3 + 6}`],
      createTime: '2023-05-15',
      updateTime: '2023-08-20'
    };
  });
};

export default ExamDetail; 