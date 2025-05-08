import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, List, Tag, Skeleton, Typography, Empty } from 'antd';
import { fetchSimilarQuestions } from '../store/slices/questionSlice';
import { RootState } from '../store/store';
import { Link } from 'react-router-dom';

const { Title } = Typography;

interface SimilarQuestionsProps {
  questionId: number;
  limit?: number;
}

const SimilarQuestions: React.FC<SimilarQuestionsProps> = ({ questionId, limit = 5 }) => {
  const dispatch = useDispatch();
  
  const { similarQuestions, loading } = useSelector((state: RootState) => ({
    similarQuestions: state.question.similarQuestions,
    loading: state.question.loading.similarQuestions
  }));

  useEffect(() => {
    if (questionId) {
      dispatch(fetchSimilarQuestions({ questionId, limit }) as any);
    }
  }, [questionId, limit, dispatch]);

  // 获取题目类型文本
  const getQuestionTypeText = (type: number) => {
    switch(type) {
      case 0: return '单选题';
      case 1: return '多选题';
      case 2: return '填空题';
      case 3: return '判断题';
      case 4: return '简答题';
      default: return '未知类型';
    }
  };

  // 获取难度标签颜色
  const getDifficultyColor = (difficulty: number) => {
    switch(difficulty) {
      case 0: return 'green';
      case 1: return 'blue';
      case 2: return 'orange';
      case 3: return 'red';
      case 4: return 'purple';
      default: return 'default';
    }
  };

  if (similarQuestions.length === 0 && !loading) {
    return null;
  }

  return (
    <Card 
      title={<Title level={5}>相似题目推荐</Title>}
      className="similar-questions-card"
      style={{ marginTop: 16 }}
    >
      <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
        {similarQuestions.length > 0 ? (
          <List
            dataSource={similarQuestions}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Link to={`/questions/${item.questionId}`}>
                      {item.questionText?.length > 50 
                        ? `${item.questionText.substring(0, 50)}...` 
                        : item.questionText}
                    </Link>
                  }
                  description={
                    <>
                      <Tag color="blue">{getQuestionTypeText(item.questionType)}</Tag>
                      <Tag color={getDifficultyColor(item.difficultyLevel)}>
                        难度: {item.difficultyLevel}
                      </Tag>
                      {item.knowledgePoint && (
                        <Tag color="green">{item.knowledgePoint}</Tag>
                      )}
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无相似题目" />
        )}
      </Skeleton>
    </Card>
  );
};

export default SimilarQuestions; 