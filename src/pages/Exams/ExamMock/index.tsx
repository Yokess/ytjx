import React, { useState } from 'react';
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
  Col
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
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import styles from './ExamMock.module.scss';

const { Title, Text, Paragraph } = Typography;

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 模拟数据 - 进行中的考试
  const ongoingExam = {
    id: '1',
    title: '2024考研数学全真模拟卷（二）',
    remainingTime: '120分钟',
    completedQuestions: 15,
    totalQuestions: 45,
    progress: 33
  };

  // 模拟数据 - 可参加的考试
  const availableExams = [
    {
      id: '2',
      title: '2024考研数学全真模拟卷（三）',
      isNew: true,
      duration: 180,
      totalScore: 150,
      questionCount: 45,
      questionTypes: ['选择', '填空', '解答'],
      difficulty: 4
    },
    {
      id: '3',
      title: '2023考研数学真题精选',
      isNew: false,
      duration: 180,
      totalScore: 150,
      questionCount: 40,
      questionTypes: ['选择', '填空', '解答'],
      difficulty: 4
    }
  ];

  // 模拟数据 - 历史考试记录
  const historyExams = [
    {
      id: '4',
      title: '2024考研数学全真模拟卷（一）',
      date: '2024-03-15',
      score: 89,
      ranking: 'Top 15%'
    },
    {
      id: '5',
      title: '2023考研数学真题模拟',
      date: '2024-03-10',
      score: 92,
      ranking: 'Top 10%'
    }
  ];

  // 模拟数据 - 考试说明
  const examInfo = {
    title: '考试说明',
    rules: [
      '考试时间为180分钟，请合理分配时间',
      '考试过程中请勿刷新页面或关闭浏览器',
      '可以使用草稿纸进行演算',
      '提交后将立即显示成绩和解析'
    ],
    distribution: [
      { type: '选择题', count: 20, score: 100 },
      { type: '填空题', count: 10, score: 20 },
      { type: '解答题', count: 5, score: 30 }
    ]
  };

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
      render: (score: number) => <span className={styles.examScore}>{score}</span>
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
        <Button type="link" className={styles.detailButton}>查看详情</Button>
      )
    }
  ];

  // 显示考试说明弹窗
  const showExamInfoModal = () => {
    setIsModalVisible(true);
  };

  // 关闭考试说明弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
              <p>12场</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f6ffed', color: '#52c41a' }}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>平均分数</h3>
              <p>85.6</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fff7e6', color: '#fa8c16' }}>
              <ClockCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>累计用时</h3>
              <p>36h</p>
            </div>
          </Card>
        </div>

        {/* 进行中的考试 */}
        <Card className={styles.sectionCard} title={
          <div className={styles.cardTitle}>
            <ClockCircleOutlined className={styles.titleIcon} />
            <span>进行中的考试</span>
          </div>
        }>
          {ongoingExam && (
            <div className={styles.ongoingExam}>
              <div className={styles.examInfo}>
                <div className={styles.examIcon}>
                  <ClockCircleOutlined />
                </div>
                <div className={styles.examDetails}>
                  <div className={styles.examHeader}>
                    <h3>{ongoingExam.title}</h3>
                    <Tag color="processing">进行中</Tag>
                  </div>
                  <div className={styles.examStats}>
                    <span>剩余时间：{ongoingExam.remainingTime}</span>
                    <span>已完成：{ongoingExam.completedQuestions}/{ongoingExam.totalQuestions}题</span>
                    <div className={styles.progressWrapper}>
                      <span>完成进度</span>
                      <Progress 
                        percent={ongoingExam.progress} 
                        showInfo={false} 
                        strokeColor="#5B5CFF" 
                        trailColor="#e8e8e8"
                        className={styles.progressBar}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Link to={`/exams/${ongoingExam.id}/detail`}>
                <Button type="primary" shape="round" className={styles.continueButton}>
                  继续考试
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* 可参加的考试 */}
        <Card className={styles.sectionCard} title={
          <div className={styles.cardTitle}>
            <FileTextOutlined className={styles.titleIcon} />
            <span>可参加的考试</span>
          </div>
        }>
          <div className={styles.availableExams}>
            {availableExams.map(exam => (
              <div key={exam.id} className={styles.examItem}>
                <div className={styles.examInfo}>
                  <div className={styles.examIcon} style={{ backgroundColor: exam.isNew ? '#f0f5ff' : '#f9f0ff' }}>
                    <FileTextOutlined style={{ color: exam.isNew ? '#5B5CFF' : '#722ed1' }} />
                  </div>
                  <div className={styles.examDetails}>
                    <div className={styles.examHeader}>
                      <h3>{exam.title}</h3>
                      {exam.isNew && <Tag color="success">新题</Tag>}
                    </div>
                    <div className={styles.examStats}>
                      <span>时长：{exam.duration}分钟</span>
                      <span>总分：{exam.totalScore}分</span>
                      <span>题目数：{exam.questionCount}</span>
                      <div className={styles.examTypes}>
                        <span>题型：</span>
                        {exam.questionTypes.map((type, index) => (
                          <Tag key={index} color={
                            index === 0 ? 'blue' : index === 1 ? 'pink' : 'orange'
                          } className={styles.typeTag}>{type}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.examActions}>
                  <Button 
                    type="text" 
                    icon={<InfoCircleOutlined />} 
                    onClick={showExamInfoModal}
                    className={styles.infoButton}
                  />
                  <Link to={`/exams/${exam.id}/detail`}>
                    <Button type="primary" shape="round" className={styles.startButton}>
                      开始考试
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 历史考试记录 */}
        <div className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h2>历史考试记录</h2>
            <Link to="/exams/history" className={styles.viewAllLink}>查看全部</Link>
          </div>
          <Card className={styles.historyCard}>
            <Table 
              dataSource={historyExams} 
              columns={historyColumns} 
              pagination={false}
              rowKey="id"
              className={styles.historyTable}
            />
          </Card>
        </div>

        {/* 考试说明弹窗 */}
        <Modal
          title={examInfo.title}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              取消
            </Button>,
            <Button key="start" type="primary" onClick={handleCancel}>
              开始考试
            </Button>,
          ]}
          width={600}
          className={styles.examInfoModal}
        >
          <div className={styles.examRules}>
            <div className={styles.rulesSection}>
              <h4>考试须知</h4>
              <ul>
                {examInfo.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className={styles.distributionSection}>
              <h4>题型分布</h4>
              <Row gutter={[16, 16]}>
                {examInfo.distribution.map((item, index) => (
                  <Col span={8} key={index}>
                    <div className={styles.distributionItem}>
                      <div className={styles.distributionType}>{item.type}</div>
                      <div className={styles.distributionValue}>{item.count}题/{item.score}分</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default ExamMockPage; 