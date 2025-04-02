import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Tag, 
  Radio, 
  Select, 
  Dropdown, 
  Menu, 
  Pagination,
  Space,
  Divider,
  Spin,
  Empty,
  message
} from 'antd';
import { 
  BookOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined, 
  BarChartOutlined,
  MoreOutlined,
  StarOutlined,
  MessageOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from '../../../components/layout/MainLayout';
import styles from './ErrorBook.module.scss';
import { RootState } from '../../../store';
import { 
  fetchWrongQuestions,
  setWrongQuestionsCurrentPage
} from '../../../store/slices/questionSlice';
import { removeFromWrongBook } from '../../../api/questionApi';
import { QuestionType, QuestionDifficulty } from '../../../types/question';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// 侧边栏内容
const SidebarContent = ({ onBackClick, totalWrongQuestions }: { onBackClick: () => void, totalWrongQuestions: number }) => {
  return (
    <div className={styles.sidebar}>
      {/* 错题统计概览 */}
      <div className={styles.errorStats}>
        <h3>错题统计</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>总错题数</span>
            <span className={styles.statValue}>{totalWrongQuestions}</span>
          </div>
        </div>
      </div>

      {/* 题库分类 */}
      <div className={styles.examCategories}>
        <h3>题库分类</h3>
        <div className={styles.categoryLinks}>
          <Link to="/questions" className={styles.categoryLink}>
            <BookOutlined />
            <span>智能练习</span>
          </Link>
          <Link to="/exams/mock" className={styles.categoryLink}>
            <ClockCircleOutlined />
            <span>模拟考试</span>
          </Link>
          <Link to="/exams/error-book" className={`${styles.categoryLink} ${styles.active}`}>
            <FileTextOutlined />
            <span>错题本</span>
          </Link>
          <Link to="/exams/statistics" className={styles.categoryLink}>
            <BarChartOutlined />
            <span>统计分析</span>
          </Link>
        </div>
      </div>

      <Button 
        type="primary" 
        onClick={onBackClick}
        icon={<ArrowLeftOutlined />}
        className={styles.backButton}
        style={{ marginTop: '20px', width: '100%' }}
      >
        返回
      </Button>
    </div>
  );
};

const ErrorBookPage: React.FC = () => {
  const [chapter, setChapter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 从Redux获取错题集数据
  const { 
    wrongQuestions, 
    wrongQuestionsTotal, 
    wrongQuestionsCurrentPage,
    loading
  } = useSelector((state: RootState) => state.question);

  // 加载错题集数据
  useEffect(() => {
    dispatch(fetchWrongQuestions({ page: wrongQuestionsCurrentPage, size: 10 }) as any);
  }, [dispatch, wrongQuestionsCurrentPage]);

  // 处理返回按钮点击
  const handleBackClick = () => {
    // 根据referrer判断返回到哪个页面
    const referrer = document.referrer;
    if (referrer.includes('/questions')) {
      navigate('/questions');
    } else {
      navigate('/exams');
    }
  };

  // 处理筛选
  const handleFilter = () => {
    // 实际应用中这里会调用API进行筛选
    console.log('筛选条件：', { chapter, difficulty, status });
    // 重置到第一页
    dispatch(setWrongQuestionsCurrentPage(1) as any);
    // 重新获取数据
    dispatch(fetchWrongQuestions({ page: 1, size: 10 }) as any);
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    dispatch(setWrongQuestionsCurrentPage(page) as any);
  };

  // 标记为已掌握
  const handleMarkAsMastered = (id: number) => {
    console.log('标记为已掌握：', id);
    // 这里需要先实现API
  };

  // 再做一遍
  const handleRetry = (id: number) => {
    navigate(`/questions/${id}`);
  };

  // 从错题本移除
  const handleRemoveFromWrongBook = async (questionId: number) => {
    try {
      const success = await removeFromWrongBook(questionId);
      if (success) {
        message.success('已从错题本移除');
        // 重新获取错题集数据
        dispatch(fetchWrongQuestions({ page: wrongQuestionsCurrentPage, size: 10 }) as any);
      } else {
        message.error('移除失败');
      }
    } catch (error) {
      message.error('移除失败');
      console.error('移除错题失败:', error);
    }
  };

  // 更多操作菜单
  const moreMenu = (id: number) => (
    <Menu>
      <Menu.Item key="mastered" onClick={() => handleMarkAsMastered(id)}>
        标记为已掌握
      </Menu.Item>
      <Menu.Item key="review">
        添加到复习计划
      </Menu.Item>
      <Menu.Item key="remove" danger onClick={() => handleRemoveFromWrongBook(id)}>
        从错题本移除
      </Menu.Item>
    </Menu>
  );

  // 获取题目类型标签
  const getTypeLabel = (type: QuestionType) => {
    switch(type) {
      case QuestionType.SINGLE_CHOICE:
        return '单选题';
      case QuestionType.MULTIPLE_CHOICE:
        return '多选题';
      case QuestionType.JUDGE:
        return '判断题';
      case QuestionType.FILL_BLANK:
        return '填空题';
      case QuestionType.ESSAY:
        return '问答题';
      default:
        return '未知类型';
    }
  };

  // 获取难度标签
  const getDifficultyLabel = (difficulty: QuestionDifficulty) => {
    switch(difficulty) {
      case QuestionDifficulty.EASY:
        return '简单';
      case QuestionDifficulty.MEDIUM:
        return '中等';
      case QuestionDifficulty.HARD:
        return '困难';
      case QuestionDifficulty.VERY_HARD:
        return '很难';
      case QuestionDifficulty.EXPERT:
        return '专家';
      default:
        return '未知难度';
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: QuestionDifficulty) => {
    switch(difficulty) {
      case QuestionDifficulty.EASY:
        return 'green';
      case QuestionDifficulty.MEDIUM:
        return 'orange';
      case QuestionDifficulty.HARD:
        return 'red';
      case QuestionDifficulty.VERY_HARD:
        return 'magenta';
      case QuestionDifficulty.EXPERT:
        return 'purple';
      default:
        return 'blue';
    }
  };

  return (
    <MainLayout sidebarContent={<SidebarContent onBackClick={handleBackClick} totalWrongQuestions={wrongQuestionsTotal} />}>
      <div className={styles.errorBookContainer}>
        {/* 错题本标题和筛选 */}
        <div className={styles.headerSection}>
          <Title level={2} className={styles.pageTitle}>我的错题本</Title>
          <div className={styles.filterSection}>
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={(value) => setChapter(value)}
              className={styles.filterSelect}
            >
              <Option value="all">全部章节</Option>
              <Option value="calculus">高等数学</Option>
              <Option value="linear">线性代数</Option>
              <Option value="probability">概率论</Option>
            </Select>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setDifficulty(value)}
              className={styles.filterSelect}
            >
              <Option value="all">全部难度</Option>
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setStatus(value)}
              className={styles.filterSelect}
            >
              <Option value="all">全部状态</Option>
              <Option value="mastered">已掌握</Option>
              <Option value="unmastered">未掌握</Option>
            </Select>
            <Button type="primary" className={styles.filterButton} onClick={handleFilter}>
              筛选
            </Button>
          </div>
        </div>

        {/* 错题列表 */}
        <div className={styles.errorCardsList}>
          {loading.wrongQuestions ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          ) : wrongQuestions.length > 0 ? (
            wrongQuestions.map((question) => (
              <Card key={question.questionId} className={styles.errorCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.tags}>
                    <Tag color={getDifficultyColor(question.difficulty)} className={styles.difficultyTag}>
                      {getDifficultyLabel(question.difficulty)}
                    </Tag>
                    <Tag color="blue" className={styles.categoryTag}>{getTypeLabel(question.type)}</Tag>
                    <span className={styles.errorCount}>错误次数：{question.wrongTimes}</span>
                    {question.passRate !== null && question.passRate !== undefined && (
                      <span className={styles.passRate}>通过率：{(question.passRate * 100).toFixed(0)}%</span>
                    )}
                    {question.usageCount !== null && question.usageCount !== undefined && (
                      <span className={styles.usageCount}>使用次数：{question.usageCount}</span>
                    )}
                  </div>
                  <div className={styles.metaInfo}>
                    {question.creatorName && (
                      <span className={styles.creator}>出题人：{question.creatorName}</span>
                    )}
                    <span className={styles.lastErrorDate}>最近错误：{new Date(question.lastWrongTime).toLocaleDateString()}</span>
                    <Dropdown overlay={moreMenu(question.questionId)} trigger={['click']} placement="bottomRight">
                      <Button type="text" icon={<MoreOutlined />} className={styles.moreButton} />
                    </Dropdown>
                  </div>
                </div>

                <div className={styles.questionContent}>
                  <div className={styles.questionText}>
                    <span className={styles.questionNumber}>{question.questionId}.</span>
                    {question.content}
                  </div>
                  
                  {/* 显示选项内容 */}
                  {question.options && question.options.length > 0 && (
                    <div className={styles.optionsContainer}>
                      {question.options.map((option: any) => (
                        <div key={option.optionId} className={styles.optionItem}>
                          <span className={styles.optionKey}>{option.optionKey}. </span>
                          <span className={styles.optionValue}>{option.optionValue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 显示正确答案和解析 */}
                  {question.correctAnswer && (
                    <div className={styles.answerAndAnalysis}>
                      <div className={styles.correctAnswer}>
                        <span className={styles.label}>正确答案：</span>
                        <span className={styles.value}>{question.correctAnswer}</span>
                      </div>
                      {question.analysis && (
                        <div className={styles.analysis}>
                          <span className={styles.label}>解析：</span>
                          <span className={styles.value}>{question.analysis}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 显示知识点标签 */}
                  {question.knowledgePoints && question.knowledgePoints.length > 0 && (
                    <div className={styles.knowledgePointsContainer}>
                      <span className={styles.knowledgePointsLabel}>知识点：</span>
                      {question.knowledgePoints.map((kp: any) => (
                        <Tag key={kp.id || kp.knowledgePointId} color="processing" className={styles.knowledgePointTag}>
                          {kp.name}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.actions}>
                    <Button type="text" icon={<StarOutlined />} className={styles.actionButton}>
                      收藏
                    </Button>
                    <Button type="text" icon={<MessageOutlined />} className={styles.actionButton}>
                      讨论
                    </Button>
                  </div>
                  <div className={styles.mainActions}>
                    <Button className={styles.retryButton} onClick={() => handleRetry(question.questionId)}>
                      再做一遍
                    </Button>
                    <Button type="primary" danger className={styles.removeButton} onClick={() => handleRemoveFromWrongBook(question.questionId)}>
                      从错题本移除
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Empty description="暂无错题" />
          )}
        </div>

        {/* 分页 */}
        {wrongQuestionsTotal > 0 && (
          <div className={styles.pagination}>
            <Pagination 
              current={wrongQuestionsCurrentPage}
              total={wrongQuestionsTotal}
              pageSize={10}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ErrorBookPage; 