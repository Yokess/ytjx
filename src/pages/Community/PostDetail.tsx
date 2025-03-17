import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  Avatar, 
  Button, 
  Tag, 
  Divider, 
  Input, 
  Space, 
  Tooltip, 
  List,
  Breadcrumb,
  message
} from 'antd';
import { 
  LikeOutlined, 
  LikeFilled, 
  StarOutlined, 
  StarFilled, 
  ShareAltOutlined, 
  MessageOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TagOutlined,
  FireOutlined
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import styles from './PostDetail.module.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 自定义评论组件
interface CommentProps {
  author: React.ReactNode;
  avatar: React.ReactNode;
  content: React.ReactNode;
  datetime: React.ReactNode;
  actions?: React.ReactNode[];
}

const Comment: React.FC<CommentProps> = ({ 
  author, 
  avatar, 
  content, 
  datetime, 
  actions 
}) => {
  return (
    <div className={styles.comment}>
      <div className={styles.commentAvatar}>
        {avatar}
      </div>
      <div className={styles.commentContent}>
        <div className={styles.commentAuthorRow}>
          {author}
          <div className={styles.commentDatetime}>{datetime}</div>
        </div>
        <div>{content}</div>
        {actions && actions.length > 0 && (
          <div className={styles.commentActions}>
            {actions.map((action, index) => (
              <span key={index} className={styles.commentAction}>
                {action}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 模拟帖子数据
const postData = {
  id: '1',
  title: '考研数学复习经验分享：如何在三个月内提高100分',
  content: `
    <p>大家好，我是一名刚刚结束考研的学生，数学从最初的模拟考试60分提升到了考试的160分。在这里分享一下我的复习经验，希望对大家有所帮助。</p>
    
    <h3>一、基础阶段（第1-4周）</h3>
    <p>这个阶段主要是打基础，我采用的方法是：</p>
    <ol>
      <li>通读教材，掌握基本概念和定理</li>
      <li>做基础题，巩固概念理解</li>
      <li>整理错题，建立错题本</li>
    </ol>
    
    <h3>二、强化阶段（第5-8周）</h3>
    <p>这个阶段主要是强化训练，我采用的方法是：</p>
    <ol>
      <li>刷题，大量刷题，特别是历年真题</li>
      <li>归纳总结解题方法和技巧</li>
      <li>定期复习错题本</li>
    </ol>
    
    <h3>三、冲刺阶段（第9-12周）</h3>
    <p>这个阶段主要是查漏补缺，我采用的方法是：</p>
    <ol>
      <li>模拟考试，找出薄弱环节</li>
      <li>针对性强化训练</li>
      <li>调整心态，保持良好的状态</li>
    </ol>
    
    <p>最后，我想说的是，考研数学不是难题，关键是方法得当，坚持不懈。希望大家都能取得好成绩！</p>
  `,
  author: {
    id: '101',
    name: '数学大神',
    avatar: 'https://joeschmoe.io/api/v1/random',
    level: 5,
    title: '研究生考生',
    postCount: 32,
    followersCount: 128
  },
  createTime: '2024-05-15 14:30',
  updateTime: '2024-05-15 16:45',
  viewCount: 1256,
  likeCount: 89,
  favoriteCount: 45,
  commentCount: 23,
  tags: ['数学', '考研经验', '学习方法'],
  section: '经验交流',
  isLiked: false,
  isFavorited: false
};

// 模拟评论数据
const commentsData = [
  {
    id: '1',
    author: {
      id: '201',
      name: '考研小白',
      avatar: 'https://joeschmoe.io/api/v1/random',
      level: 2
    },
    content: '感谢分享！请问基础特别差的话，三个月时间够吗？',
    createTime: '2024-05-15 15:10',
    likeCount: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: {
          id: '101',
          name: '数学大神',
          avatar: 'https://joeschmoe.io/api/v1/random',
          level: 5
        },
        content: '基础差的话可能需要更多时间，建议先从基础概念开始，打好基础再进行强化训练。',
        createTime: '2024-05-15 15:30',
        likeCount: 8,
        isLiked: false
      }
    ]
  },
  {
    id: '2',
    author: {
      id: '202',
      name: '考研人',
      avatar: 'https://joeschmoe.io/api/v1/random',
      level: 3
    },
    content: '请问楼主用的是哪个版本的教材和辅导书？',
    createTime: '2024-05-15 16:20',
    likeCount: 5,
    isLiked: false,
    replies: []
  },
  {
    id: '3',
    author: {
      id: '203',
      name: '数学爱好者',
      avatar: 'https://joeschmoe.io/api/v1/random',
      level: 4
    },
    content: '分享得很详细，已收藏！对于线性代数部分有什么特别的复习建议吗？',
    createTime: '2024-05-15 17:05',
    likeCount: 7,
    isLiked: false,
    replies: []
  }
];

// 模拟相关帖子数据
const relatedPosts = [
  {
    id: '2',
    title: '考研英语复习经验：如何在两个月内提高20分',
    viewCount: 986,
    commentCount: 45
  },
  {
    id: '3',
    title: '考研政治冲刺阶段复习策略',
    viewCount: 756,
    commentCount: 32
  },
  {
    id: '4',
    title: '考研专业课复习方法总结',
    viewCount: 632,
    commentCount: 28
  },
  {
    id: '5',
    title: '考研数学高频考点整理',
    viewCount: 1245,
    commentCount: 67
  }
];

// 侧边栏内容
const SidebarContent = () => {
  return (
    <div className={styles.sidebar}>
      {/* 作者信息 */}
      <Card className={styles.authorCard}>
        <div className={styles.authorInfo}>
          <Avatar size={64} src={postData.author.avatar} />
          <div className={styles.authorMeta}>
            <div className={styles.authorNameRow}>
              <Text strong className={styles.authorName}>{postData.author.name}</Text>
              <Tag color="#4f46e5" className={styles.levelTag}>Lv.{postData.author.level}</Tag>
            </div>
            <Text type="secondary">{postData.author.title}</Text>
            <div className={styles.authorStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{postData.author.postCount}</div>
                <div className={styles.statLabel}>发帖</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{postData.author.followersCount}</div>
                <div className={styles.statLabel}>粉丝</div>
              </div>
            </div>
          </div>
        </div>
        <Button type="primary" className={styles.followButton}>关注作者</Button>
      </Card>

      {/* 相关帖子 */}
      <Card 
        title="相关帖子" 
        className={styles.relatedPostsCard}
        headStyle={{ background: 'linear-gradient(to right, #4f46e5, #8b5cf6)', color: 'white' }}
      >
        <List
          itemLayout="vertical"
          dataSource={relatedPosts}
          renderItem={item => (
            <List.Item className={styles.relatedPostItem}>
              <Link to={`/community/post/${item.id}`} className={styles.relatedPostLink}>
                {item.title}
              </Link>
              <div className={styles.relatedPostMeta}>
                <span><EyeOutlined /> {item.viewCount}</span>
                <span><MessageOutlined /> {item.commentCount}</span>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* 热门标签 */}
      <Card 
        title="热门标签" 
        className={styles.tagsCard}
        headStyle={{ background: 'linear-gradient(to right, #4f46e5, #8b5cf6)', color: 'white' }}
      >
        <div className={styles.tagsList}>
          <Tag color="#4f46e5" className={styles.hotTag}>
            <FireOutlined /> 数学
          </Tag>
          <Tag color="#8b5cf6" className={styles.hotTag}>
            <FireOutlined /> 考研经验
          </Tag>
          <Tag color="#ec4899" className={styles.hotTag}>
            <FireOutlined /> 学习方法
          </Tag>
          <Tag color="#3b82f6" className={styles.hotTag}>
            英语
          </Tag>
          <Tag color="#10b981" className={styles.hotTag}>
            政治
          </Tag>
          <Tag color="#f59e0b" className={styles.hotTag}>
            专业课
          </Tag>
          <Tag color="#6366f1" className={styles.hotTag}>
            复习计划
          </Tag>
          <Tag color="#ef4444" className={styles.hotTag}>
            真题解析
          </Tag>
        </div>
      </Card>
    </div>
  );
};

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState(postData);
  const [comments, setComments] = useState(commentsData);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 模拟获取帖子详情
  useEffect(() => {
    // 实际应用中这里会调用API获取帖子详情
    console.log(`获取帖子详情，ID: ${postId}`);
  }, [postId]);

  // 处理点赞
  const handleLike = () => {
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
    });
  };

  // 处理收藏
  const handleFavorite = () => {
    setPost({
      ...post,
      isFavorited: !post.isFavorited,
      favoriteCount: post.isFavorited ? post.favoriteCount - 1 : post.favoriteCount + 1
    });
  };

  // 处理分享
  const handleShare = () => {
    message.success('分享链接已复制到剪贴板');
  };

  // 处理评论提交
  const handleCommentSubmit = () => {
    if (!commentContent.trim()) {
      message.error('评论内容不能为空');
      return;
    }

    setSubmitting(true);

    // 模拟提交评论
    setTimeout(() => {
      const newComment = {
        id: `${comments.length + 1}`,
        author: {
          id: '999',
          name: '当前用户',
          avatar: 'https://joeschmoe.io/api/v1/random',
          level: 3
        },
        content: commentContent,
        createTime: new Date().toLocaleString(),
        likeCount: 0,
        isLiked: false,
        replies: []
      };

      setComments([newComment, ...comments]);
      setCommentContent('');
      setSubmitting(false);
      setPost({
        ...post,
        commentCount: post.commentCount + 1
      });

      message.success('评论发布成功');
    }, 1000);
  };

  // 处理评论点赞
  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1
          };
        }
        return comment;
      })
    );
  };

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout sidebarContent={<SidebarContent />}>
      <div className={styles.postDetailPage}>
        {/* 面包屑导航 */}
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Link to="/community">社区</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/community?section=${post.section}`}>{post.section}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>帖子详情</Breadcrumb.Item>
        </Breadcrumb>

        {/* 帖子内容卡片 */}
        <Card className={styles.postCard}>
          {/* 帖子标题 */}
          <div className={styles.postHeader}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={handleGoBack}
              className={styles.backButton}
            />
            <Title level={2} className={styles.postTitle}>{post.title}</Title>
          </div>

          {/* 帖子元信息 */}
          <div className={styles.postMeta}>
            <div className={styles.authorInfo}>
              <Avatar src={post.author.avatar} />
              <Text strong className={styles.authorName}>{post.author.name}</Text>
              <Tag color="#4f46e5" className={styles.levelTag}>Lv.{post.author.level}</Tag>
            </div>
            <div className={styles.postInfo}>
              <span className={styles.infoItem}>
                <ClockCircleOutlined /> {post.createTime}
              </span>
              <span className={styles.infoItem}>
                <EyeOutlined /> {post.viewCount} 浏览
              </span>
              <span className={styles.infoItem}>
                <TagOutlined /> {post.tags.join(', ')}
              </span>
            </div>
          </div>

          {/* 帖子内容 */}
          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* 帖子标签 */}
          <div className={styles.postTags}>
            {post.tags.map((tag, index) => (
              <Tag key={index} color="#4f46e5" className={styles.tag}>{tag}</Tag>
            ))}
          </div>

          {/* 帖子操作 */}
          <div className={styles.postActions}>
            <Button 
              type="text" 
              icon={post.isLiked ? <LikeFilled /> : <LikeOutlined />} 
              onClick={handleLike}
              className={`${styles.actionButton} ${post.isLiked ? styles.liked : ''}`}
            >
              点赞 {post.likeCount}
            </Button>
            <Button 
              type="text" 
              icon={post.isFavorited ? <StarFilled /> : <StarOutlined />} 
              onClick={handleFavorite}
              className={`${styles.actionButton} ${post.isFavorited ? styles.favorited : ''}`}
            >
              收藏 {post.favoriteCount}
            </Button>
            <Button 
              type="text" 
              icon={<ShareAltOutlined />} 
              onClick={handleShare}
              className={styles.actionButton}
            >
              分享
            </Button>
          </div>
        </Card>

        {/* 评论区 */}
        <Card className={styles.commentsCard}>
          <Title level={4} className={styles.commentsTitle}>
            评论 ({post.commentCount})
          </Title>

          {/* 评论输入框 */}
          <div className={styles.commentInput}>
            <TextArea 
              rows={4} 
              placeholder="写下你的评论..." 
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              maxLength={500}
              showCount
            />
            <div className={styles.commentSubmit}>
              <Button 
                type="primary" 
                onClick={handleCommentSubmit} 
                loading={submitting}
                disabled={!commentContent.trim()}
              >
                发布评论
              </Button>
            </div>
          </div>

          {/* 评论列表 */}
          <List
            className={styles.commentsList}
            itemLayout="vertical"
            dataSource={comments}
            renderItem={comment => (
              <List.Item className={styles.commentItem}>
                <Comment
                  author={
                    <div className={styles.commentAuthor}>
                      <Text strong>{comment.author.name}</Text>
                      <Tag color="#4f46e5" className={styles.levelTag}>Lv.{comment.author.level}</Tag>
                    </div>
                  }
                  avatar={<Avatar src={comment.author.avatar} />}
                  content={<p className={styles.commentContent}>{comment.content}</p>}
                  datetime={
                    <span className={styles.commentTime}>{comment.createTime}</span>
                  }
                  actions={[
                    <Button 
                      key="like" 
                      type="text" 
                      size="small"
                      icon={comment.isLiked ? <LikeFilled /> : <LikeOutlined />}
                      onClick={() => handleCommentLike(comment.id)}
                      className={`${styles.commentAction} ${comment.isLiked ? styles.liked : ''}`}
                    >
                      {comment.likeCount > 0 ? comment.likeCount : '点赞'}
                    </Button>,
                    <Button 
                      key="reply" 
                      type="text" 
                      size="small"
                      icon={<MessageOutlined />}
                      className={styles.commentAction}
                    >
                      回复
                    </Button>
                  ]}
                />

                {/* 回复列表 */}
                {comment.replies.length > 0 && (
                  <div className={styles.repliesList}>
                    {comment.replies.map(reply => (
                      <Comment
                        key={reply.id}
                        author={
                          <div className={styles.commentAuthor}>
                            <Text strong>{reply.author.name}</Text>
                            <Tag color="#4f46e5" className={styles.levelTag}>Lv.{reply.author.level}</Tag>
                          </div>
                        }
                        avatar={<Avatar src={reply.author.avatar} />}
                        content={<p className={styles.commentContent}>{reply.content}</p>}
                        datetime={
                          <span className={styles.commentTime}>{reply.createTime}</span>
                        }
                        actions={[
                          <Button 
                            key="like" 
                            type="text" 
                            size="small"
                            icon={reply.isLiked ? <LikeFilled /> : <LikeOutlined />}
                            className={`${styles.commentAction} ${reply.isLiked ? styles.liked : ''}`}
                          >
                            {reply.likeCount > 0 ? reply.likeCount : '点赞'}
                          </Button>,
                          <Button 
                            key="reply" 
                            type="text" 
                            size="small"
                            icon={<MessageOutlined />}
                            className={styles.commentAction}
                          >
                            回复
                          </Button>
                        ]}
                      />
                    ))}
                  </div>
                )}
              </List.Item>
            )}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default PostDetailPage; 