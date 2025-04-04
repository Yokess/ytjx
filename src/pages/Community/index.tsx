import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Select, Tag, Avatar, Tabs, Card, Skeleton, Divider, Badge, Space, message, Pagination } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  MessageOutlined, 
  FireOutlined,
  StarOutlined,
  LikeOutlined,
  TeamOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import styles from './Community.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import { getPosts, getSections } from '../../api/communityApi';
import type { Post, Section, PageResult } from '../../types/community';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 模拟数据 - 专栏
const columns = [
  {
    id: 1,
    title: '考研数学进阶指南',
    cover: 'linear-gradient(to right, #4f46e5, #3b82f6)',
    author: {
      name: '李教授',
      avatar: 'https://joeschmoe.io/api/v1/random',
      title: '北京大学数学系'
    },
    description: '从基础到高阶，全面解析考研数学常见难点和解题技巧，助你攻克数学难关。',
    articles: 12,
    views: 3200
  },
  {
    id: 2,
    title: '英语写作高分技巧',
    cover: 'linear-gradient(to right, #8b5cf6, #ec4899)',
    author: {
      name: '王老师',
      avatar: 'https://joeschmoe.io/api/v1/random',
      title: '复旦大学外语学院'
    },
    description: '掌握考研英语写作的核心技巧，从词汇、句型到文章结构，全方位提升你的英语写作能力。',
    articles: 8,
    views: 2800
  },
  {
    id: 3,
    title: '考研心理调适指南',
    cover: 'linear-gradient(to right, #10b981, #0d9488)',
    author: {
      name: '张心理师',
      avatar: 'https://joeschmoe.io/api/v1/random',
      title: '清华大学心理学系'
    },
    description: '如何在备考期间保持良好的心态，应对压力和焦虑，提高学习效率和考试表现。',
    articles: 6,
    views: 1900
  }
];

