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
  Switch,
  Tooltip,
  Badge,
  DatePicker,
  Typography,
  Radio,
  Dropdown,
  Menu,
  TablePaginationConfig
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  PushpinOutlined,
  FireOutlined,
  WarningOutlined,
  StopOutlined,
  DownOutlined
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

// 帖子类型定义
interface PostType {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  sectionId: number;
  sectionName: string;
  createTime: string;
  updateTime: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: number; // 0: 正常, 1: 置顶, 2: 精华, 3: 置顶+精华, 4: 禁止回复, 5: 已隐藏, 6: 已删除
  isDeleted: boolean;
  isReported: boolean;
  reportCount: number;
  reportReasons?: string[];
  attachmentCount: number;
  lastReplyTime: string;
  lastReplierName: string;
}

// 模拟帖子数据
const generateMockPosts = (count: number): PostType[] => {
  const sectionNames = ['考研经验交流', '考研资料分享', '院校信息讨论', '考研政治', '考研英语', '考研数学', '专业课交流', '跨专业考研', '调剂信息', '心理健康'];
  const authorNames = ['学习达人', '考研小白', '考研老兵', 'PhD申请者', '跨考勇士', '英语高手', '数学爱好者', '考研斗士', '保研人', '未来的研究生'];
  const titles = [
    '考研备考经验分享，这一年我是如何从专业倒数到上岸的',
    '超全的考研政治最后冲刺资料，不看后悔系列',
    '某985院校计算机专业考研真题解析+考试重点',
    '跨考金融有哪些难点？我是怎么克服的',
    '二战考研，我的失败与成功之路',
    '考研英语长难句分析与解读技巧',
    '考研数学高频考点总结与解题思路',
    '调剂信息：X大学各专业接收调剂情况汇总',
    '考研期间如何调整心态，避免焦虑抑郁',
    '保研VS考研：我的选择与思考',
    '考研初试215分，复试被刷，血泪教训分享',
    '如何选择最适合自己的考研院校和专业',
    '考研专业课复习方法与技巧分享',
    '考研期间如何合理安排时间',
    '英语一VS英语二：如何选择适合自己的考试类型',
  ];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = index + 1;
    const status = [0, 0, 0, 1, 2, 3, 0, 0, 4, 0, 0, 0, 5][id % 13];
    const isReported = id % 17 === 0;
    const reportCount = isReported ? Math.floor(Math.random() * 5) + 1 : 0;
    const reportReasons = isReported ? ['垃圾广告', '政治敏感', '违规内容', '人身攻击'].slice(0, reportCount) : [];
    
    // 随机日期：过去1年内
    const randomDays = Math.floor(Math.random() * 365);
    const createDate = dayjs().subtract(randomDays, 'day');
    const lastReplyDate = dayjs(createDate).add(Math.floor(Math.random() * randomDays), 'day');
    
    return {
      id,
      title: titles[id % titles.length],
      content: `这是帖子内容，包含了${sectionNames[id % sectionNames.length]}相关的讨论内容...`,
      authorId: 1000 + id,
      authorName: authorNames[id % authorNames.length],
      authorAvatar: `https://api.ytjx.com/static/avatars/avatar${(id % 10) + 1}.jpg`,
      sectionId: (id % 10) + 1,
      sectionName: sectionNames[id % sectionNames.length],
      createTime: createDate.format('YYYY-MM-DD HH:mm:ss'),
      updateTime: createDate.add(Math.floor(Math.random() * 7), 'day').format('YYYY-MM-DD HH:mm:ss'),
      viewCount: Math.floor(Math.random() * 1000) + 50,
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      status,
      isDeleted: status === 6,
      isReported,
      reportCount,
      reportReasons,
      attachmentCount: Math.floor(Math.random() * 3),
      lastReplyTime: lastReplyDate.format('YYYY-MM-DD HH:mm:ss'),
      lastReplierName: authorNames[(id + 3) % authorNames.length],
    };
  });
};

