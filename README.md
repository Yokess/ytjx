# 研途九霄 - 考研学习平台

## 项目介绍

研途九霄是一个专为考研学生打造的综合性学习平台，旨在提供全方位的考研备考资源和智能学习工具。平台集题库练习、在线考试、视频课程、电子书资源、社区交流等功能于一体，通过个性化推荐和AI辅助学习，为考生提供高效、便捷的备考体验。

### 核心价值

- **资源整合**：汇集优质考研学习资源，打造一站式备考平台
- **智能学习**：基于AI技术的个性化推荐和学习分析
- **互动交流**：考研社区和即时通讯功能，促进学习交流
- **科学备考**：提供系统化的学习计划和进度跟踪

## 技术栈

### 前端技术

- **框架**：React、React Router
- **状态管理**：Redux、Redux Toolkit
- **UI组件**：Ant Design、Bootstrap
- **构建工具**：Webpack
- **语言**：TypeScript、JavaScript、HTML5、CSS3

### 后端技术

- **框架**：Spring Boot 2.7、Spring MVC
- **ORM**：MyBatis
- **数据库**：MySQL 8.0
- **缓存**：Redis、Caffeine
- **消息队列**：Kafka
- **搜索引擎**：Elasticsearch
- **安全**：Spring Security
- **定时任务**：Spring Quartz
- **日志**：SLF4J + Logback

## 系统架构

系统采用前后端分离的B/S架构，主要分为以下几层：

1. **表现层**：React前端应用，负责UI展示和用户交互
2. **接口层**：RESTful API，处理前端请求
3. **业务层**：实现核心业务逻辑
4. **持久层**：数据库访问和数据持久化
5. **缓存层**：提高系统性能
6. **消息队列**：处理异步任务
7. **搜索服务**：提供全文搜索功能

![系统架构图](架构图URL)

## 功能模块

### 1. 个性化推荐模块
- 个性化资源推荐
- 身份与方向选择
- 学习计划制定

### 2. 题库模块
- 题目搜索与筛选
- 题目添加与管理
- 错题集管理
- 题目通过率统计
- 做题排行榜

### 3. 考试模块
- 考试设置
- 考试评审
- 答题提交
- 试题解析
- 成绩分析
- 排行榜与讨论

### 4. 视频页模块
- 播放控制
- 实时字幕
- AI 总结
- 笔记管理

### 5. 题单管理模块
- 题单创建与编辑
- 题单分类与标签
- 题单浏览与搜索
- 练习记录与分享
- 评论与互动

### 6. 私信系统模块
- 私信功能
- 群组功能
- 在线状态与好友管理
- 管理员公告接收
- AI 提问与历史记录

### 7. 视频库模块
- 视频筛选与排序
- 收藏与转发
- 标签添加与管理
- 视频播放记录
- 评论与互动

### 8. 社区功能模块
- 主题分区与板块管理
- 发帖与回复
- 点赞与举报
- 专栏与长篇文章
- 版主管理与用户权限

### 9. 商店模块
- 商品浏览与搜索
- 商品购买与支付
- 商品评价与评论
- 商品推荐与折扣

### 10. 电子书模块
- 电子书筛选与搜索
- 电子书浏览与阅读
- 笔记与标记功能
- 评论与分享
- 收藏与推荐

### 11. 课程学习模块
- 课程搜索与筛选
- 课程资源与学习模块
- 视频播放与笔记记录
- 作业与测验
- 教师互动与答疑
- 学习进度与反馈
- 资源上传与分享

### 12. 个人空间模块
- 个人信息展示与管理
- 学习记录与动态展示
- 认证与教师身份管理
- 安全与隐私设置
- 收藏与关注
- 资源架构编排与管理

### 13. 后台管理模块
- 用户管理
- 课程与资源管理
- 社区管理
- 考试与题库管理
- 公告与信息发布
- 反馈管理与客户支持

## 安装部署

### 环境要求

- JDK 11+
- Node.js 16+
- MySQL 8.0
- Redis 6.0+
- Kafka 3.0+
- Elasticsearch 7.0+
- Maven 3.6+

### 后端部署

1. 克隆代码仓库
```bash
git clone https://github.com/your-organization/ytjx-backend.git
cd ytjx-backend
```

2. 配置数据库
```bash
# 导入数据库表结构和初始数据
mysql -u username -p database_name < ytjx.sql
```

3. 修改配置文件
```bash
# 编辑 application.properties 或 application.yml 文件
# 配置数据库连接、Redis、Kafka 等
```

4. 构建和运行
```bash
mvn clean package
java -jar target/ytjx-backend-1.0.0.jar
```

### 前端部署

1. 克隆代码仓库
```bash
git clone https://github.com/your-organization/ytjx-frontend.git
cd ytjx-frontend
```

2. 安装依赖
```bash
npm install
```

3. 修改配置文件
```bash
# 编辑 .env 文件，配置 API 地址等
```

4. 构建和运行
```bash
# 开发环境
npm run dev

# 生产环境
npm run build
# 使用 Nginx 或其他服务器部署 build 目录
```

## 开发环境

- 操作系统：Windows 11 / macOS / Linux
- IDE：IntelliJ IDEA (后端)、Visual Studio Code (前端)
- 构建工具：Maven、npm
- 数据库工具：Navicat
- API测试：Postman
- 版本控制：Git

## 文档

- [接口文档](API文档链接)
- [数据库设计文档](数据库文档链接)
- [前端组件文档](前端文档链接)

## 团队信息

研途九霄项目由XXX团队开发维护，如有问题或建议，请联系：

- 电子邮件：contact@ytjx.com
- 官方网站：https://www.ytjx.com
- GitHub：https://github.com/your-organization/ytjx

## 许可证

本项目采用 [MIT 许可证](LICENSE) 进行许可。 

src/
├── assets/                # 静态资源(图片、字体等)
├── components/            # 通用组件
│   ├── common/            # 基础组件(按钮、卡片等)
│   ├── layout/            # 布局组件(页头、页脚、侧边栏)
│   └── features/          # 功能组件(视频播放器、试题卡等)
├── pages/                 # 页面组件
│   ├── Home/              # 首页
│   ├── Auth/              # 登录/注册
│   ├── Courses/           # 课程相关页面
│   ├── Exams/             # 考试相关页面
│   ├── Community/         # 社区页面
│   ├── Ebooks/            # 电子书页面
│   ├── User/              # 用户中心
│   └── AIAssistant/       # AI助手页面
├── store/                 # Redux状态管理
│   ├── slices/            # Redux切片
│   ├── api/               # RTK Query API定义
│   ├── hooks.ts           # 自定义Redux Hooks
│   └── index.ts           # Store配置
├── api/                   # API请求服务
├── utils/                 # 工具函数
├── hooks/                 # 自定义Hooks
├── types/                 # TypeScript类型定义
├── routes/                # 路由配置
├── themes/                # 主题配置
├── App.tsx                # 应用入口组件
└── index.tsx              # 应用入口文件 