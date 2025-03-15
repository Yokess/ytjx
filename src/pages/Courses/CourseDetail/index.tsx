import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Rate, 
  Button, 
  Tabs, 
  Card, 
  Avatar, 
  Divider,
  List,
  Collapse
} from 'antd';
import { 
  ClockCircleOutlined, 
  PlayCircleOutlined, 
  TeamOutlined, 
  CheckOutlined,
  BookOutlined,
  MessageOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import styles from './CourseDetail.module.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// 模拟课程数据
const mockCourseData = {
  id: 1,
  title: '高等数学全程班',
  description: '系统讲解高等数学重难点，配套习题讲解，助力考研数学高分',
  category: '数学',
  rating: 4.9,
  ratingCount: 1234,
  teacherName: '李教授',
  teacherAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  teacherTitle: '北京大学数学系博士',
  teacherDescription: '从事高等数学教学15年，曾获全国优秀教师称号。著有《高等数学解题指南》等多部教材，对考研数学命题规律有深入研究。',
  teacherCourseCount: 12,
  teacherStudentCount: 35689,
  price: 299,
  originalPrice: 399,
  discount: true,
  discountText: '限时优惠',
  totalDuration: '36小时',
  totalLessons: 48,
  studentCount: 12345,
  features: [
    '48节高清视频课程',
    '配套习题集与解析',
    '24小时答疑服务',
    '永久观看权限'
  ],
  chapters: [
    {
      title: '第一章：函数与极限',
      lessons: [
        { title: '1.1 函数的概念与性质', duration: '45分钟' },
        { title: '1.2 极限的概念与性质', duration: '50分钟' },
        { title: '1.3 无穷小与无穷大', duration: '40分钟' }
      ]
    },
    {
      title: '第二章：导数与微分',
      lessons: []
    },
    {
      title: '第三章：微分中值定理与导数应用',
      lessons: []
    },
    {
      title: '第四章：不定积分',
      lessons: []
    },
    {
      title: '第五章：定积分及其应用',
      lessons: []
    }
  ],
  introduction: {
    description: '《高等数学全程班》是专为考研学子打造的系统化数学课程，由资深数学教师团队精心设计，覆盖考研数学全部重难点内容。',
    features: [
      '系统全面：覆盖高等数学全部考点，知识体系完整',
      '重点突出：紧扣考研大纲，突出重难点，把握命题规律',
      '讲练结合：每个知识点配套针对性练习，强化巩固',
      '答疑及时：专业助教团队，24小时在线答疑'
    ],
    targetAudience: [
      '备战考研的大学生',
      '数学基础薄弱需要系统学习的学生',
      '希望提高数学成绩的大学生',
      '对高等数学有学习兴趣的人群'
    ],
    learningOutcomes: [
      '掌握高等数学核心概念和解题方法',
      '熟练应用数学知识解决实际问题',
      '形成系统的数学思维和解题思路',
      '提高数学学习效率和考试成绩'
    ]
  },
  reviews: [
    {
      id: 1,
      userName: '王同学',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 5,
      date: '2023-10-15',
      content: '李教授讲解非常清晰，将复杂的数学概念讲得通俗易懂。课程内容系统全面，习题难度适中，非常适合考研复习。已经学习了一个月，感觉数学水平有了明显提高。'
    },
    {
      id: 2,
      userName: '李同学',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 4,
      date: '2023-09-28',
      content: '课程内容非常丰富，习题设计很巧妙，能够帮助我更好地理解知识点。李教授的讲解方式很有趣，让枯燥的数学变得生动起来。助教的答疑也很及时，遇到不懂的问题都能很快得到解答。'
    }
  ],
  relatedCourses: [
    {
      id: 2,
      title: '线性代数精讲班',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      rating: 4.8,
      price: 259
    },
    {
      id: 3,
      title: '概率论与数理统计',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      rating: 4.7,
      price: 279
    },
    {
      id: 4,
      title: '考研数学真题解析',
      coverImage: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      rating: 4.9,
      price: 329
    }
  ]
};

const CourseDetailPage: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState('introduction');
  
  return (
    <div className={styles.courseDetailPage}>
      {/* 课程头部信息 */}
      <div className={styles.courseHeader}>
        <div className={styles.courseHeaderContent}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={16}>
              <div className={styles.courseInfo}>
                <div className={styles.courseMetaTags}>
                  <Tag color="blue">{mockCourseData.category}</Tag>
                  <div className={styles.ratingWrapper}>
                    <Rate disabled defaultValue={mockCourseData.rating} allowHalf />
                    <Text className={styles.ratingText}>
                      {mockCourseData.rating} ({mockCourseData.ratingCount}人评价)
                    </Text>
                  </div>
                </div>
                <Title level={2} className={styles.courseTitle}>{mockCourseData.title}</Title>
                <Paragraph className={styles.courseDescription}>
                  {mockCourseData.description}
                </Paragraph>
                <div className={styles.courseStats}>
                  <div className={styles.statItem}>
                    <ClockCircleOutlined />
                    <span>总时长: {mockCourseData.totalDuration}</span>
                  </div>
                  <div className={styles.statItem}>
                    <PlayCircleOutlined />
                    <span>课时: {mockCourseData.totalLessons}节</span>
                  </div>
                  <div className={styles.statItem}>
                    <TeamOutlined />
                    <span>学习人数: {mockCourseData.studentCount}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <Card className={styles.priceCard}>
                <div className={styles.priceWrapper}>
                  <div className={styles.priceInfo}>
                    <Text className={styles.currentPrice}>￥{mockCourseData.price}</Text>
                    {mockCourseData.discount && (
                      <Text className={styles.originalPrice}>￥{mockCourseData.originalPrice}</Text>
                    )}
                  </div>
                  {mockCourseData.discount && (
                    <Tag color="red" className={styles.discountTag}>{mockCourseData.discountText}</Tag>
                  )}
                </div>
                <Button type="primary" block className={styles.buyButton}>
                  立即购买
                </Button>
                <Button block className={styles.cartButton}>
                  加入购物车
                </Button>
                <div className={styles.featuresList}>
                  <Text className={styles.featuresTitle}>该课程包含</Text>
                  <List
                    itemLayout="horizontal"
                    dataSource={mockCourseData.features}
                    renderItem={item => (
                      <List.Item className={styles.featureItem}>
                        <CheckOutlined className={styles.checkIcon} />
                        <Text>{item}</Text>
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* 课程内容区 */}
      <div className={styles.courseContent}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card className={styles.contentCard}>
              <Tabs 
                activeKey={activeTabKey} 
                onChange={setActiveTabKey}
                className={styles.courseTabs}
              >
                <TabPane 
                  tab={
                    <span>
                      <BookOutlined />
                      课程介绍
                    </span>
                  } 
                  key="introduction"
                >
                  <div className={styles.introductionContent}>
                    <Title level={4}>课程介绍</Title>
                    <Paragraph>{mockCourseData.introduction.description}</Paragraph>
                    
                    <Title level={4} className={styles.sectionTitle}>课程特色</Title>
                    <ul className={styles.featuresList}>
                      {mockCourseData.introduction.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    
                    <Title level={4} className={styles.sectionTitle}>适合人群</Title>
                    <ul className={styles.featuresList}>
                      {mockCourseData.introduction.targetAudience.map((audience, index) => (
                        <li key={index}>{audience}</li>
                      ))}
                    </ul>
                    
                    <Title level={4} className={styles.sectionTitle}>学习收获</Title>
                    <ul className={styles.featuresList}>
                      {mockCourseData.introduction.learningOutcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </TabPane>
                <TabPane 
                  tab={
                    <span>
                      <PlayCircleOutlined />
                      课程目录
                    </span>
                  } 
                  key="curriculum"
                >
                  <div className={styles.curriculumContent}>
                    <Collapse 
                      defaultActiveKey={['0']} 
                      className={styles.chaptersCollapse}
                    >
                      {mockCourseData.chapters.map((chapter, index) => (
                        <Panel 
                          header={chapter.title} 
                          key={index.toString()}
                          className={styles.chapterPanel}
                        >
                          {chapter.lessons.length > 0 ? (
                            <List
                              itemLayout="horizontal"
                              dataSource={chapter.lessons}
                              renderItem={lesson => (
                                <List.Item className={styles.lessonItem}>
                                  <div className={styles.lessonInfo}>
                                    <PlayCircleOutlined className={styles.lessonIcon} />
                                    <Text>{lesson.title}</Text>
                                  </div>
                                  <Text type="secondary">{lesson.duration}</Text>
                                </List.Item>
                              )}
                            />
                          ) : (
                            <Text type="secondary">内容准备中...</Text>
                          )}
                        </Panel>
                      ))}
                    </Collapse>
                  </div>
                </TabPane>
                <TabPane 
                  tab={
                    <span>
                      <MessageOutlined />
                      学员评价
                    </span>
                  } 
                  key="reviews"
                >
                  <div className={styles.reviewsContent}>
                    <List
                      itemLayout="vertical"
                      dataSource={mockCourseData.reviews}
                      renderItem={review => (
                        <List.Item className={styles.reviewItem}>
                          <div className={styles.reviewHeader}>
                            <Avatar src={review.userAvatar} size="large" />
                            <div className={styles.reviewerInfo}>
                              <Text strong>{review.userName}</Text>
                              <div className={styles.reviewMeta}>
                                <Rate disabled defaultValue={review.rating} />
                                <Text type="secondary" className={styles.reviewDate}>{review.date}</Text>
                              </div>
                            </div>
                          </div>
                          <Paragraph className={styles.reviewContent}>
                            {review.content}
                          </Paragraph>
                          <Divider />
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>
                <TabPane 
                  tab={
                    <span>
                      <QuestionCircleOutlined />
                      常见问题
                    </span>
                  } 
                  key="faq"
                >
                  <div className={styles.faqContent}>
                    <Collapse className={styles.faqCollapse}>
                      <Panel header="课程有效期是多久？" key="1">
                        <Paragraph>
                          本课程为永久观看权限，一次购买，终身有效。
                        </Paragraph>
                      </Panel>
                      <Panel header="课程是否提供课件下载？" key="2">
                        <Paragraph>
                          是的，课程提供PDF格式的课件下载，方便您离线学习。
                        </Paragraph>
                      </Panel>
                      <Panel header="如何获得答疑服务？" key="3">
                        <Paragraph>
                          购买课程后，您可以在课程讨论区提问，我们的助教会在24小时内回复您的问题。对于复杂问题，我们还提供一对一在线答疑服务。
                        </Paragraph>
                      </Panel>
                      <Panel header="是否可以申请退款？" key="4">
                        <Paragraph>
                          课程开通后7天内，如果学习时长不超过课程总时长的20%，可以申请无理由退款。超过7天或学习时长超过20%的，将不再支持退款。
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  </div>
                </TabPane>
              </Tabs>
            </Card>

            {/* 讲师介绍 */}
            <Card className={styles.teacherCard}>
              <Title level={4}>讲师介绍</Title>
              <div className={styles.teacherInfo}>
                <Avatar 
                  src={mockCourseData.teacherAvatar} 
                  size={80} 
                  className={styles.teacherAvatar}
                />
                <div className={styles.teacherDetail}>
                  <Title level={5}>{mockCourseData.teacherName}</Title>
                  <Text type="secondary">{mockCourseData.teacherTitle}</Text>
                  <Paragraph className={styles.teacherDescription}>
                    {mockCourseData.teacherDescription}
                  </Paragraph>
                  <div className={styles.teacherStats}>
                    <div className={styles.teacherStatItem}>
                      <BookOutlined />
                      <span>{mockCourseData.teacherCourseCount}门课程</span>
                    </div>
                    <div className={styles.teacherStatItem}>
                      <TeamOutlined />
                      <span>{mockCourseData.teacherStudentCount}名学员</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* 课程目录预览 */}
            <Card className={styles.sidebarCard}>
              <div className={styles.sidebarCardHeader}>
                <Title level={4}>课程目录</Title>
                <Text type="secondary">共{mockCourseData.totalLessons}节课</Text>
              </div>
              <Collapse 
                defaultActiveKey={['0']} 
                className={styles.sidebarCollapse}
              >
                {mockCourseData.chapters.slice(0, 3).map((chapter, index) => (
                  <Panel 
                    header={chapter.title} 
                    key={index.toString()}
                    className={styles.sidebarPanel}
                  >
                    {chapter.lessons.length > 0 ? (
                      <List
                        itemLayout="horizontal"
                        dataSource={chapter.lessons}
                        renderItem={lesson => (
                          <List.Item className={styles.sidebarLessonItem}>
                            <div className={styles.lessonInfo}>
                              <PlayCircleOutlined className={styles.lessonIcon} />
                              <Text>{lesson.title}</Text>
                            </div>
                            <Text type="secondary">{lesson.duration}</Text>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text type="secondary">内容准备中...</Text>
                    )}
                  </Panel>
                ))}
              </Collapse>
              <div className={styles.viewAllWrapper}>
                <Button type="link">查看完整目录</Button>
              </div>
            </Card>

            {/* 相关课程推荐 */}
            <Card className={styles.sidebarCard}>
              <Title level={4}>相关课程推荐</Title>
              <List
                itemLayout="horizontal"
                dataSource={mockCourseData.relatedCourses}
                renderItem={course => (
                  <List.Item className={styles.relatedCourseItem}>
                    <div className={styles.relatedCourseCover}>
                      <img src={course.coverImage} alt={course.title} />
                    </div>
                    <div className={styles.relatedCourseInfo}>
                      <Text strong className={styles.relatedCourseTitle}>{course.title}</Text>
                      <div className={styles.relatedCourseRating}>
                        <Rate disabled defaultValue={course.rating} allowHalf />
                        <Text type="secondary">{course.rating}</Text>
                      </div>
                      <Text type="danger" strong>￥{course.price}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 移动端底部购买栏 */}
      <div className={styles.mobileBottomBar}>
        <div className={styles.mobilePrice}>
          <Text className={styles.mobilePriceText}>￥{mockCourseData.price}</Text>
          {mockCourseData.discount && (
            <Text className={styles.mobileOriginalPrice}>￥{mockCourseData.originalPrice}</Text>
          )}
        </div>
        <Button type="primary" className={styles.mobileBuyButton}>
          立即购买
        </Button>
      </div>
    </div>
  );
};

export default CourseDetailPage; 