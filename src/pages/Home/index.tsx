import React, { useEffect } from 'react';
import { Button, Row, Col, Statistic, Avatar, Dropdown, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RightOutlined, 
  BookOutlined, 
  FileTextOutlined, 
  ReadOutlined,
  WechatOutlined,
  QqOutlined,
  WeiboOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import styles from './Home.module.scss';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

// 尝试导入AOS库，如果项目中没有安装，需要先安装：npm install aos
let AOS: any;
try {
  AOS = require('aos');
  require('aos/dist/aos.css');
} catch (e) {
  console.warn('AOS library is not installed. Please install it using: npm install aos');
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // 从Redux获取用户认证状态
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // 初始化AOS动画库
    if (AOS) {
      AOS.init({
        duration: 1000,
        once: true
      });
    }
  }, []);

  // 处理登录/注册按钮点击
  const handleAuthClick = () => {
    navigate('/login');
  };
  
  // 处理退出登录
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/user">个人中心</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.homePage}>
      {/* 导航栏 */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>研途九霄</div>
          <div className={styles.navLinks}>
            <Link to="/" className={`${styles.navLink} ${styles.active}`}>首页</Link>
            <Link to="/courses" className={styles.navLink}>精品课程</Link>
            <Link to="/questions" className={styles.navLink}>在线题库</Link>
            <Link to="/ai-assistant" className={styles.navLink}>智能助手</Link>
            <Link to="/community" className={styles.navLink}>学习社区</Link>
          </div>
          <div className={styles.authButtons}>
            {isAuthenticated && user ? (
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className={styles.userInfo}>
                  {user.avatar ? (
                    <Avatar src={user.avatar} size="small" className={styles.avatar} />
                  ) : (
                    <Avatar icon={<UserOutlined />} size="small" className={styles.avatar} />
                  )}
                  <span className={styles.userName}>{user.username}</span>
                  <DownOutlined className={styles.downIcon} />
                </div>
              </Dropdown>
            ) : (
              <Button 
                type="primary" 
                className={styles.loginButton}
                onClick={handleAuthClick}
              >
                登录/注册
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero部分 */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={24} lg={12}>
              <h1 className={styles.heroTitle}>
                <span>考研备考</span>
                <span className={styles.gradientText}>一站式学习平台</span>
              </h1>
              <p className={styles.heroDescription}>
                研途九霄为考研学子提供全面的备考资源，包括精品课程、在线题库、模拟考试和智能学习助手，助你高效备考，轻松上岸。
              </p>
              <div className={styles.heroButtons}>
                <Button type="primary" className={styles.primaryButton}>免费试用</Button>
                <Button className={styles.secondaryButton}>了解更多</Button>
              </div>
            </Col>
            <Col xs={24} md={24} lg={12} className={styles.heroImageCol}>
              <img 
                src="/images/hero-image.png" 
                alt="考研备考平台" 
                className={styles.heroImage}
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* 核心功能部分 */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>核心功能</h2>
            <p className={styles.sectionDescription}>
              我们提供全方位的考研备考服务，助你高效学习，轻松备考
            </p>
          </div>

          <Row gutter={[32, 32]} className={styles.featuresGrid}>
            <Col xs={24} sm={12} lg={8}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ backgroundColor: '#e6f7ff' }}>
                  <FileTextOutlined style={{ color: '#5B5CFF' }} />
                </div>
                <h3 className={styles.featureTitle}>智能题库</h3>
                <p className={styles.featureDescription}>
                  海量真题和模拟题，智能推荐，针对性练习，快速提升解题能力。
                </p>
                <Link to="/exams" className={styles.featureLink}>
                  立即体验 <RightOutlined />
                </Link>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ backgroundColor: '#f6ffed' }}>
                  <BookOutlined style={{ color: '#52c41a' }} />
                </div>
                <h3 className={styles.featureTitle}>模拟考试</h3>
                <p className={styles.featureDescription}>
                  模拟真实考试环境，多套模拟试卷，实时评分，查漏补缺。
                </p>
                <Link to="/mock-exams" className={styles.featureLink}>
                  立即体验 <RightOutlined />
                </Link>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ backgroundColor: '#fff2e8' }}>
                  <ReadOutlined style={{ color: '#fa8c16' }} />
                </div>
                <h3 className={styles.featureTitle}>电子书库</h3>
                <p className={styles.featureDescription}>
                  精选考研教材和辅导资料，随时随地在线阅读，提升学习效率。
                </p>
                <Link to="/ebooks" className={styles.featureLink}>
                  立即体验 <RightOutlined />
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 统计部分 */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>10,000+</div>
                <div className={styles.statLabel}>题库题目数量</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>50,000+</div>
                <div className={styles.statLabel}>注册用户</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>500+</div>
                <div className={styles.statLabel}>电子书资源</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>98%</div>
                <div className={styles.statLabel}>用户满意度</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <Row gutter={[48, 32]}>
            <Col xs={24} sm={12} md={6}>
              <h3 className={styles.footerTitle}>关于我们</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/about">公司简介</Link></li>
                <li><Link to="/team">团队介绍</Link></li>
                <li><Link to="/contact">联系我们</Link></li>
                <li><Link to="/careers">加入我们</Link></li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h3 className={styles.footerTitle}>产品服务</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/courses">精品课程</Link></li>
                <li><Link to="/exams">在线题库</Link></li>
                <li><Link to="/mock-exams">模拟考试</Link></li>
                <li><Link to="/ebooks">电子书库</Link></li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h3 className={styles.footerTitle}>学习资源</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/blog">学习博客</Link></li>
                <li><Link to="/faq">常见问题</Link></li>
                <li><Link to="/help">帮助中心</Link></li>
                <li><Link to="/feedback">意见反馈</Link></li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h3 className={styles.footerTitle}>关注我们</h3>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}><WechatOutlined /></a>
                <a href="#" className={styles.socialLink}><QqOutlined /></a>
                <a href="#" className={styles.socialLink}><WeiboOutlined /></a>
              </div>
            </Col>
          </Row>
          <div className={styles.copyright}>
            © 2023 研途九霄 版权所有
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 