// 模拟数据 - 帖子
const posts = [
  {
    id: 1,
    title: '2025年考研大纲变化解析及备考建议',
    tags: ['置顶', '官方', '精华'],
    tagColors: ['red', 'blue', 'green'],
    author: {
      name: '研途九霄官方',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-15',
    views: 5600,
    comments: 128,
    likes: 320,
    isOfficial: true
  },
  {
    id: 2,
    title: '数学中的泰勒公式如何理解和应用？',
    content: '我在复习高数时遇到了泰勒公式，但对其几何意义和应用场景不太理解，特别是在求极限和近似计算方面，有没有简单易懂的解释和例子？',
    tags: ['问答讨论', '已解决'],
    tagColors: ['blue', 'green'],
    author: {
      name: '李同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-18',
    views: 342,
    comments: 16,
    likes: 45,
    postTags: ['高等数学', '泰勒公式']
  },
  {
    id: 3,
    title: '从二本到清华：我的考研逆袭之路',
    content: '作为一名普通二本院校的学生，我用一年时间考入清华大学计算机专业。这篇文章分享我的备考经验、学习方法和心态调整技巧，希望能给正在备考的同学一些启发和鼓励。',
    tags: ['经验分享', '精华'],
    tagColors: ['green', 'yellow'],
    author: {
      name: '王同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-10',
    views: 2100,
    comments: 86,
    likes: 230,
    postTags: ['考研经验', '逆袭', '清华大学']
  },
  {
    id: 4,
    title: '2025年北京高校计算机专业考研分析',
    content: '详细分析北京地区各高校计算机专业的招生情况、考试科目、录取分数线变化趋势以及就业前景，帮助大家选择适合自己的目标院校。',
    tags: ['院校信息'],
    tagColors: ['orange'],
    author: {
      name: '赵同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-12',
    views: 1500,
    comments: 42,
    likes: 98,
    postTags: ['北京高校', '计算机专业', '分数线']
  },
  {
    id: 5,
    title: '【北京】考研英语学习小组招募',
    content: '我们是一群备战2025年考研的同学，现招募英语学习小组成员，每周线上+线下结合学习，互相督促，共同进步。要求有一定英语基础，能坚持每天打卡学习。',
    tags: ['学习小组', '招募中'],
    tagColors: ['purple', 'blue'],
    author: {
      name: '林同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-16',
    views: 328,
    comments: 24,
    likes: 36,
    postTags: ['英语学习', '北京', '2025考研']
  }
];

// 模拟数据 - 社区板块
const sections = [
  { name: '问答讨论', icon: <MessageOutlined />, count: 328, color: 'blue' },
  { name: '经验分享', icon: <StarOutlined />, count: 156, color: 'green' },
  { name: '院校信息', icon: <LikeOutlined />, count: 92, color: 'cyan' },
  { name: '学习小组', icon: <TeamOutlined />, count: 64, color: 'purple' },
  { name: '考研资讯', icon: <NotificationOutlined />, count: 108, color: 'red' }
];

// 模拟数据 - 热门标签
const hotTags = [
  '数学', '英语', '政治', '专业课', '复习计划', 
  '考研经验', '北京大学', '清华大学', '复旦大学', '学习方法'
];

// 模拟数据 - 用户信息
const userInfo = {
  name: '张同学',
  avatar: 'https://joeschmoe.io/api/v1/random',
  points: 1280,
  major: '数学专业',
  posts: 42,
  replies: 128,
  favorites: 56
};

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const [selectedSection, setSelectedSection] = useState<number | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  
  // 加载数据
  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const response = await getSections();
        setSections(response.data);
      } catch (error) {
        console.error('获取社区数据失败', error);
        message.error('获取社区数据失败，请稍后重试');
      }
      setLoading(false);
    };
    
    fetchSections();
  }, []);
  
  // 加载精选帖子
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const res = await getPosts({
          pageNum: 1,
          pageSize: 3,
          sortBy: 'featured',
        });
        
        const pageResult: PageResult<Post> = res.data;
        // 过滤出真正的精华帖子
        const essencePosts = pageResult.list.filter(post => post.isEssence === true);
        setFeaturedPosts(essencePosts);
      } catch (error) {
        console.error('获取精选帖子失败', error);
      }
    };
    
    fetchFeaturedPosts();
  }, []);
  
  // 加载帖子数据
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getPosts({
          pageNum: page,
          pageSize,
          sortBy: activeTab as 'latest' | 'hot' | 'featured',
          sectionId: selectedSection !== 'all' ? selectedSection : undefined,
          keyword: searchKeyword || undefined
        });
        
        // 使用新的API响应格式
        const pageResult: PageResult<Post> = res.data;
        setPosts(pageResult.list);
        setTotalPosts(pageResult.total);
      } catch (error) {
        console.error('获取帖子列表失败', error);
        message.error('获取帖子列表失败，请稍后重试');
      }
      setLoading(false);
    };
    
    fetchPosts();
  }, [page, pageSize, activeTab, selectedSection, searchKeyword]);
  
  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPage(1); // 重置为第一页
  };
  
  // 处理发布帖子
  const handleCreatePost = () => {
    navigate('/community/create');
  };
  
  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 帖子数据转换，将新格式转换为页面展示所需格式
  const convertPostForDisplay = (post: Post) => {
    // 构建标签和颜色
    const tags = [];
    const tagColors = [];
    
    if (post.isTop) {
      tags.push('置顶');
      tagColors.push('red');
    }
    
    if (post.isEssence) {
      tags.push('精华');
      tagColors.push('green');
    }
    
    tags.push(post.sectionName);
    tagColors.push('blue');
    
    // 返回转换后的格式
    return {
      id: post.postId,
      title: post.postTitle,
      content: post.postSummary || '',
      tags,
      tagColors,
      author: {
        name: post.username,
        avatar: post.userAvatar || 'https://joeschmoe.io/api/v1/random'
      },
      date: new Date(post.createdAt).toLocaleDateString(),
      views: post.postViews,
      comments: post.postComments,
      likes: post.postLikes
    };
  };
  
  // 侧边栏内容
  const sidebarContent = (
    <div className={styles.sidebar}>
      {/* 用户信息卡片 */}
      <Card className={styles.userCard}>
        {loading ? (
          <Skeleton avatar active paragraph={{ rows: 3 }} />
        ) : (
          <>
            <div className={styles.userInfo}>
              <Avatar size={64} src={userInfo.avatar} />
              <div className={styles.userMeta}>
                <Text strong className={styles.userName}>{userInfo.name}</Text>
                <Text type="secondary">积分：{userInfo.points}</Text>
                <div className={styles.userTags}>
                  <Tag color="blue">{userInfo.major}</Tag>
                </div>
              </div>
            </div>
            <div className={styles.userStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{userInfo.posts}</div>
                <div className={styles.statLabel}>发帖</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{userInfo.replies}</div>
                <div className={styles.statLabel}>回复</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{userInfo.favorites}</div>
                <div className={styles.statLabel}>收藏</div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* 社区导航 */}
      <Card 
        title="社区板块" 
        className={styles.sectionCard}
        headStyle={{ background: 'linear-gradient(to right, #4f46e5, #8b5cf6)', color: 'white' }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <div className={styles.sectionList}>
            <div 
              className={styles.sectionItem}
              onClick={() => setSelectedSection('all')}
            >
              <div className={styles.sectionInfo}>
                <FireOutlined />
                <Text strong>全部帖子</Text>
              </div>
              <Tag color="orange">全部</Tag>
            </div>
            {sections.map((section) => {
              // 选择图标
              const iconMap = {
                '问答讨论': <MessageOutlined />,
                '经验分享': <StarOutlined />,
                '院校信息': <LikeOutlined />,
                '学习小组': <TeamOutlined />,
                '考研资讯': <NotificationOutlined />
              };
              
              // 选择颜色
              const colorMap: Record<string, string> = {
                '问答讨论': 'blue',
                '经验分享': 'green',
                '院校信息': 'cyan',
                '学习小组': 'purple',
                '考研资讯': 'red'
              };
              
              // 默认图标
              const defaultIcon = <MessageOutlined />;
              
              // 根据版块名获取图标
              const icon = iconMap[section.sectionName as keyof typeof iconMap] || defaultIcon;
              const color = colorMap[section.sectionName] || 'blue';
              
              return (
                <div 
                  key={section.sectionId} 
                  className={styles.sectionItem}
                  onClick={() => setSelectedSection(section.sectionId)}
                >
                  <div className={styles.sectionInfo}>
                    {icon}
                    <Text strong>{section.sectionName}</Text>
                  </div>
                  <Tag color={color}>{section.postCount}</Tag>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 热门标签 */}
      <Card 
        title="热门标签" 
        className={styles.tagsCard}
        headStyle={{ background: 'linear-gradient(to right, #4f46e5, #8b5cf6)', color: 'white' }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <div className={styles.tagCloud}>
            {hotTags.map((tag, index) => (
              <Tag 
                key={index} 
                className={styles.tagItem}
                color={index % 2 === 0 ? undefined : 'blue'}
                onClick={() => handleSearch(tag)}
              >
                #{tag}
              </Tag>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  // 主内容
  const mainContent = (
    <div className={styles.communityPage}>
      {/* 页面头部 */}
      <div className={styles.pageHeader}>
        <div>
          <Title level={2}>学习社区</Title>
          <Text type="secondary">与全国考研学子一起交流学习经验</Text>
        </div>
        <div className={styles.headerActions}>
          <Input.Search 
            placeholder="搜索帖子..." 
            onSearch={handleSearch}
            className={styles.searchInput} 
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreatePost}
          >
            发布帖子
          </Button>
        </div>
      </div>

      {/* 精选帖子 */}
      <div className={styles.columnsSection}>
        <div className={styles.sectionHeader}>
          <Title level={4}>精选帖子</Title>
          <Link to="/community?sortBy=featured" className={styles.viewMore}>查看全部</Link>
        </div>
        {loading && featuredPosts.length === 0 ? (
          <div className={styles.columnsList}>
            {[1, 2, 3].map(i => (
              <Card key={i} className={styles.columnCard}>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ) : featuredPosts.length === 0 ? (
          <div className={styles.emptyPosts}>
            <Text type="secondary">暂无精选帖子</Text>
          </div>
        ) : (
          <div className={styles.columnsList}>
            {featuredPosts.map(post => {
              const displayPost = convertPostForDisplay(post);
              return (
                <Card 
                  key={displayPost.id} 
                  className={styles.featuredPostCard}
                  hoverable
                  onClick={() => navigate(`/community/post/${displayPost.id}`)}
                >
                  <div className={styles.postHeader}>
                    <div className={styles.postMeta}>
                      <div className={styles.userInfo}>
                        <Avatar src={displayPost.author.avatar} />
                        <Text strong>{displayPost.author.name}</Text>
                      </div>
                      <div className={styles.postTime}>{displayPost.date}</div>
                    </div>
                    <div className={styles.postTitle}>
                      <Link to={`/community/post/${displayPost.id}`}>{displayPost.title}</Link>
                    </div>
                    <div className={styles.postContent}>
                      <Paragraph ellipsis={{ rows: 2 }}>{displayPost.content}</Paragraph>
                    </div>
                  </div>
                  <div className={styles.postFooter}>
                    <div className={styles.postTags}>
                      {displayPost.tags.map((tag: string, index: number) => (
                        <Tag key={index} color={displayPost.tagColors?.[index] || '#4f46e5'}>{tag}</Tag>
                      ))}
                    </div>
                    <div className={styles.postMeta}>
                      <span><EyeOutlined /> {displayPost.views}</span>
                      <span><MessageOutlined /> {displayPost.comments}</span>
                      <span><LikeOutlined /> {displayPost.likes || 0}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 帖子列表 */}
      <div className={styles.postsSection}>
        <div className={styles.postFilters}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className={styles.postTabs}
          >
            <TabPane tab={<span><FireOutlined />最新发布</span>} key="latest" />
            <TabPane tab="热门讨论" key="hot" />
            <TabPane tab="精华内容" key="featured" />
          </Tabs>
          <Select 
            value={selectedSection} 
            onChange={setSelectedSection}
            className={styles.sectionSelect}
          >
            <Option value="all">全部板块</Option>
            {sections.map((section) => (
              <Option key={section.sectionId} value={section.sectionId}>{section.sectionName}</Option>
            ))}
          </Select>
        </div>

        {/* 帖子列表 */}
        {loading ? (
          <div className={styles.postsList}>
            {[1, 2, 3].map(i => (
              <Card key={i} className={styles.postCard}>
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyPosts}>
            <Title level={4}>暂无相关帖子</Title>
            <Text type="secondary">换个筛选条件试试，或者发布一个新帖子吧！</Text>
          </div>
        ) : (
          <div className={styles.postsList}>
            {posts.map(post => {
              // 将新的API返回数据转换为UI显示所需的格式
              const displayPost = convertPostForDisplay(post);
              
              return (
                <Card 
                  key={displayPost.id} 
                  className={styles.postCard}
                  hoverable
                  onClick={() => navigate(`/community/post/${displayPost.id}`)}
                >
                  <div className={styles.postHeader}>
                    <div className={styles.postMeta}>
                      <div className={styles.userInfo}>
                        <Avatar src={displayPost.author.avatar} />
                        <Text strong>{displayPost.author.name}</Text>
                      </div>
                      <div className={styles.postTime}>{displayPost.date}</div>
                    </div>
                    <div className={styles.postTitle}>
                      <Link to={`/community/post/${displayPost.id}`}>{displayPost.title}</Link>
                    </div>
                    <div className={styles.postContent}>
                      <Paragraph ellipsis={{ rows: 2 }}>{displayPost.content}</Paragraph>
                    </div>
                  </div>
                  <div className={styles.postFooter}>
                    <div className={styles.postTags}>
                      {displayPost.tags.map((tag: string, index: number) => (
                        <Tag key={index} color={displayPost.tagColors?.[index] || '#4f46e5'}>{tag}</Tag>
                      ))}
                    </div>
                    <div className={styles.postMeta}>
                      <span><EyeOutlined /> {displayPost.views}</span>
                      <span><MessageOutlined /> {displayPost.comments}</span>
                      <span><LikeOutlined /> {displayPost.likes || 0}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* 分页 */}
        <div className={styles.pagination}>
          <Pagination 
            current={page}
            pageSize={pageSize}
            total={totalPosts}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout sidebarContent={sidebarContent}>
      {mainContent}
    </MainLayout>
  );
};

export default CommunityPage; 