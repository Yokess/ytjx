import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Avatar,
  Popconfirm,
  Badge,
  Typography,
  Row,
  Col,
  Divider,
  Switch,
  Tabs,
  Dropdown
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CommentOutlined,
  LikeOutlined,
  DislikeOutlined,
  ClockCircleOutlined,
  PushpinOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  DownOutlined
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

// 帖子类型定义
interface PostType {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  section: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'published' | 'hidden' | 'flagged' | 'deleted';
  isPinned: boolean;
  isHot: boolean;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

// 生成模拟帖子数据
const generateMockPosts = (count: number): PostType[] => {
  const sections = ['考试交流', '学习心得', '资料分享', '经验交流', '求助讨论'];
  const tags = ['考研', 'Java', 'Python', '前端', '后端', 'AI', '大数据', '算法', '网络', '操作系统'];
  const statuses = ['published', 'hidden', 'flagged', 'deleted'] as const;
  
  return Array.from({ length: count }).map((_, index) => {
    const id = index + 1;
    const authorId = Math.floor(Math.random() * 100) + 1;
    const now = dayjs();
    const randomDays = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 24);
    const createdAt = now.subtract(randomDays, 'day').subtract(randomHours, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const updatedHours = Math.floor(Math.random() * randomHours);
    const updatedAt = dayjs(createdAt).add(updatedHours, 'hour').format('YYYY-MM-DD HH:mm:ss');
    
    // 随机生成标签
    const postTags: string[] = [];
    const tagCount = Math.floor(Math.random() * 3) + 1;
    const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
    postTags.push(...shuffledTags.slice(0, tagCount));
    
    // 随机生成状态，让大多数帖子为已发布状态
    const randomStatus = Math.random();
    let status: typeof statuses[number];
    if (randomStatus < 0.8) {
      status = 'published';
    } else if (randomStatus < 0.9) {
      status = 'hidden';
    } else if (randomStatus < 0.95) {
      status = 'flagged';
    } else {
      status = 'deleted';
    }
    
    return {
      id,
      title: `帖子标题 ${id}: ${postTags[0]} 相关讨论`,
      content: `这是帖子 ${id} 的详细内容。包含多个段落的文本内容，讨论关于 ${postTags.join('、')} 相关的话题...`,
      authorId,
      authorName: `用户${authorId}`,
      authorAvatar: `https://api.ytjx.com/static/avatars/user${authorId}.jpg`,
      section: sections[Math.floor(Math.random() * sections.length)],
      tags: postTags,
      viewCount: Math.floor(Math.random() * 1000) + 10,
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      status,
      isPinned: Math.random() < 0.1, // 10%概率为置顶
      isHot: Math.random() < 0.2, // 20%概率为热门
      isRecommended: Math.random() < 0.15, // 15%概率为推荐
      createdAt,
      updatedAt,
    };
  });
};

const mockPosts = generateMockPosts(50);

const PostsManager: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const [editForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    section: '',
    status: '',
    tag: '',
    keyword: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [pagination.current, pagination.pageSize, filters]);

  // 获取帖子列表
  const fetchPosts = async () => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      // 过滤帖子
      let filteredPosts = [...mockPosts];
      
      if (filters.section) {
        filteredPosts = filteredPosts.filter(post => post.section === filters.section);
      }
      
      if (filters.status) {
        filteredPosts = filteredPosts.filter(post => post.status === filters.status);
      }
      
