import React from 'react';
import { Card, Typography, Tag, Button, Progress, Tooltip } from 'antd';
import { 
  ClockCircleOutlined, 
  QuestionCircleOutlined, 
  TrophyOutlined,
  UserOutlined,
  FireOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './ExamCard.module.scss';

const { Title, Text } = Typography;

interface ExamCardProps {
  id: string;
  title: string;
  coverImage?: string;
  duration: number; // 考试时长（分钟）
  questionCount: number; // 题目数量
  difficulty: 'easy' | 'medium' | 'hard'; // 难度
  participantCount: number; // 参与人数
  category: string; // 考试类别
  tags?: string[]; // 标签
  bestScore?: number; // 最高分
  averageScore?: number; // 平均分
  completionRate?: number; // 完成率
  isHot?: boolean; // 是否热门
  isNew?: boolean; // 是否新增
  isFree?: boolean; // 是否免费
  userProgress?: number; // 用户进度（百分比）
}

const ExamCard: React.FC<ExamCardProps> = ({
  id,
  title,
  coverImage,
  duration,
  questionCount,
  difficulty,
  participantCount,
  category,
  tags = [],
  bestScore,
  averageScore,
  completionRate,
  isHot = false,
  isNew = false,
  isFree = false,
  userProgress,
}) => {
  // 难度标签颜色映射
  const difficultyColorMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'error'
  };
  
  // 难度文本映射
  const difficultyTextMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };

  return (
    <Link to={`/exams/${id}`} className={styles.cardLink}>
      <Card 
        className={styles.card} 
        hoverable
        cover={
          coverImage ? (
            <div className={styles.coverContainer}>
              <img 
                src={coverImage} 
                alt={title} 
                className={styles.coverImage} 
              />
              {isHot && (
                <Tag color="red" className={styles.hotTag}>
                  <FireOutlined /> 热门
                </Tag>
              )}
              {isNew && (
                <Tag color="green" className={styles.newTag}>
                  NEW
                </Tag>
              )}
              {isFree && (
                <Tag color="blue" className={styles.freeTag}>
                  免费
                </Tag>
              )}
            </div>
          ) : null
        }
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <Title level={5} className={styles.title}>{title}</Title>
            <Tag color={difficultyColorMap[difficulty]} className={styles.difficultyTag}>
              {difficultyTextMap[difficulty]}
            </Tag>
          </div>
          
          <div className={styles.category}>
            <Tag>{category}</Tag>
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <ClockCircleOutlined />
              <Text>{duration} 分钟</Text>
            </div>
            <div className={styles.stat}>
              <QuestionCircleOutlined />
              <Text>{questionCount} 题</Text>
            </div>
            <div className={styles.stat}>
              <UserOutlined />
              <Text>{participantCount} 人参与</Text>
            </div>
          </div>
          
          {userProgress !== undefined && (
            <div className={styles.progress}>
              <Text>完成进度</Text>
              <Progress percent={userProgress} size="small" />
            </div>
          )}
          
          {(bestScore !== undefined || averageScore !== undefined) && (
            <div className={styles.scoreInfo}>
              {bestScore !== undefined && (
                <Tooltip title="最高分">
                  <div className={styles.score}>
                    <TrophyOutlined className={styles.trophyIcon} />
                    <Text>{bestScore}</Text>
                  </div>
                </Tooltip>
              )}
              {averageScore !== undefined && (
                <Tooltip title="平均分">
                  <div className={styles.score}>
                    <Text className={styles.avgLabel}>平均</Text>
                    <Text>{averageScore}</Text>
                  </div>
                </Tooltip>
              )}
              {completionRate !== undefined && (
                <Tooltip title="完成率">
                  <div className={styles.score}>
                    <Text className={styles.completeLabel}>完成率</Text>
                    <Text>{completionRate}%</Text>
                  </div>
                </Tooltip>
              )}
            </div>
          )}
          
          <Button type="primary" block className={styles.startButton}>
            {userProgress ? '继续考试' : '开始考试'}
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default ExamCard;