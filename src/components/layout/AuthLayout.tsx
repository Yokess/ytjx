import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import styles from './AuthLayout.module.scss';

const { Content } = Layout;
const { Title } = Typography;

const AuthLayout: React.FC = () => {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Link to="/" className={styles.logo}>
              <Title level={3} className={styles.title}>
                <span className={styles.gradientText}>研途九霄</span>
              </Title>
            </Link>
          </div>
          <div className={styles.authCard}>
            <Outlet />
          </div>
          <div className={styles.footer}>
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} 研途九霄. All rights reserved.
            </Typography.Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout; 