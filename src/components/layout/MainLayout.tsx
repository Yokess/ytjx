import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import styles from './MainLayout.module.scss';

const { Content, Sider } = Layout;

interface MainLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebarContent }) => {
  return (
    <Layout className={styles.mainLayout}>
      {/* 使用Header组件替代原来的导航栏 */}
      <Header />

      <Layout className={styles.contentLayout}>
        {/* 侧边栏 */}
        {sidebarContent && (
          <Sider width={240} className={styles.sider}>
            {sidebarContent}
          </Sider>
        )}

        {/* 主要内容区 */}
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 