      if (filters.tag) {
        filteredPosts = filteredPosts.filter(post => post.tags.includes(filters.tag));
      }
      
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredPosts = filteredPosts.filter(
          post => post.title.toLowerCase().includes(keyword) || 
                 post.content.toLowerCase().includes(keyword) ||
                 post.authorName.toLowerCase().includes(keyword)
        );
      }
      
      // 计算分页
      const total = filteredPosts.length;
      const { current, pageSize } = pagination;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const paginatedPosts = filteredPosts.slice(start, end);
      
      setPosts(paginatedPosts);
      setPagination(prev => ({ ...prev, total }));
      setLoading(false);
    }, 500);
  };

  // 处理查看帖子
  const handleViewPost = (post: PostType) => {
    setCurrentPost(post);
    setViewModalVisible(true);
  };

  // 处理编辑帖子
  const handleEditPost = (post: PostType) => {
    setCurrentPost(post);
    editForm.setFieldsValue({
      ...post,
      tags: post.tags.join(','),
    });
    setEditModalVisible(true);
  };

  // 处理保存帖子
  const handleSavePost = () => {
    editForm.validateFields().then(values => {
      if (!currentPost) return;
      
      // 处理tags
      const tags = values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      
      // 更新帖子
      const updatedPost: PostType = {
        ...currentPost,
        ...values,
        tags,
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      
      // 更新帖子列表
      setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
      
      setEditModalVisible(false);
      message.success('帖子已更新');
    });
  };

  // 处理删除帖子
  const handleDeletePost = (postId: number) => {
    // 软删除，仅更改状态
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'deleted' } : post
    ));
    message.success('帖子已删除');
  };

  // 处理置顶状态切换
  const handleTogglePin = (post: PostType) => {
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, isPinned: !p.isPinned } : p
    ));
    message.success(`帖子已${post.isPinned ? '取消置顶' : '置顶'}`);
  };

  // 处理热门状态切换
  const handleToggleHot = (post: PostType) => {
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, isHot: !p.isHot } : p
    ));
    message.success(`已${post.isHot ? '取消' : '设为'}热门帖子`);
  };

  // 处理推荐状态切换
  const handleToggleRecommend = (post: PostType) => {
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, isRecommended: !p.isRecommended } : p
    ));
    message.success(`已${post.isRecommended ? '取消' : '设为'}推荐帖子`);
  };

  // 处理状态变更
  const handleStatusChange = (post: PostType, status: 'published' | 'hidden' | 'flagged') => {
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, status } : p
    ));
    
    const statusMap = {
      published: '已发布',
      hidden: '已隐藏',
      flagged: '已标记'
    };
    
    message.success(`帖子状态已更改为${statusMap[status]}`);
  };

  // 处理分页变化
  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    }));
  };

  // 处理筛选变化
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      section: '',
      status: '',
      tag: '',
      keyword: '',
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 渲染帖子状态标签
  const renderStatusTag = (status: string) => {
    switch (status) {
      case 'published':
        return <Tag color="success">已发布</Tag>;
      case 'hidden':
        return <Tag color="warning">已隐藏</Tag>;
      case 'flagged':
        return <Tag color="error">已标记</Tag>;
      case 'deleted':
        return <Tag color="default">已删除</Tag>;
      default:
        return null;
    }
  };

  // 表格列配置
  const columns: ColumnsType<PostType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.isPinned && <PushpinOutlined style={{ color: '#f5222d' }} />}
          {record.isHot && <FireOutlined style={{ color: '#fa8c16' }} />}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
      width: 100,
      render: (text, record) => (
        <Space>
          <Avatar size="small" src={record.authorAvatar} icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '版块',
      dataIndex: 'section',
      key: 'section',
      width: 120,
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '数据',
      key: 'stats',
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="浏览量">
            <Space>
              <EyeOutlined />
              <span>{record.viewCount}</span>
            </Space>
          </Tooltip>
          <Tooltip title="点赞数">
            <Space>
              <LikeOutlined />
              <span>{record.likeCount}</span>
            </Space>
          </Tooltip>
          <Tooltip title="评论数">
            <Space>
              <CommentOutlined />
              <span>{record.commentCount}</span>
            </Space>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 100,
      render: renderStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewPost(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditPost(record)}
            disabled={record.status === 'deleted'} 
          />
          {record.status !== 'deleted' && (
            <Popconfirm
              title="确定要删除此帖子吗？"
              onConfirm={() => handleDeletePost(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          )}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'pin',
                  label: record.isPinned ? '取消置顶' : '置顶',
                  icon: <PushpinOutlined />,
                  onClick: () => handleTogglePin(record),
                  disabled: record.status === 'deleted',
                },
                {
                  key: 'hot',
                  label: record.isHot ? '取消热门' : '设为热门',
                  icon: <FireOutlined />,
                  onClick: () => handleToggleHot(record),
                  disabled: record.status === 'deleted',
                },
                {
                  key: 'recommend',
                  label: record.isRecommended ? '取消推荐' : '设为推荐',
                  icon: <LikeOutlined />,
                  onClick: () => handleToggleRecommend(record),
                  disabled: record.status === 'deleted',
                },
                { type: 'divider' },
                {
                  key: 'publish',
                  label: '发布',
                  icon: <CheckCircleOutlined />,
                  onClick: () => handleStatusChange(record, 'published'),
                  disabled: record.status === 'published' || record.status === 'deleted',
                },
                {
                  key: 'hide',
                  label: '隐藏',
                  icon: <StopOutlined />,
                  onClick: () => handleStatusChange(record, 'hidden'),
                  disabled: record.status === 'hidden' || record.status === 'deleted',
                },
                {
                  key: 'flag',
                  label: '标记',
                  icon: <ExclamationCircleOutlined />,
                  onClick: () => handleStatusChange(record, 'flagged'),
                  disabled: record.status === 'flagged' || record.status === 'deleted',
                },
              ],
            }}
          >
            <Button type="text" icon={<DownOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Card
        title="帖子管理"
        extra={
          <Space>
            <Button onClick={handleResetFilters}>重置筛选</Button>
            <Button type="primary">刷新数据</Button>
          </Space>
        }
      >
        {/* 筛选条件 */}
        <div style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item label="关键词">
              <Input
                placeholder="标题/内容/作者"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                style={{ width: 180 }}
                allowClear
              />
            </Form.Item>
            <Form.Item label="版块">
              <Select
                placeholder="选择版块"
                value={filters.section || undefined}
                onChange={(value) => handleFilterChange('section', value || '')}
                style={{ width: 150 }}
                allowClear
              >
                <Option value="考试交流">考试交流</Option>
                <Option value="学习心得">学习心得</Option>
                <Option value="资料分享">资料分享</Option>
                <Option value="经验交流">经验交流</Option>
                <Option value="求助讨论">求助讨论</Option>
              </Select>
            </Form.Item>
            <Form.Item label="状态">
              <Select
                placeholder="选择状态"
                value={filters.status || undefined}
                onChange={(value) => handleFilterChange('status', value || '')}
                style={{ width: 120 }}
                allowClear
              >
                <Option value="published">已发布</Option>
                <Option value="hidden">已隐藏</Option>
                <Option value="flagged">已标记</Option>
                <Option value="deleted">已删除</Option>
              </Select>
            </Form.Item>
            <Form.Item label="标签">
              <Select
                placeholder="选择标签"
                value={filters.tag || undefined}
                onChange={(value) => handleFilterChange('tag', value || '')}
                style={{ width: 120 }}
                allowClear
              >
                <Option value="考研">考研</Option>
                <Option value="Java">Java</Option>
                <Option value="Python">Python</Option>
                <Option value="前端">前端</Option>
                <Option value="后端">后端</Option>
                <Option value="AI">AI</Option>
                <Option value="大数据">大数据</Option>
                <Option value="算法">算法</Option>
                <Option value="网络">网络</Option>
                <Option value="操作系统">操作系统</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>

        {/* 帖子列表 */}
        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 查看帖子弹窗 */}
      <Modal
        title="查看帖子"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentPost && (
          <div>
            <Title level={4}>{currentPost.title}</Title>
            <div style={{ marginBottom: 16 }}>
              <Space wrap>
                {currentPost.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
                {currentPost.isPinned && <Tag color="red">置顶</Tag>}
                {currentPost.isHot && <Tag color="orange">热门</Tag>}
                {currentPost.isRecommended && <Tag color="purple">推荐</Tag>}
                {renderStatusTag(currentPost.status)}
              </Space>
            </div>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Space>
                  <Avatar src={currentPost.authorAvatar} icon={<UserOutlined />} />
                  <Text strong>{currentPost.authorName}</Text>
                </Space>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Space>
                  <ClockCircleOutlined />
                  <Text type="secondary">{currentPost.createdAt}</Text>
                </Space>
              </Col>
            </Row>
            
            <Divider />
            
            <Paragraph style={{ minHeight: 150 }}>
              {currentPost.content}
            </Paragraph>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Space>
                  <Space>
                    <EyeOutlined />
                    <span>{currentPost.viewCount}</span>
                  </Space>
                  <Space>
                    <LikeOutlined />
                    <span>{currentPost.likeCount}</span>
                  </Space>
                  <Space>
                    <CommentOutlined />
                    <span>{currentPost.commentCount}</span>
                  </Space>
                </Space>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text type="secondary">最后更新: {currentPost.updatedAt}</Text>
              </Col>
            </Row>
            
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setViewModalVisible(false)}>关闭</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setViewModalVisible(false);
                    handleEditPost(currentPost);
                  }}
                  disabled={currentPost.status === 'deleted'}
                >
                  编辑
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑帖子弹窗 */}
      <Modal
        title="编辑帖子"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSavePost}
        width={700}
      >
        {currentPost && (
          <Form
            form={editForm}
            layout="vertical"
            initialValues={{
              ...currentPost,
              tags: currentPost.tags.join(','),
            }}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入帖子标题" />
            </Form.Item>
            
            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <TextArea rows={8} placeholder="请输入帖子内容" />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="section"
                  label="版块"
                  rules={[{ required: true, message: '请选择版块' }]}
                >
                  <Select placeholder="请选择版块">
                    <Option value="考试交流">考试交流</Option>
                    <Option value="学习心得">学习心得</Option>
                    <Option value="资料分享">资料分享</Option>
                    <Option value="经验交流">经验交流</Option>
                    <Option value="求助讨论">求助讨论</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tags"
                  label="标签"
                  rules={[{ required: true, message: '请输入标签' }]}
                >
                  <Input placeholder="标签之间用逗号分隔" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="isPinned" valuePropName="checked">
                  <Switch checkedChildren="置顶" unCheckedChildren="不置顶" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="isHot" valuePropName="checked">
                  <Switch checkedChildren="热门" unCheckedChildren="不热门" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="isRecommended" valuePropName="checked">
                  <Switch checkedChildren="推荐" unCheckedChildren="不推荐" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="published">发布</Option>
                <Option value="hidden">隐藏</Option>
                <Option value="flagged">标记</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default PostsManager; 