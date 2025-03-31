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
  Divider,
  Typography,
  Badge,
  Tabs,
  Radio
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ImportOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 题目类型定义
interface QuestionOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

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
}

// 题目数据 (模拟)
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

const QuestionsList: React.FC = () => {
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // 初始化数据
  useEffect(() => {
    fetchQuestions();
  }, [pagination.current, pagination.pageSize]);

  // 获取题目列表
  const fetchQuestions = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const allQuestions = generateMockQuestions();
      const { current, pageSize } = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      const paginatedQuestions = allQuestions.slice(startIndex, endIndex);
      
      setQuestions(paginatedQuestions);
      setPagination({
        ...pagination,
        total: allQuestions.length
      });
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const allQuestions = generateMockQuestions();
      let filteredQuestions = [...allQuestions];
      
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filteredQuestions = filteredQuestions.filter(q => 
          q.content.toLowerCase().includes(keyword) || 
          q.analysis.toLowerCase().includes(keyword)
        );
      }
      
      if (values.type) {
        filteredQuestions = filteredQuestions.filter(q => q.type === values.type);
      }
      
      if (values.difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === values.difficulty);
      }
      
      const { pageSize } = pagination;
      const paginatedQuestions = filteredQuestions.slice(0, pageSize);
      
      setQuestions(paginatedQuestions);
      setPagination({
        ...pagination,
        current: 1,
        total: filteredQuestions.length
      });
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetchQuestions();
  };

  // 处理表格分页变化
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // 预览题目
  const handlePreview = (question: QuestionType) => {
    setSelectedQuestion(question);
    setPreviewVisible(true);
  };

  // 添加或编辑题目
  const handleAddOrEdit = (question?: QuestionType) => {
    if (question) {
      // 编辑现有题目
      setSelectedQuestion(question);
      questionForm.setFieldsValue({
        content: question.content,
        type: question.type,
        difficulty: question.difficulty,
        options: question.options,
        answer: question.answer,
        analysis: question.analysis,
        tags: question.tags,
        source: question.source,
        knowPoints: question.knowPoints
      });
    } else {
      // 添加新题目
      setSelectedQuestion(null);
      questionForm.resetFields();
    }
    setEditVisible(true);
  };

  // 保存题目
  const saveQuestion = () => {
    questionForm.validateFields().then(values => {
      setSaveLoading(true);
      // 模拟API请求
      setTimeout(() => {
        if (selectedQuestion) {
          // 更新题目
          const updatedQuestion = {
            ...selectedQuestion,
            ...values,
            updateTime: new Date().toISOString().split('T')[0]
          };
          setQuestions(prevQuestions => 
            prevQuestions.map(q => q.id === selectedQuestion.id ? updatedQuestion : q)
          );
          message.success('题目已更新');
        } else {
          // 添加新题目
          const newQuestion: QuestionType = {
            id: Math.max(...questions.map(q => q.id), 0) + 1,
            ...values,
            createTime: new Date().toISOString().split('T')[0],
            updateTime: new Date().toISOString().split('T')[0]
          };
          setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
          message.success('题目已添加');
        }
        setEditVisible(false);
        setSaveLoading(false);
      }, 800);
    });
  };

  // 删除题目
  const handleDelete = (id: number) => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
      message.success('题目已删除');
      setLoading(false);
    }, 500);
  };

  // 表格列定义
  const columns: ColumnsType<QuestionType> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Space size={4} style={{ marginTop: 4 }}>
            <Tag color={questionTypeMap[record.type].color}>
              {questionTypeMap[record.type].text}
            </Tag>
            <Tag color={difficultyMap[record.difficulty].color}>
              {difficultyMap[record.difficulty].text}
            </Tag>
          </Space>
        </div>
      )
    },
    {
      title: '答案',
      dataIndex: 'answer',
      key: 'answer',
      width: 150,
      ellipsis: true
    },
    {
      title: '知识点',
      dataIndex: 'knowPoints',
      key: 'knowPoints',
      width: 150,
      render: (knowPoints: string[]) => (
        <Space size={[0, 4]} wrap>
          {knowPoints.map(point => (
            <Tag key={point}>{point}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 110
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Tooltip title="预览">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleAddOrEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除此题目吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  // 渲染题目预览内容
  const renderQuestionPreview = () => {
    if (!selectedQuestion) return null;
    
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Space size={8}>
            <Tag color={questionTypeMap[selectedQuestion.type].color}>
              {questionTypeMap[selectedQuestion.type].text}
            </Tag>
            <Tag color={difficultyMap[selectedQuestion.difficulty].color}>
              {difficultyMap[selectedQuestion.difficulty].text}
            </Tag>
            {selectedQuestion.tags.map(tag => (
              <Tag key={tag} color="blue">{tag}</Tag>
            ))}
          </Space>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>题目内容：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.content}</div>
        </div>
        
        {['single', 'multiple', 'judge'].includes(selectedQuestion.type) && (
          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong>选项：</Typography.Text>
            <div style={{ marginTop: 8 }}>
              {selectedQuestion.options.map(option => (
                <div key={option.id} style={{ marginBottom: 8 }}>
                  <Space>
                    {option.isCorrect ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: '#f5222d' }} />
                    )}
                    <span>{option.id}. {option.content}</span>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>答案：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.answer}</div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>解析：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.analysis}</div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>知识点：</Typography.Text>
          <div style={{ marginTop: 8 }}>
            {selectedQuestion.knowPoints.map(point => (
              <Tag key={point}>{point}</Tag>
            ))}
          </div>
        </div>
        
        <div>
          <Typography.Text strong>来源：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.source}</div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <Card
        title="题目管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddOrEdit()}>
              添加题目
            </Button>
            <Button icon={<ImportOutlined />}>批量导入</Button>
            <Button icon={<ExportOutlined />}>导出题目</Button>
          </Space>
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
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="题目内容/解析"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="type">
                <Select placeholder="题目类型" allowClear>
                  <Option value="single">单选题</Option>
                  <Option value="multiple">多选题</Option>
                  <Option value="judge">判断题</Option>
                  <Option value="fillBlank">填空题</Option>
                  <Option value="essay">问答题</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="difficulty">
                <Select placeholder="难度等级" allowClear>
                  <Option value="easy">简单</Option>
                  <Option value="medium">中等</Option>
                  <Option value="hard">困难</Option>
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

        {/* 题目列表 */}
        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />

        {/* 题目预览弹窗 */}
        <Modal
          title="题目预览"
          visible={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="back" onClick={() => setPreviewVisible(false)}>关闭</Button>,
            <Button 
              key="edit" 
              type="primary" 
              onClick={() => {
                setPreviewVisible(false);
                if (selectedQuestion) {
                  handleAddOrEdit(selectedQuestion);
                }
              }}
            >
              编辑此题
            </Button>
          ]}
          width={700}
        >
          {renderQuestionPreview()}
        </Modal>

        {/* 添加/编辑题目弹窗 */}
        <Modal
          title={selectedQuestion ? "编辑题目" : "添加题目"}
          visible={editVisible}
          onCancel={() => setEditVisible(false)}
          onOk={saveQuestion}
          confirmLoading={saveLoading}
          width={800}
          maskClosable={false}
        >
          <Form
            form={questionForm}
            layout="vertical"
            initialValues={{
              type: 'single',
              difficulty: 'medium',
              options: [
                { id: 'A', content: '', isCorrect: false },
                { id: 'B', content: '', isCorrect: false },
                { id: 'C', content: '', isCorrect: false },
                { id: 'D', content: '', isCorrect: false }
              ]
            }}
          >
            <Tabs defaultActiveKey="basic">
              <TabPane tab="基本信息" key="basic">
                <Form.Item
                  name="type"
                  label="题目类型"
                  rules={[{ required: true, message: '请选择题目类型' }]}
                >
                  <Select placeholder="请选择题目类型">
                    <Option value="single">单选题</Option>
                    <Option value="multiple">多选题</Option>
                    <Option value="judge">判断题</Option>
                    <Option value="fillBlank">填空题</Option>
                    <Option value="essay">问答题</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="difficulty"
                  label="难度等级"
                  rules={[{ required: true, message: '请选择难度等级' }]}
                >
                  <Select placeholder="请选择难度等级">
                    <Option value="easy">简单</Option>
                    <Option value="medium">中等</Option>
                    <Option value="hard">困难</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="content"
                  label="题目内容"
                  rules={[{ required: true, message: '请输入题目内容' }]}
                >
                  <TextArea rows={4} placeholder="请输入题目内容" />
                </Form.Item>
                
                <Form.Item
                  name="source"
                  label="题目来源"
                >
                  <Input placeholder="请输入题目来源，如教材、真题等" />
                </Form.Item>
              </TabPane>
              
              <TabPane tab="选项与答案" key="options">
                <Form.Item
                  shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                >
                  {({ getFieldValue }) => {
                    const type = getFieldValue('type');
                    
                    if (type === 'single' || type === 'multiple') {
                      return (
                        <Form.List name="options">
                          {(fields) => (
                            <>
                              {fields.map(field => (
                                <Row key={field.key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                  <Col span={4}>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'id']}
                                      noStyle
                                    >
                                      <Input disabled />
                                    </Form.Item>
                                  </Col>
                                  <Col span={16}>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'content']}
                                      rules={[{ required: true, message: '请输入选项内容' }]}
                                      noStyle
                                    >
                                      <Input placeholder="选项内容" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={4}>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'isCorrect']}
                                      valuePropName="checked"
                                      noStyle
                                    >
                                      <Radio checked={false}>
                                        正确选项
                                      </Radio>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ))}
                            </>
                          )}
                        </Form.List>
                      );
                    }
                    
                    if (type === 'judge') {
                      return (
                        <Form.Item name="answer" label="答案" rules={[{ required: true }]}>
                          <Radio.Group>
                            <Radio value="T">正确</Radio>
                            <Radio value="F">错误</Radio>
                          </Radio.Group>
                        </Form.Item>
                      );
                    }
                    
                    return (
                      <Form.Item name="answer" label="答案" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="请输入答案" />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                
                <Form.Item name="analysis" label="解析">
                  <TextArea rows={4} placeholder="请输入解析" />
                </Form.Item>
              </TabPane>
              
              <TabPane tab="标签与知识点" key="tags">
                <Form.Item name="knowPoints" label="知识点">
                  <Select mode="tags" placeholder="请输入知识点，回车键添加">
                  </Select>
                </Form.Item>
                
                <Form.Item name="tags" label="标签">
                  <Select mode="tags" placeholder="请输入标签，回车键添加">
                  </Select>
                </Form.Item>
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </Card>
    </AdminLayout>
  );
};

export default QuestionsList; 