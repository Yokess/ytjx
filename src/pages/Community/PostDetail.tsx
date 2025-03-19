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
  message,
  Skeleton
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
import { getPostDetail, getPostComments, likePost, favoritePost, createComment, likeComment, replyComment } from '../../api/communityApi';
import type { PostDetail, Comment } from '../../types/community';

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

// 侧边栏内容
interface SidebarContentProps {
  post: PostDetail;
  relatedPosts: Array<{
    id: string;
    title: string;
    viewCount: number;
    commentCount: number;
  }>;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ post, relatedPosts }) => {
  return (
    <div className={styles.sidebar}>
      {/* 作者信息 */}
      <Card className={styles.authorCard}>
        <div className={styles.authorInfo}>
          <Avatar size={64} src={post.author.avatar} />
          <div className={styles.authorMeta}>
            <div className={styles.authorNameRow}>
              <Text strong className={styles.authorName}>{post.author.name}</Text>
              <Tag color="#4f46e5" className={styles.levelTag}>Lv.{post.author.level}</Tag>
            </div>
            <Text type="secondary">{post.author.title}</Text>
            <div className={styles.authorStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{post.author.postCount}</div>
                <div className={styles.statLabel}>发帖</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{post.author.followersCount}</div>
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
  const [post, setPost] = useState<PostDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Array<{
    id: string;
    title: string;
    viewCount: number;
    commentCount: number;
  }>>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  
  // 获取帖子详情
  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) return;
      
      setLoading(true);
      try {
        const response = await getPostDetail(postId);
        setPost(response.data);
      } catch (error) {
        console.error('获取帖子详情失败:', error);
        message.error('获取帖子详情失败，请稍后重试');
      }
      setLoading(false);
    };
    
    fetchPostDetail();
  }, [postId]);
  
  // 获取评论列表
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      
      setCommentsLoading(true);
      try {
        const response = await getPostComments(postId);
        setComments(response.data.comments);
        setTotalComments(response.data.total);
      } catch (error) {
        console.error('获取评论失败:', error);
        message.error('获取评论失败，请稍后重试');
      }
      setCommentsLoading(false);
    };
    
    fetchComments();
  }, [postId]);
  
  // 处理点赞
  const handleLike = async () => {
    if (!postId || !post) return;
    
    try {
      const response = await likePost(postId);
      setPost({
        ...post,
        isLiked: response.data.isLiked,
        likeCount: response.data.likeCount
      });
      message.success(response.data.isLiked ? '点赞成功' : '取消点赞成功');
    } catch (error) {
      console.error('点赞操作失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };
  
  // 处理收藏
  const handleFavorite = async () => {
    if (!postId || !post) return;
    
    try {
      const response = await favoritePost(postId);
      setPost({
        ...post,
        isFavorited: response.data.isFavorited,
        favoriteCount: response.data.favoriteCount
      });
      message.success(response.data.isFavorited ? '收藏成功' : '取消收藏成功');
    } catch (error) {
      console.error('收藏操作失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };
  
  // 处理分享
  const handleShare = () => {
    // 获取当前帖子链接
    const url = window.location.href;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(url)
      .then(() => {
        message.success('分享链接已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制链接');
      });
  };
  
  // 处理评论提交
  const handleCommentSubmit = async () => {
    if (!postId) return;
    if (!commentContent.trim()) {
      message.error('评论内容不能为空');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await createComment(postId, { content: commentContent });
      
      // 更新评论列表
      setComments([response.data, ...comments]);
      setTotalComments(totalComments + 1);
      
      // 更新帖子评论数
      if (post) {
        setPost({
          ...post,
          commentCount: post.commentCount + 1
        });
      }
      
      // 清空输入框
      setCommentContent('');
      message.success('评论发布成功');
    } catch (error) {
      console.error('评论发布失败:', error);
      message.error('评论发布失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 处理回复提交
  const handleReplySubmit = async () => {
    if (!postId || !replyingTo) return;
    if (!replyContent.trim()) {
      message.error('回复内容不能为空');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await replyComment(replyingTo, { content: replyContent });
      
      // 更新评论列表，找到被回复的评论并添加回复
      const updatedComments = comments.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...comment.replies, response.data]
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      
      // 更新帖子评论数
      if (post) {
        setPost({
          ...post,
          commentCount: post.commentCount + 1
        });
      }
      
      // 清空输入框和回复状态
      setReplyContent('');
      setReplyingTo(null);
      setReplyingToName(null);
      message.success('回复发布成功');
    } catch (error) {
      console.error('回复发布失败:', error);
      message.error('回复发布失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 处理评论点赞
  const handleCommentLike = async (commentId: string) => {
    try {
      const response = await likeComment(commentId);
      
      // 更新评论列表中的点赞状态
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: response.data.isLiked,
            likeCount: response.data.likeCount
          };
        }
        
        // 检查回复中是否有匹配项
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              isLiked: response.data.isLiked,
              likeCount: response.data.likeCount
            };
          }
          return reply;
        });
        
        return {
          ...comment,
          replies: updatedReplies
        };
      });
      
      setComments(updatedComments);
    } catch (error) {
      console.error('点赞评论失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };
  
  // 开始回复
  const startReply = (commentId: string, authorName: string) => {
    setReplyingTo(commentId);
    setReplyingToName(authorName);
    
    // 滚动到回复框
    const replyElement = document.getElementById('reply-box');
    if (replyElement) {
      replyElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 取消回复
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyingToName(null);
    setReplyContent('');
  };
  
  // 返回上一页
  const goBack = () => {
    navigate('/community');
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <Skeleton active avatar paragraph={{ rows: 12 }} />
        </div>
      </MainLayout>
    );
  }
  
  if (!post) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <Title level={3}>帖子不存在</Title>
            <Button type="primary" onClick={goBack}>返回社区</Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className={styles.container}>
        {/* 面包屑导航 */}
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/community">学习社区</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{post.section}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        
        {/* 返回按钮 */}
        <Button 
          className={styles.backButton}
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={goBack}
        >
          返回社区
        </Button>
        
        {/* 帖子内容 */}
        <Card className={styles.postCard}>
          <div className={styles.postHeader}>
            <Title level={2}>{post.title}</Title>
            <div className={styles.postMeta}>
              <div className={styles.metaItem}>
                <UserOutlined />
                <span>{post.author.name}</span>
              </div>
              <div className={styles.metaItem}>
                <ClockCircleOutlined />
                <span>{post.createTime}</span>
              </div>
              <div className={styles.metaItem}>
                <EyeOutlined />
                <span>{post.viewCount} 浏览</span>
              </div>
              <div className={styles.metaItem}>
                <TagOutlined />
                <span>
                  {post.tags.map((tag, index) => (
                    <Tag key={index} color="#2db7f5">{tag}</Tag>
                  ))}
                </span>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <Divider />
          
          <div className={styles.postActions}>
            <div className={styles.leftActions}>
              <Button
                type="text"
                icon={post.isLiked ? <LikeFilled /> : <LikeOutlined />}
                onClick={handleLike}
                className={post.isLiked ? styles.active : ''}
              >
                点赞 {post.likeCount}
              </Button>
              <Button
                type="text"
                icon={<MessageOutlined />}
                onClick={() => {
                  const commentElement = document.getElementById('comment-box');
                  if (commentElement) {
                    commentElement.scrollIntoView({ behavior: 'smooth' });
                    // 聚焦评论输入框
                    const textarea = commentElement.querySelector('textarea');
                    if (textarea) {
                      textarea.focus();
                    }
                  }
                }}
              >
                评论 {post.commentCount}
              </Button>
              <Button
                type="text"
                icon={post.isFavorited ? <StarFilled /> : <StarOutlined />}
                onClick={handleFavorite}
                className={post.isFavorited ? styles.active : ''}
              >
                收藏 {post.favoriteCount}
              </Button>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                分享
              </Button>
            </div>
          </div>
        </Card>
        
        {/* 作者信息 */}
        <Card className={styles.authorCard}>
          <div className={styles.authorInfo}>
            <Avatar size={64} src={post.author.avatar} />
            <div className={styles.authorMeta}>
              <div className={styles.authorName}>
                <Text strong>{post.author.name}</Text>
                <Tag color="#108ee9">Lv.{post.author.level}</Tag>
              </div>
              <div className={styles.authorTitle}>{post.author.title}</div>
              <div className={styles.authorStats}>
                <span>发帖 {post.author.postCount}</span>
                <span>粉丝 {post.author.followersCount}</span>
              </div>
            </div>
          </div>
          <div className={styles.followButton}>
            <Button type="primary">关注</Button>
          </div>
        </Card>
        
        {/* 评论区 */}
        <Card 
          className={styles.commentsCard}
          title={<div className={styles.commentsTitle}>评论 ({post.commentCount})</div>}
        >
          {/* 评论输入框 */}
          <div id="comment-box" className={styles.commentBox}>
            <TextArea 
              rows={4} 
              placeholder="写下你的评论..." 
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              maxLength={1000}
              showCount
            />
            <div className={styles.commentActions}>
              <Button 
                type="primary" 
                onClick={handleCommentSubmit}
                loading={submitting}
                disabled={!commentContent.trim()}
              >
                发表评论
              </Button>
            </div>
          </div>
          
          <Divider />
          
          {/* 回复框 */}
          {replyingTo && (
            <div id="reply-box" className={styles.replyBox}>
              <div className={styles.replyingTo}>
                回复 <Text strong>{replyingToName}</Text>：
                <Button 
                  type="text" 
                  className={styles.cancelReply}
                  onClick={cancelReply}
                >
                  取消
                </Button>
              </div>
              <TextArea 
                rows={3} 
                placeholder={`回复 ${replyingToName}...`} 
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                maxLength={500}
                showCount
              />
              <div className={styles.commentActions}>
                <Button 
                  type="primary" 
                  onClick={handleReplySubmit}
                  loading={submitting}
                  disabled={!replyContent.trim()}
                >
                  发表回复
                </Button>
              </div>
              <Divider />
            </div>
          )}
          
          {/* 评论列表 */}
          {commentsLoading ? (
            <div className={styles.loadingComments}>
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </div>
          ) : comments.length === 0 ? (
            <div className={styles.noComments}>
              <div className={styles.noCommentsIcon}>
                <MessageOutlined />
              </div>
              <div className={styles.noCommentsText}>暂无评论，快来抢沙发吧！</div>
            </div>
          ) : (
            <div className={styles.commentsList}>
              {comments.map(comment => (
                <div key={comment.id} className={styles.commentItem}>
                  <Comment
                    author={
                      <div className={styles.commentAuthor}>
                        <Text strong>{comment.author.name}</Text>
                        <Tag color="#87d068">Lv.{comment.author.level}</Tag>
                      </div>
                    }
                    avatar={<Avatar src={comment.author.avatar} />}
                    content={<div>{comment.content}</div>}
                    datetime={comment.createTime}
                    actions={[
                      <span 
                        key="like" 
                        onClick={() => handleCommentLike(comment.id)}
                        className={comment.isLiked ? styles.liked : ''}
                      >
                        {comment.isLiked ? <LikeFilled /> : <LikeOutlined />} {comment.likeCount}
                      </span>,
                      <span 
                        key="reply" 
                        onClick={() => startReply(comment.id, comment.author.name)}
                      >
                        回复
                      </span>
                    ]}
                  />
                  
                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.repliesList}>
                      {comment.replies.map(reply => (
                        <div key={reply.id} className={styles.replyItem}>
                          <Comment
                            author={
                              <div className={styles.commentAuthor}>
                                <Text strong>{reply.author.name}</Text>
                                <Tag color="#87d068">Lv.{reply.author.level}</Tag>
                                {reply.replyTo && (
                                  <span className={styles.replyToInfo}>
                                    回复 <Text strong>{reply.replyTo.name}</Text>
                                  </span>
                                )}
                              </div>
                            }
                            avatar={<Avatar src={reply.author.avatar} />}
                            content={<div>{reply.content}</div>}
                            datetime={reply.createTime}
                            actions={[
                              <span 
                                key="like" 
                                onClick={() => handleCommentLike(reply.id)}
                                className={reply.isLiked ? styles.liked : ''}
                              >
                                {reply.isLiked ? <LikeFilled /> : <LikeOutlined />} {reply.likeCount}
                              </span>,
                              <span 
                                key="reply" 
                                onClick={() => startReply(comment.id, reply.author.name)}
                              >
                                回复
                              </span>
                            ]}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <SidebarContent post={post} relatedPosts={relatedPosts} />
      </div>
    </MainLayout>
  );
};

export default PostDetailPage; 