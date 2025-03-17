import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Tabs, 
  Tag, 
  Progress, 
  Divider, 
  Spin,
  Empty,
  message,
  Radio,
  Row,
  Col,
  Space
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  TrophyOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PieChartOutlined,
  BarChartOutlined,
  RollbackOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getExamResult, getExamDetail } from '../../../api/examApi';
import { QuestionType, ExamResult, ExamResultQuestionDetail } from '../../../types/exam';
import MainLayout from '../../../components/layout/MainLayout';
import styles from './ExamResult.module.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 侧边栏内容
const SidebarContent = () => {
  return (
    <div className={styles.sidebar}>
      {/* 考试分析 */}
      <div className={styles.examAnalysis}>
        <h3>考试分析</h3>
        <div className={styles.analysisItem}>
          <span className={styles.itemLabel}>知识点掌握</span>
          <Progress 
            percent={75} 
            showInfo={false} 
            strokeColor="#5B5CFF" 
            trailColor="#e8e8e8"
            className={styles.progressBar}
          />
          <span className={styles.itemValue}>良好</span>
        </div>
        <div className={styles.analysisItem}>
          <span className={styles.itemLabel}>答题速度</span>
          <Progress 
            percent={60} 
            showInfo={false} 
            strokeColor="#5B5CFF" 
            trailColor="#e8e8e8"
            className={styles.progressBar}
          />
          <span className={styles.itemValue}>中等</span>
        </div>
        <div className={styles.analysisItem}>
          <span className={styles.itemLabel}>错题率</span>
          <Progress 
            percent={20} 
            showInfo={false} 
            strokeColor="#ff4d4f" 
            trailColor="#e8e8e8"
            className={styles.progressBar}
          />
          <span className={styles.itemValue}>低</span>
        </div>
      </div>

      {/* 建议改进 */}
      <div className={styles.improvementTips}>
        <h3>建议改进</h3>
        <div className={styles.tipsList}>
          <div className={styles.tipItem}>
            <div className={styles.tipDot}></div>
            <span>巩固线性代数知识点</span>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipDot}></div>
            <span>加强计算机网络练习</span>
          </div>
          <div className={styles.tipItem}>
            <div className={styles.tipDot}></div>
            <span>复习数据结构算法</span>
          </div>
        </div>
      </div>

      {/* 相关考试 */}
      <div className={styles.relatedExams}>
        <h3>相关考试</h3>
        <div className={styles.examsList}>
          <Link to="/exams/mock" className={styles.examLink}>
            <span>2025考研英语模拟测试</span>
            <Tag color="blue">即将开始</Tag>
          </Link>
          <Link to="/exams/mock" className={styles.examLink}>
            <span>数据结构专项练习</span>
            <Tag color="green">进行中</Tag>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ExamResultPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  // 数据加载状态
  const [loading, setLoading] = useState(true);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [examDetail, setExamDetail] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 本地状态
  const [activeTab, setActiveTab] = useState('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // 加载考试结果
  useEffect(() => {
    const fetchData = async () => {
      if (!examId) return;
      
      setLoading(true);
      try {
        // 获取考试结果
        const resultResponse = await getExamResult(Number(examId));
        if (resultResponse.code === 200 && resultResponse.data) {
          setExamResult(resultResponse.data);
          
          // 获取考试详情
          const detailResponse = await getExamDetail(Number(examId));
          if (detailResponse.code === 200 && detailResponse.data) {
            setExamDetail(detailResponse.data);
          }
          
          setError(null);
        } else {
          setError(resultResponse.message || '获取考试结果失败');
        }
      } catch (err) {
        setError('获取考试结果出错');
        console.error('获取考试结果出错:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [examId]);
  
  // 获取题目类型名称
  const getQuestionTypeName = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return '单选题';
      case QuestionType.MULTIPLE_CHOICE:
        return '多选题';
      case QuestionType.JUDGE:
        return '判断题';
      case QuestionType.FILL_BLANK:
        return '填空题';
      case QuestionType.ESSAY:
        return '简答题';
      default:
        return '其他题型';
    }
  };
  
  // 过滤题目（全部/正确/错误）
  const filterQuestions = (questions: ExamResultQuestionDetail[], type: 'all' | 'correct' | 'wrong') => {
    if (type === 'all') return questions;
    if (type === 'correct') return questions.filter(q => q.isCorrect);
    return questions.filter(q => !q.isCorrect);
  };
  
  // 计算相关统计数据
  const calculateStats = () => {
    if (!examResult) return { correctRate: 0, wrongRate: 0, avgScore: 0 };
    
    const correctRate = examResult.accuracy * 100;
    const wrongRate = 100 - correctRate;
    const avgScore = examResult.score / examResult.totalCount;
    
    return { correctRate, wrongRate, avgScore };
  };
  
  // 格式化考试时间
  const formatExamDuration = () => {
    if (!examResult) return '0分钟';
    
    const startTime = new Date(examResult.startTime);
    const submitTime = new Date(examResult.submitTime);
    const durationMs = submitTime.getTime() - startTime.getTime();
    
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    return `${minutes}分${seconds}秒`;
  };
  
  // 生成百分比评价
  const getPercentileRating = () => {
    if (!examResult || !examResult.percentile) return { text: '未知', color: '' };
    
    const percentile = examResult.percentile;
    if (percentile >= 90) return { text: '优秀', color: 'success' };
    if (percentile >= 75) return { text: '良好', color: 'processing' };
    if (percentile >= 60) return { text: '一般', color: 'warning' };
    return { text: '需努力', color: 'error' };
  };
  
  if (loading) {
    return (
      <MainLayout sidebarContent={<SidebarContent />}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p>正在加载考试结果...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !examResult) {
    return (
      <MainLayout sidebarContent={<SidebarContent />}>
        <div className={styles.errorContainer}>
          <p>{error || '加载考试结果失败'}</p>
          {error && error.includes('考试尚未结束') ? (
            <>
              <p>您正在查看的是进行中的考试，无法获取结果。请完成考试后再查看结果。</p>
              <Button type="primary" onClick={() => navigate(`/exams/detail/${examId}`)}>
                返回考试
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          )}
        </div>
      </MainLayout>
    );
  }
  
  const { correctRate, wrongRate, avgScore } = calculateStats();
  const percentileRating = getPercentileRating();
  
  // 获取错题数量
  const wrongQuestionsCount = examResult.details.filter(q => !q.isCorrect).length;
  
  return (
    <MainLayout sidebarContent={<SidebarContent />}>
      <div className={styles.examResultContainer}>
        {/* 结果标题 */}
        <Card className={styles.resultTitleCard}>
          <div className={styles.examTitle}>
            <Title level={4}>{examResult.examName}</Title>
            <div className={styles.examMeta}>
              <span>总分: {examResult.totalScore}分</span>
              <span>题目: {examResult.totalCount}道</span>
              <span>参与人数: {examResult.participantCount || 0}人</span>
            </div>
          </div>
        </Card>
        
        {/* 成绩总览 */}
        <Card className={styles.scoreOverviewCard}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8}>
              <div className={styles.scoreDisplay}>
                <div className={styles.scoreBadge}>
                  <span className={styles.scoreValue}>{examResult.score}</span>
                  <span className={styles.scoreTotal}>/{examResult.totalScore}</span>
                </div>
                <Progress 
                  type="circle" 
                  percent={Math.round((examResult.score / examResult.totalScore) * 100)} 
                  strokeColor="#5B5CFF"
                  className={styles.scoreProgress}
                />
              </div>
            </Col>
            
            <Col xs={24} md={16}>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
                    <CheckCircleOutlined />
                  </div>
                  <div className={styles.statInfo}>
                    <Text type="secondary">正确题数</Text>
                    <div className={styles.statValue}>
                      {examResult.correctCount}/{examResult.totalCount}
                      <span className={styles.statPercent}>({Math.round(correctRate)}%)</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#fff2f0', color: '#ff4d4f' }}>
                    <CloseCircleOutlined />
                  </div>
                  <div className={styles.statInfo}>
                    <Text type="secondary">错误题数</Text>
                    <div className={styles.statValue}>
                      {wrongQuestionsCount}/{examResult.totalCount}
                      <span className={styles.statPercent}>({Math.round(wrongRate)}%)</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#f0f5ff', color: '#1890ff' }}>
                    <TrophyOutlined />
                  </div>
                  <div className={styles.statInfo}>
                    <Text type="secondary">排名</Text>
                    <div className={styles.statValue}>
                      {examResult.rank || '-'}
                      {examResult.percentile && (
                        <span className={styles.statPercent}>
                          (超过{Math.round(examResult.percentile)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}>
                    <ClockCircleOutlined />
                  </div>
                  <div className={styles.statInfo}>
                    <Text type="secondary">用时</Text>
                    <div className={styles.statValue}>{formatExamDuration()}</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          
          <Divider />
          
          <div className={styles.overallEvaluation}>
            <Title level={5}>总体评价</Title>
            <div className={styles.evaluationContent}>
              <Tag color={percentileRating.color} className={styles.evaluationTag}>
                {percentileRating.text}
              </Tag>
              <Text>
                您在本次考试中表现{percentileRating.text}，
                {correctRate >= 80 ? '整体答题情况良好。' : 
                 correctRate >= 60 ? '有一定的进步空间。' : '需要加强相关知识点的学习。'}
                建议重点关注错题，巩固薄弱环节。
              </Text>
            </div>
          </div>
        </Card>
        
        {/* 答题详情 */}
        <Card className={styles.questionDetailsCard}>
          <Title level={5}>答题详情</Title>
          
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className={styles.questionTabs}
          >
            <TabPane 
              tab={`全部题目(${examResult.details.length})`} 
              key="all"
            >
              {renderQuestionList(examResult.details)}
            </TabPane>
            <TabPane 
              tab={`正确题目(${examResult.correctCount})`} 
              key="correct"
            >
              {renderQuestionList(filterQuestions(examResult.details, 'correct'))}
            </TabPane>
            <TabPane 
              tab={`错误题目(${wrongQuestionsCount})`} 
              key="wrong"
            >
              {renderQuestionList(filterQuestions(examResult.details, 'wrong'))}
            </TabPane>
          </Tabs>
        </Card>
        
        {/* 操作按钮 */}
        <div className={styles.actionButtons}>
          <Button 
            icon={<BarChartOutlined />} 
            className={styles.actionButton}
            onClick={() => message.info('排行榜功能正在开发中')}
          >
            查看排行榜
          </Button>
          
          <Button 
            type="primary" 
            icon={<RedoOutlined />} 
            className={styles.actionButton}
            onClick={() => navigate('/exams/mock')}
          >
            继续做题
          </Button>
          
          <Link to="/exams/mock">
            <Button 
              icon={<RollbackOutlined />} 
              className={styles.actionButton}
            >
              返回列表
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
  
  // 渲染题目列表
  function renderQuestionList(questions: ExamResultQuestionDetail[]) {
    if (questions.length === 0) {
      return <Empty description="暂无题目" />;
    }
    
    return (
      <div className={styles.questionList}>
        {questions.map((question, index) => (
          <div key={question.questionId} className={styles.questionItem}>
            <div className={styles.questionHeader}>
              <div className={styles.questionIndex}>
                <span>第 {index + 1} 题</span>
                <Tag 
                  color={question.isCorrect ? 'success' : 'error'}
                  className={styles.questionStatus}
                >
                  {question.isCorrect ? '正确' : '错误'}
                </Tag>
              </div>
              <div className={styles.questionScore}>
                得分：<span>{question.score}</span>
              </div>
            </div>
            
            <div className={styles.questionContent}>
              <Paragraph>{`问题: ${question.questionId}`}</Paragraph>
              
              <div className={styles.answerComparison}>
                <div className={styles.userAnswer}>
                  <Text type="secondary">您的答案：</Text>
                  <Text className={question.isCorrect ? styles.correctAnswer : styles.wrongAnswer}>
                    {question.userAnswer || '未作答'}
                  </Text>
                </div>
                
                <div className={styles.correctAnswerDisplay}>
                  <Text type="secondary">正确答案：</Text>
                  <Text className={styles.correctAnswer}>{question.correctAnswer}</Text>
                </div>
              </div>
              
              <div className={styles.questionAnalysis}>
                <Text type="secondary">解析：</Text>
                <Paragraph>{question.analysis || '暂无解析'}</Paragraph>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default ExamResultPage; 