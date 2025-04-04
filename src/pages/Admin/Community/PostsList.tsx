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
  Radio,
  Dropdown,
  TablePaginationConfig,
  Checkbox
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
  MessageOutlined,
  PushpinOutlined,
  StarOutlined,
  StopOutlined,
  WarningOutlined,
  DownOutlined,
  EditOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  StarFilled,
  UnlockOutlined,
  LockOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { getPosts, getSections, deletePost, setPostTopStatus, setPostEssenceStatus, setPostLockStatus, setPostHiddenStatus } from '../../../api/communityApi';
import { Post, PageResult, Section } from '../../../types/community';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const PostsList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchForm] = Form.useForm();
  const [sortBy, setSortBy] = useState<'latest' | 'hot' | 'featured'>('featured');

  // 帖子内容预览弹窗状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  
  // 举报详情弹窗状态
  const [reportVisible, setReportVisible] = useState(false);
  
  // 删除确认弹窗状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  
  // 获取板块列表
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await getSections();
        if (response.code === 200) {
          setSections(response.data);
        } else {
          message.error(response.message || '获取板块列表失败');
        }
      } catch (error) {
        console.error('获取板块列表失败:', error);
        message.error('获取板块列表失败');
      }
    };
    
    fetchSections();
  }, []);
  
  // 在组件加载和依赖项变化时获取数据
  useEffect(() => {
    console.log("PostsList 组件加载，开始准备调用fetchPosts");
    console.log("当前sortBy值:", sortBy);
    console.log("当前分页设置:", pagination);
    
    // 直接使用API调用获取数据
    fetchPosts();
  }, [sortBy]); // 当排序方式改变时重新获取数据

  // 获取帖子列表
  const fetchPosts = async (params?: any) => {
    console.log('开始执行fetchPosts, 参数:', params);
    setLoading(true);
    try {
      const pageNum = params?.current || pagination.current;
      const pageSize = params?.pageSize || pagination.pageSize;
      
      // 获取表单中的值
      const keyword = searchForm.getFieldValue('keyword');
      const sectionId = searchForm.getFieldValue('sectionId');
      
      console.log('表单值 - keyword:', keyword, 'sectionId:', sectionId, 'sortBy:', sortBy);
      
      const queryParams = {
        pageNum,
        pageSize,
        sortBy,
        sectionId: sectionId || undefined,
        keyword: keyword || undefined
      };
      
      console.log('准备发送API请求，参数:', queryParams);
      
      const response = await getPosts(queryParams);
      console.log('API响应成功:', response);
      
      if (response.code === 200) {
        const pageResult = response.data as PageResult<Post>;
        console.log('设置帖子列表数据:', pageResult.list);
        setPosts(pageResult.list);
        setPagination({
          current: pageResult.pageNum,
          pageSize: pageResult.pageSize,
          total: pageResult.total,
        });
      } else {
        message.error(response.message || '获取帖子列表失败');
      }
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      message.error('获取帖子列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理表格分页、排序等变化
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    console.log('表格分页变化:', newPagination);
    fetchPosts({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // 搜索帖子
  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // 重置为第一页，保留其他分页设置
    fetchPosts({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 重置搜索
  const handleReset = () => {
    // 重置表单
    searchForm.resetFields();
    // 重置排序方式
    setSortBy('featured');
    // 重置分页并重新获取数据
    fetchPosts({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  // 查看帖子
  const handleViewPost = (post: Post) => {
    setCurrentPost(post);
    setPreviewVisible(true);
  };

  // 查看举报详情
  const handleViewReport = (post: Post) => {
    setCurrentPost(post);
    setReportVisible(true);
  };

  // 删除帖子
  const handleDeletePost = (postId: number) => {
    setDeletePostId(postId);
    setDeleteModalVisible(true);
  };
  
  // 确认删除
  const confirmDelete = async () => {
    if (!deletePostId) return;
    
    try {
      setLoading(true);
      console.log('准备删除帖子:', deletePostId);
      
      const response = await deletePost(deletePostId);
      console.log('删除帖子响应:', response);
      
      if (response.code === 200) {
        message.success('帖子已删除');
        fetchPosts(); // 重新获取帖子列表
      } else if (response.code === 401) {
        message.error('您未登录或登录已过期，请重新登录');
      } else if (response.code === 403) {
        message.error('您没有权限执行此操作');
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error: any) {
      console.error('删除帖子失败:', error);
      const errorMsg = error.response?.data?.message || '删除失败，请稍后再试';
      message.error(errorMsg);
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
    }
  };

  // 帖子操作：置顶/取消置顶
  const handleTogglePin = async (post: Post) => {
    try {
      setLoading(true);
      console.log('准备设置帖子置顶状态:', post.postId, !post.isTop);
      
      const response = await setPostTopStatus(post.postId, !post.isTop);
      console.log('置顶操作响应:', response);
      
      if (response.code === 200) {
        message.success(post.isTop ? '已取消置顶' : '已置顶');
        fetchPosts(); // 重新加载帖子列表
      } else if (response.code === 401) {
        message.error('您未登录或登录已过期，请重新登录');
      } else if (response.code === 403) {
        message.error('您没有权限执行此操作');
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error: any) {
      console.error('设置置顶状态失败:', error);
      const errorMsg = error.response?.data?.message || '操作失败，请稍后再试';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 帖子操作：设为精华/取消精华
  const handleToggleEssence = async (post: Post) => {
    try {
      setLoading(true);
      console.log('准备设置帖子精华状态:', post.postId, !post.isEssence);
      
      const response = await setPostEssenceStatus(post.postId, !post.isEssence);
      console.log('精华操作响应:', response);
      
      if (response.code === 200) {
        message.success(post.isEssence ? '已取消精华' : '已设为精华');
        fetchPosts(); // 重新加载帖子列表
      } else if (response.code === 401) {
        message.error('您未登录或登录已过期，请重新登录');
      } else if (response.code === 403) {
        message.error('您没有权限执行此操作');
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error: any) {
      console.error('设置精华状态失败:', error);
      const errorMsg = error.response?.data?.message || '操作失败，请稍后再试';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 帖子操作：禁止回复/允许回复
  const handleToggleLock = async (post: Post) => {
    setLoading(true);
    try {
      console.log('[Admin] 锁定/解锁帖子, postId:', post.postId, '当前状态:', post.postStatus === 1);
      // 当前状态为1表示已锁定，取反后为boolean值
      const newStatus = post.postStatus === 1 ? false : true;
      
      const response = await setPostLockStatus(post.postId, newStatus);
      console.log('[Admin] 锁定/解锁帖子响应:', response);
      
      if (response.code === 200) {
        message.success(newStatus ? '帖子已禁止回复' : '帖子已允许回复');
        // 更新列表
        fetchPosts();
      } else if (response.code === 401) {
        message.error('请先登录');
        navigate('/login');
      } else if (response.code === 403) {
        message.error('您没有操作权限');
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      console.error('[Admin] 锁定/解锁帖子失败:', error);
      message.error('操作失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 帖子操作：隐藏/显示
  const handleToggleHide = async (post: Post) => {
    setLoading(true);
    try {
      console.log('[Admin] 隐藏/显示帖子, postId:', post.postId, '当前状态:', post.postStatus === 2);
      // 当前状态为2表示已隐藏，取反后为boolean值
      const newStatus = post.postStatus === 2 ? false : true;
      
      const response = await setPostHiddenStatus(post.postId, newStatus);
      console.log('[Admin] 隐藏/显示帖子响应:', response);
      
      if (response.code === 200) {
        message.success(newStatus ? '帖子已隐藏' : '帖子已显示');
        // 更新列表
        fetchPosts();
      } else if (response.code === 401) {
        message.error('请先登录');
        navigate('/login');
      } else if (response.code === 403) {
        message.error('您没有操作权限');
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      console.error('[Admin] 隐藏/显示帖子失败:', error);
      message.error('操作失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理举报
  const handleProcessReport = async () => {
    if (!currentPost) return;
    
    try {
      setLoading(true);
      // 此处应调用处理举报的API，但由于当前没有举报ID信息，先以模拟方式处理
      // const response = await handlePostReport(reportId, 1, "管理员已处理");
      message.success('举报已处理');
      setReportVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('处理举报失败:', error);
      message.error('处理失败');
    } finally {
      setLoading(false);
    }
  };

  // 跳转到前台帖子详情页面
  const goToPostDetail = (postId: number) => {
    navigate(`/community/post/${postId}`);
  };

  // 表格列定义
  const columns: ColumnsType<Post> = [
    {
      title: 'ID',
      dataIndex: 'postId',
      key: 'postId',
      width: 60,
      sorter: (a, b) => a.postId - b.postId,
    },
    {
      title: '帖子标题',
      dataIndex: 'postTitle',
      key: 'postTitle',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.isTop && <PushpinOutlined style={{ color: 'red' }} />}
          {record.isEssence && <StarOutlined style={{ color: 'gold' }} />}
          <Text>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: '作者',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '板块',
      dataIndex: 'sectionName',
      key: 'sectionName',
      width: 120,
      render: (text) => text ? <Tag color="blue">{text}</Tag> : <Tag color="default">未分类</Tag>,
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: '统计',
      key: 'stats',
      width: 150,
      render: (_, record) => (
        <Space>
          <span title="浏览量"><EyeOutlined /> {record.postViews}</span>
          <span title="点赞数"><LikeOutlined /> {record.postLikes}</span>
          <span title="评论数"><MessageOutlined /> {record.postComments}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_, record) => {
        let statusTags = [];
        
        if (record.isTop) {
          statusTags.push(<Tag color="blue" key="top">置顶</Tag>);
        }
        
        if (record.isEssence) {
          statusTags.push(<Tag color="gold" key="essence">精华</Tag>);
        }
        
        if (record.postStatus === 0) {
          statusTags.push(<Tag color="green" key="normal">正常</Tag>);
        } else if (record.postStatus === 1) {
          statusTags.push(<Tag color="orange" key="locked">已锁定</Tag>);
        } else if (record.postStatus === 2) {
          statusTags.push(<Tag color="red" key="hidden">已隐藏</Tag>);
        }
        
        if (statusTags.length === 0) {
          statusTags.push(<Tag color="default" key="default">普通</Tag>);
        }
        
        return <Space>{statusTags}</Space>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewPost(record)}
          >
            预览
          </Button>
          
          <Button
            type="link"
            size="small"
            onClick={() => goToPostDetail(record.postId)}
          >
            查看详情
          </Button>
          
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  icon: <PushpinOutlined />,
                  label: (record.isTop ? '取消置顶' : '置顶'),
                  onClick: () => handleTogglePin(record),
                },
                {
                  key: '2',
                  icon: <StarOutlined />,
                  label: (record.isEssence ? '取消精华' : '设为精华'),
                  onClick: () => handleToggleEssence(record),
                },
                {
                  key: '3',
                  icon: <StopOutlined />,
                  label: (record.postStatus === 1 ? '允许回复' : '禁止回复'),
                  onClick: () => handleToggleLock(record),
                },
                {
                  key: '4',
                  icon: <StopOutlined />,
                  label: (record.postStatus === 2 ? '显示帖子' : '隐藏帖子'),
                  onClick: () => handleToggleHide(record),
                },
                {
                  key: '5',
                  icon: <DeleteOutlined />,
                  label: '删除帖子',
                  danger: true,
                  onClick: () => handleDeletePost(record.postId),
                },
              ]
            }}
            trigger={['click']}
          >
            <Button type="link" size="small">
              更多 <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Card title="社区帖子管理">
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
                  placeholder="帖子标题/内容/作者"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="sectionId">
                <Select placeholder="所属板块" allowClear>
                  {sections.map(section => (
                    <Option key={section.sectionId} value={section.sectionId}>
                      {section.sectionName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="sortBy">
                <Select 
                  placeholder="排序方式" 
                  defaultValue="featured"
                  onChange={(value) => setSortBy(value as 'latest' | 'hot' | 'featured')}
                >
                  <Option value="latest">最新</Option>
                  <Option value="hot">热门</Option>
                  <Option value="featured">精选</Option>
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

        {/* 帖子列表表格 */}
        <Table
          columns={columns}
          dataSource={posts}
          rowKey="postId"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* 帖子详情预览 */}
      <Modal
        title="帖子详情"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={700}
      >
        {currentPost && (
          <div>
            <Typography.Title level={4}>{currentPost.postTitle}</Typography.Title>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <span>作者: {currentPost.username}</span>
                <span>发布时间: {dayjs(currentPost.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                <span>所属板块: {currentPost.sectionName ? <Tag color="blue">{currentPost.sectionName}</Tag> : <Tag color="default">未分类</Tag>}</span>
              </Space>
            </div>
            
            {/* 帖子内容 */}
            <div 
              dangerouslySetInnerHTML={{ __html: currentPost.postContent || currentPost.postSummary || '' }}
              style={{ 
                padding: 16, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 4,
                minHeight: 200,
                maxHeight: 400,
                overflow: 'auto'
              }}
            />
            
            {/* 帖子标签/知识点 */}
            {currentPost.knowledgePoints && currentPost.knowledgePoints.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Text strong>知识点:</Text>
                <div>
                  {currentPost.knowledgePoints.map(point => (
                    <Tag key={point.knowledgePointId}>{point.knowledgePointName}</Tag>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ marginTop: 16 }}>
              <Space>
                <span><EyeOutlined /> {currentPost.postViews} 浏览</span>
                <span><LikeOutlined /> {currentPost.postLikes} 点赞</span>
                <span><MessageOutlined /> {currentPost.postComments} 评论</span>
              </Space>
            </div>
            
            {/* 帖子状态信息 */}
            <div style={{ marginTop: 16 }}>
              <Text strong>帖子状态: </Text>
              <Space>
                {currentPost.isTop && <Tag color="blue">置顶</Tag>}
                {currentPost.isEssence && <Tag color="gold">精华</Tag>}
                {currentPost.postStatus === 0 && <Tag color="green">正常</Tag>}
                {currentPost.postStatus === 1 && <Tag color="orange">已锁定</Tag>}
                {currentPost.postStatus === 2 && <Tag color="red">已隐藏</Tag>}
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 举报详情 */}
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
        ]}
      >
        {currentPost && (
          <div>
            <Typography.Title level={5}>{currentPost.postTitle}</Typography.Title>
            <div style={{ marginBottom: 16 }}>
              <Text>举报次数: <Tag color="red">1</Tag></Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>举报理由:</Text>
              <ul>
                <li>违规内容</li>
              </ul>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>处理建议:</Text>
              <Radio.Group defaultValue="ignore">
                <Space direction="vertical">
                  <Radio value="ignore">忽略举报（不处理）</Radio>
                  <Radio value="warn">警告作者</Radio>
                  <Radio value="hide">隐藏帖子</Radio>
                  <Radio value="delete">删除帖子</Radio>
                </Space>
              </Radio.Group>
            </div>
            <div>
              <Text strong>管理员备注:</Text>
              <Input.TextArea rows={3} placeholder="请输入处理备注（可选）" />
            </div>
          </div>
        )}
      </Modal>

      {/* 帖子删除确认弹窗 */}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 22, marginRight: 16 }} />
          <span>确定要删除该帖子吗？删除后将不可恢复</span>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default PostsList; 