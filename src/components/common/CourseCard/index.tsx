import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Tag, Rate } from 'antd';
import { PlayCircleOutlined, TeamOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import styles from './CourseCard.module.scss';

const { Title, Text } = Typography;

export interface CourseCardProps {
  id: string | number;
  title: string;
  coverImage: string;
  teacherName: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  studentCount?: number;
  duration?: string;
  tags?: string[];
  isHot?: boolean;
  isNew?: boolean;
  isDiscount?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  coverImage,
  teacherName,
  price,
  originalPrice,
  rating = 0,
  studentCount = 0,
  duration = '',
  tags = [],
  isHot = false,
  isNew = false,
  isDiscount = false,
}) => {
  return (
    <Link to={`/courses/${id}`} className={styles.cardLink}>
      <Card
        hoverable
        className={styles.card}
        cover={
          <div className={styles.coverContainer}>
            <img
              alt={title}
              src={coverImage}
              className={styles.coverImage}
            />
            <div className={styles.overlay}>
              <PlayCircleOutlined className={styles.playIcon} />
            </div>
            {isHot && <Tag color="#f50" className={styles.hotTag}>热门</Tag>}
            {isNew && <Tag color="#87d068" className={styles.newTag}>新课</Tag>}
            {isDiscount && <Tag color="#108ee9" className={styles.discountTag}>特惠</Tag>}
            <div className={styles.rating}>
              <StarFilled className={styles.starIcon} />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        }
      >
        <div className={styles.tags}>
          {tags.slice(0, 1).map((tag, index) => (
            <Tag key={index} className={styles.tag}>{tag}</Tag>
          ))}
          <span className={styles.duration}>{duration}</span>
        </div>
        
        <Title level={5} className={styles.title} title={title}>
          {title}
        </Title>
        
        <div className={styles.teacher}>
          <Text type="secondary">{teacherName}</Text>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.rating}>
            <Rate disabled defaultValue={rating} allowHalf className={styles.rateStars} />
            <Text className={styles.rateValue}>{rating.toFixed(1)}</Text>
          </div>
          
          <div className={styles.info}>
            {studentCount > 0 && (
              <Text className={styles.students}>
                <TeamOutlined /> {studentCount > 10000 ? `${(studentCount / 10000).toFixed(1)}万` : studentCount}
              </Text>
            )}
          </div>
        </div>
        
        <div className={styles.price}>
          <Text className={styles.currentPrice}>¥{price}</Text>
          {originalPrice && originalPrice > price && (
            <Text delete className={styles.originalPrice}>¥{originalPrice}</Text>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard; 