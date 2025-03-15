import React, { useState } from 'react';
import { 
  Typography, 
  Input, 
  Button, 
  Avatar, 
  Space, 
  Divider, 
  Menu,
  Layout
} from 'antd';
import { 
  MessageOutlined, 
  FileTextOutlined, 
  BookOutlined, 
  FileMarkdownOutlined, 
  PlusOutlined,
  SendOutlined,
  PaperClipOutlined,
  PictureOutlined
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import styles from './AIAssistant.module.scss';

const { TextArea } = Input;
const { Sider, Content } = Layout;

// 模拟聊天数据
const mockMessages = [
  {
    id: 1,
    type: 'system',
    content: '今天 14:30',
    timestamp: new Date()
  },
  {
    id: 2,
    type: 'assistant',
    content: '你好，我是研途九霄的智能助手。我可以帮你解答考研相关的问题，制定学习计划，或者解析难题。请问有什么可以帮到你的吗？',
    timestamp: new Date()
  },
  {
    id: 3,
    type: 'user',
    content: '我想了解一下考研数学中的高数部分应该如何复习？有什么好的方法和资料推荐吗？',
    timestamp: new Date()
  },
  {
    id: 4,
    type: 'assistant',
    content: `考研数学高数部分的复习可以分为以下几个阶段：

1. 基础阶段（3-4个月）
- 系统学习教材，推荐《高等数学》（同济第七版）
- 结合《考研数学复习全书》（李永乐）进行知识点梳理
- 做基础题巩固概念，可以使用《考研数学660题》

2. 强化阶段（2-3个月）
- 使用《考研数学辅导讲义》（李永乐）进行专题训练
- 开始做历年真题，先做2000年以前的
- 针对薄弱环节进行专项突破

3. 冲刺阶段（2个月）
- 系统做近10年真题，注重分析解题思路
- 模拟考试训练，推荐合工大超越和张宇八套卷
- 总结常见题型和解题方法

你目前处于哪个阶段？我可以根据你的情况给出更具体的建议。`,
    timestamp: new Date()
  }
];

// 历史对话列表
const historyChats = [
  { id: 1, title: '数学函数极限问题' },
  { id: 2, title: '英语写作技巧分析' },
  { id: 3, title: '政治重点知识梳理' },
  { id: 4, title: '专业课复习计划' }
];

// 侧边栏内容
const SidebarContent = () => {
  const [selectedKey, setSelectedKey] = useState('1');

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>智能助手</h3>
      
      {/* 功能菜单 */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) => setSelectedKey(e.key)}
        className={styles.sidebarMenu}
      >
        <Menu.Item key="1" icon={<MessageOutlined />}>
          智能问答
        </Menu.Item>
        <Menu.Item key="2" icon={<FileTextOutlined />}>
          解题助手
        </Menu.Item>
        <Menu.Item key="3" icon={<BookOutlined />}>
          学习规划
        </Menu.Item>
        <Menu.Item key="4" icon={<FileMarkdownOutlined />}>
          笔记整理
        </Menu.Item>
      </Menu>
      
      {/* 历史记录 */}
      <div className={styles.historySection}>
        <h4 className={styles.historyTitle}>最近对话</h4>
        <div className={styles.historyList}>
          {historyChats.map(chat => (
            <div key={chat.id} className={styles.historyItem}>
              {chat.title}
            </div>
          ))}
        </div>
      </div>
      
      {/* 新建对话按钮 */}
      <Button 
        icon={<PlusOutlined />} 
        className={styles.newChatButton}
      >
        新建对话
      </Button>
    </div>
  );
};

const AIAssistantPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  // 处理发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // 添加用户消息
    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    // 模拟AI回复
    setTimeout(() => {
      const newAIMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: '我正在处理您的问题，请稍等...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAIMessage]);
    }, 1000);
  };

  return (
    <MainLayout sidebarContent={<SidebarContent />}>
      <div className={styles.chatContainer}>
        {/* 聊天头部 */}
        <div className={styles.chatHeader}>
          <h2 className={styles.chatTitle}>智能问答助手</h2>
          <p className={styles.chatDescription}>我可以回答考研相关的各种问题，帮助你解决学习中的困惑</p>
        </div>
        
        {/* 聊天内容区域 */}
        <div className={styles.messagesContainer}>
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`${styles.messageWrapper} ${
                message.type === 'system' 
                  ? styles.systemMessage 
                  : message.type === 'user' 
                    ? styles.userMessage 
                    : styles.assistantMessage
              }`}
            >
              {message.type === 'system' ? (
                <div className={styles.systemMessageContent}>
                  {message.content}
                </div>
              ) : message.type === 'user' ? (
                <div className={styles.userMessageContainer}>
                  <div className={styles.messageContent}>
                    {message.content}
                  </div>
                  <Avatar className={styles.userAvatar} src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                </div>
              ) : (
                <div className={styles.assistantMessageContainer}>
                  <Avatar className={styles.assistantAvatar}>AI</Avatar>
                  <div className={styles.messageContent}>
                    {message.content.split('\n\n').map((paragraph, index) => (
                      <React.Fragment key={index}>
                        {paragraph.split('\n').map((line, lineIndex) => {
                          if (line.startsWith('- ')) {
                            return <li key={lineIndex}>{line.substring(2)}</li>;
                          } else if (line.match(/^\d+\./)) {
                            return <h4 key={lineIndex} className={styles.messageSubheading}>{line}</h4>;
                          } else {
                            return <p key={lineIndex}>{line}</p>;
                          }
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 输入区域 */}
        <div className={styles.inputContainer}>
          <div className={styles.textareaWrapper}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入你的问题..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className={styles.textarea}
            />
            <div className={styles.inputActions}>
              <Button 
                type="text" 
                icon={<PaperClipOutlined />} 
                className={styles.actionButton}
              />
              <Button 
                type="text" 
                icon={<PictureOutlined />} 
                className={styles.actionButton}
              />
            </div>
          </div>
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSendMessage}
            className={styles.sendButton}
          />
        </div>
        
        <div className={styles.inputFooter}>
          <span>支持上传图片、文档进行提问</span>
          <span>Powered by 研途九霄 AI</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIAssistantPage; 