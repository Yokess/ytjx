import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Button, 
  Radio, 
  Checkbox, 
  Input, 
  Space, 
  Tag, 
  Divider, 
  Alert, 
  Spin, 
  Result,
  Typography,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import { RootState } from '../../store';
import { 
  fetchQuestionDetail, 
  submitQuestionAnswer, 
  clearCurrentQuestion, 
  clearAnswerResult 
} from '../../store/slices/questionSlice';
import { 
  QuestionType, 
  QuestionDifficulty, 
  SubmitAnswerRequest 
} from '../../types/question';
import styles from './Questions.module.scss';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const QuestionDetailPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 从Redux获取状态
  const { 
    currentQuestion, 
    answerResult, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.question);
  
  // 本地状态
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  // 初始加载
  useEffect(() => {
    if (questionId) {
      dispatch(fetchQuestionDetail(parseInt(questionId)) as any);
    }
    
    // 组件卸载时清除当前题目和答题结果
    return () => {
      dispatch(clearCurrentQuestion());
      dispatch(clearAnswerResult());
    };
  }, [dispatch, questionId]);
  
  // 处理答案变化
  const handleAnswerChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      // 多选题，将选项排序并连接
      setUserAnswer(value.sort().join(''));
    } else {
      setUserAnswer(value);
    }
  };
  
  // 处理提交答案
  const handleSubmit = () => {
    if (!userAnswer) {
      message.warning('请先作答');
      return;
    }
    
    if (questionId && currentQuestion) {
      const submitData: SubmitAnswerRequest = {
        answer: userAnswer,
        spendTime: 0 // 暂不计算答题时间
      };
      
      dispatch(submitQuestionAnswer({ questionId: parseInt(questionId), data: submitData }) as any);
      setSubmitted(true);
    }
  };
  
  // 处理返回列表
  const handleBackToList = () => {
    navigate('/questions');
  };
  
  // 处理下一题
  const handleNextQuestion = () => {
    // 这里简单实现为返回列表，实际应该获取下一题ID
    navigate('/questions');
  };
  
  // 获取题目类型标签
  const getTypeLabel = (type: QuestionType) => {
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
        return '问答题';
      default:
        return '未知类型';
    }
  };
  
  // 获取题目类型颜色
  const getTypeColor = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return 'blue';
      case QuestionType.MULTIPLE_CHOICE:
        return 'purple';
      case QuestionType.JUDGE:
        return 'green';
      case QuestionType.FILL_BLANK:
        return 'orange';
      case QuestionType.ESSAY:
        return 'red';
      default:
        return 'default';
    }
  };
  
  // 获取难度标签
  const getDifficultyLabel = (difficulty: QuestionDifficulty) => {
    switch (difficulty) {
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
    switch (difficulty) {
      case QuestionDifficulty.EASY:
        return 'green';
      case QuestionDifficulty.MEDIUM:
        return 'blue';
      case QuestionDifficulty.HARD:
        return 'orange';
      case QuestionDifficulty.VERY_HARD:
        return 'red';
      case QuestionDifficulty.EXPERT:
        return 'purple';
      default:
        return 'default';
    }
  };
  
  // 渲染答题区域
  const renderAnswerArea = () => {
    if (!currentQuestion) return null;
    
    switch (currentQuestion.type) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <Radio.Group 
            onChange={(e) => handleAnswerChange(e.target.value)} 
            value={userAnswer}
            disabled={submitted}
            className={styles.radioGroup}
          >
            <Space direction="vertical" className={styles.optionsSpace}>
              {currentQuestion.options?.map((option) => (
                <Radio key={option.id} value={option.id} className={styles.radioOption}>
                  <span className={styles.optionId}>{option.id}.</span>
                  <span className={styles.optionContent}>{option.content}</span>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );
        
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <Checkbox.Group 
            onChange={(values) => handleAnswerChange(values as string[])} 
            value={userAnswer.split('')}
            disabled={submitted}
            className={styles.checkboxGroup}
          >
            <Space direction="vertical" className={styles.optionsSpace}>
              {currentQuestion.options?.map((option) => (
                <Checkbox key={option.id} value={option.id} className={styles.checkboxOption}>
                  <span className={styles.optionId}>{option.id}.</span>
                  <span className={styles.optionContent}>{option.content}</span>
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        );
        
      case QuestionType.JUDGE:
        return (
          <Radio.Group 
            onChange={(e) => handleAnswerChange(e.target.value)} 
            value={userAnswer}
            disabled={submitted}
            className={styles.radioGroup}
          >
            <Space direction="vertical" className={styles.optionsSpace}>
              <Radio value="1" className={styles.radioOption}>正确</Radio>
              <Radio value="0" className={styles.radioOption}>错误</Radio>
            </Space>
          </Radio.Group>
        );
        
      case QuestionType.FILL_BLANK:
        return (
          <Input 
            placeholder="请输入答案" 
            value={userAnswer} 
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={submitted}
            className={styles.fillBlankInput}
          />
        );
        
      case QuestionType.ESSAY:
        return (
          <TextArea 
            placeholder="请输入答案" 
            value={userAnswer} 
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={submitted}
            rows={6}
            className={styles.essayInput}
          />
        );
        
      default:
        return null;
    }
  };
  
  // 渲染答题结果
  const renderResult = () => {
    if (!answerResult) return null;
    
    const isCorrect = answerResult.isCorrect;
    
    return (
      <div className={styles.answerResult}>
        <Alert
          message={isCorrect ? "回答正确" : "回答错误"}
          description={
            <div>
              <div className={styles.correctAnswer}>
                <Text strong>正确答案：</Text>
                <Text>{answerResult.correctAnswer}</Text>
              </div>
              <Divider />
              <div className={styles.analysis}>
                <Text strong>解析：</Text>
                <Paragraph>{answerResult.analysis}</Paragraph>
              </div>
            </div>
          }
          type={isCorrect ? "success" : "error"}
          showIcon
          icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          className={styles.resultAlert}
        />
      </div>
    );
  };
  
  // 渲染侧边栏
  const renderSidebar = () => {
    return (
      <div className={styles.sidebar}>
        <Card title="答题卡" className={styles.answerCard}>
          <div className={styles.questionInfo}>
            <div className={styles.questionNumber}>
              题目 #{questionId}
            </div>
            {currentQuestion && (
              <div className={styles.questionTags}>
                <Tag color={getTypeColor(currentQuestion.type)}>
                  {getTypeLabel(currentQuestion.type)}
                </Tag>
                <Tag color={getDifficultyColor(currentQuestion.difficulty)}>
                  {getDifficultyLabel(currentQuestion.difficulty)}
                </Tag>
              </div>
            )}
          </div>
          
          <Divider />
          
          <div className={styles.answerActions}>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              disabled={submitted || !userAnswer}
              block
              className={styles.submitButton}
            >
              提交答案
            </Button>
            
            <Button 
              onClick={handleBackToList}
              icon={<ArrowLeftOutlined />}
              className={styles.backButton}
            >
              返回列表
            </Button>
            
            {submitted && (
              <Button 
                type="primary"
                onClick={handleNextQuestion}
                className={styles.nextButton}
              >
                下一题
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  };
  
  // 加载中
  if (loading.questionDetail) {
    return (
      <MainLayout>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }
  
  // 加载错误
  if (error.questionDetail) {
    return (
      <MainLayout>
        <Result
          status="error"
          title="加载失败"
          subTitle={error.questionDetail}
          extra={
            <Button type="primary" onClick={handleBackToList}>
              返回题目列表
            </Button>
          }
        />
      </MainLayout>
    );
  }
  
  // 题目不存在
  if (!currentQuestion) {
    return (
      <MainLayout>
        <Result
          icon={<QuestionCircleOutlined />}
          title="题目不存在"
          extra={
            <Button type="primary" onClick={handleBackToList}>
              返回题目列表
            </Button>
          }
        />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout sidebarContent={renderSidebar()}>
      <div className={styles.questionDetailPage}>
        <Card className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <Title level={4} className={styles.questionTitle}>
              {currentQuestion.content}
            </Title>
          </div>
          
          <div className={styles.questionBody}>
            {renderAnswerArea()}
          </div>
          
          {submitted && renderResult()}
        </Card>
      </div>
    </MainLayout>
  );
};

export default QuestionDetailPage; 