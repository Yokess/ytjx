import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Progress, 
  Divider, 
  Table, 
  Tag, 
  Modal, 
  Space,
  Row,
  Col,
  Spin,
  Empty,
  message
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  StarFilled
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ExamStatus } from '../../../types/exam';
import { 
  getExams,
  participateExam,
  getExamResult
} from '../../../api/examApi';
import MainLayout from '../../../components/layout/MainLayout';
import styles from './ExamMock.module.scss';

const { Title, Text, Paragraph } = Typography;

// 定义API返回的考试数据接口
interface ExamData {
  examId: number;
  examName: string;
  examDesc: string;
  examStartTime: string;
  examEndTime: string;
  duration: number;
  totalScore: number;
  passScore: number;
  status: number;
  createAt: string;
  updateAt: string;
  creatorId: number;
  creatorName: string;
  participantCount: number;
  questions: any[] | null;
}

// 定义API返回的数据结构
interface ApiResponse {
  code: number;
  message: string;
  data: {
    total: number;
    list: ExamData[];
  };
}

// 侧边栏内容
const SidebarContent = () => {
  return (
    <div className={styles.sidebar}>
      {/* 考试统计 */}
      <div className={styles.examStats}>
        <h3>考试统计</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>已完成</span>
            <span className={styles.statValue}>12场</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>平均分</span>
            <span className={styles.statValue}>85.6</span>
          </div>
        </div>
      </div>

      {/* 考试分类 */}
      <div className={styles.examCategories}>
        <h3>考试分类</h3>
        <div className={styles.categoryLinks}>
          <Link to="/exams/smart" className={styles.categoryLink}>
            <BookOutlined />
            <span>智能练习</span>
          </Link>
          <Link to="/exams/mock" className={`${styles.categoryLink} ${styles.active}`}>
            <ClockCircleOutlined />
            <span>模拟考试</span>
          </Link>
          <Link to="/exams/error-book" className={styles.categoryLink}>
            <FileTextOutlined />
            <span>错题本</span>
          </Link>
          <Link to="/exams/statistics" className={styles.categoryLink}>
            <BarChartOutlined />
            <span>统计分析</span>
          </Link>
        </div>
      </div>

      {/* 科目分类 */}
      <div className={styles.subjectCategories}>
        <h3>考试科目</h3>
        <div className={styles.subjectList}>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <div className={styles.subjectDot} style={{ backgroundColor: '#5B5CFF' }}></div>
              <span className={styles.subjectName}>数学</span>
              <span className={styles.subjectCount}>8套</span>
            </div>
          </div>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <div className={styles.subjectDot} style={{ backgroundColor: '#52c41a' }}></div>
              <span className={styles.subjectName}>英语</span>
              <span className={styles.subjectCount}>6套</span>
            </div>
          </div>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <div className={styles.subjectDot} style={{ backgroundColor: '#722ed1' }}></div>
              <span className={styles.subjectName}>政治</span>
              <span className={styles.subjectCount}>5套</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExamMockPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 数据加载状态
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [examResultData, setExamResultData] = useState<any>(null);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [historyExamList, setHistoryExamList] = useState<any[]>([]);
  
  // 加载考试数据
  useEffect(() => {
    // 获取进行中和即将开始的考试
    fetchOngoingExams();
    
    // 加载历史考试记录
    loadHistoryExams();
  }, []);
  
  // 获取进行中的考试
  const fetchOngoingExams = async () => {
    setLoading(true);
    try {
      // 获取全部考试，因为前端可能需要显示各种状态的考试
      const response = await getExams({}) as unknown as ApiResponse;
      if (response.code === 200 && response.data) {
        // 获取考试列表
        const examsList = response.data.list || [];
        
        // 更新考试状态 - 基于当前时间判断实际状态
        const now = new Date();
        const updatedExams = examsList.map((exam: ExamData) => {
          const startTime = new Date(exam.examStartTime);
          const endTime = new Date(exam.examEndTime);
          
          let actualStatus = exam.status;
          if (now < startTime) {
            actualStatus = ExamStatus.UPCOMING;
          } else if (now > endTime) {
            actualStatus = ExamStatus.ENDED;
          } else {
            actualStatus = ExamStatus.ONGOING;
          }
          
          return { 
            ...exam, 
            status: actualStatus,
            name: exam.examName,
            description: exam.examDesc,
            startTime: exam.examStartTime,
            endTime: exam.examEndTime
          };
        });
        
        setExams(updatedExams);
        setError(null);
      } else {
        setError(response.message || '获取考试列表失败');
      }
    } catch (err) {
      setError('获取考试列表出错');
      console.error('获取考试列表出错:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 加载历史考试记录
  const loadHistoryExams = async () => {
    try {
      // 获取已结束的考试
      const response = await getExams({ status: ExamStatus.ENDED }) as unknown as ApiResponse;
      if (response.code === 200 && response.data) {
        const endedExams = response.data.list || [];
        const historyData = [];
        
        for (const exam of endedExams.slice(0, 5)) { // 取前5个
          try {
            const resultResponse = await getExamResult(exam.examId);
            if (resultResponse.code === 200 && resultResponse.data) {
              const resultData = resultResponse.data;
              historyData.push({
                id: exam.examId,
                title: exam.examName,
                date: new Date(resultData.submitTime || exam.examEndTime).toLocaleDateString(),
                score: resultData.score,
                totalScore: resultData.totalScore,
                ranking: resultData.rank ? 
                  `第${resultData.rank}名` : 
                  (resultData.percentile ? `Top ${Math.round(100 - resultData.percentile)}%` : '-')
              });
            }
          } catch (err) {
            console.error('获取考试结果失败', err);
          }
        }
        
        setHistoryExamList(historyData);
      }
    } catch (err) {
      console.error('获取历史考试记录出错:', err);
    }
  };
  
  // 筛选进行中的考试
  const ongoingExam = exams.find(exam => exam.status === ExamStatus.ONGOING);
  
  // 筛选即将开始的考试
  const upcomingExams = exams.filter(exam => exam.status === ExamStatus.UPCOMING);
  
  // 历史考试表格列
  const historyColumns = [
    {
      title: '考试名称',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className={styles.examTitle}>{text}</span>
    },
    {
      title: '考试时间',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => <span className={styles.examDate}>{date}</span>
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: any) => (
        <span className={styles.examScore}>{score}/{record.totalScore}</span>
      )
    },
    {
      title: '排名',
      dataIndex: 'ranking',
      key: 'ranking',
      render: (ranking: string) => (
        <Tag color="success" className={styles.rankingTag}>{ranking}</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Link to={`/exams/result/${record.id}`}>
          <Button 
            type="link" 
            className={styles.detailButton}
          >
            查看详情
          </Button>
        </Link>
      )
    }
  ];
  
  // 显示考试说明弹窗
  const showExamInfoModal = (examId: number) => {
    setSelectedExamId(examId);
    setIsModalVisible(true);
  };
  
  // 关闭考试说明弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  // 参加考试
  const handleParticipate = async () => {
    if (!selectedExamId) return;
    
    const exam = exams.find(exam => exam.examId === selectedExamId);
    if (!exam) return;

    // 检查考试是否已经开始
    const now = new Date();
    const startTime = new Date(exam.startTime);
    
    if (now < startTime) {
      message.warning('考试尚未开始，请等待考试开始后再参加');
      setIsModalVisible(false);
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await participateExam(selectedExamId);
      if (response.code === 200) {
        message.success('成功进入考试');
        navigate(`/exams/detail/${selectedExamId}`);
      } else {
        message.error(response.message || '考试加入失败');
      }
    } catch (err) {
      message.error('考试加入出错，请稍后重试');
      console.error('参加考试出错:', err);
    } finally {
      setSubmitting(false);
      setIsModalVisible(false);
    }
  };
  
  // 获取选中的考试
  const selectedExam = selectedExamId ? exams.find(exam => exam.examId === selectedExamId) : null;
  
  // 格式化剩余时间
  const formatRemainingTime = (exam: any) => {
    // 考试已经结束的情况
    if (exam.status === ExamStatus.ENDED) {
      return '已结束';
    }
    
    // 考试未开始的情况
    if (exam.status === ExamStatus.UPCOMING) {
      return '未开始';
    }
    
    // 考试正在进行中，计算剩余时间
    const now = new Date();
    const endTime = new Date(exam.endTime);
    
    const diffMs = endTime.getTime() - now.getTime();
    
    // 考试已经结束的情况
    if (diffMs <= 0) {
      return '已结束';
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}小时${diffMinutes}分钟`;
  };
  
  // 计算进度
  const calculateProgress = (exam: any) => {
    if (!exam) return 0;
    
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    
    const totalDuration = endTime.getTime() - startTime.getTime();
    const elapsedDuration = now.getTime() - startTime.getTime();
    
    return Math.round((elapsedDuration / totalDuration) * 100);
  };
  
  if (loading && exams.length === 0) {
    return (
      <MainLayout sidebarContent={<SidebarContent />}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p>正在加载考试数据...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout sidebarContent={<SidebarContent />}>
      <div className={styles.examMockContainer}>
        {/* 顶部统计卡片 */}
        <div className={styles.statsCards}>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f0f5ff', color: '#5B5CFF' }}>
              <PlusOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>完成考试</h3>
              <p>{historyExamList.length}场</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f6ffed', color: '#52c41a' }}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>平均分数</h3>
              <p>
                {historyExamList.length > 0 
                  ? (historyExamList.reduce((sum, exam) => sum + exam.score, 0) / historyExamList.length).toFixed(1) 
                  : '0.0'}
              </p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fff7e6', color: '#fa8c16' }}>
              <ClockCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>可参加考试</h3>
              <p>{upcomingExams.length + (ongoingExam ? 1 : 0)}场</p>
            </div>
          </Card>
        </div>

        {/* 进行中的考试 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>进行中的考试</h2>
          </div>
          
          {ongoingExam ? (
            <div className={styles.ongoingExam}>
              <div className={styles.examInfo}>
                <div className={styles.examTitle}>
                  <h3>{ongoingExam.name}</h3>
                  <Tag color="green">进行中</Tag>
                </div>
                <div className={styles.examProgress}>
                  <div className={styles.progressInfo}>
                    <span>剩余时间</span>
                    <span className={styles.progressValue}>{formatRemainingTime(ongoingExam)}</span>
                  </div>
                  <Progress 
                    percent={calculateProgress(ongoingExam)} 
                    showInfo={false} 
                    strokeColor="#5B5CFF" 
                    trailColor="#e8e8e8"
                    className={styles.progressBar}
                  />
                </div>
                
                <div className={styles.examMetaContainer}>
                  <div className={styles.examMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>题目总数</span>
                      <span className={styles.metaValue}>{ongoingExam.questionCount}题</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>总分</span>
                      <span className={styles.metaValue}>{ongoingExam.totalScore}分</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>时长</span>
                      <span className={styles.metaValue}>{ongoingExam.duration}分钟</span>
                    </div>
                  </div>
                  
                  <div className={styles.examActions}>
                    <Link to={`/exams/detail/${ongoingExam.examId}`}>
                      <Button type="primary" icon={<PlayCircleOutlined />} size="large">
                        继续考试
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Empty description="当前没有进行中的考试" />
          )}
        </Card>

        {/* 可参加的考试 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>可参加的考试</h2>
          </div>
          
          {upcomingExams.length > 0 ? (
            <div className={styles.availableExams}>
              {upcomingExams.map(exam => (
                <Card key={exam.examId} className={styles.examCard}>
                  <div className={styles.examContent}>
                    <div className={styles.examInfo}>
                      <div className={styles.examHeader}>
                        <h3>{exam.name}</h3>
                        {new Date(exam.startTime).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 && (
                          <Tag color="blue">新考试</Tag>
                        )}
                      </div>
                      <div className={styles.examDescription}>
                        {exam.description}
                      </div>
                      <div className={styles.examTime}>
                        <div className={styles.timeItem}>
                          <ClockCircleOutlined />
                          <span>开始时间：{new Date(exam.startTime).toLocaleString()}</span>
                        </div>
                        <div className={styles.timeItem}>
                          <ClockCircleOutlined />
                          <span>结束时间：{new Date(exam.endTime).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={styles.examDetails}>
                        <div className={styles.detailItem}>
                          <ClockCircleOutlined />
                          <span>{exam.duration}分钟</span>
                        </div>
                        <div className={styles.detailItem}>
                          <FileTextOutlined />
                          <span>{exam.questionCount}题</span>
                        </div>
                        <div className={styles.detailItem}>
                          <StarFilled />
                          <span>{exam.totalScore}分</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.examActions}>
                      {new Date(exam.startTime) > new Date() ? (
                        <Button disabled>
                          考试未开始
                        </Button>
                      ) : (
                        <Button 
                          type="primary" 
                          onClick={() => showExamInfoModal(exam.examId)}
                        >
                          参加考试
                        </Button>
                      )}
                      <Button type="link" icon={<InfoCircleOutlined />}>
                        查看详情
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="当前没有可参加的考试" />
          )}
        </Card>

        {/* 历史考试记录 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>历史考试记录</h2>
            <Link to="/exams/history" className={styles.viewMoreLink}>
              查看更多
            </Link>
          </div>
          
          {historyExamList.length > 0 ? (
            <Table 
              columns={historyColumns} 
              dataSource={historyExamList} 
              rowKey="id"
              pagination={false}
              className={styles.historyTable}
            />
          ) : (
            <Empty description="暂无历史考试记录" />
          )}
        </Card>
        
        {/* 考试说明弹窗 */}
        {selectedExam && (
          <Modal
            title="考试说明"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>,
              <Button 
                key="submit" 
                type="primary" 
                loading={submitting}
                onClick={handleParticipate}
              >
                开始考试
              </Button>,
            ]}
            width={700}
          >
            <div className={styles.examInfoModal}>
              <div className={styles.modalExamTitle}>
                <h3>{selectedExam.name}</h3>
                <Tag color="blue">即将开始</Tag>
              </div>
              
              <div className={styles.examRules}>
                <h4>考试规则</h4>
                <ul>
                  <li>考试时间为{selectedExam.duration}分钟，请合理分配时间</li>
                  <li>考试过程中请勿刷新页面或关闭浏览器</li>
                  <li>可以使用草稿纸进行演算</li>
                  <li>提交后将立即显示成绩和解析</li>
                </ul>
              </div>
              
              <div className={styles.examDistribution}>
                <h4>题目分布</h4>
                <div className={styles.distributionItems}>
                  <div className={styles.distributionItem}>
                    <span className={styles.itemType}>总分</span>
                    <span className={styles.itemValue}>{selectedExam.totalScore}分</span>
                  </div>
                  <div className={styles.distributionItem}>
                    <span className={styles.itemType}>题目数量</span>
                    <span className={styles.itemValue}>{selectedExam.questionCount}题</span>
                  </div>
                  <div className={styles.distributionItem}>
                    <span className={styles.itemType}>考试时长</span>
                    <span className={styles.itemValue}>{selectedExam.duration}分钟</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.examNote}>
                <h4>注意事项</h4>
                <p>请确保在考试期间网络畅通，建议使用电脑参加考试以获得最佳体验。祝您考试顺利！</p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </MainLayout>
  );
};

export default ExamMockPage; 