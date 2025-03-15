import React, { useState } from 'react';
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
  Divider
} from 'antd';
import { 
  BookOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined, 
  BarChartOutlined,
  MoreOutlined,
  StarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import styles from './ErrorBook.module.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// 侧边栏内容
const SidebarContent = () => {
  return (
    <div className={styles.sidebar}>
      {/* 错题统计概览 */}
      <div className={styles.errorStats}>
        <h3>错题统计</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>总错题数</span>
            <span className={styles.statValue}>86</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>已掌握</span>
            <span className={styles.statValue}>32</span>
          </div>
        </div>
      </div>

      {/* 题库分类 */}
      <div className={styles.examCategories}>
        <h3>题库分类</h3>
        <div className={styles.categoryLinks}>
          <Link to="/exams/smart" className={styles.categoryLink}>
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

      {/* 科目分类 */}
      <div className={styles.subjectCategories}>
        <h3>科目分类</h3>
        <div className={styles.subjectList}>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <div className={styles.subjectDot} style={{ backgroundColor: '#5B5CFF' }}></div>
              <span className={styles.subjectName}>数学</span>
              <span className={styles.subjectCount}>42</span>
            </div>
          </div>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <div className={styles.subjectDot} style={{ backgroundColor: '#52c41a' }}></div>
              <span className={styles.subjectName}>英语</span>
              <span className={styles.subjectCount}>18</span>
            </div>
          </div>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <div className={styles.subjectDot} style={{ backgroundColor: '#722ed1' }}></div>
              <span className={styles.subjectName}>政治</span>
              <span className={styles.subjectCount}>15</span>
            </div>
          </div>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <div className={styles.subjectDot} style={{ backgroundColor: '#fa8c16' }}></div>
              <span className={styles.subjectName}>专业课</span>
              <span className={styles.subjectCount}>11</span>
            </div>
          </div>
        </div>
      </div>

      {/* 难度分类 */}
      <div className={styles.difficultyCategories}>
        <h3>难度分类</h3>
        <div className={styles.difficultyList}>
          <div className={styles.difficultyItem}>
            <div className={styles.difficultyInfo}>
              <div className={styles.difficultyDot} style={{ backgroundColor: '#52c41a' }}></div>
              <span className={styles.difficultyName}>简单</span>
              <span className={styles.difficultyCount}>12</span>
            </div>
          </div>
          <div className={styles.difficultyItem}>
            <div className={styles.difficultyInfo}>
              <div className={styles.difficultyDot} style={{ backgroundColor: '#faad14' }}></div>
              <span className={styles.difficultyName}>中等</span>
              <span className={styles.difficultyCount}>38</span>
            </div>
          </div>
          <div className={styles.difficultyItem}>
            <div className={styles.difficultyInfo}>
              <div className={styles.difficultyDot} style={{ backgroundColor: '#f5222d' }}></div>
              <span className={styles.difficultyName}>困难</span>
              <span className={styles.difficultyCount}>36</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 错题数据
const errorQuestions = [
  {
    id: '1',
    question: '已知函数f(x)=ln(x+√(x²+1))，求f\'(x)。',
    options: [
      { label: 'A. 1/√(x²+1)', value: 'A' },
      { label: 'B. x/√(x²+1)', value: 'B' },
      { label: 'C. 1/(x²+1)', value: 'C' },
      { label: 'D. x/(x²+1)', value: 'D' }
    ],
    correctAnswer: 'A',
    userAnswer: 'C',
    difficulty: 'hard',
    category: '微积分',
    errorCount: 3,
    lastErrorDate: '2024-05-10',
    errorAnalysis: '你选择了C选项，但正确答案是A。常见错误：在求导过程中忽略了复合函数求导法则，或者在处理根号项时计算错误。',
    solutionSteps: [
      '1. 令u = x + √(x²+1)，则f(x) = ln(u)',
      '2. 使用链式法则：f\'(x) = (1/u) · u\'',
      '3. 计算u\'：u\' = 1 + (1/2)(x²+1)^(-1/2) · 2x = 1 + x/√(x²+1)',
      '4. 代入得：f\'(x) = (1/(x+√(x²+1))) · (1 + x/√(x²+1))',
      '5. 化简：f\'(x) = (1 + x/√(x²+1))/(x+√(x²+1)) = 1/√(x²+1)'
    ],
    relatedKnowledge: ['复合函数求导法则', '对数函数求导', '根式的求导'],
    discussionCount: 8
  },
  {
    id: '2',
    question: '设A是3阶方阵，|A|=2，则|2A|=？',
    options: [
      { label: 'A. 2', value: 'A' },
      { label: 'B. 4', value: 'B' },
      { label: 'C. 8', value: 'C' },
      { label: 'D. 16', value: 'D' }
    ],
    correctAnswer: 'D',
    userAnswer: 'C',
    difficulty: 'medium',
    category: '线性代数',
    errorCount: 2,
    lastErrorDate: '2024-05-08',
    errorAnalysis: '你选择了C选项，但正确答案是D。常见错误：忘记了行列式的性质，当矩阵的每一行（或每一列）都乘以同一个数k时，行列式的值变为原来的k^n倍，其中n为矩阵的阶数。',
    solutionSteps: [
      '1. 根据行列式的性质，若A是n阶方阵，则|kA| = k^n|A|',
      '2. 本题中，A是3阶方阵，|A| = 2',
      '3. 所以|2A| = 2^3|A| = 8 × 2 = 16'
    ],
    relatedKnowledge: ['行列式的性质', '矩阵的运算'],
    discussionCount: 5
  }
];

const ErrorBookPage: React.FC = () => {
  const [chapter, setChapter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 处理筛选
  const handleFilter = () => {
    // 实际应用中这里会调用API进行筛选
    console.log('筛选条件：', { chapter, difficulty, status });
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 标记为已掌握
  const handleMarkAsMastered = (id: string) => {
    console.log('标记为已掌握：', id);
  };

  // 再做一遍
  const handleRetry = (id: string) => {
    console.log('再做一遍：', id);
  };

  // 更多操作菜单
  const moreMenu = (id: string) => (
    <Menu>
      <Menu.Item key="mastered" onClick={() => handleMarkAsMastered(id)}>
        标记为已掌握
      </Menu.Item>
      <Menu.Item key="review">
        添加到复习计划
      </Menu.Item>
      <Menu.Item key="remove" danger>
        从错题本移除
      </Menu.Item>
    </Menu>
  );

  return (
    <MainLayout sidebarContent={<SidebarContent />}>
      <div className={styles.errorBookContainer}>
        {/* 错题本标题和筛选 */}
        <div className={styles.headerSection}>
          <Title level={2} className={styles.pageTitle}>数学错题本</Title>
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
              style={{ width: 150 }}
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
              style={{ width: 150 }}
              onChange={(value) => setStatus(value)}
              className={styles.filterSelect}
            >
              <Option value="all">全部状态</Option>
              <Option value="unmastered">未掌握</Option>
              <Option value="mastered">已掌握</Option>
            </Select>
            <Button type="primary" onClick={handleFilter} className={styles.filterButton}>
              筛选
            </Button>
          </div>
        </div>

        {/* 错题列表 */}
        <div className={styles.errorList}>
          {errorQuestions.map((question) => (
            <Card key={question.id} className={styles.errorCard}>
              <div className={styles.cardHeader}>
                <div className={styles.tags}>
                  <Tag color={question.difficulty === 'hard' ? 'red' : question.difficulty === 'medium' ? 'orange' : 'green'} className={styles.difficultyTag}>
                    {question.difficulty === 'hard' ? '困难' : question.difficulty === 'medium' ? '中等' : '简单'}
                  </Tag>
                  <Tag color="blue" className={styles.categoryTag}>{question.category}</Tag>
                  <span className={styles.errorCount}>错误次数：{question.errorCount}</span>
                </div>
                <div className={styles.metaInfo}>
                  <span className={styles.lastErrorDate}>最近错误：{question.lastErrorDate}</span>
                  <Dropdown overlay={moreMenu(question.id)} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} className={styles.moreButton} />
                  </Dropdown>
                </div>
              </div>

              <div className={styles.questionContent}>
                <div className={styles.questionText}>
                  <span className={styles.questionNumber}>{question.id}.</span>
                  {question.question}
                </div>
                <div className={styles.optionsGrid}>
                  {question.options.map((option) => (
                    <div key={option.value} className={styles.optionItem}>
                      <Radio 
                        checked={option.value === question.userAnswer} 
                        className={
                          option.value === question.correctAnswer 
                            ? styles.correctOption 
                            : option.value === question.userAnswer 
                              ? styles.wrongOption 
                              : ''
                        }
                      >
                        {option.label}
                      </Radio>
                    </div>
                  ))}
                </div>

                {/* 错误分析 */}
                <div className={styles.errorAnalysis}>
                  <h4>错误分析</h4>
                  <p>{question.errorAnalysis}</p>
                </div>

                {/* 解题步骤 */}
                <div className={styles.solutionSteps}>
                  <h4>解题步骤</h4>
                  <div className={styles.steps}>
                    {question.solutionSteps.map((step, index) => (
                      <p key={index}>{step}</p>
                    ))}
                  </div>
                </div>

                {/* 相关知识点 */}
                <div className={styles.relatedKnowledge}>
                  <h4>相关知识点</h4>
                  <ul>
                    {question.relatedKnowledge.map((knowledge, index) => (
                      <li key={index}>{knowledge}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.actions}>
                  <Button type="text" icon={<StarOutlined />} className={styles.actionButton}>
                    收藏
                  </Button>
                  <Button type="text" icon={<MessageOutlined />} className={styles.actionButton}>
                    讨论({question.discussionCount})
                  </Button>
                </div>
                <div className={styles.mainActions}>
                  <Button className={styles.retryButton} onClick={() => handleRetry(question.id)}>
                    再做一遍
                  </Button>
                  <Button type="primary" className={styles.masteredButton} onClick={() => handleMarkAsMastered(question.id)}>
                    标记为已掌握
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
    </MainLayout>
  );
};

export default ErrorBookPage; 