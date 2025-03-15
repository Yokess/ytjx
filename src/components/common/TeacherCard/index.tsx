import React from 'react';
import { Card, Avatar, Typography, Tag, Button } from 'antd';
import { UserOutlined, BookOutlined, StarOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './TeacherCard.module.scss';

const { Title, Text, Paragraph } = Typography;

interface TeacherCardProps {
  id: string;
  name: string;
  avatar?: string;
  title: string; // 职称，如"副教授"、"特聘讲师"等
  institution: string; // 所属机构，如"北京大学"
  specialties: string[]; // 专业领域，如["数学分析", "高等代数"]
  courseCount: number; // 课程数量
  studentCount: number; // 学生数量
  rating: number; // 评分
  description: string; // 简介
  isCertified?: boolean; // 是否认证
  isRecommended?: boolean; // 是否推荐
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  id,
  name,
  avatar,
  title,
  institution,
  specialties,
  courseCount,
  studentCount,
  rating,
  description,
  isCertified = false,
  isRecommended = false,
}) => {
  return (
    <Link to={`/teachers/${id}`} className={styles.cardLink}>
      <Card className={styles.card} hoverable>
        <div className={styles.header}>
          <Avatar 
            size={64} 
            src={avatar} 
            icon={!avatar ? <UserOutlined /> : undefined} 
            className={styles.avatar}
          />
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <Title level={5} className={styles.name}>{name}</Title>
              {isCertified && (
                <Tag color="blue" className={styles.certifiedTag}>已认证</Tag>
              )}
              {isRecommended && (
                <Tag color="orange" className={styles.recommendedTag}>推荐</Tag>
              )}
            </div>
            <Text className={styles.title}>{title}</Text>
            <Text className={styles.institution}>{institution}</Text>
          </div>
        </div>
        
        <div className={styles.specialties}>
          {specialties.map((specialty, index) => (
            <Tag key={index} className={styles.specialtyTag}>{specialty}</Tag>
          ))}
        </div>
        
        <Paragraph ellipsis={{ rows: 2 }} className={styles.description}>
          {description}
        </Paragraph>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <BookOutlined />
            <Text>{courseCount} 门课程</Text>
          </div>
          <div className={styles.stat}>
            <TeamOutlined />
            <Text>{studentCount} 名学生</Text>
          </div>
          <div className={styles.stat}>
            <StarOutlined />
            <Text>{rating.toFixed(1)} 分</Text>
          </div>
        </div>
        
        <Button type="primary" block className={styles.viewButton}>
          查看详情
        </Button>
      </Card>
    </Link>
  );
};

export default TeacherCard; 