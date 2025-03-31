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

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

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

// 考试题目类型
interface ExamQuestionType {
  id: number;
  examId: number;
  questionId: number;
  score: number;
  sort: number;
  type: 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay';
  content: string;
  answer: string;
  options?: { id: string; content: string }[];
  analysis?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 候选题目类型
interface QuestionType {
  id: number;
  content: string;
  type: 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  options?: { id: string; content: string; isCorrect: boolean }[];
  answer: string;
  analysis: string;
  tags: string[];
  createTime: string;
  updateTime: string;
}

// 模拟考试数据
const getMockExam = (id: number): ExamType => {
  return {
    id,
    title: `考试${id}：${['政治模拟测试', '英语词汇测试', '数学综合测试', '专业课模拟考'][id % 4]}`,
    description: `这是${['政治', '英语', '数学', '专业课'][id % 4]}模拟考试的详细描述，包含考试范围、要求等信息...`,
    category: ['政治', '英语', '数学', '专业课'][id % 4],
    startTime: '2023-12-01 09:00:00',
    endTime: '2023-12-31 18:00:00',
    duration: 120,
    totalScore: 100,
    passingScore: 60,
    questionsCount: Math.floor(Math.random() * 20) + 10,
    participants: Math.floor(Math.random() * 1000),
    status: ['draft', 'published', 'ongoing', 'ended'][id % 4] as 'draft' | 'published' | 'ongoing' | 'ended',
    createdAt: '2023-10-15 14:30:00',
    updatedAt: '2023-11-01 10:15:00',
    isPublic: true,
    creator: `讲师${id % 5 + 1}`
  };
};

// 模拟考试题目数据
const getMockExamQuestions = (examId: number): ExamQuestionType[] => {
  const count = Math.floor(Math.random() * 15) + 5;
  return Array.from({ length: count }).map((_, index) => {
    const qid = index + 1;
    const type = ['single', 'multiple', 'judge', 'fillBlank', 'essay'][index % 5] as 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay';
    const difficulty = ['easy', 'medium', 'hard'][index % 3] as 'easy' | 'medium' | 'hard';
    
    let options;
    if (type === 'single' || type === 'multiple') {
      options = [
        { id: 'A', content: `选项A-${qid}` },
        { id: 'B', content: `选项B-${qid}` },
        { id: 'C', content: `选项C-${qid}` },
        { id: 'D', content: `选项D-${qid}` }
      ];
    } else if (type === 'judge') {
      options = [
        { id: 'T', content: '正确' },
        { id: 'F', content: '错误' }
      ];
    }
    
    return {
      id: qid,
      examId,
      questionId: 100 + qid,
      score: type === 'essay' ? 10 : type === 'multiple' ? 5 : 3,
      sort: qid,
      type,
      content: `这是第${qid}题，${type === 'single' ? '单选题' : type === 'multiple' ? '多选题' : type === 'judge' ? '判断题' : type === 'fillBlank' ? '填空题' : '问答题'}。题目内容: ${['政治', '英语', '数学', '专业课'][examId % 4]}考试题目示例...`,
      answer: type === 'single' ? 'A' : type === 'multiple' ? 'A,B' : type === 'judge' ? 'T' : `答案${qid}`,
      options,
      analysis: `本题考察了${['基础知识点', '计算能力', '分析能力', '理解能力'][qid % 4]}，解题关键在于...`,
      difficulty
    };
  });
};

// 获取候选题目
const getMockAvailableQuestions = (): QuestionType[] => {
  return Array.from({ length: 20 }).map((_, index) => {
    const qid = 200 + index;
    const type = ['single', 'multiple', 'judge', 'fillBlank', 'essay'][index % 5] as 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay';
    const difficulty = ['easy', 'medium', 'hard'][index % 3] as 'easy' | 'medium' | 'hard';
    
    let options;
    if (type === 'single' || type === 'multiple') {
      options = [
        { id: 'A', content: `选项A-${qid}`, isCorrect: true },
        { id: 'B', content: `选项B-${qid}`, isCorrect: type === 'multiple' },
        { id: 'C', content: `选项C-${qid}`, isCorrect: false },
        { id: 'D', content: `选项D-${qid}`, isCorrect: false }
      ];
    } else if (type === 'judge') {
      options = [
        { id: 'T', content: '正确', isCorrect: true },
        { id: 'F', content: '错误', isCorrect: false }
      ];
    }
    
    return {
      id: qid,
      content: `这是题库中的第${qid}题，${type === 'single' ? '单选题' : type === 'multiple' ? '多选题' : type === 'judge' ? '判断题' : type === 'fillBlank' ? '填空题' : '问答题'}。题目内容示例...`,
      type,
      difficulty,
      options,
      answer: type === 'single' ? 'A' : type === 'multiple' ? 'A,B' : type === 'judge' ? 'T' : `答案${qid}`,
      analysis: `本题的解析说明...`,
      tags: [`标签${index % 5 + 1}`, `标签${index % 3 + 6}`],
      createTime: '2023-05-15',
      updateTime: '2023-08-20'
    };
  });
};

// 题目类型映射
const questionTypeMap = {
  single: { text: '单选题', color: 'blue' },
  multiple: { text: '多选题', color: 'purple' },
  judge: { text: '判断题', color: 'cyan' },
  fillBlank: { text: '填空题', color: 'orange' },
  essay: { text: '问答题', color: 'green' }
};

// 难度级别映射
const difficultyMap = {
  easy: { text: '简单', color: 'success' },
  medium: { text: '中等', color: 'warning' },
  hard: { text: '困难', color: 'error' }
};

// 状态映射
const statusMap = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'blue' },
  ongoing: { text: '进行中', color: 'green' },
  ended: { text: '已结束', color: 'red' }
};

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
  const fetchExamDetail = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const examData = getMockExam(examIdNum);
      setExam(examData);
      setLoading(false);
    }, 500);
  };

  // 获取考试题目
  const fetchExamQuestions = () => {
    setQuestionsLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const questions = getMockExamQuestions(examIdNum);
      setExamQuestions(questions);
      setQuestionsLoading(false);
    }, 800);
  };

  // 加载可用题目
  const loadAvailableQuestions = () => {
    setAvailableQuestionsLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const questions = getMockAvailableQuestions();
      setAvailableQuestions(questions);
      setAvailableQuestionsLoading(false);
    }, 1000);
  };

  // 打开添加题目弹窗
  const handleOpenAddQuestion = () => {
    setSelectedQuestionIds([]);
    loadAvailableQuestions();
    setAddQuestionVisible(true);
  };

  // 确认添加题目
  const handleConfirmAddQuestions = () => {
    if (selectedQuestionIds.length === 0) {
      message.warning('请至少选择一道题目');
      return;
    }

    // 模拟添加题目到考试
    const selectedQuestions = availableQuestions.filter(q => selectedQuestionIds.includes(q.id));
    const newExamQuestions = selectedQuestions.map((q, index) => {
      const existingCount = examQuestions.length;
      return {
        id: existingCount + index + 1,
        examId: examIdNum,
        questionId: q.id,
        score: q.type === 'essay' ? questionDefaultScore * 2 : q.type === 'multiple' ? questionDefaultScore * 1.5 : questionDefaultScore,
        sort: existingCount + index + 1,
        type: q.type,
        content: q.content,
        answer: q.answer,
        options: q.options,
        analysis: q.analysis,
        difficulty: q.difficulty
      };
    });

    setExamQuestions([...examQuestions, ...newExamQuestions]);
    if (exam) {
      setExam({
        ...exam,
        questionsCount: exam.questionsCount + selectedQuestionIds.length,
        updatedAt: new Date().toLocaleString()
      });
    }
    message.success(`已添加 ${selectedQuestionIds.length} 道题目`);
    setAddQuestionVisible(false);
  };

  // 删除考试题目
  const handleDeleteQuestion = (questionId: number) => {
    // 模拟API请求
    setTimeout(() => {
      setExamQuestions(prevQuestions => {
        const newQuestions = prevQuestions.filter(q => q.id !== questionId);
        
        // 更新排序
        const updatedQuestions = newQuestions.map((q, index) => ({
          ...q,
          sort: index + 1
        }));
        
        return updatedQuestions;
      });
      
      if (exam) {
        setExam({
          ...exam,
          questionsCount: exam.questionsCount - 1,
          updatedAt: new Date().toLocaleString()
        });
      }
      
      message.success('题目已从考试中移除');
    }, 500);
  };

  // 编辑题目分数
  const handleEditScore = (question: ExamQuestionType) => {
    setCurrentQuestion(question);
    scoreForm.setFieldsValue({ score: question.score });
    setEditScoreVisible(true);
  };

  // 保存题目分数
  const handleSaveScore = () => {
    scoreForm.validateFields().then(values => {
      if (!currentQuestion) return;

      setExamQuestions(prevQuestions => 
        prevQuestions.map(q => q.id === currentQuestion.id ? { ...q, score: values.score } : q)
      );
      
      message.success('题目分数已更新');
      setEditScoreVisible(false);
      setCurrentQuestion(null);
    });
  };

  // 发布考试
  const handlePublishExam = () => {
    if (!exam) return;
    
    if (examQuestions.length === 0) {
      message.error('考试题目为空，请先添加题目再发布考试');
      return;
    }
    
    // 计算总分
    const totalScore = examQuestions.reduce((sum, q) => sum + q.score, 0);
    
    // 显示确认对话框
    Modal.confirm({
      title: '确认发布考试',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>发布后考试将对学生可见，确定要发布吗？</p>
          <p>
            <Text>考试题目数：</Text>
            <Text strong>{examQuestions.length}</Text>
          </p>
          <p>
            <Text>考试总分：</Text>
            <Text strong>{totalScore}</Text> 
            {totalScore !== exam.totalScore && (
              <Text type="warning"> (与设置总分 {exam.totalScore} 不一致)</Text>
            )}
          </p>
        </div>
      ),
      okText: '确认发布',
      cancelText: '取消',
      onOk() {
        // 模拟API请求
        setTimeout(() => {
          setExam({
            ...exam,
            status: 'published',
            totalScore,
            updatedAt: new Date().toLocaleString()
          });
          message.success('考试已发布');
        }, 1000);
      }
    });
  };

  // 返回考试列表
  const handleBack = () => {
    navigate('/admin/exams');
  };

  // 候选题目表格列
  const availableQuestionsColumns: ColumnsType<QuestionType> = [
    {
      title: '题目ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '题目类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay') => <Tag color={questionTypeMap[type].color}>{questionTypeMap[type].text}</Tag>
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty: 'easy' | 'medium' | 'hard') => (
        <Tag color={difficultyMap[difficulty].color}>{difficultyMap[difficulty].text}</Tag>
      )
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
        </Space>
      )
    }
  ];

  // 考试题目表格列
  const examQuestionsColumns: ColumnsType<ExamQuestionType> = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width: 60
    },
    {
      title: '题目类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'single' | 'multiple' | 'judge' | 'fillBlank' | 'essay') => <Tag color={questionTypeMap[type].color}>{questionTypeMap[type].text}</Tag>
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty: 'easy' | 'medium' | 'hard') => (
        <Tag color={difficultyMap[difficulty].color}>{difficultyMap[difficulty].text}</Tag>
      )
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: '分值',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score) => <Text strong>{score}</Text>
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEditScore(record)}
            disabled={exam?.status !== 'draft'}
          >
            编辑分值
          </Button>
          <Popconfirm
            title="确定从考试中移除此题目吗？"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={exam?.status !== 'draft'}
          >
            <Button 
              type="link" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              disabled={exam?.status !== 'draft'}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <AdminLayout>
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
            考试详情
          </Space>
        }
        extra={
          <Space>
            {exam?.status === 'draft' && (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => message.success('考试已保存')}
                >
                  保存
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handlePublishExam}
                >
                  发布考试
                </Button>
              </>
            )}
            <Button icon={<PrinterOutlined />}>导出考卷</Button>
            <Button icon={<SettingOutlined />}>考试设置</Button>
          </Space>
        }
        loading={loading}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="考试信息" key="info">
            {exam && (
              <Descriptions bordered column={2}>
                <Descriptions.Item label="考试名称" span={2}>{exam.title}</Descriptions.Item>
                <Descriptions.Item label="考试类别">{exam.category}</Descriptions.Item>
                <Descriptions.Item label="考试状态">
                  <Tag color={statusMap[exam.status].color}>{statusMap[exam.status].text}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="开始时间">{exam.startTime}</Descriptions.Item>
                <Descriptions.Item label="结束时间">{exam.endTime}</Descriptions.Item>
                <Descriptions.Item label="考试时长">{exam.duration} 分钟</Descriptions.Item>
                <Descriptions.Item label="题目数量">{exam.questionsCount}</Descriptions.Item>
                <Descriptions.Item label="总分值">{exam.totalScore}</Descriptions.Item>
                <Descriptions.Item label="及格分数">{exam.passingScore}</Descriptions.Item>
                <Descriptions.Item label="创建者">{exam.creator}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{exam.createdAt}</Descriptions.Item>
                <Descriptions.Item label="可见性">{exam.isPublic ? '公开' : '私有'}</Descriptions.Item>
                <Descriptions.Item label="参与人数">{exam.participants}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{exam.updatedAt}</Descriptions.Item>
                <Descriptions.Item label="考试描述" span={2}>{exam.description}</Descriptions.Item>
              </Descriptions>
            )}
          </TabPane>
          
          <TabPane tab="考试题目" key="questions">
            <div style={{ marginBottom: 16 }}>
              {exam?.status === 'draft' && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenAddQuestion}
                >
                  添加题目
                </Button>
              )}
              {examQuestions.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text>题目总数：{examQuestions.length}</Text>
                  <Divider type="vertical" />
                  <Text>总分值：{examQuestions.reduce((sum, q) => sum + q.score, 0)}</Text>
                  
                  {examQuestions.reduce((sum, q) => sum + q.score, 0) !== (exam?.totalScore || 0) && (
                    <Text type="warning" style={{ marginLeft: 8 }}>
                      (注意：当前总分值与考试设置的总分值不一致)
                    </Text>
                  )}
                </div>
              )}
            </div>
            
            <Table
              columns={examQuestionsColumns}
              dataSource={examQuestions}
              rowKey="id"
              loading={questionsLoading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 添加题目弹窗 */}
      <Modal
        title="添加题目"
        visible={addQuestionVisible}
        onCancel={() => setAddQuestionVisible(false)}
        width={900}
        onOk={handleConfirmAddQuestions}
      >
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="默认题目分值">
            <InputNumber 
              min={0.5} 
              max={100} 
              step={0.5} 
              value={questionDefaultScore} 
              onChange={value => setQuestionDefaultScore(Number(value) || 3)} 
            />
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (单选题×1，多选题×1.5，问答题×2)
            </Text>
          </Form.Item>
        </Form>
        
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedQuestionIds,
            onChange: (selectedRowKeys) => {
              setSelectedQuestionIds(selectedRowKeys as number[]);
            }
          }}
          columns={availableQuestionsColumns}
          dataSource={availableQuestions}
          rowKey="id"
          loading={availableQuestionsLoading}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
      
      {/* 编辑分值弹窗 */}
      <Modal
        title="编辑题目分值"
        visible={editScoreVisible}
        onCancel={() => {
          setEditScoreVisible(false);
          setCurrentQuestion(null);
        }}
        onOk={handleSaveScore}
      >
        <Form form={scoreForm}>
          <Form.Item
            name="score"
            label="分值"
            rules={[{ required: true, message: '请输入分值' }]}
          >
            <InputNumber min={0.5} max={100} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default ExamDetail; 