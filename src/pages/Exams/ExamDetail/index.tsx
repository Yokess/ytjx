import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Tag, 
  Radio, 
  Space, 
  Progress
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ArrowRightOutlined,
  BookOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './ExamDetail.module.scss';

const { Title, Paragraph } = Typography;

// 模拟考试数据
const mockExamData = {
  id: '1',
  title: '2024考研数学全真模拟卷（二）',
  totalScore: 150,
  totalQuestions: 35,
  duration: '3小时',
  remainingTime: '02:45:30',
  completedQuestions: 12,
  currentQuestion: {
    id: '3',
    type: '单选题',
    score: 5,
    content: '已知函数f(x)=ln(x+√(x²+1))，求f\'(x)。',
    options: [
      { label: 'A', value: 'A', content: '1/√(x²+1)' },
      { label: 'B', value: 'B', content: 'x/√(x²+1)' },
      { label: 'C', value: 'C', content: '1/(x²+1)' },
      { label: 'D', value: 'D', content: 'x/(x²+1)' }
    ],
    answer: 'C',
    isMarked: true
  },
  sections: [
    {
      name: '选择题',
      score: 100,
      questions: Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        status: i < 2 ? 'answered' : i === 2 ? 'marked' : 'unanswered'
      }))
    },
    {
      name: '填空题',
      score: 20,
      questions: Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 21),
        status: 'unanswered'
      }))
    },
    {
      name: '解答题',
      score: 30,
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: String(i + 31),
        status: 'unanswered'
      }))
    }
  ]
};

const ExamDetailPage: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(mockExamData.currentQuestion.answer);
  const [isMarked, setIsMarked] = useState<boolean>(mockExamData.currentQuestion.isMarked);
  
  const handleAnswerChange = (e: any) => {
    setSelectedAnswer(e.target.value);
  };
  
  const toggleMark = () => {
    setIsMarked(!isMarked);
  };
  
  const handlePrevQuestion = () => {
    // 实际应用中这里会跳转到上一题
    console.log('Navigate to previous question');
  };
  
  const handleNextQuestion = () => {
    // 实际应用中这里会跳转到下一题
    console.log('Navigate to next question');
  };
  
  const handleSubmit = () => {
    // 实际应用中这里会提交考试
    console.log('Submit exam');
  };
  
  const handleSave = () => {
    // 实际应用中这里会保存当前答案
    console.log('Save current answers');
  };
  
  // 计算完成进度
  const completionProgress = Math.round((mockExamData.completedQuestions / mockExamData.totalQuestions) * 100);
  
  return (
    <div className={styles.examDetailContainer}>
      {/* 顶部导航栏 */}
      <header className={styles.examHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>研途九霄</div>
          
          <div className={styles.headerRight}>
            <div className={styles.examTimer}>
              <ClockCircleOutlined />
              <span>剩余时间: {mockExamData.remainingTime}</span>
            </div>
            
            <div className={styles.userInfo}>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="用户头像" 
              />
              <div>
                <span className={styles.userName}>张同学</span>
                <span className={styles.userProgress}>已完成: {mockExamData.completedQuestions}/{mockExamData.totalQuestions}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 考试信息头部 */}
      <div className={styles.examInfo}>
        <div className={styles.examInfoContent}>
          <div className={styles.examTitle}>
            <Title level={4}>{mockExamData.title}</Title>
            <div className={styles.examMeta}>
              <span>总分: {mockExamData.totalScore}分</span>
              <span>题目: {mockExamData.totalQuestions}道</span>
              <span>时长: {mockExamData.duration}</span>
            </div>
          </div>
          
          <div className={styles.examActions}>
            <Button onClick={handleSave}>
              暂存答案
            </Button>
            <Button type="primary" danger onClick={handleSubmit}>
              交卷
            </Button>
          </div>
        </div>
      </div>
      
      <div className={styles.examContent}>
        {/* 左侧题目导航 */}
        <div className={styles.questionNav}>
          <h3>题目导航</h3>
          
          {mockExamData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={styles.sectionNav}>
              <h4>{section.name} ({section.score}分)</h4>
              <div className={styles.questionGrid}>
                {section.questions.map((question: any) => (
                  <button 
                    key={question.id} 
                    className={`${styles.questionButton} ${styles[question.status]}`}
                  >
                    {question.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className={styles.navLegend}>
            <div className={styles.legendTitle}>图例说明:</div>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.answered}`}></div>
                <span>已答</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.marked}`}></div>
                <span>标记</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.unanswered}`}></div>
                <span>未答</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧题目内容 */}
        <div className={styles.questionContent}>
          <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <div className={styles.questionType}>
                <Tag color="blue">{mockExamData.currentQuestion.type}</Tag>
                <span className={styles.questionNumber}>第{mockExamData.currentQuestion.id}题 ({mockExamData.currentQuestion.score}分)</span>
              </div>
              
              <Button 
                type="text" 
                icon={<BookOutlined />} 
                className={`${styles.markButton} ${isMarked ? styles.marked : ''}`}
                onClick={toggleMark}
              >
                标记
              </Button>
            </div>
            
            <div className={styles.questionBody}>
              <Paragraph>{mockExamData.currentQuestion.content}</Paragraph>
              
              <div className={styles.questionOptions}>
                <Radio.Group onChange={handleAnswerChange} value={selectedAnswer}>
                  <Space direction="vertical">
                    {mockExamData.currentQuestion.options.map((option) => (
                      <Radio key={option.value} value={option.value}>
                        {option.label}. {option.content}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>
          
          <div className={styles.navigationButtons}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handlePrevQuestion}
            >
              上一题
            </Button>
            <Button 
              type="primary"
              onClick={handleNextQuestion}
            >
              下一题
              <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>
      
      {/* 底部固定导航 */}
      <footer className={styles.examFooter}>
        <div className={styles.footerContent}>
          <div className={styles.progressInfo}>
            <span>已完成: {mockExamData.completedQuestions}/{mockExamData.totalQuestions}</span>
            <div className={styles.progressBar}>
              <Progress 
                percent={completionProgress} 
                showInfo={false} 
                strokeColor="#5B5CFF" 
                trailColor="#e8e8e8"
              />
            </div>
          </div>
          
          <div className={styles.footerActions}>
            <Button onClick={handleSave}>
              暂存答案
            </Button>
            <Button type="primary" danger onClick={handleSubmit}>
              交卷
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExamDetailPage; 