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
import { getPostById, getComments, likePost, unlikePost, createComment, likeComment, unlikeComment } from '../../api/communityApi';
import type { PostDetail, Comment, CommentReply, CreateCommentDTO } from '../../types/community';

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

const CustomComment: React.FC<CommentProps> = ({ 
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
    postId: number;
    postTitle: string;
    postViews: number;
    postComments: number;
  }>;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ post, relatedPosts }) => {
  return (
    <div className={styles.sidebar}>
      {/* 作者信息 */}
      <Card className={styles.authorCard}>
        <div className={styles.authorInfo}>
          <Avatar size={64} src={post.userAvatar || "https://joeschmoe.io/api/v1/random"} />
          <div className={styles.authorMeta}>
            <div className={styles.authorNameRow}>
              <Text strong className={styles.authorName}>{post.username}</Text>
              <Tag color="#4f46e5" className={styles.levelTag}>Lv.3</Tag>
            </div>
            <Text type="secondary">考研学子</Text>
            <div className={styles.authorStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>42</div>
                <div className={styles.statLabel}>发帖</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>128</div>
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
              <Link to={`/community/post/${item.postId}`} className={styles.relatedPostLink}>
                {item.postTitle}
              </Link>
              <div className={styles.relatedPostMeta}>
                <span><EyeOutlined /> {item.postViews}</span>
                <span><MessageOutlined /> {item.postComments}</span>
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
    postId: number;
    postTitle: string;
    postViews: number;
    postComments: number;
  }>>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  // 获取帖子详情
  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) return;
      
      setLoading(true);
      try {
        const response = await getPostById(parseInt(postId));
        setPost(response.data);
        
        // 模拟相关帖子数据（实际应从API获取）
        setRelatedPosts([
          {
            postId: 1,
            postTitle: '考研数学复习方法总结',
            postViews: 1200,
            postComments: 42
          },
          {
            postId: 2,
            postTitle: '如何高效记忆英语单词？',
            postViews: 980,
            postComments: 36
          },
          {
            postId: 3,
            postTitle: '2025考研政治大纲解读',
            postViews: 1500,
            postComments: 56
          }
        ]);
      } catch (error) {
        console.error('获取帖子详情失败:', error);
        message.error('获取帖子详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostDetail();
  }, [postId]);
  
  // 获取评论列表
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      
      setCommentsLoading(true);
      try {
        const response = await getComments(parseInt(postId), page, pageSize);
        setComments(response.data.list);
        setTotalComments(response.data.total);
      } catch (error) {
        console.error('获取评论失败:', error);
        message.error('获取评论失败，请稍后重试');
      } finally {
        setCommentsLoading(false);
      }
    };
    
    if (post) {
      fetchComments();
    }
  }, [postId, post, page, pageSize]);
  
  // 点赞/取消点赞
  const handleLike = async () => {
    if (!postId || !post) return;
    
    try {
      const postIdNum = parseInt(postId);
      if (post.hasLiked) {
        await unlikePost(postIdNum);
        setPost({
          ...post,
          hasLiked: false,
          postLikes: post.postLikes - 1
        });
        message.success('已取消点赞');
      } else {
        await likePost(postIdNum);
        setPost({
          ...post,
          hasLiked: true,
          postLikes: post.postLikes + 1
        });
        message.success('点赞成功');
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };
  
  // 收藏功能
  const handleFavorite = async () => {
    message.info('收藏功能暂未开放，敬请期待');
  };
  
  // 分享功能
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
      const commentData: CreateCommentDTO = {
        postId: parseInt(postId),
        commentContent: commentContent.trim()
      };
      
      const response = await createComment(commentData);
      
      // 更新评论列表
      setComments(prev => [response.data, ...prev]);
      
      // 更新帖子评论数
      if (post) {
        setPost({
          ...post,
          postComments: post.postComments + 1
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
      const replyData: CreateCommentDTO = {
        postId: parseInt(postId),
        commentContent: replyContent.trim(),
        parentCommentId: replyingTo
      };
      
      const response = await createComment(replyData);
      
      // 更新评论列表，找到被回复的评论并添加回复
      const updatedComments = comments.map(comment => {
        if (comment.commentId === replyingTo) {
          const reply = response.data as unknown as CommentReply;
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      
      // 更新帖子评论数
      if (post) {
        setPost({
          ...post,
          postComments: post.postComments + 1
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
  
  // 评论点赞
  const handleCommentLike = async (commentId: number) => {
    try {
      // 找到当前评论
      const targetComment = comments.find(c => c.commentId === commentId);
      if (!targetComment) return;
      
      if (targetComment.hasLiked) {
        // 取消点赞
        await unlikeComment(commentId);
        
        // 更新状态
        setComments(comments.map(c => 
          c.commentId === commentId 
            ? { ...c, hasLiked: false, likeCount: c.likeCount - 1 } 
            : c
        ));
        
        message.success('已取消点赞');
      } else {
        // 点赞
        await likeComment(commentId);
        
        // 更新状态
        setComments(comments.map(c => 
          c.commentId === commentId 
            ? { ...c, hasLiked: true, likeCount: c.likeCount + 1 } 
            : c
        ));
        
        message.success('点赞成功');
      }
    } catch (error) {
      console.error('点赞评论失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };
  
  // 子评论点赞
  const handleReplyLike = async (commentId: number, parentId: number) => {
    try {
      // 找到当前评论和父评论
      const parentComment = comments.find(c => c.commentId === parentId);
      if (!parentComment || !parentComment.replies) return;
      
      const targetReply = parentComment.replies.find(r => r.commentId === commentId);
      if (!targetReply) return;
      
      if (targetReply.hasLiked) {
        // 取消点赞
        await unlikeComment(commentId);
        
        // 更新状态
        const updatedComments = comments.map(c => {
          if (c.commentId === parentId) {
            return {
              ...c,
              replies: c.replies.map(r => 
                r.commentId === commentId 
                  ? { ...r, hasLiked: false, likeCount: r.likeCount - 1 } 
                  : r
              )
            };
          }
          return c;
        });
        
        setComments(updatedComments);
        message.success('已取消点赞');
      } else {
        // 点赞
        await likeComment(commentId);
        
        // 更新状态
        const updatedComments = comments.map(c => {
          if (c.commentId === parentId) {
            return {
              ...c,
              replies: c.replies.map(r => 
                r.commentId === commentId 
                  ? { ...r, hasLiked: true, likeCount: r.likeCount + 1 } 
                  : r
              )
            };
          }
          return c;
        });
        
        setComments(updatedComments);
        message.success('点赞成功');
      }
    } catch (error) {
      console.error('点赞评论失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };
  
  // 开始回复
  const startReply = (commentId: number, authorName: string) => {
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
  
  // 举报帖子
  const handleReport = () => {
    message.info('举报功能暂未开放，敬请期待');
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
            <Breadcrumb.Item>{post.sectionName}</Breadcrumb.Item>
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
            <Title level={2}>{post.postTitle}</Title>
            <div className={styles.postMeta}>
              <div className={styles.metaItem}>
                <UserOutlined />
                <span>{post.username}</span>
              </div>
              <div className={styles.metaItem}>
                <ClockCircleOutlined />
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <div className={styles.metaItem}>
                <EyeOutlined />
                <span>{post.postViews} 浏览</span>
              </div>
              {post.knowledgePoints && post.knowledgePoints.length > 0 && (
                <div className={styles.metaItem}>
                  <TagOutlined />
                  <span>
                    {post.knowledgePoints.map((tag, index) => (
                      <Tag key={index} color="#2db7f5">{tag.knowledgePointName}</Tag>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Divider />
          
          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.postContent }} />
          
          <Divider />
          
          <div className={styles.postActions}>
            <div className={styles.leftActions}>
              <Button
                type="text"
                icon={post.hasLiked ? <LikeFilled /> : <LikeOutlined />}
                onClick={handleLike}
                className={post.hasLiked ? styles.active : ''}
              >
                点赞 {post.postLikes}
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
                评论 {post.postComments}
              </Button>
              <Button
                type="text"
                icon={<StarOutlined />}
                onClick={handleFavorite}
              >
                收藏
              </Button>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                分享
              </Button>
              <Button
                type="text"
                danger
                onClick={handleReport}
              >
                举报
              </Button>
            </div>
          </div>
        </Card>
        
        {/* 作者信息 */}
        <Card className={styles.authorCard}>
          <div className={styles.authorInfo}>
            <Avatar size={64} src={post.userAvatar || 'https://joeschmoe.io/api/v1/random'} />
            <div className={styles.authorMeta}>
              <div className={styles.authorName}>
                <Text strong>{post.username}</Text>
                <Tag color="#108ee9">Lv.3</Tag>
              </div>
              <div className={styles.authorTitle}>考研学子</div>
              <div className={styles.authorStats}>
                <span>发帖 42</span>
                <span>粉丝 128</span>
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
          title={<div className={styles.commentsTitle}>评论 ({post.postComments})</div>}
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
                <div key={comment.commentId} className={styles.commentItem}>
                  <CustomComment
                    author={
                      <div className={styles.commentAuthor}>
                        <Text strong>{comment.username}</Text>
                        <Tag color="#87d068">Lv.3</Tag>
                      </div>
                    }
                    avatar={<Avatar src={comment.userAvatar || 'https://joeschmoe.io/api/v1/random'} />}
                    content={<div>{comment.commentContent}</div>}
                    datetime={new Date(comment.createdAt).toLocaleString()}
                    actions={[
                      <span 
                        key="like" 
                        onClick={() => handleCommentLike(comment.commentId)}
                        className={comment.hasLiked ? styles.liked : ''}
                      >
                        {comment.hasLiked ? <LikeFilled /> : <LikeOutlined />} {comment.likeCount}
                      </span>,
                      <span 
                        key="reply" 
                        onClick={() => startReply(comment.commentId, comment.username)}
                      >
                        回复
                      </span>
                    ]}
                  />
                  
                  {/* 回复列表 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.repliesList}>
                      {comment.replies.map(reply => (
                        <div key={reply.commentId} className={styles.replyItem}>
                          <CustomComment
                            author={
                              <div className={styles.commentAuthor}>
                                <Text strong>{reply.username}</Text>
                                <Tag color="#87d068">Lv.3</Tag>
                              </div>
                            }
                            avatar={<Avatar src={reply.userAvatar || 'https://joeschmoe.io/api/v1/random'} />}
                            content={<div>{reply.commentContent}</div>}
                            datetime={new Date(reply.createdAt).toLocaleString()}
                            actions={[
                              <span 
                                key="like" 
                                onClick={() => handleReplyLike(reply.commentId, comment.commentId)}
                                className={reply.hasLiked ? styles.liked : ''}
                              >
                                {reply.hasLiked ? <LikeFilled /> : <LikeOutlined />} {reply.likeCount}
                              </span>,
                              <span 
                                key="reply" 
                                onClick={() => startReply(comment.commentId, reply.username)}
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