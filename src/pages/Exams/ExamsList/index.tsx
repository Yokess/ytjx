import React, { useState } from 'react';
import { Card, Row, Col, Button, Input, Tag, Tabs, Progress, Radio, Space, Pagination } from 'antd';
import { 
  SearchOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  RightOutlined,
  StarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import styles from './ExamsList.module.scss';

const { TabPane } = Tabs;

// 模拟题目数据
const mockQuestions = [
  {
    id: '1',
    type: '单选题',
    difficulty: '中等',
    question: '已知函数f(x)=ln(x+√(x²+1))，求f\'(x)。',
    options: [
      { label: 'A. 1/√(x²+1)', value: 'A' },
      { label: 'B. x/√(x²+1)', value: 'B' },
      { label: 'C. 1/(x²+1)', value: 'C' },
      { label: 'D. x/(x²+1)', value: 'D' }
    ],
    tags: ['导数与微分', '复合函数求导', '高数必考点'],
    correctRate: '85%',
    attemptCount: 1280,
    discussionCount: 12
  },
  {
    id: '2',
    type: '多选题',
    difficulty: '困难',
    question: '下列关于矩阵的说法中，正确的有：',
    options: [
      { label: 'A. 若A是可逆矩阵，则A的行列式不为0', value: 'A' },
      { label: 'B. 若A是对称矩阵，则A的特征值都是实数', value: 'B' },
      { label: 'C. 若A是正交矩阵，则A的转置等于A的逆', value: 'C' },
      { label: 'D. 若A是奇异矩阵，则A的秩小于A的阶数', value: 'D' }
    ],
    tags: ['线性代数', '矩阵性质', '特征值'],
    correctRate: '45%',
    attemptCount: 960,
    discussionCount: 18
  }
];

// 侧边栏内容
const SidebarContent = () => {
  return (
    <div className={styles.sidebar}>
      {/* 今日做题 */}
      <div className={styles.todayExam}>
        <h3>今日做题</h3>
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
      </div>

      {/* 题库分类 */}
      <div className={styles.examCategories}>
        <h3>题库分类</h3>
        <div className={styles.categoryLinks}>
          <Link to="/exams/smart" className={`${styles.categoryLink} ${styles.active}`}>
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
      </div>

      {/* 科目分类 */}
      <div className={styles.subjectCategories}>
        <h3>科目分类</h3>
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
                strokeColor="#5B5CFF" 
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
                strokeColor="#5B5CFF" 
                trailColor="#e8e8e8"
                className={styles.progressBar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExamsListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [searchValue, setSearchValue] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <MainLayout sidebarContent={<SidebarContent />}>
      <div className={styles.examsContainer}>
        {/* 统计卡片 */}
        <div className={styles.statsCards}>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#e6f7ff', color: '#1890ff' }}>
              <FileTextOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>总做题量</h3>
              <p>1280</p>
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
                  type="default" 
                  shape="round" 
                  className={styles.filterButton}
                >
                  全部
                </Button>
                <Button 
                  type="default" 
                  shape="round" 
                  className={styles.filterButton}
                >
                  单选题
                </Button>
                <Button 
                  type="default" 
                  shape="round" 
                  className={styles.filterButton}
                >
                  多选题
                </Button>
                <Button 
                  type="default" 
                  shape="round" 
                  className={styles.filterButton}
                >
                  判断题
                </Button>
              </div>
            </div>
            <div className={styles.filterTitle}>
              <span className={styles.filterLabel}>难度：</span>
              <div className={styles.filterButtons}>
                <Button 
                  type={difficultyFilter === 'all' ? 'primary' : 'default'} 
                  shape="round" 
                  className={styles.filterButton}
                  onClick={() => setDifficultyFilter('all')}
                >
                  全部
                </Button>
                <Button 
                  type={difficultyFilter === 'easy' ? 'primary' : 'default'} 
                  shape="round" 
                  className={styles.filterButton}
                  onClick={() => setDifficultyFilter('easy')}
                >
                  简单
                </Button>
                <Button 
                  type={difficultyFilter === 'medium' ? 'primary' : 'default'} 
                  shape="round" 
                  className={styles.filterButton}
                  onClick={() => setDifficultyFilter('medium')}
                  style={{ background: difficultyFilter === 'medium' ? '#faad14' : '' }}
                >
                  中等
                </Button>
                <Button 
                  type={difficultyFilter === 'hard' ? 'primary' : 'default'} 
                  shape="round" 
                  className={styles.filterButton}
                  onClick={() => setDifficultyFilter('hard')}
                >
                  困难
                </Button>
              </div>
            </div>
            <div className={styles.filterTitle}>
              <span className={styles.filterLabel}>知识点：</span>
              <div className={styles.filterButtons}>
                <Button 
                  type="default" 
                  shape="round" 
                  className={styles.filterButton}
                >
                  全部
                </Button>
                <Button 
                  type="default" 
                  shape="round" 
                  className={styles.filterButton}
                >
                  导数与微分
                </Button>
                <Button 
                  type="default" 
                  shape="round" 
                  className={styles.filterButton}
                >
                  复合函数求导
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.searchBar}>
            <Input
              placeholder="搜索题目..."
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </Card>

        {/* 题目列表 */}
        <div className={styles.examsList}>
          {mockQuestions.map((question) => (
            <Card key={question.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <div className={styles.questionTags}>
                  <Tag color={question.type === '单选题' ? '#5B5CFF' : '#722ed1'} className={styles.typeTag}>
                    {question.type}
                  </Tag>
                  <div className={styles.difficultyTag}>
                    <span className={styles.starIcon}>★</span>
                    <span className={styles.difficultyText}>{question.difficulty}</span>
                  </div>
                </div>
                <div className={styles.questionStats}>
                  <span className={styles.statItem}>正确率：{question.correctRate}</span>
                  <span className={styles.statItem}>做题人数：{question.attemptCount}</span>
                </div>
              </div>
              
              <div className={styles.tagsList}>
                {question.tags.map((tag, index) => (
                  <Tag 
                    key={index} 
                    color={index === 0 ? 'blue' : index === 1 ? 'green' : 'purple'} 
                    className={styles.knowledgeTag}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
              
              <div className={styles.questionContent}>
                <div className={styles.questionText}>
                  <span className={styles.questionNumber}>{question.id}.</span>
                  {question.question}
                </div>
                <div className={styles.optionsGrid}>
                  {question.options.map((option) => (
                    <div key={option.value} className={styles.optionItem}>
                      <Radio value={option.value}>
                        {option.label}
                      </Radio>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.questionFooter}>
                <div className={styles.actionButtons}>
                  <Button type="text" icon={<StarOutlined />} className={styles.actionButton}>
                    收藏
                  </Button>
                  <Button type="text" icon={<MessageOutlined />} className={styles.actionButton}>
                    讨论({question.discussionCount})
                  </Button>
                </div>
                <Button type="primary" className={styles.analysisButton}>
                  查看解析
                </Button>
              </div>
            </Card>
          ))}
          
          {/* 分页 */}
          <div className={styles.pagination}>
            <Pagination 
              current={currentPage}
              total={50}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamsListPage; 