const mockPosts = generateMockPosts(50);

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchForm] = Form.useForm();

  // 帖子内容预览弹窗状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  
  // 举报详情弹窗状态
  const [reportVisible, setReportVisible] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // 获取帖子列表
  const fetchPosts = async () => {
    setLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      setPosts(mockPosts);
      setPagination({
        ...pagination,
        total: mockPosts.length,
      });
      setLoading(false);
    }, 500);
  };

  // 搜索帖子
  const handleSearch = (values: any) => {
    setLoading(true);
    
    // 模拟搜索过滤
    setTimeout(() => {
      let filteredPosts = [...mockPosts];
      
      // 关键词过滤
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(keyword) || 
          post.content.toLowerCase().includes(keyword) ||
          post.authorName.toLowerCase().includes(keyword)
        );
      }
      
      // 板块过滤
      if (values.sectionId) {
        filteredPosts = filteredPosts.filter(post => post.sectionId === values.sectionId);
      }
      
      // 状态过滤
      if (values.status !== undefined) {
        filteredPosts = filteredPosts.filter(post => post.status === values.status);
      }
      
      // 时间范围过滤
      if (values.timeRange && values.timeRange.length === 2) {
        const startTime = values.timeRange[0].startOf('day');
        const endTime = values.timeRange[1].endOf('day');
        
        filteredPosts = filteredPosts.filter(post => {
          const postTime = dayjs(post.createTime);
          return postTime.isAfter(startTime) && postTime.isBefore(endTime);
        });
      }
      
      // 是否被举报
      if (values.isReported !== undefined) {
        filteredPosts = filteredPosts.filter(post => post.isReported === values.isReported);
      }
      
      setPosts(filteredPosts);
      setPagination({
        ...pagination,
        current: 1,
        total: filteredPosts.length,
      });
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetchPosts();
  };

  // 查看帖子
  const handleViewPost = (post: PostType) => {
    setCurrentPost(post);
    setPreviewVisible(true);
  };

  // 查看举报详情
  const handleViewReport = (post: PostType) => {
    setCurrentPost(post);
    setReportVisible(true);
  };

  // 删除帖子
  const handleDeletePost = (postId: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除该帖子吗？删除后将不可恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 模拟 API 请求
        setTimeout(() => {
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId ? { ...post, status: 6, isDeleted: true } : post
            )
          );
          message.success('帖子已删除');
        }, 500);
      }
    });
  };

  // 帖子操作：置顶/取消置顶
  const handleTogglePin = (post: PostType) => {
    const isCurrentlyPinned = post.status === 1 || post.status === 3;
    const newStatus = isCurrentlyPinned 
      ? (post.status === 3 ? 2 : 0) // 如果是置顶+精华，则变为仅精华；如果仅置顶，则变为普通
      : (post.status === 2 ? 3 : 1); // 如果是精华，则变为置顶+精华；如果是普通，则变为置顶
    
    // 模拟 API 请求
    setTimeout(() => {
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id ? { ...p, status: newStatus } : p
        )
      );
      message.success(isCurrentlyPinned ? '已取消置顶' : '已置顶');
    }, 500);
  };

  // 帖子操作：设为精华/取消精华
  const handleToggleEssence = (post: PostType) => {
    const isCurrentlyEssence = post.status === 2 || post.status === 3;
    const newStatus = isCurrentlyEssence 
      ? (post.status === 3 ? 1 : 0) // 如果是置顶+精华，则变为仅置顶；如果仅精华，则变为普通
      : (post.status === 1 ? 3 : 2); // 如果是置顶，则变为置顶+精华；如果是普通，则变为精华
    
    // 模拟 API 请求
    setTimeout(() => {
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id ? { ...p, status: newStatus } : p
        )
      );
      message.success(isCurrentlyEssence ? '已取消精华' : '已设为精华');
    }, 500);
  };

  // 帖子操作：禁止回复/允许回复
  const handleToggleLock = (post: PostType) => {
    const isCurrentlyLocked = post.status === 4;
    const newStatus = isCurrentlyLocked ? 0 : 4;
    
    // 模拟 API 请求
    setTimeout(() => {
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id ? { ...p, status: newStatus } : p
        )
      );
      message.success(isCurrentlyLocked ? '已允许回复' : '已禁止回复');
    }, 500);
  };

  // 帖子操作：隐藏/显示
  const handleToggleHide = (post: PostType) => {
    const isCurrentlyHidden = post.status === 5;
    const newStatus = isCurrentlyHidden ? 0 : 5;
    
    // 模拟 API 请求
    setTimeout(() => {
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id ? { ...p, status: newStatus } : p
        )
      );
      message.success(isCurrentlyHidden ? '帖子已显示' : '帖子已隐藏');
    }, 500);
  };

  // 处理举报
  const handleProcessReport = () => {
    if (!currentPost) return;
    
    // 模拟 API 请求
    setTimeout(() => {
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === currentPost.id ? { ...p, isReported: false, reportCount: 0, reportReasons: [] } : p
        )
      );
      message.success('举报已处理');
      setReportVisible(false);
    }, 500);
  };

  // 表格列定义
  const columns: ColumnsType<PostType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '帖子标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.status === 1 || record.status === 3 ? <PushpinOutlined style={{ color: 'red' }} /> : null}
          {record.status === 2 || record.status === 3 ? <StarOutlined style={{ color: 'gold' }} /> : null}
          {record.status === 4 ? <StopOutlined style={{ color: 'orange' }} /> : null}
          {record.status === 5 ? <StopOutlined style={{ color: 'gray' }} /> : null}
          {record.isReported ? <WarningOutlined style={{ color: 'red' }} /> : null}
          <Text 
            style={{ 
              textDecoration: record.isDeleted ? 'line-through' : 'none',
              color: record.isDeleted ? '#999' : 'inherit' 
            }}
          >
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
      width: 120,
    },
    {
      title: '板块',
      dataIndex: 'sectionName',
      key: 'sectionName',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '最后回复',
      dataIndex: 'lastReplyTime',
      key: 'lastReplyTime',
      width: 150,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <small>by {record.lastReplierName}</small>
        </div>
      ),
    },
    {
      title: '统计',
      key: 'stats',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="浏览量">
            <span><EyeOutlined /> {record.viewCount}</span>
          </Tooltip>
          <Tooltip title="点赞数">
            <span><LikeOutlined /> {record.likeCount}</span>
          </Tooltip>
          <Tooltip title="评论数">
            <span><MessageOutlined /> {record.commentCount}</span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let text = '正常';
        let color = 'default';
        
        switch (status) {
          case 1:
            text = '置顶';
            color = 'blue';
            break;
          case 2:
            text = '精华';
            color = 'gold';
            break;
          case 3:
            text = '置顶+精华';
            color = 'purple';
            break;
          case 4:
            text = '禁止回复';
            color = 'orange';
            break;
          case 5:
            text = '已隐藏';
            color = 'gray';
            break;
          case 6:
            text = '已删除';
            color = 'red';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
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
            disabled={record.isDeleted}
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
              举报({record.reportCount})
            </Button>
          )}
          
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  icon: <PushpinOutlined />,
                  label: ((record.status === 1 || record.status === 3) ? '取消置顶' : '置顶'),
                  onClick: () => handleTogglePin(record),
                  disabled: record.isDeleted || record.status === 5 || record.status === 6
                },
                {
                  key: '2',
                  icon: <StarOutlined />,
                  label: ((record.status === 2 || record.status === 3) ? '取消精华' : '设为精华'),
                  onClick: () => handleToggleEssence(record),
                  disabled: record.isDeleted || record.status === 5 || record.status === 6
                },
                {
                  key: '3',
                  icon: <StopOutlined />,
                  label: (record.status === 4 ? '允许回复' : '禁止回复'),
                  onClick: () => handleToggleLock(record),
                  disabled: record.isDeleted || record.status === 5 || record.status === 6
                },
                {
                  key: '4',
                  icon: record.status === 5 ? <EyeOutlined /> : <StopOutlined />,
                  label: (record.status === 5 ? '显示帖子' : '隐藏帖子'),
                  onClick: () => handleToggleHide(record),
                  disabled: record.isDeleted || record.status === 6
                },
                {
                  key: '5',
                  icon: <DeleteOutlined />,
                  label: '删除帖子',
                  danger: true,
                  onClick: () => handleDeletePost(record.id),
                  disabled: record.isDeleted
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
                  {mockPosts
                    .map(post => ({ id: post.sectionId, name: post.sectionName }))
                    .filter((item, index, self) => self.findIndex(t => t.id === item.id) === index)
                    .map(section => (
                      <Option key={section.id} value={section.id}>{section.name}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status">
                <Select placeholder="帖子状态" allowClear>
                  <Option value={0}>普通</Option>
                  <Option value={1}>置顶</Option>
                  <Option value={2}>精华</Option>
                  <Option value={3}>置顶+精华</Option>
                  <Option value={4}>禁止回复</Option>
                  <Option value={5}>已隐藏</Option>
                  <Option value={6}>已删除</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="isReported" valuePropName="checked">
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

        {/* 帖子列表表格 */}
        <Table
          columns={columns}
          dataSource={posts}
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
        />
      </Card>

      {/* 帖子详情预览 */}
      <Modal
        title="帖子详情"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={700}
      >
        {currentPost && (
          <div>
            <Typography.Title level={4}>{currentPost.title}</Typography.Title>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <span>作者: {currentPost.authorName}</span>
                <span>发布时间: {currentPost.createTime}</span>
                <span>所属板块: <Tag color="blue">{currentPost.sectionName}</Tag></span>
              </Space>
            </div>
            <Paragraph
              style={{ 
                padding: 16, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 4,
                minHeight: 200
              }}
            >
              {currentPost.content}
              {currentPost.attachmentCount > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text strong>附件 ({currentPost.attachmentCount}):</Text>
                  <ul>
                    {Array.from({ length: currentPost.attachmentCount }).map((_, index) => (
                      <li key={index}>
                        <a href="#">附件{index + 1}.pdf</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Paragraph>
            <div style={{ marginTop: 16 }}>
              <Space>
                <span><EyeOutlined /> {currentPost.viewCount} 浏览</span>
                <span><LikeOutlined /> {currentPost.likeCount} 点赞</span>
                <span><MessageOutlined /> {currentPost.commentCount} 评论</span>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 举报详情 */}
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
        ]}
      >
        {currentPost && (
          <div>
            <Typography.Title level={5}>{currentPost.title}</Typography.Title>
            <div style={{ marginBottom: 16 }}>
              <Text>举报次数: <Tag color="red">{currentPost.reportCount}</Tag></Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>举报理由:</Text>
              <ul>
                {currentPost.reportReasons?.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
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
    </AdminLayout>
  );
};

export default PostsList; 