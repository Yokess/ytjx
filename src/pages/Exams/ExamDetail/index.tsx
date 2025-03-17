import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Tag, 
  Radio, 
  Space, 
  Progress,
  Spin,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ArrowRightOutlined,
  BookOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  getExamDetail, 
  getExamQuestions, 
  submitExamAnswers 
} from '../../../api/examApi';
import { QuestionType, ExamQuestion } from '../../../types/exam';
import styles from './ExamDetail.module.scss';

const { Title, Paragraph } = Typography;

// 题目分类部分的接口定义
interface QuestionSection {
  name: string;
  score: number;
  questions: {
    id: string;
    questionIndex: number;
    status: string;
  }[];
}

const ExamDetailPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  // 数据加载状态
  const [detailLoading, setDetailLoading] = useState(false);
  const [examDetailData, setExamDetailData] = useState<any>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  
  // 用户答案状态
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [submitting, setSubmitting] = useState(false);
  
  // 本地状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [examEndTime, setExamEndTime] = useState<Date | null>(null);
  
  // 加载考试详情
  useEffect(() => {
    const fetchExamDetail = async () => {
      if (!examId) return;
      
      setDetailLoading(true);
      try {
        const response = await getExamDetail(Number(examId));
        if (response.code === 200 && response.data) {
          setExamDetailData(response.data);
          setDetailError(null);
        } else {
          setDetailError(response.message || '获取考试详情失败');
        }
      } catch (err) {
        setDetailError('获取考试详情出错');
        console.error('获取考试详情出错:', err);
      } finally {
        setDetailLoading(false);
      }
    };
    
    fetchExamDetail();
  }, [examId]);
  
  // 加载考试题目
  useEffect(() => {
    const fetchExamQuestions = async () => {
      if (!examId) return;
      
      setQuestionsLoading(true);
      try {
        const response = await getExamQuestions(Number(examId));
        if (response.code === 200 && response.data) {
          setQuestions(response.data.questions || []);
          setQuestionsError(null);
        } else {
          setQuestionsError(response.message || '获取考试题目失败');
        }
      } catch (err) {
        setQuestionsError('获取考试题目出错');
        console.error('获取考试题目出错:', err);
      } finally {
        setQuestionsLoading(false);
      }
    };
    
    fetchExamQuestions();
  }, [examId]);
  
  // 设置考试倒计时
  useEffect(() => {
    if (examDetailData) {
      const endTime = new Date(examDetailData.endTime);
      setExamEndTime(endTime);
      
      let timerId: NodeJS.Timeout; // 提前声明timerId变量
      
      // 更新倒计时
      const updateRemainingTime = () => {
        const now = new Date();
        const diffMs = endTime.getTime() - now.getTime();
        
        if (diffMs <= 0) {
          // 考试时间结束，自动提交
          clearInterval(timerId);
          message.warning('考试时间已结束，系统将自动提交');
          handleSubmit();
          return;
        }
        
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        setRemainingTime(
          `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`
        );
      };
      
      // 初始调用一次
      updateRemainingTime();
      
      // 每秒更新
      timerId = setInterval(updateRemainingTime, 1000);
      
      return () => clearInterval(timerId);
    }
  }, [examDetailData]);
  
  // 当前题目
  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;
  
  // 检查是否已标记
  const isMarked = currentQuestion ? markedQuestions.includes(currentQuestion.questionId) : false;
  
  // 获取用户答案
  const getUserAnswer = (questionId: number) => userAnswers[questionId] || '';
  
  // 处理答案变更
  const handleAnswerChange = (e: any) => {
    if (currentQuestion) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.questionId]: e.target.value
      });
    }
  };
  
  // 标记/取消标记题目
  const toggleMark = () => {
    if (currentQuestion) {
      const questionId = currentQuestion.questionId;
      if (isMarked) {
        setMarkedQuestions(markedQuestions.filter(id => id !== questionId));
      } else {
        setMarkedQuestions([...markedQuestions, questionId]);
      }
    }
  };
  
  // 前往上一题
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // 前往下一题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // 提交考试
  const handleSubmit = () => {
    if (!examId) return;
    
    // 转换用户答案格式
    const answers = Object.entries(userAnswers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer
    }));
    
    setSubmitting(true);
    submitExamAnswers(Number(examId), answers)
      .then(response => {
        if (response.code === 200) {
          message.success('提交成功');
          navigate(`/exams/result/${examId}`);
        } else {
          message.error(response.message || '提交失败，请稍后重试');
        }
      })
      .catch(err => {
        message.error('提交出错，请稍后重试');
        console.error('提交考试答案出错:', err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  
  // 暂存当前答案
  const handleSave = () => {
    message.success('已保存答案');
  };
  
  // 计算完成进度
  const getCompletionProgress = () => {
    if (!questions || questions.length === 0) return 0;
    
    const answeredCount = Object.keys(userAnswers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };
  
  // 获取题目状态
  const getQuestionStatus = (questionId: number) => {
    if (markedQuestions.includes(questionId)) {
      return 'marked';
    }
    return userAnswers[questionId] ? 'answered' : 'unanswered';
  };
  
  // 跳到指定题目
  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  // 如果正在加载，显示加载状态
  if (detailLoading || questionsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p>正在加载考试...</p>
      </div>
    );
  }
  
  // 如果有错误，显示错误信息
  if (detailError || questionsError || !examDetailData || !questions || questions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p>加载考试失败，请刷新页面重试</p>
        <Button type="primary" onClick={() => window.location.reload()}>
          刷新页面
        </Button>
      </div>
    );
  }
  
  // 根据考试题目生成题目分类
  const generateSections = () => {
    const sections: QuestionSection[] = [];
    let currentSection: QuestionType | null = null;
    let currentSectionQuestions: ExamQuestion[] = [];
    let totalScore = 0;
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionType = question.type;
      
      // 计算总分
      totalScore += question.score;
      
      if (!currentSection || currentSection !== questionType) {
        if (currentSection) {
          sections.push({
            name: getQuestionTypeName(currentSection),
            score: currentSectionQuestions.reduce((sum, q) => sum + q.score, 0),
            questions: currentSectionQuestions.map((q) => ({
              id: String(q.questionId),
              questionIndex: questions.findIndex(item => item.questionId === q.questionId),
              status: getQuestionStatus(q.questionId)
            }))
          });
        }
        
        currentSection = questionType;
        currentSectionQuestions = [question];
      } else {
        currentSectionQuestions.push(question);
      }
    }
    
    // 添加最后一部分
    if (currentSection && currentSectionQuestions.length > 0) {
      sections.push({
        name: getQuestionTypeName(currentSection),
        score: currentSectionQuestions.reduce((sum, q) => sum + q.score, 0),
        questions: currentSectionQuestions.map((q) => ({
          id: String(q.questionId),
          questionIndex: questions.findIndex(item => item.questionId === q.questionId),
          status: getQuestionStatus(q.questionId)
        }))
      });
    }
    
    return { sections, totalScore };
  };
  
  // 根据题目类型获取显示名称
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
  
  const { sections, totalScore } = generateSections();
  
  return (
    <div className={styles.examDetailContainer}>
      {/* 顶部导航栏 */}
      <header className={styles.examHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>研途九霄</div>
          
          <div className={styles.headerRight}>
            <div className={styles.examTimer}>
              <ClockCircleOutlined />
              <span>剩余时间: {remainingTime}</span>
            </div>
            
            <div className={styles.userInfo}>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="用户头像" 
              />
              <div>
                <span className={styles.userName}>考生</span>
                <span className={styles.userProgress}>已完成: {Object.keys(userAnswers).length}/{questions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 考试信息头部 */}
      <div className={styles.examInfo}>
        <div className={styles.examInfoContent}>
          <div className={styles.examTitle}>
            <Title level={4}>{examDetailData.name}</Title>
            <div className={styles.examMeta}>
              <span>总分: {totalScore}分</span>
              <span>题目: {questions.length}道</span>
              <span>时长: {examDetailData.duration}分钟</span>
            </div>
          </div>
          
          <div className={styles.examActions}>
            <Button onClick={handleSave}>
              暂存答案
            </Button>
            <Button type="primary" danger onClick={handleSubmit} loading={submitting}>
              交卷
            </Button>
          </div>
        </div>
      </div>
      
      <div className={styles.examContent}>
        {/* 左侧题目导航 */}
        <div className={styles.questionNav}>
          <h3>题目导航</h3>
          
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={styles.sectionNav}>
              <h4>{section.name} ({section.score}分)</h4>
              <div className={styles.questionGrid}>
                {section.questions.map((question: any) => (
                  <button 
                    key={question.id} 
                    className={`${styles.questionButton} ${styles[question.status]}`}
                    onClick={() => navigateToQuestion(question.questionIndex)}
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
        {currentQuestion && (
          <div className={styles.questionContent}>
            <div className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <div className={styles.questionType}>
                  <Tag color="blue">{getQuestionTypeName(currentQuestion.type)}</Tag>
                  <span className={styles.questionNumber}>第{currentQuestionIndex + 1}题 ({currentQuestion.score}分)</span>
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
                <Paragraph>{currentQuestion.content}</Paragraph>
                
                <div className={styles.questionOptions}>
                  {currentQuestion.type === QuestionType.SINGLE_CHOICE && currentQuestion.options && (
                    <Radio.Group 
                      onChange={handleAnswerChange} 
                      value={getUserAnswer(currentQuestion.questionId)}
                    >
                      <Space direction="vertical">
                        {currentQuestion.options.map((option) => (
                          <Radio key={option.id} value={option.id}>
                            {option.id}. {option.content}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  )}
                  
                  {/* 这里可以添加其他题型的答题组件 */}
                </div>
              </div>
            </div>
            
            <div className={styles.navigationButtons}>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                上一题
              </Button>
              <Button 
                type="primary"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                下一题
                <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetailPage; 