import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Tag, 
  Radio, 
  Space, 
  Progress,
  Spin,
  message,
  Modal,
  Checkbox,
  Input,
  Divider,
  Empty
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ArrowRightOutlined,
  BookOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  CheckSquareOutlined,
  FormOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  getExamDetail, 
  getExamQuestions, 
  submitExamAnswers 
} from '../../../api/examApi';
import { QuestionType, ExamQuestion } from '../../../types/exam';
import styles from './ExamDetail.module.scss';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

// 题目分类部分的接口定义
interface QuestionSection {
  name: string;
  score: number;
  questions: {
    id: string;
    questionId: number;
    questionIndex: number;
    status: string;
  }[];
}

const ExamDetailPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  // 数据加载状态
  const [detailLoading, setDetailLoading] = useState(true);
  const [examDetailData, setExamDetailData] = useState<any>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  
  // 用户答案状态
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  
  // 本地状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
        // 直接获取考试详情，包含完整题目信息
        const detailResponse = await getExamDetail(Number(examId));
        if (detailResponse.code === 200 && detailResponse.data) {
          const examDetail = detailResponse.data;
          setExamDetailData(examDetail);
          
          // 从examDetail中提取题目
          if (examDetail.questions && examDetail.questions.length > 0) {
            setQuestions(examDetail.questions);
            
            // 初始化答案状态
            const initialAnswers: Record<number, string> = {};
            const initialMarked: Record<number, boolean> = {};
            
            examDetail.questions.forEach((q: any) => {
              initialAnswers[q.questionId] = '';
              initialMarked[q.questionId] = false;
            });
            
            setUserAnswers(initialAnswers);
            setMarkedQuestions(initialMarked);
            
            // 尝试从localStorage加载保存的答案
            const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
            const savedMarked = localStorage.getItem(`exam_${examId}_marked`);
            
            if (savedAnswers) {
              try {
                const parsedAnswers = JSON.parse(savedAnswers);
                setUserAnswers(parsedAnswers);
              } catch (err) {
                console.error('解析保存的答案出错:', err);
              }
            }
            
            if (savedMarked) {
              try {
                const parsedMarked = JSON.parse(savedMarked);
                setMarkedQuestions(parsedMarked);
              } catch (err) {
                console.error('解析保存的标记出错:', err);
              }
            }
          } else {
            message.warning('此考试暂无题目');
          }
        } else {
          message.error(detailResponse.message || '获取考试详情失败');
        }
      } catch (error) {
        console.error('加载考试题目出错:', error);
        message.error('加载考试题目出错');
      } finally {
        setQuestionsLoading(false);
      }
    };
    
    fetchExamQuestions();
  }, [examId]);
  
  // 设置考试倒计时
  useEffect(() => {
    if (examDetailData) {
      // 使用examEndTime字段
      const endTimeStr = examDetailData.examEndTime;
      if (!endTimeStr) {
        setRemainingTime('00:00:00');
        return;
      }
      
      const endTime = new Date(endTimeStr);
      setExamEndTime(endTime);
      
      let timerId: NodeJS.Timeout;
      
      // 更新倒计时
      const updateRemainingTime = () => {
        const now = new Date();
        const diffMs = endTime.getTime() - now.getTime();
        
        if (diffMs <= 0) {
          // 考试时间结束，自动提交
          clearInterval(timerId);
          setRemainingTime('00:00:00');
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
  
  // 当用户答案或标记题目变化时，保存到本地存储
  useEffect(() => {
    if (examId) {
      localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(userAnswers));
    }
  }, [userAnswers, examId]);
  
  useEffect(() => {
    if (examId) {
      localStorage.setItem(`exam_${examId}_marked`, JSON.stringify(markedQuestions));
    }
  }, [markedQuestions, examId]);
  
  // 当前题目
  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;
  
  // 检查是否已标记
  const isMarked = currentQuestion ? markedQuestions[currentQuestion.questionId] : false;
  
  // 获取用户答案
  const getUserAnswer = (questionId: number) => userAnswers[questionId] || '';
  
  // 处理单选/判断题答案变更
  const handleSingleAnswerChange = (e: any) => {
    if (currentQuestion) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.questionId]: e.target.value
      });
    }
  };
  
  // 处理多选题答案变更
  const handleMultipleAnswerChange = (checkedValues: any[]) => {
    if (currentQuestion) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.questionId]: checkedValues.join(',')
      });
    }
  };
  
  // 处理填空题/简答题答案变更
  const handleTextAnswerChange = (e: any) => {
    if (currentQuestion) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.questionId]: e.target.value
      });
    }
  };
  
  // 标记/取消标记题目
  const toggleMarkedQuestion = (questionId: number) => {
    setMarkedQuestions(prev => {
      const newMarked = {
        ...prev,
        [questionId]: !prev[questionId]
      };
      
      // 保存到localStorage
      localStorage.setItem(`exam_${examId}_marked`, JSON.stringify(newMarked));
      
      return newMarked;
    });
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
    
    // 检查未答题目
    const unansweredCount = questions.length - Object.keys(userAnswers).length;
    
    if (unansweredCount > 0) {
      confirm({
        title: '确认提交',
        icon: <ExclamationCircleOutlined />,
        content: `您还有 ${unansweredCount} 道题未作答，确定要提交吗？`,
        onOk() {
          submitAnswers(answers);
        },
        okText: '确认提交',
        cancelText: '继续答题'
      });
    } else {
      submitAnswers(answers);
    }
  };
  
  // 实际提交答案
  const submitAnswers = (answers: { questionId: number; answer: string }[]) => {
    setSubmitting(true);
    
    const formattedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      examQuestionId: questions.find(q => q.questionId === answer.questionId)?.examQuestionId || 0,
      answer: answer.answer
    }));
    
    submitExamAnswers(Number(examId), formattedAnswers)
      .then(response => {
        if (response.code === 200) {
          message.success('提交成功');
          
          // 清除本地存储的答案和标记
          localStorage.removeItem(`exam_${examId}_answers`);
          localStorage.removeItem(`exam_${examId}_marked`);
          
          // 导航到结果页
          navigate(`/exams/result/${examId}`);
        } else {
          message.error(response.message || '提交失败，请稍后重试');
        }
      })
      .catch(err => {
        console.error('提交考试答案出错:', err);
        message.error('提交出错，请稍后重试');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  
  // 暂存当前答案
  const handleSave = () => {
    if (!examId) return;
    
    // 答案已自动保存到localStorage
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
    if (markedQuestions[questionId]) {
      return 'marked';
    }
    return userAnswers[questionId] ? 'answered' : 'unanswered';
  };
  
  // 跳到指定题目
  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  // 生成题目分类
  const generateSections = (): QuestionSection[] => {
    if (!questions || questions.length === 0) return [];
    
    const sectionMap = new Map<QuestionType, QuestionSection>();
    
    questions.forEach((q, index) => {
      const type = q.type;
      const typeName = getQuestionTypeName(type);
      
      if (!sectionMap.has(type)) {
        sectionMap.set(type, {
          name: typeName,
          score: 0,
          questions: []
        });
      }
      
      const section = sectionMap.get(type)!;
      section.score += q.score;
      section.questions.push({
        id: `${type}-${q.questionId}`,
        questionId: q.questionId,
        questionIndex: index,
        status: getQuestionStatus(q.questionId)
      });
    });
    
    return Array.from(sectionMap.values());
  };
  
  // 获取题目类型名称
  const getQuestionTypeName = (type: number): string => {
    switch (type) {
      case 0:
        return '单选题';
      case 1:
        return '多选题';
      case 2:
        return '判断题';
      case 3:
        return '填空题';
      case 4:
        return '简答题';
      default:
        return '未知题型';
    }
  };
  
  // 修改题目渲染逻辑
  const renderQuestion = (question: any, index: number) => {
    if (!question) return <div>题目加载失败</div>;
    
    const questionId = question.questionId;
    const isMarked = markedQuestions[questionId] || false;
    const answer = userAnswers[questionId] || '';
    
    return (
      <div className={styles.questionItem} key={questionId} id={`question-${index + 1}`}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>第 {index + 1} 题</span>
          <span className={styles.questionType}>{getQuestionTypeName(question.questionType)}</span>
          <span className={styles.questionScore}>{question.questionScore}分</span>
          <Button 
            type={isMarked ? "primary" : "default"}
            icon={<FlagOutlined />}
            size="small"
            onClick={() => toggleMarkedQuestion(questionId)}
          >
            {isMarked ? '取消标记' : '标记'}
          </Button>
        </div>
        
        <div className={styles.questionContent}>
          <div className={styles.questionText}>{question.questionText}</div>
          
          {question.questionType === 0 && (
            <Radio.Group 
              onChange={(e) => handleSingleAnswerChange(e)}
              value={answer}
              className={styles.optionsGroup}
            >
              {question.options && question.options.map((option: any) => (
                <Radio key={option.optionId} value={option.optionKey} className={styles.optionItem}>
                  {option.optionKey}. {option.optionValue}
                </Radio>
              ))}
            </Radio.Group>
          )}
          
          {question.questionType === 1 && (
            <Checkbox.Group 
              onChange={(checkedValues) => handleMultipleAnswerChange(checkedValues)}
              value={answer ? answer.split(',') : []}
              className={styles.optionsGroup}
            >
              {question.options && question.options.map((option: any) => (
                <Checkbox key={option.optionId} value={option.optionKey} className={styles.optionItem}>
                  {option.optionKey}. {option.optionValue}
                </Checkbox>
              ))}
            </Checkbox.Group>
          )}
          
          {question.questionType === 2 && (
            <Radio.Group 
              onChange={(e) => handleSingleAnswerChange(e)}
              value={answer}
              className={styles.optionsGroup}
            >
              <Radio value="T" className={styles.optionItem}>正确</Radio>
              <Radio value="F" className={styles.optionItem}>错误</Radio>
            </Radio.Group>
          )}
          
          {question.questionType === 3 && (
            <Input.TextArea 
              rows={3}
              value={answer}
              onChange={(e) => handleTextAnswerChange(e)}
              placeholder="请输入答案"
              className={styles.fillBlankInput}
            />
          )}
          
          {question.questionType === 4 && (
            <Input.TextArea 
              rows={6}
              value={answer}
              onChange={(e) => handleTextAnswerChange(e)}
              placeholder="请输入答案"
              className={styles.essayInput}
            />
          )}
        </div>
      </div>
    );
  };
  
  // 修改标记题目的函数调用
  const toggleMark = () => {
    if (currentQuestion) {
      toggleMarkedQuestion(currentQuestion.questionId);
    }
  };
  
  // 渲染加载状态
  if (detailLoading || questionsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p>正在加载考试数据...</p>
      </div>
    );
  }
  
  // 渲染错误状态
  if (detailError || questionsError) {
    return (
      <div className={styles.errorContainer}>
        <h2>加载失败</h2>
        <p>{detailError || questionsError}</p>
        <Button type="primary" onClick={() => window.location.reload()}>重新加载</Button>
      </div>
    );
  }
  
  // 检查考试是否已结束
  if (examDetailData && new Date() > new Date(examDetailData.endTime)) {
    return (
      <div className={styles.errorContainer}>
        <h2>考试已结束</h2>
        <p>本场考试已经结束，无法继续答题。</p>
        <Link to="/exams/mock">
          <Button type="primary">返回考试列表</Button>
        </Link>
      </div>
    );
  }
  
  // 题目分类
  const sections = generateSections();
  
  return (
    <div className={styles.examDetailContainer}>
      {/* 顶部栏 */}
      <header className={styles.examHeader}>
        <div className={styles.examTitle}>
          <BookOutlined />
          <span>{examDetailData?.examName || '考试'}</span>
        </div>
        
        <div className={styles.examActions}>
          <div className={styles.timeRemaining}>
            <ClockCircleOutlined />
            <span>{remainingTime}</span>
          </div>
          
          <div className={styles.progressInfo}>
            <span className={styles.completionText}>
              进度: {Object.values(userAnswers).filter(value => value !== '').length}/{questions.length}
            </span>
            <Progress 
              percent={getCompletionProgress()} 
              size="small" 
              className={styles.progressBar} 
              showInfo={false}
              strokeColor="#1890ff"
            />
          </div>
          
          <Button 
            type="primary" 
            danger
            onClick={handleSubmit}
            loading={submitting}
          >
            交卷
          </Button>
        </div>
      </header>
      
      {/* 题目区域 */}
      <div className={styles.mainContent}>
        {/* 左侧题目导航 */}
        <div className={styles.sideNavigation}>
          <div className={styles.examInfo}>
            <div className={styles.examInfoItem}>
              <span className={styles.examInfoLabel}>考试名称:</span>
              <span className={styles.examInfoValue}>{examDetailData?.examName}</span>
            </div>
            <div className={styles.examInfoItem}>
              <span className={styles.examInfoLabel}>总分:</span>
              <span className={styles.examInfoValue}>{examDetailData?.totalScore}分</span>
            </div>
            <div className={styles.examInfoItem}>
              <span className={styles.examInfoLabel}>题目数量:</span>
              <span className={styles.examInfoValue}>{questions.length}题</span>
            </div>
          </div>

          <Divider className={styles.divider} />
          
          <div className={styles.questionNavigator}>
            <h3 className={styles.navigatorTitle}>题目导航</h3>
            
            {questions.map((question, index) => {
              const status = getQuestionStatus(question.questionId);
              return (
                <button
                  key={question.questionId}
                  className={`${styles.questionButton} ${styles[status]} ${currentQuestionIndex === index ? styles.current : ''}`}
                  onClick={() => navigateToQuestion(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className={styles.legendArea}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.answered}`}></div>
              <span>已答</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.unanswered}`}></div>
              <span>未答</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.marked}`}></div>
              <span>标记</span>
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <Button
              type="primary"
              block
              onClick={handleSave}
              icon={<CheckSquareOutlined />}
              className={styles.saveButton}
            >
              保存答案
            </Button>
            
            <Button
              type="primary"
              danger
              block
              onClick={handleSubmit}
              loading={submitting}
              className={styles.submitButton}
            >
              提交试卷
            </Button>
          </div>
        </div>
        
        {/* 中间题目区域 */}
        <div className={styles.questionArea}>
          {currentQuestion ? (
            <div className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <div className={styles.questionMeta}>
                  <span className={styles.questionIndex}>第 {currentQuestionIndex + 1} 题</span>
                  <Tag color="blue">{getQuestionTypeName(currentQuestion.questionType)}</Tag>
                  <span className={styles.questionScore}>{currentQuestion.questionScore}分</span>
                </div>
                
                <div className={styles.questionActions}>
                  <Button
                    type={isMarked ? 'primary' : 'default'}
                    icon={<FlagOutlined />}
                    onClick={toggleMark}
                    size="middle"
                  >
                    {isMarked ? '取消标记' : '标记题目'}
                  </Button>
                </div>
              </div>
              
              <div className={styles.questionContent}>
                <div className={styles.questionText}>
                  {currentQuestion.questionText}
                </div>
                
                <div className={styles.answerArea}>
                  {currentQuestion.questionType === 0 && (
                    <Radio.Group 
                      onChange={handleSingleAnswerChange}
                      value={getUserAnswer(currentQuestion.questionId)}
                      className={styles.optionsGroup}
                    >
                      <Space direction="vertical" className={styles.optionsSpace}>
                        {currentQuestion.options && currentQuestion.options.map((option: any) => (
                          <Radio key={option.optionId} value={option.optionKey} className={styles.optionItem}>
                            <span className={styles.optionKey}>{option.optionKey}.</span>
                            <span className={styles.optionValue}>{option.optionValue}</span>
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  )}
                  
                  {currentQuestion.questionType === 1 && (
                    <Checkbox.Group 
                      onChange={handleMultipleAnswerChange}
                      value={getUserAnswer(currentQuestion.questionId) ? getUserAnswer(currentQuestion.questionId).split(',') : []}
                      className={styles.optionsGroup}
                    >
                      <Space direction="vertical" className={styles.optionsSpace}>
                        {currentQuestion.options && currentQuestion.options.map((option: any) => (
                          <Checkbox key={option.optionId} value={option.optionKey} className={styles.optionItem}>
                            <span className={styles.optionKey}>{option.optionKey}.</span>
                            <span className={styles.optionValue}>{option.optionValue}</span>
                          </Checkbox>
                        ))}
                      </Space>
                    </Checkbox.Group>
                  )}
                  
                  {currentQuestion.questionType === 2 && (
                    <Radio.Group 
                      onChange={handleSingleAnswerChange}
                      value={getUserAnswer(currentQuestion.questionId)}
                      className={styles.optionsGroup}
                    >
                      <Space direction="vertical" className={styles.optionsSpace}>
                        <Radio value="T" className={styles.optionItem}>
                          <span className={styles.optionKey}>√</span>
                          <span className={styles.optionValue}>正确</span>
                        </Radio>
                        <Radio value="F" className={styles.optionItem}>
                          <span className={styles.optionKey}>×</span>
                          <span className={styles.optionValue}>错误</span>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  )}
                  
                  {currentQuestion.questionType === 3 && (
                    <div className={styles.textAnswer}>
                      <TextArea 
                        rows={3}
                        value={getUserAnswer(currentQuestion.questionId)}
                        onChange={handleTextAnswerChange}
                        placeholder="请在此输入您的答案..."
                        className={styles.answerTextarea}
                      />
                    </div>
                  )}
                  
                  {currentQuestion.questionType === 4 && (
                    <div className={styles.textAnswer}>
                      <TextArea 
                        rows={6}
                        value={getUserAnswer(currentQuestion.questionId)}
                        onChange={handleTextAnswerChange}
                        placeholder="请在此输入您的答案..."
                        className={styles.answerTextarea}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.navigationButtons}>
                <Button 
                  onClick={handlePrevQuestion} 
                  disabled={currentQuestionIndex === 0}
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  className={styles.navButton}
                >
                  上一题
                </Button>
                
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={currentQuestionIndex === questions.length - 1}
                  icon={<ArrowRightOutlined />}
                  type="primary"
                  size="large"
                  className={styles.navButton}
                >
                  下一题
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.noQuestionCard}>
              <Empty description="暂无题目" />
              <Button type="primary" onClick={() => navigate('/exams/mock')}>
                返回考试列表
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage; 