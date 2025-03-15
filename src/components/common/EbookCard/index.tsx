import React from 'react';
import { Card, Typography, Tag, Button, Progress, Tooltip } from 'antd';
import { 
  ReadOutlined, 
  FileTextOutlined, 
  DownloadOutlined,
  StarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './EbookCard.module.scss';

const { Title, Text } = Typography;

interface EbookCardProps {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  pageCount: number;
  fileSize: string; // 如 "5.2MB"
  category: string;
  tags?: string[];
  rating?: number;
  downloadCount?: number;
  viewCount?: number;
  isFree?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  userProgress?: number; // 用户阅读进度（百分比）
}

const EbookCard: React.FC<EbookCardProps> = ({
  id,
  title,
  coverImage,
  author,
  pageCount,
  fileSize,
  category,
  tags = [],
  rating,
  downloadCount,
  viewCount,
  isFree = false,
  isNew = false,
  isRecommended = false,
  userProgress,
}) => {
  return (
    <Link to={`/ebooks/${id}`} className={styles.cardLink}>
      <Card 
        className={styles.card} 
        hoverable
        cover={
          <div className={styles.coverContainer}>
            <img 
              src={coverImage} 
              alt={title} 
              className={styles.coverImage} 
            />
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
            {isRecommended && (
              <Tag color="orange" className={styles.recommendedTag}>
                推荐
              </Tag>
            )}
          </div>
        }
      >
        <div className={styles.content}>
          <Title level={5} className={styles.title}>{title}</Title>
          
          <Text className={styles.author}>{author}</Text>
          
          <div className={styles.category}>
            <Tag>{category}</Tag>
            {tags.slice(0, 2).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {tags.length > 2 && (
              <Tooltip title={tags.slice(2).join(', ')}>
                <Tag>+{tags.length - 2}</Tag>
              </Tooltip>
            )}
          </div>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <FileTextOutlined />
              <Text>{pageCount} 页</Text>
            </div>
            <div className={styles.stat}>
              <ReadOutlined />
              <Text>{fileSize}</Text>
            </div>
            {rating !== undefined && (
              <div className={styles.stat}>
                <StarOutlined />
                <Text>{rating.toFixed(1)}</Text>
              </div>
            )}
          </div>
          
          {userProgress !== undefined && (
            <div className={styles.progress}>
              <Text>阅读进度</Text>
              <Progress percent={userProgress} size="small" />
            </div>
          )}
          
          <div className={styles.footer}>
            {downloadCount !== undefined && (
              <Tooltip title="下载次数">
                <div className={styles.footerStat}>
                  <DownloadOutlined />
                  <Text>{downloadCount}</Text>
                </div>
              </Tooltip>
            )}
            
            {viewCount !== undefined && (
              <Tooltip title="阅读次数">
                <div className={styles.footerStat}>
                  <EyeOutlined />
                  <Text>{viewCount}</Text>
                </div>
              </Tooltip>
            )}
            
            <Button 
              type="primary" 
              className={styles.readButton}
            >
              {userProgress ? '继续阅读' : '开始阅读'}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default EbookCard; 