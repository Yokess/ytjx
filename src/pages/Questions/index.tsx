import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Pagination, 
  Spin, 
  Empty, 
  Tabs,
  Statistic,
  Divider,
  Progress,
  Space,
  Radio,
  message
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  StarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import { RootState } from '../../store';
import { 
  fetchQuestions, 
  fetchLeaderboard,
  searchQuestions,
  setCurrentPage, 
  setPageSize 
} from '../../store/slices/questionSlice';
import { 
  QuestionType, 
  QuestionDifficulty, 
  QuestionQueryParams 
} from '../../types/question';
import styles from './Questions.module.scss';
// 导入默认头像
import defaultAvatar from '../../assets/images/default-avatar.svg';
import questionApi from '../../api/questionApi';
import HighlightText from '../../components/HighlightText';
import questionSearchApi from '../../api/questionSearchApi';

const { TabPane } = Tabs;
const { Option } = Select;

// 题目类型选项
const questionTypeOptions = [
  { value: QuestionType.SINGLE_CHOICE, label: '单选题' },
  { value: QuestionType.MULTIPLE_CHOICE, label: '多选题' },
  { value: QuestionType.JUDGE, label: '判断题' },
  { value: QuestionType.FILL_BLANK, label: '填空题' },
  { value: QuestionType.ESSAY, label: '问答题' }
];

// 难度等级选项
const difficultyOptions = [
  { value: QuestionDifficulty.EASY, label: '简单' },
  { value: QuestionDifficulty.MEDIUM, label: '中等' },
  { value: QuestionDifficulty.HARD, label: '困难' },
];

