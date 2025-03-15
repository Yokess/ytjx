import React, { useState } from 'react';
import { Typography, Input, Button, Select, Tag, Avatar, Tabs, Card, Skeleton, Divider, Badge, Space } from 'antd';
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
  const [selectedSection, setSelectedSection] = useState('all');

  // 侧边栏内容
  const sidebarContent = (
    <div className={styles.sidebar}>
      {/* 用户信息卡片 */}
      <Card className={styles.userCard}>
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
      </Card>

      {/* 社区导航 */}
      <Card 
        title="社区板块" 
        className={styles.sectionCard}
        headStyle={{ background: 'linear-gradient(to right, #4f46e5, #8b5cf6)', color: 'white' }}
      >
        <div className={styles.sectionList}>
          {sections.map((section, index) => (
            <div 
              key={index} 
              className={styles.sectionItem}
              onClick={() => setSelectedSection(section.name)}
            >
              <div className={styles.sectionInfo}>
                {section.icon}
                <Text strong>{section.name}</Text>
              </div>
              <Tag color={section.color}>{section.count}</Tag>
            </div>
          ))}
        </div>
      </Card>

      {/* 热门标签 */}
      <Card 
        title="热门标签" 
        className={styles.tagsCard}
        headStyle={{ background: 'linear-gradient(to right, #4f46e5, #8b5cf6)', color: 'white' }}
      >
        <div className={styles.tagCloud}>
          {hotTags.map((tag, index) => (
            <Tag 
              key={index} 
              className={styles.tagItem}
              color={index % 2 === 0 ? undefined : 'blue'}
            >
              #{tag}
            </Tag>
          ))}
        </div>
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
          <Input 
            placeholder="搜索帖子..." 
            prefix={<SearchOutlined />} 
            className={styles.searchInput} 
          />
          <Button type="primary" icon={<PlusOutlined />}>
            发布帖子
          </Button>
        </div>
      </div>

      {/* 专栏推荐 */}
      <div className={styles.columnsSection}>
        <div className={styles.sectionHeader}>
          <Title level={4}>精选专栏</Title>
          <a href="#" className={styles.viewMore}>查看全部</a>
        </div>
        <div className={styles.columnsList}>
          {columns.map(column => (
            <Card key={column.id} className={styles.columnCard}>
              <div 
                className={styles.columnCover} 
                style={{ background: column.cover }}
              >
                <div className={styles.columnTitle}>{column.title}</div>
              </div>
              <div className={styles.columnContent}>
                <div className={styles.columnAuthor}>
                  <Avatar src={column.author.avatar} />
                  <div>
                    <Text strong>{column.author.name}</Text>
                    <div className={styles.authorTitle}>{column.author.title}</div>
                  </div>
                </div>
                <Paragraph ellipsis={{ rows: 2 }} className={styles.columnDesc}>
                  {column.description}
                </Paragraph>
                <div className={styles.columnMeta}>
                  <Text type="secondary">已更新：{column.articles}篇</Text>
                  <Text type="secondary">阅读：{column.views}</Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
            defaultValue="all" 
            className={styles.sectionSelect}
          >
            <Option value="all">全部板块</Option>
            {sections.map((section, index) => (
              <Option key={index} value={section.name}>{section.name}</Option>
            ))}
          </Select>
        </div>

        {/* 帖子列表 */}
        <div className={styles.postsList}>
          {posts.map(post => (
            <Card key={post.id} className={styles.postCard}>
              <div className={styles.postTags}>
                {post.tags.map((tag, index) => (
                  <Tag key={index} color={post.tagColors[index]}>{tag}</Tag>
                ))}
              </div>
              <div className={styles.postMain}>
                <div className={styles.postContent}>
                  <Title level={5} className={styles.postTitle}>
                    <a href="#">{post.title}</a>
                  </Title>
                  {post.content && (
                    <Paragraph ellipsis={{ rows: 2 }} className={styles.postExcerpt}>
                      {post.content}
                    </Paragraph>
                  )}
                  <div className={styles.postMeta}>
                    <div className={styles.postAuthor}>
                      <Avatar size="small" src={post.author.avatar} />
                      <Text>{post.author.name}</Text>
                    </div>
                    <Text type="secondary">{post.date}</Text>
                    <Text type="secondary">阅读 {post.views}</Text>
                  </div>
                </div>
                <div className={styles.postStats}>
                  <div className={styles.statItem}>
                    <MessageOutlined />
                    <span>{post.comments}</span>
                  </div>
                  <div className={styles.statItem}>
                    <EyeOutlined />
                    <span>{post.views}</span>
                  </div>
                </div>
              </div>
              {post.postTags && (
                <div className={styles.postFooter}>
                  <Space size={[0, 8]} wrap>
                    {post.postTags.map((tag, index) => (
                      <Tag key={index} color="blue">{`#${tag}`}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* 分页 */}
        <div className={styles.pagination}>
          <Button type="text">上一页</Button>
          <Button type="primary">1</Button>
          <Button type="text">2</Button>
          <Button type="text">3</Button>
          <Button type="text">下一页</Button>
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