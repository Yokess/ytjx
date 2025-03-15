import React, { useState } from 'react';
import { Typography, Row, Col, Card, Input, Button, Tag, Statistic, Progress } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  ClockCircleOutlined, 
  StarOutlined,
  TeamOutlined,
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  BellOutlined,
  UserOutlined,
  PlayCircleOutlined,
  ReadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import CourseCard from '../../../components/common/CourseCard';
import styles from './CoursesList.module.scss';

const { Title, Text } = Typography;

// 模拟课程数据
const mockCourses = [
  {
    id: '1',
    title: '高等数学全程班',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    teacherName: '张教授',
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    studentCount: 12560,
    duration: '12课时',
    tags: ['数学'],
    isHot: true,
  },
  {
    id: '2',
    title: '英语词汇速记班',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    teacherName: '李教授',
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    studentCount: 8920,
    duration: '16课时',
    tags: ['英语'],
    isNew: true,
  },
  {
    id: '3',
    title: '政治理论精讲班',
    coverImage: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    teacherName: '王教授',
    price: 259,
    originalPrice: 359,
    rating: 4.8,
    studentCount: 7340,
    duration: '14课时',
    tags: ['政治'],
    isDiscount: true,
  },
  {
    id: '4',
    title: '计算机专业课程',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    teacherName: '赵教授',
    price: 329,
    originalPrice: 429,
    rating: 4.6,
    studentCount: 5680,
    duration: '18课时',
    tags: ['专业课'],
  },
  {
    id: '5',
    title: '线性代数基础班',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    teacherName: '陈教授',
    price: 229,
    originalPrice: 329,
    rating: 4.5,
    studentCount: 4320,
    duration: '10课时',
    tags: ['数学'],
  },
  {
    id: '6',
    title: '概率论与数理统计',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    teacherName: '杨教授',
    price: 249,
    originalPrice: 349,
    rating: 4.7,
    studentCount: 3980,
    duration: '12课时',
    tags: ['数学'],
    isHot: true,
  },
];

// 侧边栏内容
const SidebarContent = () => {
  return (
    <div className={styles.sidebar}>
      {/* 今日学习 */}
      <div className={styles.todayStudy}>
        <h3>今日学习</h3>
        <div className={styles.studyProgress}>
          <div className={styles.progressInfo}>
            <span>学习时长</span>
            <span className={styles.progressValue}>2.5小时/4小时</span>
          </div>
          <Progress 
            percent={62} 
            showInfo={false} 
            strokeColor="#5B5CFF" 
            trailColor="#e8e8e8"
            className={styles.progressBar}
          />
        </div>
      </div>

      {/* 课程分类 */}
      <div className={styles.courseCategories}>
        <h3>课程分类</h3>
        <div className={styles.categoryLinks}>
          <Link to="/courses/all" className={`${styles.categoryLink} ${styles.active}`}>
            <BookOutlined />
            <span>全部课程</span>
          </Link>
          <Link to="/courses/my" className={styles.categoryLink}>
            <PlayCircleOutlined />
            <span>我的课程</span>
          </Link>
          <Link to="/courses/live" className={styles.categoryLink}>
            <TeamOutlined />
            <span>直播课堂</span>
          </Link>
          <Link to="/courses/statistics" className={styles.categoryLink}>
            <BarChartOutlined />
            <span>学习统计</span>
          </Link>
        </div>
      </div>

      {/* 学科分类 */}
      <div className={styles.subjectCategories}>
        <h3>学科分类</h3>
        <div className={styles.subjectList}>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <span className={styles.subjectName}>数学</span>
              <span className={styles.subjectCount}>28门课程</span>
            </div>
            <div className={styles.subjectProgress}>
              <Progress 
                percent={75} 
                showInfo={false} 
                strokeColor="#5B5CFF" 
                trailColor="#e8e8e8"
                className={styles.progressBar}
              />
            </div>
          </div>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <span className={styles.subjectName}>英语</span>
              <span className={styles.subjectCount}>16门课程</span>
            </div>
            <div className={styles.subjectProgress}>
              <Progress 
                percent={60} 
                showInfo={false} 
                strokeColor="#5B5CFF" 
                trailColor="#e8e8e8"
                className={styles.progressBar}
              />
            </div>
          </div>
          <div className={styles.subjectItem}>
            <div className={styles.subjectInfo}>
              <span className={styles.subjectName}>政治</span>
              <span className={styles.subjectCount}>12门课程</span>
            </div>
            <div className={styles.subjectProgress}>
              <Progress 
                percent={45} 
                showInfo={false} 
                strokeColor="#5B5CFF" 
                trailColor="#e8e8e8"
                className={styles.progressBar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  return (
    <MainLayout sidebarContent={<SidebarContent />}>
      <div className={styles.coursesContainer}>
        {/* 统计卡片 */}
        <div className={styles.statsCards}>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f0f5ff', color: '#5B5CFF' }}>
              <BookOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>已学课程</h3>
              <p>24</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f6ffed', color: '#52c41a' }}>
              <ClockCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>学习时长</h3>
              <p>128h</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fff7e6', color: '#fa8c16' }}>
              <PlayCircleOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>完成课时</h3>
              <p>186</p>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f9f0ff', color: '#722ed1' }}>
              <StarOutlined />
            </div>
            <div className={styles.statInfo}>
              <h3>收藏课程</h3>
              <p>12</p>
            </div>
          </Card>
        </div>

        {/* 推荐课程卡片 */}
        <Row gutter={[24, 24]} className={styles.featureCards}>
          <Col xs={24} md={12}>
            <Card className={styles.featureCard} style={{ background: '#5B5CFF' }}>
              <div className={styles.featureContent}>
                <h2>推荐课程</h2>
                <p>基于你的学习记录和偏好，为你推荐最适合的课程</p>
                <Button type="primary" className={styles.featureButton}>
                  查看推荐
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className={styles.featureCard} style={{ background: '#fff', border: '1px dashed #ddd' }}>
              <div className={styles.featureContent}>
                <h2>直播课堂</h2>
                <p>与名师实时互动，解答疑惑，提升学习效果</p>
                <Button type="primary" className={styles.featureButton}>
                  进入直播
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 课程分类和搜索 */}
        <Card className={styles.filterCard}>
          <div className={styles.filterContainer}>
            <div className={styles.categories}>
              <Button 
                type={activeCategory === 'all' ? 'primary' : 'default'}
                shape="round"
                onClick={() => setActiveCategory('all')}
              >
                全部课程
              </Button>
              <Button 
                type={activeCategory === 'math' ? 'primary' : 'default'}
                shape="round"
                onClick={() => setActiveCategory('math')}
              >
                数学
              </Button>
              <Button 
                type={activeCategory === 'english' ? 'primary' : 'default'}
                shape="round"
                onClick={() => setActiveCategory('english')}
              >
                英语
              </Button>
              <Button 
                type={activeCategory === 'politics' ? 'primary' : 'default'}
                shape="round"
                onClick={() => setActiveCategory('politics')}
              >
                政治
              </Button>
              <Button 
                type={activeCategory === 'professional' ? 'primary' : 'default'}
                shape="round"
                onClick={() => setActiveCategory('professional')}
              >
                专业课
              </Button>
            </div>
            <div className={styles.search}>
              <Input 
                placeholder="搜索课程" 
                prefix={<SearchOutlined />} 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 课程列表 */}
        <div className={styles.coursesList}>
          <Row gutter={[24, 24]}>
            {mockCourses.map(course => (
              <Col xs={24} sm={12} lg={8} key={course.id}>
                <CourseCard {...course} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursesListPage; 