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
import communityApi from '../../../api/communityApi';
import { Comment, ApiResponse, PageResult } from '../../../types/community';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

// 扩展评论类型，添加管理所需的额外字段
interface CommentType extends Omit<Comment, 'parentCommentId'> {
  sectionId?: number;
  sectionName?: string;
  postTitle?: string;
  isDeleted?: boolean;
  isReported?: boolean;
  reportCount?: number;
  reportReasons?: string[];
  content?: string;
  parentCommentId?: number;
}

const CommentsManager: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchForm] = Form.useForm();
  const [sections, setSections] = useState<{id: number, name: string}[]>([]);

  // 评论详情弹窗状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState<CommentType | null>(null);
  
  // 举报详情弹窗状态
  const [reportVisible, setReportVisible] = useState(false);
  
  // 当前查询的帖子ID
  const [currentPostId, setCurrentPostId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchSections();
    fetchComments();
  }, []);

  // 获取板块列表
  const fetchSections = async () => {
    try {
      const response = await communityApi.getSections();
      if (response.code === 200 && response.data) {
        const sectionOptions = response.data.map(section => ({
          id: section.sectionId,
          name: section.sectionName
        }));
        setSections(sectionOptions);
      }
    } catch (error) {
      console.error('获取板块列表失败:', error);
      message.error('获取板块列表失败');
    }
  };

  // 获取评论列表
  const fetchComments = async (postId?: number, pageNum = 1, pageSize = 10) => {
    setLoading(true);
    try {
      if (!postId) {
        // 如果没有指定帖子ID，获取最近的评论（这需要后端支持）
        // 这里可能需要一个管理员专用的API
        setComments([]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
        });
        setLoading(false);
        return;
      }
      
      const response = await communityApi.getComments(postId, pageNum, pageSize);
      if (response.code === 200 && response.data) {
        // 转换评论数据格式
        const commentsData = response.data.list.map(comment => ({
          ...comment,
          // 将commentId映射为id以便表格使用
          id: comment.commentId,
          // 评论内容使用commentContent
          content: comment.commentContent,
          // 作者信息
          authorId: comment.userId,
          authorName: comment.username,
          // 创建时间
          createTime: comment.createdAt,
          // 默认值
          isDeleted: false,
          isReported: false,
          reportCount: 0,
        }));
        
        setComments(commentsData);
        setPagination({
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.total,
        });
        setCurrentPostId(postId);
      }
    } catch (error) {
      console.error('获取评论列表失败:', error);
      message.error('获取评论列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索评论
  const handleSearch = (values: any) => {
    setLoading(true);
    
    // 获取表单值
    const { postId, keyword, sectionId, isDeleted, isReported, timeRange } = values;
    
    if (postId) {
      // 如果指定了帖子ID，使用API获取该帖子的评论
      fetchComments(postId, pagination.current, pagination.pageSize);
    } else {
      // 提示用户需要输入帖子ID
      message.info('请输入帖子ID');
      setLoading(false);
    }
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setCurrentPostId(undefined);
    setComments([]);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0,
    });
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
  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await communityApi.deleteComment(commentId);
      if (response.code === 200) {
        message.success('评论已删除');
        // 更新评论列表
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.commentId === commentId ? { ...comment, isDeleted: true } : comment
          )
        );
      } else {
        message.error(response.message || '删除评论失败');
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      message.error('删除评论失败，请稍后重试');
    }
  };

  // 处理举报
  const handleProcessReport = () => {
    if (!currentComment) return;
    
    // 暂时没有处理举报的API，这里只是UI交互
    message.success('举报已处理');
    setReportVisible(false);
    
    // 更新评论列表
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.commentId === currentComment.commentId ? { ...comment, isReported: false, reportCount: 0, reportReasons: [] } : comment
      )
    );
  };

  // 批量删除评论
  const handleBatchDelete = (selectedIds: React.Key[]) => {
    Modal.confirm({
      title: '批量删除评论',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除已选中的 ${selectedIds.length} 条评论吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 逐个删除评论
          const deletePromises = selectedIds.map(id => 
            communityApi.deleteComment(Number(id))
          );
          
          await Promise.all(deletePromises);
          message.success(`已删除 ${selectedIds.length} 条评论`);
          
          // 刷新评论列表
          if (currentPostId) {
            fetchComments(currentPostId, pagination.current, pagination.pageSize);
          }
        } catch (error) {
          console.error('批量删除评论失败:', error);
          message.error('批量删除评论失败，请稍后重试');
        }
      }
    });
  };

  // 表格分页变化
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 10 } = newPagination;
    setPagination({
      ...pagination,
      current: current,
      pageSize: pageSize,
    });
    
    if (currentPostId) {
      fetchComments(currentPostId, current, pageSize);
    }
  };

  // 表格列定义
  const columns: ColumnsType<CommentType> = [
    {
      title: 'ID',
      dataIndex: 'commentId',
      key: 'commentId',
      width: 60,
    },
    {
      title: '评论内容',
      dataIndex: 'commentContent',
      key: 'commentContent',
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
            {record.parentCommentId ? <Tag color="blue">回复</Tag> : null}
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: '评论者',
      dataIndex: 'username',
      key: 'username',
      width: 100,
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
          
          {!record.isDeleted && (
            <Popconfirm
              title="确定要删除该评论吗？"
              onConfirm={() => handleDeleteComment(record.commentId)}
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
              <Form.Item name="postId" label="帖子ID" rules={[{ required: true, message: '请输入帖子ID' }]}>
                <Input placeholder="请输入帖子ID" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="keyword">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="评论内容/评论者"
                  allowClear
                />
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
          rowKey="commentId"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
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
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {currentComment && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <span>评论者: {currentComment.username}</span>
                <span>评论时间: {currentComment.createdAt}</span>
              </Space>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>帖子ID:</Text>
              <div>
                {currentComment.postId}
              </div>
            </div>
            
            {currentComment.parentCommentId && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>回复评论:</Text> ID: {currentComment.parentCommentId}
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
                {currentComment.commentContent}
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
        open={reportVisible}
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
                handleDeleteComment(currentComment.commentId);
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
              <Text>举报次数: <Tag color="red">{currentComment.reportCount || 0}</Tag></Text>
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
                {currentComment.commentContent}
              </Paragraph>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>举报理由:</Text>
              {currentComment.reportReasons?.length ? (
                <ul>
                  {currentComment.reportReasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <div>暂无详细举报信息</div>
              )}
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