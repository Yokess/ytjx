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
  Radio,
  Upload,
  Checkbox
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
  CloseCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import { 
  getQuestionsList, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion,
  importQuestions,
  exportQuestions
} from '../../../api/adminApi';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 题目类型定义
interface QuestionOption {
  optionId: string;
  optionKey: string;
  optionValue: string;
  isCorrect?: boolean;
}

interface QuestionType {
  questionId: number;
  questionText: string;
  questionType: number;
  difficultyLevel: number;
  knowledgePoint: string;
  correctAnswer: string;
  analysis: string;
  options?: QuestionOption[];
  createTime: string;
  updateTime: string;
  passRate?: number;
  usageCount?: number;
  creatorName?: string;
}

// 题目类型映射
const questionTypeMap: Record<number, { text: string; color: string }> = {
  0: { text: '单选题', color: 'blue' },
  1: { text: '多选题', color: 'purple' },
  2: { text: '填空题', color: 'orange' },
  3: { text: '判断题', color: 'cyan' },
  4: { text: '问答题', color: 'green' }
};

// 难度级别映射
const difficultyMap: Record<number, { text: string; color: string }> = {
  0: { text: '简单', color: 'success' },
  1: { text: '中等', color: 'warning' },
  2: { text: '困难', color: 'error' },
  3: { text: '很难', color: 'magenta' },
  4: { text: '专家', color: 'volcano' }
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
  const [importVisible, setImportVisible] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  // 初始化数据
  useEffect(() => {
    fetchQuestions();
  }, [pagination.current, pagination.pageSize]);

  // 获取题目列表
  const fetchQuestions = async (searchParams?: any) => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
        ...searchParams
      };
      
      const result = await getQuestionsList(params);
      if (result.success) {
        // 转换后端数据为组件所需格式
        const data = result.data;
        const list = data.list || [];
        
        const formattedQuestions = list.map((item: any) => ({
          questionId: item.questionId,
          questionText: item.questionText,
          questionType: item.questionType,
          difficultyLevel: item.difficultyLevel,
          knowledgePoint: item.knowledgePoint,
          correctAnswer: item.correctAnswer,
          analysis: item.analysis,
          options: item.options || [],
          createTime: item.createTime,
          updateTime: item.updateTime,
          passRate: item.passRate,
          usageCount: item.usageCount,
          creatorName: item.creatorName || `用户${item.creatorId}`
        }));
        
        setQuestions(formattedQuestions);
        setPagination({
          ...pagination,
          total: data.total || 0
        });
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('获取题目列表失败:', error);
      message.error('获取题目列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    const searchParams = {
      keyword: values.keyword,
      type: values.type,
      difficulty: values.difficulty,
      knowledgePoint: values.knowledgePoint
    };
    
    setPagination({
      ...pagination,
      current: 1 // 重置为第一页
    });
    
    fetchQuestions(searchParams);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setPagination({
      ...pagination,
      current: 1
    });
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
      
      // 处理选项数据
      let optionsData: Array<{optionKey: string; optionValue: string; isCorrect: boolean}> = [];
      if ([0, 1, 3].includes(question.questionType) && question.options) {
        optionsData = question.options.map(opt => ({
          optionKey: opt.optionKey,
          optionValue: opt.optionValue,
          isCorrect: question.correctAnswer.includes(opt.optionKey)
        }));
      }
      
      // 知识点转换为数组
      const knowledgePoints = question.knowledgePoint ? question.knowledgePoint.split(',') : [];
      
      questionForm.setFieldsValue({
        questionText: question.questionText,
        questionType: question.questionType,
        difficultyLevel: question.difficultyLevel,
        options: optionsData,
        correctAnswer: question.correctAnswer,
        analysis: question.analysis,
        knowledgePoint: knowledgePoints
      });
    } else {
      // 添加新题目
      setSelectedQuestion(null);
      questionForm.resetFields();
      
      // 默认值设置
      questionForm.setFieldsValue({
        questionType: 0,
        difficultyLevel: 1,
        options: [
          { optionKey: 'A', optionValue: '', isCorrect: false },
          { optionKey: 'B', optionValue: '', isCorrect: false },
          { optionKey: 'C', optionValue: '', isCorrect: false },
          { optionKey: 'D', optionValue: '', isCorrect: false }
        ]
      });
    }
    setEditVisible(true);
  };

  // 保存题目
  const saveQuestion = async () => {
    try {
      const values = await questionForm.validateFields();
      setSaveLoading(true);
      
      // 处理选项和正确答案
      let correctAnswer = values.correctAnswer;
      let options = undefined;
      
      if ([0, 1].includes(values.questionType)) {
        // 单选题和多选题，从选项中提取正确答案
        options = values.options.map((opt: any) => ({
          optionKey: opt.optionKey,
          optionValue: opt.optionValue
        }));
        
        // 从标记为正确的选项中提取答案
        correctAnswer = values.options
          .filter((opt: any) => opt.isCorrect)
          .map((opt: any) => opt.optionKey)
          .join(',');
      } else if (values.questionType === 3) {
        // 判断题
        options = [
          { optionKey: 'T', optionValue: '正确' },
          { optionKey: 'F', optionValue: '错误' }
        ];
      }
      
      // 构建API所需的数据格式
      const questionData = {
        questionText: values.questionText,
        questionType: values.questionType,
        difficultyLevel: values.difficultyLevel,
        options: options,
        correctAnswer: correctAnswer,
        analysis: values.analysis,
        knowledgePoint: Array.isArray(values.knowledgePoint) ? values.knowledgePoint.join(',') : values.knowledgePoint
      };
      
      let result;
      if (selectedQuestion) {
        // 更新题目
        result = await updateQuestion(selectedQuestion.questionId, questionData);
      } else {
        // 添加新题目
        result = await createQuestion(questionData);
      }
      
      if (result.success) {
        message.success(result.message);
        setEditVisible(false);
        fetchQuestions(); // 刷新列表
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('保存题目失败:', error);
      message.error('保存题目失败，请检查表单数据');
    } finally {
      setSaveLoading(false);
    }
  };

  // 删除题目
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const result = await deleteQuestion(id);
      if (result.success) {
        message.success(result.message);
        fetchQuestions(); // 刷新列表
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('删除题目失败:', error);
      message.error('删除题目失败');
    } finally {
      setLoading(false);
    }
  };

  // 显示导入题目对话框
  const showImportModal = () => {
    setImportFile(null);
    setImportVisible(true);
  };

  // 处理文件上传
  const handleFileChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      setImportFile(info.file.originFileObj);
    }
  };

  // 导入题目
  const handleImportQuestions = async () => {
    if (!importFile) {
      message.warning('请先选择要导入的文件');
      return;
    }
    
    setImportLoading(true);
    try {
      const result = await importQuestions(importFile);
      if (result.success) {
        message.success(result.message);
        setImportVisible(false);
        fetchQuestions(); // 刷新列表
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('导入题目失败:', error);
      message.error('导入题目失败');
    } finally {
      setImportLoading(false);
    }
  };

  // 导出题目
  const handleExportQuestions = async () => {
    try {
      // 获取当前搜索条件
      const values = searchForm.getFieldsValue();
      const params = {
        type: values.type,
        difficulty: values.difficulty
      };
      
      message.loading('正在导出题目...', 0);
      const result = await exportQuestions(params);
      message.destroy();
      
      if (!result.success) {
        message.error(result.message);
      }
    } catch (error) {
      console.error('导出题目失败:', error);
      message.error('导出题目失败');
    }
  };

  // 表格列定义
  const columns: ColumnsType<QuestionType> = [
    {
      title: '序号',
      dataIndex: 'questionId',
      key: 'questionId',
      width: 60
    },
    {
      title: '题目内容',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Space size={4} style={{ marginTop: 4 }}>
            <Tag color={questionTypeMap[record.questionType]?.color || 'blue'}>
              {questionTypeMap[record.questionType]?.text || record.questionType}
            </Tag>
            <Tag color={difficultyMap[record.difficultyLevel]?.color || 'blue'}>
              {difficultyMap[record.difficultyLevel]?.text || record.difficultyLevel}
            </Tag>
          </Space>
        </div>
      )
    },
    {
      title: '答案',
      dataIndex: 'correctAnswer',
      key: 'correctAnswer',
      width: 150,
      ellipsis: true
    },
    {
      title: '知识点',
      dataIndex: 'knowledgePoint',
      key: 'knowledgePoint',
      width: 150,
      render: (knowledgePoint: string) => (
        <Space size={[0, 4]} wrap>
          {knowledgePoint?.split(',').map(point => (
            <Tag key={point}>{point}</Tag>
          )) || '-'}
        </Space>
      )
    },
    {
      title: '创建者',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: 100
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
              onConfirm={() => handleDelete(record.questionId)}
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
            <Tag color={questionTypeMap[selectedQuestion.questionType]?.color || 'blue'}>
              {questionTypeMap[selectedQuestion.questionType]?.text || selectedQuestion.questionType}
            </Tag>
            <Tag color={difficultyMap[selectedQuestion.difficultyLevel]?.color || 'blue'}>
              {difficultyMap[selectedQuestion.difficultyLevel]?.text || selectedQuestion.difficultyLevel}
            </Tag>
          </Space>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>题目内容：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.questionText}</div>
        </div>
        
        {[0, 1, 3].includes(selectedQuestion.questionType) && selectedQuestion.options && (
          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong>选项：</Typography.Text>
            <div style={{ marginTop: 8 }}>
              {selectedQuestion.options?.map(option => {
                const isCorrect = selectedQuestion.correctAnswer.includes(option.optionKey);
                return (
                  <div key={option.optionId} style={{ marginBottom: 8 }}>
                    <Space>
                      {isCorrect ? (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: '#f5222d' }} />
                      )}
                      <span>{option.optionKey}. {option.optionValue}</span>
                    </Space>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>答案：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.correctAnswer}</div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>解析：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.analysis}</div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>知识点：</Typography.Text>
          <div style={{ marginTop: 8 }}>
            {selectedQuestion.knowledgePoint?.split(',').map(point => (
              <Tag key={point}>{point}</Tag>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>使用次数：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.usageCount || 0}</div>
        </div>
        
        <div>
          <Typography.Text strong>创建者：</Typography.Text>
          <div style={{ marginTop: 8 }}>{selectedQuestion.creatorName || '未知'}</div>
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
            <Button icon={<ImportOutlined />} onClick={showImportModal}>批量导入</Button>
            <Button icon={<ExportOutlined />} onClick={handleExportQuestions}>导出题目</Button>
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
                  <Option value={0}>单选题</Option>
                  <Option value={1}>多选题</Option>
                  <Option value={2}>填空题</Option>
                  <Option value={3}>判断题</Option>
                  <Option value={4}>问答题</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="difficulty">
                <Select placeholder="难度等级" allowClear>
                  <Option value={0}>简单</Option>
                  <Option value={1}>中等</Option>
                  <Option value={2}>困难</Option>
                  <Option value={3}>很难</Option>
                  <Option value={4}>专家</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="knowledgePoint">
                <Input placeholder="知识点" allowClear />
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
          rowKey="questionId"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />

        {/* 题目预览弹窗 */}
        <Modal
          title="题目预览"
          open={previewVisible}
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
          open={editVisible}
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
              questionType: 0,
              difficultyLevel: 1,
              options: [
                { optionKey: 'A', optionValue: '', isCorrect: false },
                { optionKey: 'B', optionValue: '', isCorrect: false },
                { optionKey: 'C', optionValue: '', isCorrect: false },
                { optionKey: 'D', optionValue: '', isCorrect: false }
              ]
            }}
          >
            <Tabs defaultActiveKey="basic">
              <TabPane tab="基本信息" key="basic">
                <Form.Item
                  name="questionType"
                  label="题目类型"
                  rules={[{ required: true, message: '请选择题目类型' }]}
                >
                  <Select placeholder="请选择题目类型">
                    <Option value={0}>单选题</Option>
                    <Option value={1}>多选题</Option>
                    <Option value={2}>填空题</Option>
                    <Option value={3}>判断题</Option>
                    <Option value={4}>问答题</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="difficultyLevel"
                  label="难度等级"
                  rules={[{ required: true, message: '请选择难度等级' }]}
                >
                  <Select placeholder="请选择难度等级">
                    <Option value={0}>简单</Option>
                    <Option value={1}>中等</Option>
                    <Option value={2}>困难</Option>
                    <Option value={3}>很难</Option>
                    <Option value={4}>专家</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="questionText"
                  label="题目内容"
                  rules={[{ required: true, message: '请输入题目内容' }]}
                >
                  <TextArea rows={4} placeholder="请输入题目内容" />
                </Form.Item>
              </TabPane>
              
              <TabPane tab="选项与答案" key="options">
                <Form.Item
                  shouldUpdate={(prevValues, currentValues) => prevValues.questionType !== currentValues.questionType}
                >
                  {({ getFieldValue }) => {
                    const type = getFieldValue('questionType');
                    
                    if (type === 0 || type === 1) {
                      // 单选题或多选题
                      return (
                        <Form.List name="options">
                          {(fields) => (
                            <>
                              {fields.map(field => (
                                <Row key={field.key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                  <Col span={4}>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'optionKey']}
                                      noStyle
                                    >
                                      <Input disabled />
                                    </Form.Item>
                                  </Col>
                                  <Col span={16}>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, 'optionValue']}
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
                                      {type === 0 ? (
                                        <Radio checked={false}>
                                          正确选项
                                        </Radio>
                                      ) : (
                                        <Checkbox>
                                          正确选项
                                        </Checkbox>
                                      )}
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ))}
                            </>
                          )}
                        </Form.List>
                      );
                    }
                    
                    if (type === 3) {
                      return (
                        <Form.Item name="correctAnswer" label="答案" rules={[{ required: true }]}>
                          <Radio.Group>
                            <Radio value="T">正确</Radio>
                            <Radio value="F">错误</Radio>
                          </Radio.Group>
                        </Form.Item>
                      );
                    }
                    
                    return (
                      <Form.Item name="correctAnswer" label="答案" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="请输入答案" />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                
                <Form.Item name="analysis" label="解析">
                  <TextArea rows={4} placeholder="请输入解析" />
                </Form.Item>
              </TabPane>
              
              <TabPane tab="知识点" key="knowledgePoint">
                <Form.Item name="knowledgePoint" label="知识点">
                  <Select mode="tags" placeholder="请输入知识点，回车键添加">
                  </Select>
                </Form.Item>
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
        
        {/* 导入题目弹窗 */}
        <Modal
          title="批量导入题目"
          open={importVisible}
          onCancel={() => setImportVisible(false)}
          footer={[
            <Button key="back" onClick={() => setImportVisible(false)}>取消</Button>,
            <Button
              key="import"
              type="primary"
              loading={importLoading}
              onClick={handleImportQuestions}
            >
              开始导入
            </Button>
          ]}
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Upload
              name="file"
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={importFile ? [{ uid: '1', name: importFile.name, status: 'done' }] : []}
              accept=".xlsx,.xls,.csv"
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <div style={{ marginTop: 16 }}>
              <Typography.Text type="secondary">
                支持 Excel (.xlsx, .xls) 或 CSV 格式文件，文件大小不超过5MB
              </Typography.Text>
              <br />
              <Typography.Link href="#" target="_blank">
                下载导入模板
              </Typography.Link>
            </div>
          </div>
        </Modal>
      </Card>
    </AdminLayout>
  );
};

export default QuestionsList; 