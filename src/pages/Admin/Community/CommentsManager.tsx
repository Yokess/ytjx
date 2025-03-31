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
  Modal,
  message,
  Popconfirm,
  Typography,
  DatePicker,
  Tooltip,
  TablePaginationConfig
} from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

// 定义评论类型
interface CommentType {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  postId: number;
  postTitle: string;
  sectionId: number;
  sectionName: string;
  parentId: number | null;
  createTime: string;
  likeCount: number;
  isDeleted: boolean;
  isReported: boolean;
  reportCount: number;
  reportReasons?: string[];
}

// 模拟评论数据
const generateMockComments = (count: number): CommentType[] => {
  const sectionNames = ['考研经验交流', '考研资料分享', '院校信息讨论', '考研政治', '考研英语', '考研数学', '专业课交流', '跨专业考研', '调剂信息', '心理健康'];
  const authorNames = ['学习达人', '考研小白', '考研老兵', 'PhD申请者', '跨考勇士', '英语高手', '数学爱好者', '考研斗士', '保研人', '未来的研究生'];
  const postTitles = [
    '考研备考经验分享，这一年我是如何从专业倒数到上岸的',
    '超全的考研政治最后冲刺资料，不看后悔系列',
    '某985院校计算机专业考研真题解析+考试重点',
    '跨考金融有哪些难点？我是怎么克服的',
    '二战考研，我的失败与成功之路',
  ];
  
  const commentContents = [
    '谢谢分享，非常有帮助！',
    '请问楼主，这个方法对跨考有效吗？',
    '我也是这么认为的，支持楼主的观点。',
    '这个资料能分享一下吗？',
    '我试过这个方法，真的有效！',
    '这篇文章写得太好了，解答了我很多疑惑。',
    '有没有上岸的同学来分享一下经验？',
    '我觉得这个说法不太对，应该是...',
    '请问楼主，这个学校今年的考试难度如何？',
    '我是已经考上的学长，有什么问题欢迎私信我。',
    '这个知识点在考试中经常考到，大家一定要掌握。',
    '这个经验分享得很及时，正好我也在准备这部分内容。',
    '有没有一起备考的同学，我们可以组个学习小组。',
    '感谢分享，收藏了！',
    '这部分内容我还是不太理解，能再详细解释一下吗？',
  ];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = index + 1;
    const isReported = id % 23 === 0;
    const reportCount = isReported ? Math.floor(Math.random() * 3) + 1 : 0;
    const reportReasons = isReported ? ['垃圾广告', '人身攻击', '内容不当', '无意义灌水'].slice(0, reportCount) : [];
    const isDeleted = id % 31 === 0;
    
    // 随机日期：过去3个月内
    const randomDays = Math.floor(Math.random() * 90);
    const createDate = dayjs().subtract(randomDays, 'day');
    
    // 一部分评论是回复其他评论的
    const parentId = id % 5 === 0 ? Math.floor(id / 5) : null;
    
    return {
      id,
      content: parentId 
        ? `@${authorNames[(id % authorNames.length + 2) % authorNames.length]} ${commentContents[id % commentContents.length]}`
        : commentContents[id % commentContents.length],
      authorId: 1000 + id,
      authorName: authorNames[id % authorNames.length],
      postId: (id % 5) + 1,
      postTitle: postTitles[id % postTitles.length],
      sectionId: (id % 10) + 1,
      sectionName: sectionNames[id % sectionNames.length],
      parentId,
      createTime: createDate.format('YYYY-MM-DD HH:mm:ss'),
      likeCount: Math.floor(Math.random() * 50),
      isDeleted,
      isReported,
      reportCount,
      reportReasons,
    };
  });
};

const mockComments = generateMockComments(100);

