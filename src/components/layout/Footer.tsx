import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import {
  GithubOutlined,
  WechatOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import styles from './Footer.module.scss';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: '关于我们',
      items: [
        { label: '公司介绍', link: '/about' },
        { label: '联系我们', link: '/contact' },
        { label: '加入我们', link: '/join' },
      ],
    },
    {
      title: '产品服务',
      items: [
        { label: '智能题库', link: '/exams' },
        { label: '在线课程', link: '/courses' },
        { label: '模拟考试', link: '/mock-exam' },
      ],
    },
    {
      title: '学习资源',
      items: [
        { label: '电子书库', link: '/ebooks' },
        { label: '学习社区', link: '/community' },
        { label: '考研资讯', link: '/news' },
      ],
    },
    {
      title: '关注我们',
      items: [],
      socialIcons: true,
    },
  ];

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.container}>
        <Row gutter={[32, 24]}>
          {footerLinks.map((section, index) => (
            <Col xs={12} sm={6} key={index}>
              <div className={styles.section}>
                <Title level={5} className={styles.title}>
                  {section.title}
                </Title>
                {section.items.length > 0 && (
                  <ul className={styles.links}>
                    {section.items.map((item, i) => (
                      <li key={i}>
                        <Link to={item.link} className={styles.link}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {section.socialIcons && (
                  <Space size="middle" className={styles.socialIcons}>
                    <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                      <WechatOutlined />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                      <WeiboOutlined />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                      <GithubOutlined />
                    </a>
                  </Space>
                )}
              </div>
            </Col>
          ))}
        </Row>
        <div className={styles.copyright}>
          <Text className={styles.copyrightText}>
            © {currentYear} 研途九霄. All rights reserved.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 