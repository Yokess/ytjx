import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Input, 
  Avatar, 
  Divider,
  List,
  Tooltip,
  Progress,
  Tag,
  Tabs
} from 'antd';
import { 
  PlayCircleOutlined, 
  PauseOutlined,
  FullscreenOutlined, 
  SettingOutlined, 
  HeartOutlined, 
  ShareAltOutlined,
  FileTextOutlined,
  DownloadOutlined,
  LikeOutlined,
  MessageOutlined,
  MoreOutlined,
  SoundOutlined,
  BookOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import styles from './VideoPlayer.module.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 模拟视频数据
const mockVideoData = {
  id: 1,
  title: '1.2 极限的概念与性质',
  description: '本节课讲解极限的基本概念、性质及计算方法，是高等数学的重要基础。',
  courseName: '高等数学全程班',
  chapterName: '第一章：函数与极限',
  duration: '50:00',
  currentTime: '25:30',
  progress: 50,
  coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  notes: [
    {
      id: 1,
      content: '极限的ε-δ定义是理解极限概念的关键，需要记住：当x→x₀时，f(x)→A，即对于任意给定的ε>0，总存在δ>0，使得当0<|x-x₀|<δ时，有|f(x)-A|<ε。',
      timestamp: '25:30',
      date: '2023-10-15',
      user: {
        name: '我的笔记',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    }
  ],
  discussions: [
    {
      id: 1,
      content: '老师，我对极限的ε-δ定义有些不理解，能否再详细解释一下？特别是如何确定δ的值？',
      likes: 12,
      date: '3天前',
      user: {
        name: '王同学',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      replies: [
        {
          id: 101,
          content: '同学你好，确定δ的值是理解ε-δ定义的关键。通常我们需要根据具体函数和给定的ε，通过不等式推导来确定δ。在视频32:15处我有详细的例题讲解，你可以回看一下。如果还有疑问，欢迎在答疑区提问。',
          date: '2天前',
          user: {
            name: '李教授',
            avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
            isTeacher: true
          }
        }
      ]
    },
    {
      id: 2,
      content: '老师讲解的极限性质总结非常清晰，特别是四则运算法则和夹逼准则的应用，对做题很有帮助。建议大家做课后习题1-5，很经典。',
      likes: 8,
      date: '1天前',
      user: {
        name: '李同学',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      replies: []
    }
  ],
  chapters: [
    {
      id: 1,
      title: '第一章：函数与极限',
      videos: [
        { id: 1, title: '1.1 函数的概念与性质', duration: '45:00', isCompleted: true },
        { id: 2, title: '1.2 极限的概念与性质', duration: '50:00', isActive: true },
        { id: 3, title: '1.3 连续性与间断点', duration: '48:00', isCompleted: false }
      ]
    },
    {
      id: 2,
      title: '第二章：导数与微分',
      videos: [
        { id: 4, title: '2.1 导数的概念与计算', duration: '52:00', isCompleted: false },
        { id: 5, title: '2.2 微分的概念与应用', duration: '47:00', isCompleted: false }
      ]
    }
  ]
};

const VideoPlayerPage: React.FC = () => {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNoteSubmit = () => {
    if (noteContent.trim()) {
      // 提交笔记的逻辑
      console.log('提交笔记:', noteContent);
      setNoteContent('');
    }
  };
  
  const handleCommentSubmit = () => {
    if (commentContent.trim()) {
      // 提交评论的逻辑
      console.log('提交评论:', commentContent);
      setCommentContent('');
    }
  };
  
  return (
    <div className={styles.videoPlayerContainer}>
      <Row gutter={[24, 24]}>
        {/* 左侧视频播放区 */}
        <Col xs={24} lg={18}>
          {/* 视频播放器 */}
          <div className={styles.videoSection}>
            <div className={styles.playerWrapper}>
              <div 
                className={styles.videoPlayer} 
                style={{ backgroundImage: `url(${mockVideoData.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                {/* 视频播放器将在这里实现 */}
              </div>
              
              <div className={styles.controls}>
                <div className={styles.playbackControls}>
                  <div 
                    className={styles.playButton} 
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                  </div>
                  <span className={styles.timeDisplay}>
                    {mockVideoData.currentTime} / {mockVideoData.duration}
                  </span>
                </div>
                
                <div className={styles.rightControls}>
                  <div className={styles.volumeControl}>
                    <SoundOutlined />
                    <div className={styles.volumeSlider}>
                      <Progress percent={75} showInfo={false} size="small" />
                    </div>
                  </div>
                  <div className={styles.fullscreenButton}>
                    <FullscreenOutlined />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 视频进度条 */}
          <div className={styles.progressBar}>
            <Progress 
              percent={mockVideoData.progress} 
              size="small"
              strokeColor="#1890ff"
            />
          </div>
          
          {/* 视频信息和操作 */}
          <div className={styles.videoInfo}>
            <div className={styles.videoTitle}>
              <div>
                <Title level={4} className={styles.titleText}>{mockVideoData.title}</Title>
                <div className={styles.courseInfo}>
                  <BookOutlined /> {mockVideoData.courseName} - {mockVideoData.chapterName}
                </div>
              </div>
              <div className={styles.videoActions}>
                <Button className={styles.actionButton} icon={<HeartOutlined />}>收藏</Button>
                <Button className={styles.actionButton} icon={<ShareAltOutlined />}>分享</Button>
                <Button className={styles.actionButton} icon={<DownloadOutlined />}>下载</Button>
              </div>
            </div>
            
            <Paragraph className={styles.videoDescription}>
              {mockVideoData.description}
            </Paragraph>
          </div>
          
          {/* 笔记和讨论标签页 */}
          <div className={styles.contentTabs}>
            <Tabs defaultActiveKey="notes">
              <TabPane tab="我的笔记" key="notes">
                <div className={styles.tabContent}>
                  <div className={styles.notesSection}>
                    <div className={styles.noteInput}>
                      <TextArea 
                        rows={3} 
                        placeholder="添加笔记..." 
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                      />
                      <div className={styles.noteActions}>
                        <Button type="primary" onClick={handleNoteSubmit}>保存笔记</Button>
                      </div>
                    </div>
                    
                    <div className={styles.notesList}>
                      {mockVideoData.notes.map(note => (
                        <div key={note.id} className={styles.noteItem}>
                          <div className={styles.noteTime}>
                            <ClockCircleOutlined /> {note.timestamp}
                          </div>
                          <div className={styles.noteContent}>
                            {note.content}
                          </div>
                          <div className={styles.noteFooter}>
                            <div className={styles.noteTimestamp}>
                              {note.date}
                            </div>
                            <div className={styles.noteActions}>
                              <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
                              <Button type="text" size="small" icon={<DeleteOutlined />}>删除</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabPane>
              
              <TabPane tab="课程讨论" key="discussions">
                <div className={styles.tabContent}>
                  <div className={styles.discussionSection}>
                    <div className={styles.commentInput}>
                      <TextArea 
                        rows={3} 
                        placeholder="添加评论..." 
                        value={commentContent}
                        onChange={e => setCommentContent(e.target.value)}
                      />
                      <div className={styles.noteActions}>
                        <Button type="primary" onClick={handleCommentSubmit}>发表评论</Button>
                      </div>
                    </div>
                    
                    <div className={styles.discussionList}>
                      {mockVideoData.discussions.map(discussion => (
                        <div key={discussion.id} className={styles.discussionItem}>
                          <List.Item
                            actions={[
                              <span key="like" className={styles.commentActions}>
                                <Tooltip title="点赞">
                                  <Button type="text" icon={<LikeOutlined />} size="small">
                                    {discussion.likes}
                                  </Button>
                                </Tooltip>
                                <Button type="text" icon={<MessageOutlined />} size="small">
                                  回复
                                </Button>
                              </span>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={<Avatar src={discussion.user.avatar} />}
                              title={<Text strong>{discussion.user.name}</Text>}
                              description={
                                <>
                                  <p>{discussion.content}</p>
                                  <span>{discussion.date}</span>
                                </>
                              }
                            />
                            
                            {discussion.replies.length > 0 && (
                              <div className={styles.replySection}>
                                {discussion.replies.map(reply => (
                                  <List.Item key={reply.id}>
                                    <List.Item.Meta
                                      avatar={<Avatar src={reply.user.avatar} />}
                                      title={
                                        <span>
                                          <Text strong>{reply.user.name}</Text>
                                          {reply.user.isTeacher && (
                                            <Tag color="blue" style={{ marginLeft: 8 }}>讲师</Tag>
                                          )}
                                        </span>
                                      }
                                      description={
                                        <>
                                          <p>{reply.content}</p>
                                          <span>{reply.date}</span>
                                        </>
                                      }
                                    />
                                  </List.Item>
                                ))}
                              </div>
                            )}
                          </List.Item>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Col>
        
        {/* 右侧课程目录 */}
        <Col xs={24} lg={6}>
          <div className={styles.chapterList}>
            <div className={styles.chapterTitle}>
              <Title level={5}>课程目录</Title>
            </div>
            <div className={styles.videoList}>
              {mockVideoData.chapters.map(chapter => (
                <div key={chapter.id}>
                  <div className={styles.chapterHeader}>
                    {chapter.title}
                  </div>
                  {chapter.videos.map(video => (
                    <div 
                      key={video.id} 
                      className={`${styles.videoItem} ${video.isActive ? styles.active : ''}`}
                    >
                      <div className={styles.videoIcon}>
                        <PlayCircleOutlined />
                      </div>
                      <div className={styles.videoItemInfo}>
                        <div className={styles.videoItemTitle}>
                          {video.title}
                        </div>
                        <div className={styles.videoItemMeta}>
                          <span>{video.duration}</span>
                          {video.isCompleted && <span>已完成</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VideoPlayerPage; 