const CommentsManager: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchForm] = Form.useForm();

  // 评论详情弹窗状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState<CommentType | null>(null);
  
  // 举报详情弹窗状态
  const [reportVisible, setReportVisible] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  // 获取评论列表
  const fetchComments = async () => {
    setLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      setComments(mockComments);
      setPagination({
        ...pagination,
        total: mockComments.length,
      });
      setLoading(false);
    }, 500);
  };

  // 搜索评论
  const handleSearch = (values: any) => {
    setLoading(true);
    
    // 模拟搜索过滤
    setTimeout(() => {
      let filteredComments = [...mockComments];
      
      // 关键词过滤
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filteredComments = filteredComments.filter(comment => 
          comment.content.toLowerCase().includes(keyword) || 
          comment.authorName.toLowerCase().includes(keyword) ||
          comment.postTitle.toLowerCase().includes(keyword)
        );
      }
      
      // 板块过滤
      if (values.sectionId) {
        filteredComments = filteredComments.filter(comment => comment.sectionId === values.sectionId);
      }
      
      // 是否被删除过滤
      if (values.isDeleted !== undefined) {
        filteredComments = filteredComments.filter(comment => comment.isDeleted === values.isDeleted);
      }
      
      // 是否被举报过滤
      if (values.isReported !== undefined) {
        filteredComments = filteredComments.filter(comment => comment.isReported === values.isReported);
      }
      
      // 时间范围过滤
      if (values.timeRange && values.timeRange.length === 2) {
        const startTime = values.timeRange[0].startOf('day');
        const endTime = values.timeRange[1].endOf('day');
        
        filteredComments = filteredComments.filter(comment => {
          const commentTime = dayjs(comment.createTime);
          return commentTime.isAfter(startTime) && commentTime.isBefore(endTime);
        });
      }
      
      setComments(filteredComments);
      setPagination({
        ...pagination,
        current: 1,
        total: filteredComments.length,
      });
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetchComments();
  };

  // 查看评论详情
  const handleViewComment = (comment: CommentType) => {
    setCurrentComment(comment);
    setDetailVisible(true);
  };

  // 查看举报详情
  const handleViewReport = (comment: CommentType) => {
    setCurrentComment(comment);
    setReportVisible(true);
  };

  // 删除评论
  const handleDeleteComment = (commentId: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除该评论吗？删除后不可恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 模拟 API 请求
        setTimeout(() => {
          setComments(prevComments => 
            prevComments.map(comment => 
              comment.id === commentId ? { ...comment, isDeleted: true } : comment
            )
          );
          message.success('评论已删除');
        }, 500);
      }
    });
  };

  // 恢复评论
  const handleRestoreComment = (commentId: number) => {
    // 模拟 API 请求
    setTimeout(() => {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId ? { ...comment, isDeleted: false } : comment
        )
      );
      message.success('评论已恢复');
    }, 500);
  };

  // 处理举报
  const handleProcessReport = () => {
    if (!currentComment) return;
    
    // 模拟 API 请求
    setTimeout(() => {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === currentComment.id ? { ...comment, isReported: false, reportCount: 0, reportReasons: [] } : comment
        )
      );
      message.success('举报已处理');
      setReportVisible(false);
    }, 500);
  };

  // 批量删除评论
  const handleBatchDelete = (selectedIds: React.Key[]) => {
    Modal.confirm({
      title: '批量删除评论',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除已选中的 ${selectedIds.length} 条评论吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 模拟 API 请求
        setTimeout(() => {
          setComments(prevComments => 
            prevComments.map(comment => 
              selectedIds.includes(comment.id) ? { ...comment, isDeleted: true } : comment
            )
          );
          message.success(`已删除 ${selectedIds.length} 条评论`);
        }, 500);
      }
    });
  };

  // 表格列定义
  const columns: ColumnsType<CommentType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.isReported && <WarningOutlined style={{ color: 'red' }} />}
          <Text 
            style={{ 
              textDecoration: record.isDeleted ? 'line-through' : 'none',
              color: record.isDeleted ? '#999' : 'inherit' 
            }}
          >
            {record.parentId ? <Tag color="blue">回复</Tag> : null}
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: '评论者',
      dataIndex: 'authorName',
      key: 'authorName',
      width: 100,
    },
    {
      title: '所属帖子',
      dataIndex: 'postTitle',
      key: 'postTitle',
      width: 200,
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '所属板块',
      dataIndex: 'sectionName',
      key: 'sectionName',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      sorter: (a, b) => a.likeCount - b.likeCount,
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        if (record.isDeleted) {
          return <Tag color="red">已删除</Tag>;
        }
        if (record.isReported) {
          return <Tag color="orange">被举报({record.reportCount})</Tag>;
        }
        return <Tag color="green">正常</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewComment(record)}
          >
            查看
          </Button>
          
          {record.isReported && (
            <Button
              type="link"
              danger
              size="small"
              icon={<WarningOutlined />}
              onClick={() => handleViewReport(record)}
            >
              举报
            </Button>
          )}
          
          {record.isDeleted ? (
            <Button
              type="link"
              size="small"
              onClick={() => handleRestoreComment(record.id)}
            >
              恢复
            </Button>
          ) : (
            <Popconfirm
              title="确定要删除该评论吗？"
              onConfirm={() => handleDeleteComment(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Card title="社区评论管理">
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
                  placeholder="评论内容/评论者/帖子标题"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="sectionId">
                <Select placeholder="所属板块" allowClear>
                  {mockComments
                    .map(comment => ({ id: comment.sectionId, name: comment.sectionName }))
                    .filter((item, index, self) => self.findIndex(t => t.id === item.id) === index)
                    .map(section => (
                      <Option key={section.id} value={section.id}>{section.name}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="isDeleted">
                <Select placeholder="删除状态" allowClear>
                  <Option value={true}>已删除</Option>
                  <Option value={false}>未删除</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="isReported">
                <Select placeholder="举报状态" allowClear>
                  <Option value={true}>已举报</Option>
                  <Option value={false}>未举报</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="timeRange">
                <RangePicker locale={locale} style={{ width: '100%' }} />
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

        {/* 评论列表表格 */}
        <Table
          columns={columns}
          dataSource={comments}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(newPagination: TablePaginationConfig) => {
            setPagination({
              ...pagination,
              current: newPagination.current || 1,
              pageSize: newPagination.pageSize || 10,
              total: pagination.total
            });
          }}
          rowSelection={{
            onChange: (selectedRowKeys) => {
              if (selectedRowKeys.length > 0) {
                const deleteBtn = (
                  <Button
                    danger
                    onClick={() => handleBatchDelete(selectedRowKeys)}
                    style={{ margin: '0 16px' }}
                  >
                    批量删除 ({selectedRowKeys.length})
                  </Button>
                );
                
                message.info({
                  content: (
                    <div>
                      已选择 <Text strong>{selectedRowKeys.length}</Text> 条评论
                      {deleteBtn}
                    </div>
                  ),
                  duration: 3,
                  key: 'selection',
                });
              } else {
                message.destroy('selection');
              }
            }
          }}
        />
      </Card>

      {/* 评论详情弹窗 */}
      <Modal
        title="评论详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {currentComment && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <span>评论者: {currentComment.authorName}</span>
                <span>评论时间: {currentComment.createTime}</span>
              </Space>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>所属帖子:</Text>
              <div>
                <a href="#">{currentComment.postTitle}</a>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>所属板块:</Text> <Tag color="blue">{currentComment.sectionName}</Tag>
            </div>
            
            {currentComment.parentId && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>回复评论:</Text> ID: {currentComment.parentId}
              </div>
            )}
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>评论内容:</Text>
              <Paragraph
                style={{ 
                  padding: 16, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 4,
                  marginTop: 8
                }}
              >
                {currentComment.content}
              </Paragraph>
            </div>
            
            <div>
              <Text strong>赞:</Text> {currentComment.likeCount}
            </div>
          </div>
        )}
      </Modal>

      {/* 举报详情弹窗 */}
      <Modal
        title="举报详情"
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReportVisible(false)}>
            关闭
          </Button>,
          <Button key="process" type="primary" onClick={handleProcessReport}>
            标记为已处理
          </Button>,
          currentComment && !currentComment.isDeleted && (
            <Button 
              key="delete" 
              type="primary" 
              danger
              onClick={() => {
                handleDeleteComment(currentComment.id);
                setReportVisible(false);
              }}
            >
              删除评论
            </Button>
          ),
        ]}
      >
        {currentComment && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text>举报次数: <Tag color="red">{currentComment.reportCount}</Tag></Text>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>评论内容:</Text>
              <Paragraph
                style={{ 
                  padding: 16, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 4,
                  marginTop: 8
                }}
              >
                {currentComment.content}
              </Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>举报理由:</Text>
              <ul>
                {currentComment.reportReasons?.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <Text strong>处理说明:</Text>
              <Input.TextArea rows={3} placeholder="请输入处理说明（可选）" />
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default CommentsManager; 