// 知识点选项（模拟数据）
const knowledgePointOptions = [
  { value: 101, label: '高等数学' },
  { value: 102, label: '线性代数' },
  { value: 103, label: '概率论' },
  { value: 104, label: '数据结构' },
  { value: 105, label: '操作系统' },
  { value: 106, label: '计算机网络' },
  { value: 107, label: '数据库原理' },
  { value: 108, label: '软件工程' }
];

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 从Redux获取状态
  const { 
    questions: reduxQuestions,
    searchResults,
    searchTotal,
    searchCurrentPage,
    total: reduxTotal, 
    currentPage, 
    pageSize, 
    totalPages,
    loading: reduxLoading,
    leaderboard
  } = useSelector((state: RootState) => state.question);
  
  // 本地状态
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<QuestionQueryParams>({
    keyword: '',
    page: 1,
    size: 10
  });
  const [activeTab, setActiveTab] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all');
  const [knowledgePointFilter, setKnowledgePointFilter] = useState<number | 'all'>('all');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // 获取题目列表
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionSearchApi.searchQuestions(searchParams);
      if (response.success && response.data) {
        setQuestions(response.data.list || []);
        setTotal(response.data.total || 0);
      } else {
        message.error(response.message || '获取题目失败');
      }
    } catch (error) {
      console.error('获取题目失败:', error);
      message.error('获取题目失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    // 获取题目列表
    fetchQuestions();
    
    // 获取排行榜
    dispatch(fetchLeaderboard({}) as any);
  }, [dispatch]);
  
  // 当搜索参数变化时重新获取题目
  useEffect(() => {
    fetchQuestions();
  }, [searchParams]);
  
  // 处理搜索
  const handleSearch = () => {
    setSearchParams({
      ...searchParams,
      page: 1 // 重置到第一页
    });
  };
  
  // 处理筛选条件变化
  const handleFilterChange = (field: string, value: any) => {
    setSearchParams({
      ...searchParams,
      [field]: value,
      page: 1 // 重置到第一页
    });
  };
  
  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    dispatch(setCurrentPage(page) as any);
    if (pageSize) {
      dispatch(setPageSize(pageSize) as any);
    }
    
    setSearchParams({
      ...searchParams,
      page,
      size: pageSize || searchParams.size
    });
  };
  
  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    setIsSubmitting(true);
    try {
      const response = await questionApi.submitAnswer(currentQuestion.questionId, {
        answer: selectedAnswer
      });
      
      if (response.isCorrect) {
        message.success('回答正确！');
        setShowAnswer(true);
      } else {
        message.error('回答错误，请重试');
      }
    } catch (error) {
      message.error('提交答案失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionClick = (question: any) => {
    // 跳转到题目详情页面
    console.log('点击题目:', question);
    navigate(`/questions/${question.questionId}`);
  };
  
  // 渲染侧边栏内容
  const renderSidebar = () => {
    return (
      <div className={styles.sidebar}>
        {/* 今日做题 */}
        <div className={styles.todayExam}>
          <Card title="今日做题" className={styles.todayExamCard}>
            <div className={styles.examProgress}>
              <div className={styles.progressInfo}>
                <span>完成题目</span>
                <span className={styles.progressValue}>68/100</span>
              </div>
              <Progress 
                percent={68} 
                showInfo={false} 
                strokeColor="#5B5CFF" 
                trailColor="#e8e8e8"
                className={styles.progressBar}
              />
            </div>
          </Card>
        </div>

        {/* 题库分类 */}
        <Card title="题库分类" className={styles.categoriesCard}>
          <div className={styles.categoryLinks}>
            <Link to="/questions" className={`${styles.categoryLink} ${styles.active}`}>
              <BookOutlined />
              <span>智能练习</span>
            </Link>
            <Link to="/exams/mock" className={styles.categoryLink}>
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
        </Card>

        {/* 科目分类 */}
        <Card title="科目分类" className={styles.subjectsCard}>
          <div className={styles.subjectList}>
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <div className={styles.subjectDot} style={{ backgroundColor: '#5B5CFF' }}></div>
                <span className={styles.subjectName}>数学</span>
                <span className={styles.subjectCount}>3280题</span>
              </div>
              <div className={styles.subjectProgress}>
                <Progress 
                  percent={75} 
                  showInfo={false} 
                  strokeColor="#5B5CFF" 
                  trailColor="#e8e8e8"
                  className={styles.progressBar}
                />
              </div>
            </div>
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <div className={styles.subjectDot} style={{ backgroundColor: '#52c41a' }}></div>
                <span className={styles.subjectName}>英语</span>
                <span className={styles.subjectCount}>2460题</span>
              </div>
              <div className={styles.subjectProgress}>
                <Progress 
                  percent={60} 
                  showInfo={false} 
                  strokeColor="#52c41a" 
                  trailColor="#e8e8e8"
                  className={styles.progressBar}
                />
              </div>
            </div>
            <div className={styles.subjectItem}>
              <div className={styles.subjectInfo}>
                <div className={styles.subjectDot} style={{ backgroundColor: '#722ed1' }}></div>
                <span className={styles.subjectName}>政治</span>
                <span className={styles.subjectCount}>1840题</span>
              </div>
              <div className={styles.subjectProgress}>
                <Progress 
                  percent={45} 
                  showInfo={false} 
                  strokeColor="#722ed1" 
                  trailColor="#e8e8e8"
                  className={styles.progressBar}
                />
              </div>
            </div>
          </div>
        </Card>
        
        {/* 做题排行榜 */}
        <Card title="做题排行榜" className={styles.leaderboardCard}>
          {reduxLoading.leaderboard ? (
            <div className={styles.loadingContainer}>
              <Spin />
            </div>
          ) : leaderboard ? (
            <div className={styles.leaderboard}>
              {leaderboard.leaderboard && leaderboard.leaderboard.map((item, index) => (
                <div key={item.userId} className={styles.leaderboardItem}>
                  <div className={styles.rank}>
                    {index < 3 ? (
                      <TrophyOutlined className={`${styles.trophy} ${styles[`trophy${index + 1}`]}`} />
                    ) : (
                      <span>{item.rank}</span>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <img 
                      src={item.avatar || defaultAvatar} 
                      alt={item.username} 
                      className={styles.avatar} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = defaultAvatar;
                      }}
                    />
                    <span className={styles.username}>{item.username}</span>
                  </div>
                  <div className={styles.stats}>
                    <div className={styles.count}>{item.count}题</div>
                    <div className={styles.accuracy}>{(item.accuracy * 100).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="暂无排行榜数据" />
          )}
        </Card>
      </div>
    );
  };
  
  // 渲染题目卡片
  const renderQuestionCard = (question: any) => {
    const isSelected = currentQuestion?.questionId === question.questionId;
    
    // 处理高亮内容 - 适配ES搜索接口返回的数据
    const displayContent = question.highlightFields?.questionText?.[0] || question.questionText;
    const displayKnowledgePoints = question.highlightFields?.knowledgePoint?.[0] || question.knowledgePoint;
    
    // 处理题目类型和难度
    const questionType = question.questionType;
    const difficultyLevel = question.difficultyLevel;
    
    return (
      <Card 
        key={question.questionId} 
        className={`${styles.questionCard} ${isSelected ? styles.selected : ''}`}
        onClick={() => handleQuestionClick(question)}
      >
        <div className={styles.questionHeader}>
          <Tag color={getTypeColor(questionType)}>{getTypeLabel(questionType)}</Tag>
          <Tag color={getDifficultyColor(difficultyLevel)}>
            {getDifficultyLabel(difficultyLevel)}
          </Tag>
          {displayKnowledgePoints && (
            <HighlightText 
              text={displayKnowledgePoints}
              html={!!question.highlightFields?.knowledgePoint}
              className={styles.knowledgePoint}
              customStyle={true}
            />
          )}
        </div>
        
        <div className={styles.questionContent}>
          <div className={styles.questionText}>
            <HighlightText 
              text={displayContent}
              html={!!question.highlightFields?.questionText}
              customStyle={true}
            />
          </div>
          
          {isSelected && question.options && (
            <div className={styles.answerSection}>
              <div className={styles.optionsGrid}>
                {question.options.map((option: any) => (
                  <div key={option.optionId} className={styles.optionItem}>
                    <Radio 
                      value={option.optionId} 
                      checked={selectedAnswer === option.optionId}
                      onChange={() => handleAnswerSelect(option.optionId)}
                      disabled={showAnswer}
                    >
                      {option.optionValue}
                    </Radio>
                  </div>
                ))}
              </div>
              
              {!showAnswer && (
                <Button 
                  type="primary" 
                  onClick={handleSubmitAnswer}
                  loading={isSubmitting}
                  disabled={!selectedAnswer}
                >
                  提交答案
                </Button>
              )}
              
              {showAnswer && (
                <div className={styles.analysis}>
                  <div className={styles.analysisTitle}>解析：</div>
                  <div className={styles.analysisContent}>{question.analysis}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  };
  
  // 获取题目类型标签
  const getTypeLabel = (type: QuestionType) => {
    const option = questionTypeOptions.find(opt => opt.value === type);
    return option ? option.label : '未知类型';
  };
  
  // 获取题目类型颜色
  const getTypeColor = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return '#5B5CFF';
      case QuestionType.MULTIPLE_CHOICE:
        return '#722ed1';
      case QuestionType.JUDGE:
        return '#52c41a';
      case QuestionType.FILL_BLANK:
        return '#fa8c16';
      case QuestionType.ESSAY:
        return '#f5222d';
      default:
        return '#d9d9d9';
    }
  };
  
  // 获取难度标签
  const getDifficultyLabel = (difficulty: QuestionDifficulty) => {
    const option = difficultyOptions.find(opt => opt.value === difficulty);
    return option ? option.label : '未知难度';
  };
  
  // 获取难度颜色
  const getDifficultyColor = (difficulty: QuestionDifficulty) => {
    switch (difficulty) {
      case QuestionDifficulty.EASY:
        return '#52c41a';
      case QuestionDifficulty.MEDIUM:
        return '#1890ff';
      case QuestionDifficulty.HARD:
        return '#fa8c16';
      case QuestionDifficulty.VERY_HARD:
        return '#f5222d';
      case QuestionDifficulty.EXPERT:
        return '#722ed1';
      default:
        return '#d9d9d9';
    }
  };
  
  return (
    <MainLayout sidebarContent={renderSidebar()}>
      <div className={styles.questionsPage}>
        {/* 统计卡片 */}
        <div className={styles.statsCards}>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#e6f7ff', color: '#1890ff' }}>
              <FileTextOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>总做题量</h3>
              <p>{reduxTotal}</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f6ffed', color: '#52c41a' }}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>正确率</h3>
              <p>85%</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fff7e6', color: '#fa8c16' }}>
              <ClockCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>做题时长</h3>
              <p>96h</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f9f0ff', color: '#722ed1' }}>
              <StarOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>连续做题</h3>
              <p>28天</p>
            </div>
          </Card>
        </div>

        {/* 智能练习和模拟考试卡片 */}
        <Row gutter={[24, 24]} className={styles.featureCards}>
          <Col xs={24} md={12}>
            <Card className={styles.featureCard} style={{ background: 'linear-gradient(to bottom right, #5B5CFF, #8E8EFF)' }}>
              <div className={styles.featureContent}>
                <h2>智能练习</h2>
                <p>基于AI算法，根据你的做题情况智能推荐适合的题目</p>
                <Button type="primary" className={styles.featureButton} style={{ background: '#fff', color: '#5B5CFF' }}>
                  开始练习
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className={styles.featureCard} style={{ background: '#fff', border: '2px dashed #ddd' }}>
              <div className={styles.featureContent}>
                <h2>模拟考试</h2>
                <p>真实还原考试环境，提供全真模拟体验</p>
                <Link to="/exams/mock">
                  <Button type="primary" className={styles.featureButton}>
                    进入考试
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* 题库筛选 */}
        <Card className={styles.filterCard}>
          <div className={styles.filterHeader}>
            <div className={styles.filterTitle}>
              <span className={styles.filterLabel}>题型：</span>
              <div className={styles.filterButtons}>
                <Button 
                  type={typeFilter === 'all' ? 'primary' : 'default'} 
                  shape="round" 
                  className={styles.filterButton}
                  onClick={() => {
                    setTypeFilter('all');
                    handleFilterChange('type', undefined);
                  }}
                >
                  全部
                </Button>
                {questionTypeOptions.map(option => (
                  <Button 
                    key={option.value}
                    type={typeFilter === option.value ? 'primary' : 'default'} 
                    shape="round" 
                    className={styles.filterButton}
                    onClick={() => {
                      setTypeFilter(option.value);
                      handleFilterChange('type', option.value);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className={styles.filterTitle}>
              <span className={styles.filterLabel}>难度：</span>
              <div className={styles.filterButtons}>
                <Button 
                  type={difficultyFilter === 'all' ? 'primary' : 'default'} 
                  shape="round" 
                  className={styles.filterButton}
                  onClick={() => {
                    setDifficultyFilter('all');
                    handleFilterChange('difficulty', undefined);
                  }}
                >
                  全部
                </Button>
                {difficultyOptions.map(option => (
                  <Button 
                    key={option.value}
                    type={difficultyFilter === option.value ? 'primary' : 'default'} 
                    shape="round" 
                    className={styles.filterButton}
                    onClick={() => {
                      setDifficultyFilter(option.value);
                      handleFilterChange('difficulty', option.value);
                    }}
                    style={{ 
                      background: difficultyFilter === option.value ? getDifficultyColor(option.value) : '',
                      borderColor: difficultyFilter === option.value ? getDifficultyColor(option.value) : ''
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className={styles.filterTitle}>
              <span className={styles.filterLabel}>知识点：</span>
              <div className={styles.filterButtons}>
                <Button 
                  type={knowledgePointFilter === 'all' ? 'primary' : 'default'} 
                  shape="round" 
                  className={styles.filterButton}
                  onClick={() => {
                    setKnowledgePointFilter('all');
                    handleFilterChange('knowledgePoint', undefined);
                  }}
                >
                  全部
                </Button>
                {knowledgePointOptions.slice(0, 3).map(option => (
                  <Button 
                    key={option.value}
                    type={knowledgePointFilter === option.value ? 'primary' : 'default'} 
                    shape="round" 
                    className={styles.filterButton}
                    onClick={() => {
                      setKnowledgePointFilter(option.value);
                      handleFilterChange('knowledgePoint', option.value);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.searchBar}>
            <Input
              placeholder="搜索题目关键词"
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              className={styles.searchInput}
            />
            <Button type="primary" onClick={handleSearch}>搜索</Button>
          </div>
        </Card>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          className={styles.tabs}
        >
          <TabPane tab="全部题目" key="all">
            {loading ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                <div className={styles.questionsList}>
                  {questions.length > 0 
                    ? questions.map(question => renderQuestionCard(question))
                    : <Empty description="没有找到相关题目" />
                  }
                </div>
                
                <div className={styles.pagination}>
                  <Pagination
                    current={searchParams.page || 1}
                    pageSize={searchParams.size || 10}
                    total={total}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `共 ${total} 题`}
                    onChange={handlePageChange}
                    onShowSizeChange={(current, size) => handlePageChange(current, size)}
                  />
                </div>
              </>
            )}
          </TabPane>
          
          <TabPane tab="我的错题" key="wrong">
            <div className={styles.wrongQuestionsTab}>
              <Button 
                type="primary" 
                onClick={() => navigate('/questions/wrong')}
                className={styles.viewAllButton}
              >
                查看全部错题
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default QuestionsPage; 