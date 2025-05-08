import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Radio, Checkbox, Button, Space, message, Result } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import styles from './Questions.module.scss';
import questionApi from '../../api/questionApi';
import SimilarQuestions from '../../components/SimilarQuestions';

const { Title, Paragraph, Text } = Typography;

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionDetail = async () => {
      try {
        setLoading(true);
        console.log('尝试获取题目详情, ID:', questionId);
        
        if (!questionId) {
          setError('题目ID不存在');
          setLoading(false);
          return;
        }

        const response = await questionApi.getQuestionDetail(parseInt(questionId || '0'));
        console.log('题目详情数据:', response);
        
        const questionData = {
          questionId: response.questionId,
          content: response.questionText,
          type: response.questionType,
          difficulty: response.difficultyLevel,
          knowledgePoint: response.knowledgePoint,
          knowledgePoints: response.knowledgePoints 
            ? response.knowledgePoints.map((kp: any) => ({
                id: kp.knowledgePointId,
                name: kp.name
              })) 
            : (response.knowledgePoint 
                ? response.knowledgePoint.split(',').map((name: string) => ({
                    id: 0, // 临时ID
                    name: name.trim()
                  })) 
                : []),
          options: response.options?.map((opt: any) => ({
            id: opt.optionId, 
            label: opt.optionKey, 
            content: opt.optionValue
          })) || []
        };
        
        setQuestion(questionData);
      } catch (error) {
        console.error('获取题目详情失败:', error);
        setError('获取题目详情失败，请稍后重试');
        message.error('获取题目详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetail();
  }, [questionId]);

  const handleSingleAnswerChange = (e: any) => {
    setSelectedAnswer(e.target.value);
  };

  const handleMultipleAnswerChange = (checkedValues: string[]) => {
    setSelectedAnswers(checkedValues);
  };

  const handleSubmitAnswer = async () => {
    // 检查是否选择了答案
    if (isMultipleChoice() && selectedAnswers.length === 0) {
      message.warning('请至少选择一个选项');
      return;
    } else if (!isMultipleChoice() && !selectedAnswer) {
      message.warning('请选择一个选项');
      return;
    }

    try {
      setSubmitting(true);
      
      // 根据题目类型获取答案
      let answer;
      if (isMultipleChoice()) {
        // 查找选中选项的标签(A,B,C,D)
        const selectedLabels = selectedAnswers.map(id => {
          const option = question.options.find((opt: any) => opt.id === id);
          return option ? option.label : '';
        }).filter(Boolean);
        
        // 按字母顺序排序并用逗号连接
        answer = selectedLabels.sort().join(',');
        console.log('多选题答案:', {
          原始ID: selectedAnswers,
          转换后标签: selectedLabels,
          提交答案: answer
        });
      } else {
        // 单选题，查找选中选项的标签
        const selectedOption = question.options.find((opt: any) => opt.id === selectedAnswer);
        answer = selectedOption ? selectedOption.label : selectedAnswer;
        console.log('单选题答案:', {
          原始ID: selectedAnswer,
          转换后标签: answer
        });
      }
      
      console.log('提交答案:', {
        questionId: parseInt(questionId || '0'),
        answer
      });
      
      const response = await questionApi.submitAnswer(parseInt(questionId || '0'), {
        answer
      });
      
      console.log('提交答案响应:', response);
      
      const resultData = {
        isCorrect: response.isCorrect,
        correctAnswer: response.correctAnswer,
        explanation: response.explanation || response.analysis
      };
      
      setResult(resultData);
      
      if (resultData.isCorrect) {
        message.success('回答正确！');
      } else {
        message.error('回答错误');
      }
    } catch (error) {
      message.error('提交答案失败');
      console.error('提交答案失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/questions');
  };

  // 检查是否为多选题
  const isMultipleChoice = () => {
    return question && question.type === 1; // 1 表示多选题
  };

  const renderOptions = () => {
    if (!question || !Array.isArray(question.options)) return null;
    
    // 多选题使用 Checkbox，单选题使用 Radio
    if (isMultipleChoice()) {
      return (
        <Checkbox.Group 
          onChange={handleMultipleAnswerChange} 
          value={selectedAnswers} 
          disabled={!!result}
          className={styles.optionsGrid}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {question.options.map((option: any) => (
              <div key={option.id} className={styles.optionItem}>
                <Checkbox value={option.id}>
                  {option.label}. {option.content}
                </Checkbox>
              </div>
            ))}
          </Space>
        </Checkbox.Group>
      );
    } else {
      return (
        <Radio.Group 
          onChange={handleSingleAnswerChange} 
          value={selectedAnswer} 
          disabled={!!result}
        >
          <Space direction="vertical" className={styles.optionsGrid}>
            {question.options.map((option: any) => (
              <div key={option.id} className={styles.optionItem}>
                <Radio value={option.id}>
                  {option.label}. {option.content}
                </Radio>
              </div>
            ))}
          </Space>
        </Radio.Group>
      );
    }
  };

  const renderResult = () => {
    if (!result) return null;
    
    return (
      <div className={styles.analysis}>
        <div className={styles.analysisTitle}>
          {result.isCorrect ? '答对了！' : '答错了！'}
        </div>
        <div className={styles.analysisContent}>
          <p><strong>正确答案：</strong>{result.correctAnswer}</p>
          <p><strong>解析：</strong>{result.explanation}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Card loading={true} />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Result
          status="error"
          title="加载失败"
          subTitle={error}
          extra={
            <Button type="primary" onClick={handleGoBack}>
              返回题目列表
            </Button>
          }
        />
      </MainLayout>
    );
  }

  if (!question) {
    return (
      <MainLayout>
        <Result
          status="404"
          title="未找到题目"
          subTitle="抱歉，请求的题目不存在"
          extra={
            <Button type="primary" onClick={handleGoBack}>
              返回题目列表
            </Button>
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
          style={{ marginBottom: '16px' }}
        >
          返回题目列表
        </Button>
        
        <Card>
          <div>
            <Title level={4}>
              {question.content}
            </Title>
            
            <Paragraph>
              <Text type="secondary">
                题型：{getTypeName(question.type)} | 
                难度：{getDifficultyName(question.difficulty)} | 
                知识点：{question.knowledgePoint}
              </Text>
            </Paragraph>
            
            {renderOptions()}
            
            <div style={{ marginTop: '20px' }}>
              {!result ? (
                <Button 
                  type="primary" 
                  onClick={handleSubmitAnswer} 
                  loading={submitting}
                  disabled={(isMultipleChoice() ? selectedAnswers.length === 0 : !selectedAnswer)}
                >
                  提交答案
                </Button>
              ) : (
                <Button 
                  onClick={handleGoBack}
                >
                  继续做题
                </Button>
              )}
            </div>
            
            {renderResult()}
          </div>
        </Card>
        
        {/* 添加相似题目推荐 */}
        {question && <SimilarQuestions questionId={parseInt(questionId || '0')} limit={5} />}
      </div>
    </MainLayout>
  );
};

// 辅助函数
const getTypeName = (type: number) => {
  const typeMap: Record<number, string> = {
    0: '单选题',
    1: '多选题',
    2: '填空题',
    3: '判断题',
    4: '问答题'
  };
  return typeMap[type] || '未知';
};

const getDifficultyName = (difficulty: number) => {
  const difficultyMap: Record<number, string> = {
    0: '简单',
    1: '中等',
    2: '困难'
  };
  return difficultyMap[difficulty] || '未知';
};

export default QuestionDetail; 