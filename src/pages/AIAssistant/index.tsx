import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Input, 
  Button, 
  Card, 
  Tabs, 
  Upload, 
  Form, 
  Select, 
  DatePicker, 
  InputNumber,
  message,
  Spin,
  Divider, 
  Space,
  List,
  Tag,
  Switch,
  Image,
  Alert,
  Radio
} from 'antd';
import { 
  SendOutlined,
  CameraOutlined, 
  UploadOutlined,
  CalendarOutlined,
  FileTextOutlined,
  RobotOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PictureOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import MainLayout from '../../components/layout/MainLayout';
import styles from './AIAssistant.module.scss';
import type { AIMessage, AIRole } from '../../types/ai';
import aiApi from '../../api/aiApi';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

// 侧边栏内容组件
const SidebarContent: React.FC<{
  chatHistory: Array<{ id: string; title: string; date: string }>;
  onHistoryClick: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onNewChat: () => void;
}> = ({ chatHistory, onHistoryClick, onDeleteHistory, onNewChat }) => {
  return (
    <div className={styles.sidebar}>
      {/* 新建对话按钮 */}
      <Button 
        type="primary" 
        icon={<PlusCircleOutlined />} 
        onClick={onNewChat}
        className={styles.newChatButton}
        block
      >
        新建对话
      </Button>

      <Divider />

      {/* 对话历史 */}
      <div className={styles.historySection}>
        <div className={styles.historyTitle}>
          <HistoryOutlined /> 历史记录
        </div>
        <List
          className={styles.historyList}
          dataSource={chatHistory}
          renderItem={item => (
            <List.Item
              className={styles.historyItem}
              actions={[
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  onClick={() => onDeleteHistory(item.id)}
                  size="small"
                />
              ]}
              onClick={() => onHistoryClick(item.id)}
            >
              <div className={styles.historyItemContent}>
                <div className={styles.historyItemTitle}>{item.title}</div>
                <div className={styles.historyItemDate}>{item.date}</div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <Divider />

      {/* 快捷操作 */}
      <div className={styles.quickActions}>
        <Title level={5}>快捷操作</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Tag color="blue" className={styles.quickAction}>
            <QuestionCircleOutlined /> 解答数学题
          </Tag>
          <Tag color="green" className={styles.quickAction}>
            <CalendarOutlined /> 制定学习计划
          </Tag>
          <Tag color="purple" className={styles.quickAction}>
            <FileTextOutlined /> 整理笔记
          </Tag>
        </Space>
      </div>
    </div>
  );
};

// 图像显示组件
const ImageDisplay: React.FC<{
  imageBase64: string | null;
  imageUrl: string | null;
}> = ({ imageBase64, imageUrl }) => {
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [useAltMethod, setUseAltMethod] = useState<boolean>(false);
  const [displayUrl, setDisplayUrl] = useState<string>('');
  
  // 确保至少有一种方式显示图像
  useEffect(() => {
    if (!imageUrl && imageBase64) {
      // 如果没有Blob URL但有Base64，强制使用Base64显示
      setUseAltMethod(true);
    }
    
    // 设置显示用的URL
    if (useAltMethod && imageBase64) {
      setDisplayUrl(`data:image/png;base64,${imageBase64}`);
    } else if (imageUrl) {
      setDisplayUrl(imageUrl);
    } else if (imageBase64) {
      setDisplayUrl(`data:image/png;base64,${imageBase64}`);
    } else {
      setDisplayUrl('');
    }
  }, [imageUrl, imageBase64, useAltMethod]);
  
  // 处理图像加载错误
  const handleImageError = () => {
    console.log('图像加载失败，尝试使用备用方法');
    setDisplayError(true);
    if (!useAltMethod && imageBase64) {
      setUseAltMethod(true);
      setDisplayUrl(`data:image/png;base64,${imageBase64}`);
    }
  };
  
  // 使用图像加载成功处理
  const handleImageLoad = () => {
    console.log('图像加载成功!');
    setDisplayError(false);
  };
  
  // 下载图像
  const handleDownloadImage = () => {
    if (!displayUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = displayUrl;
      link.download = `generated_image_${Date.now()}.png`;
      console.log("正在下载图像:", displayUrl);
      link.click();
    } catch (error) {
      console.error('下载图像失败:', error);
      message.error('下载图像失败，请重试');
    }
  };
  
  // 在新窗口查看
  const handleViewInNewWindow = () => {
    if (!displayUrl) return;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>图像查看</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; background: #f0f0f0; font-family: Arial, sans-serif; }
              img { max-width: 90%; max-height: 90vh; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border-radius: 8px; }
              .error { color: red; margin: 20px; font-size: 16px; }
              .controls { margin-top: 20px; }
              button { padding: 8px 16px; margin: 0 8px; cursor: pointer; background: #1890ff; color: white; border: none; border-radius: 4px; }
              .info { margin-top: 20px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <img src="${displayUrl}" alt="生成的图像" onerror="handleImageError()" onload="handleImageLoad()" />
            <div id="error-message" class="error" style="display:none;">图像加载失败，请检查图像URL是否正确</div>
            <div class="controls">
              <button onclick="downloadImage()">下载图像</button>
              <button onclick="copyImageUrl()">复制图像URL</button>
              <button onclick="window.close()">关闭</button>
            </div>
            <div class="info">
              <p>图像URL: <span id="image-url">${displayUrl}</span></p>
            </div>
            <script>
              function handleImageError() {
                console.error('图片加载失败');
                document.getElementById('error-message').style.display = 'block';
              }
              
              function handleImageLoad() {
                console.log('图片成功加载');
                document.getElementById('error-message').style.display = 'none';
              }
            
              function downloadImage() {
                const link = document.createElement('a');
                link.href = "${displayUrl}";
                link.download = "image_${Date.now()}.png";
                link.click();
              }
              
              function copyImageUrl() {
                const url = document.getElementById('image-url').textContent;
                navigator.clipboard.writeText(url)
                  .then(() => alert('图像URL已复制到剪贴板'))
                  .catch(err => alert('复制失败: ' + err));
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };
  
  // 如果既没有URL也没有Base64，显示错误信息
  if (!imageUrl && !imageBase64) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Alert
          message="无法显示图像"
          description="未找到图像数据，请尝试重新生成。"
          type="error"
          showIcon
        />
      </div>
    );
  }
  
  // 如果链接中包含手动输入的文本，尝试提取URL
  if (typeof displayUrl === 'string' && displayUrl.includes('blob:http')) {
    try {
      // 尝试提取blob URL
      const blobUrlMatch = displayUrl.match(/blob:http[^\s"')]+/);
      if (blobUrlMatch && blobUrlMatch[0]) {
        return (
          <img 
            src={blobUrlMatch[0]}
            alt="生成的图像" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '600px',
              border: '1px solid #eee',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onError={(e) => {
              console.error('提取的Blob URL图像加载失败:', blobUrlMatch[0]);
              setDisplayError(true);
            }}
            onLoad={() => {
              console.log('提取的Blob URL图像加载成功!', blobUrlMatch[0]);
              setDisplayError(false);
            }}
            onClick={() => {
              const newWindow = window.open('', '_blank');
              if (newWindow) {
                newWindow.document.write(`
                  <html>
                    <head>
                      <title>图像查看</title>
                      <style>
                        body { margin: 0; padding: 20px; text-align: center; background: #f0f0f0; }
                        img { max-width: 90%; max-height: 90vh; }
                      </style>
                    </head>
                    <body>
                      <img src="${blobUrlMatch[0]}" alt="图像" />
                      <div style="margin-top: 20px;">
                        <button onclick="window.close()">关闭</button>
                      </div>
                    </body>
                  </html>
                `);
                newWindow.document.close();
              }
            }}
          />
        );
      }
    } catch (error) {
      console.error('解析Blob URL出错:', error);
    }
  }
  
  // 如果有显示URL但加载失败
  if (displayError && displayUrl) {
    return (
      <div style={{ marginTop: '20px' }}>
        <Alert
          message="图像加载失败"
          description={
            <div>
              <p>图像URL加载失败，可能的原因：</p>
              <ol>
                <li>Blob URL已过期或无效</li>
                <li>Base64数据格式不正确</li>
                <li>浏览器无法解析图像格式</li>
              </ol>
              <div style={{ marginTop: '10px' }}>
                <Space>
                  <Button type="primary" onClick={handleViewInNewWindow}>
                    在新窗口查看
                  </Button>
                  <Button onClick={handleDownloadImage}>
                    尝试直接下载
                  </Button>
                </Space>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Text type="secondary">图像URL:</Text>
                <br />
                <Text code copyable style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                  {displayUrl.substring(0, 100)}{displayUrl.length > 100 ? '...' : ''}
                </Text>
              </div>
            </div>
          }
          type="error"
          showIcon
        />
      </div>
    );
  }
  
  return (
    <div style={{ marginTop: '20px' }}>
      {/* 图像显示区 */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        {displayUrl && (
          <img 
            src={displayUrl}
            alt="生成的图像" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '600px',
              border: '1px solid #eee',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
      </div>
      
      {/* 操作按钮 */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Space>
      <Button 
            type="primary" 
            onClick={handleDownloadImage}
            icon={<DownloadOutlined />}
            disabled={!displayUrl}
          >
            下载图像
      </Button>
          
          <Button
            onClick={handleViewInNewWindow}
            icon={<EyeOutlined />}
            disabled={!displayUrl}
          >
            新窗口查看
          </Button>
          
          {!useAltMethod && imageBase64 && (
            <Button 
              onClick={() => setUseAltMethod(true)}
              icon={<ReloadOutlined />}
            >
              使用Base64显示
            </Button>
          )}
          
          {useAltMethod && imageUrl && (
            <Button 
              onClick={() => setUseAltMethod(false)}
              icon={<ReloadOutlined />}
            >
              使用Blob URL显示
            </Button>
          )}
        </Space>
        
        <div style={{ marginTop: '10px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            当前显示方式: {useAltMethod ? 'Base64' : 'Blob URL'} | 
            URL类型: {displayUrl.startsWith('blob:') ? 'Blob URL' : displayUrl.startsWith('data:') ? 'Data URL' : '其他URL'}
          </Text>
        </div>
      </div>
    </div>
  );
};

// 添加自定义图像组件
const MarkdownImage = ({ src, alt, node, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { node?: any }) => {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  
  // 在组件挂载和src变化时更新imgSrc
  useEffect(() => {
    console.log("MarkdownImage组件接收到的src:", src);
    console.log("MarkdownImage组件接收到的node:", node);
    
    // 如果链接中包含手动输入的文本，尝试提取URL
    if (typeof src === 'string' && src.includes('blob:http')) {
      try {
        // 尝试提取blob URL
        const blobUrlMatch = src.match(/blob:http[^\s"')]+/);
        if (blobUrlMatch && blobUrlMatch[0]) {
          console.log("提取到Blob URL:", blobUrlMatch[0]);
          setImgSrc(blobUrlMatch[0]);
          return;
        }
      } catch (error) {
        console.error('解析Blob URL出错:', error);
      }
    }
    
    if (src) {
      setImgSrc(src);
    }
  }, [src, node]);
  
  // 处理图像加载错误
  const handleError = () => {
    console.error('图像加载失败:', imgSrc);
    setError(true);
  }
  
  // 处理图像加载成功
  const handleLoad = () => {
    console.log('图像加载成功!', imgSrc);
    setError(false);
  }
  
  // 处理右键点击事件
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!imgSrc) return;
    
    try {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = imgSrc;
      link.download = `image_${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('下载图像失败:', error);
      message.error('下载图像失败');
    }
  };
  
  // 处理点击事件（放大查看）
  const handleClick = () => {
    if (!imgSrc) return;
    // 在新窗口中打开图像
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${alt || '图像查看'}</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; background: #f0f0f0; font-family: Arial, sans-serif; }
              img { max-width: 90%; max-height: 90vh; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border-radius: 8px; }
              .error { color: red; margin: 20px; font-size: 16px; }
              .controls { margin-top: 20px; }
              button { padding: 8px 16px; margin: 0 8px; cursor: pointer; background: #1890ff; color: white; border: none; border-radius: 4px; }
              .info { margin-top: 20px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <img src="${imgSrc}" alt="${alt || '图像'}" onerror="handleImageError()" onload="handleImageLoad()" />
            <div id="error-message" class="error" style="display:none;">图像加载失败，请检查图像URL是否正确</div>
            <div class="controls">
              <button onclick="downloadImage()">下载图像</button>
              <button onclick="window.close()">关闭</button>
            </div>
            <div class="info">
              <p>图像URL: <span id="image-url">${imgSrc}</span></p>
              <button onclick="copyImageUrl()">复制图像URL</button>
            </div>
            <script>
              function handleImageError() {
                console.error('图片加载失败');
                document.getElementById('error-message').style.display = 'block';
              }
              
              function handleImageLoad() {
                console.log('图片成功加载');
                document.getElementById('error-message').style.display = 'none';
              }
            
              function downloadImage() {
                const link = document.createElement('a');
                link.href = "${imgSrc}";
                link.download = "image_${Date.now()}.png";
                link.click();
              }
              
              function copyImageUrl() {
                const url = document.getElementById('image-url').textContent;
                navigator.clipboard.writeText(url)
                  .then(() => alert('图像URL已复制到剪贴板'))
                  .catch(err => alert('复制失败: ' + err));
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '10px', border: '1px dashed #ff4d4f', borderRadius: '8px', margin: '10px 0' }}>
        <p style={{ color: '#ff4d4f' }}>图像加载失败</p>
        <Text code copyable>{imgSrc}</Text>
        <div style={{ marginTop: '10px' }}>
          <Button size="small" onClick={handleClick}>尝试在新窗口打开</Button>
        </div>
      </div>
    );
  }
  
  return (
    <img 
      src={imgSrc} 
      alt={alt || '生成的图像'} 
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onError={handleError}
      onLoad={handleLoad}
      title="点击查看大图，右键保存图像"
      className={styles.messageImage}
      {...props} 
    />
  );
};

// 添加调试信息的自定义链接组件
const CustomLink = (props: any) => {
  console.log("MarkdownLink组件接收到的props:", props);
  return (
    <a 
      href={props.href} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{color: '#1890ff', textDecoration: 'underline'}}
    >
      {props.children}
    </a>
  );
};

// 添加自定义组件映射
const markdownComponents = {
  img: MarkdownImage,
  a: CustomLink,
};

const AIAssistant: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<AIRole>('tutor');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: '数学题解答', date: '2024-03-18' },
    { id: '2', title: '英语学习计划', date: '2024-03-17' },
    { id: '3', title: '政治知识整理', date: '2024-03-16' },
  ]);

  // 图像生成相关状态
  const [imageForm] = Form.useForm();
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageParams, setImageParams] = useState<any>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');

  // 初始化对话
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const response = await aiApi.initializeChat(currentRole);
        if (response.code === 200) {
          setMessages([
            {
              role: 'assistant',
              content: response.data.content
            }
          ]);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.error('初始化对话失败:', error);
        message.error('初始化对话失败，请重试');
      }
      setLoading(false);
    };

    initialize();
  }, [currentRole]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: AIMessage = {
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await aiApi.sendQuestion(
        inputValue,
        currentRole,
        messages
      );

      if (response.code === 200) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.content
        }]);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('发送失败，请重试');
    }

    setLoading(false);
  };

  // 解题助手表单
  const [solverForm] = Form.useForm();
  const handleSolveProblem = async (values: any) => {
    setLoading(true);
    try {
      const response = await aiApi.solveProblem({
        subject: values.subject,
        question: values.question,
        image: values.image?.[0]?.originFileObj
      });

      if (response.code === 200) {
        setMessages([
          {
            role: 'user',
            content: `【${values.subject}】问题：${values.question}`
          },
          {
            role: 'assistant',
            content: response.data.content
          }
        ]);
        setActiveTab('chat');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('提交失败，请重试');
    }
    setLoading(false);
  };

  // 学习规划表单
  const [plannerForm] = Form.useForm();
  const handleCreatePlan = async (values: any) => {
    setLoading(true);
    try {
      const response = await aiApi.generateStudyPlan({
        targetSchool: values.targetSchool,
        targetMajor: values.targetMajor,
        currentLevel: values.currentLevel,
        availableTime: values.availableTime,
        startDate: values.startDate.format('YYYY-MM-DD'),
        examDate: values.examDate.format('YYYY-MM-DD')
      });

      if (response.code === 200) {
        setMessages([
          {
            role: 'user',
            content: '请帮我制定学习计划'
          },
          {
            role: 'assistant',
            content: response.data.content
          }
        ]);
        setActiveTab('chat');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('生成计划失败，请重试');
    }
    setLoading(false);
  };

  // 笔记整理表单
  const [notesForm] = Form.useForm();
  const handleOrganizeNotes = async (values: any) => {
    setLoading(true);
    try {
      const response = await aiApi.organizeNotes({
        content: values.content,
        subject: values.subject,
        format: values.format
      });

      if (response.code === 200) {
        setMessages([
          {
            role: 'user',
            content: `请帮我整理${values.subject}笔记`
          },
          {
            role: 'assistant',
            content: response.data.content
          }
        ]);
        setActiveTab('chat');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('整理笔记失败，请重试');
    }
    setLoading(false);
  };

  // 修改生成图像 - 优化逻辑
  const handleGenerateImage = async (values: any) => {
    setGeneratingImage(true);
    
    // 清理旧图像相关状态
    if (imageParams?.imageUrl) {
      try {
        // 释放之前的Blob URL以避免内存泄漏
        if (imageParams.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imageParams.imageUrl);
          console.log("已释放旧的Blob URL:", imageParams.imageUrl);
        }
      } catch (e) {
        console.warn('无法释放之前的Blob URL:', e);
      }
    }
    
    setGeneratedImage(null);
    setImageParams(null);
    setImageError(null);
    setOriginalPrompt(values.description);
    setEnhancedPrompt('');
    
    try {
      // 打开浏览器控制台
      console.log('开始生成图像，请查看控制台日志...');
      
      const response = await aiApi.generateImage({
        description: values.description,
        negativePrompt: values.negativePrompt,
        width: values.width,
        height: values.height,
        steps: values.steps,
        cfg_scale: values.cfg_scale,
        sampler_index: values.sampler_index,
        seed: values.seed === -1 ? -1 : Number(values.seed),
        enhance_prompt: values.enhance_prompt
      });
      
      console.log("图像生成成功，检查返回数据：", {
        hasImageBase64: !!response.imageBase64,
        imageBase64Length: response.imageBase64?.length || 0,
        hasImageUrl: !!response.imageUrl,
        parameters: response.parameters
      });
      
      // 设置图像和参数
      setGeneratedImage(response.imageBase64);
      setImageParams({
        ...response.parameters,
        imageUrl: response.imageUrl
      });
      setEnhancedPrompt(response.parameters.prompt);
      
      // 使用函数式更新，避免依赖于之前的状态
      const userMessage: AIMessage = {
        role: 'user',
        content: `请生成图像：${values.description}`
      };
      
      // 确保使用有效的图像URL
      const imgSrc = response.imageUrl || (response.imageBase64 ? `data:image/png;base64,${response.imageBase64}` : '');
      
      console.log("将在消息中使用的图像URL:", imgSrc);
      
      // 将图像参数记录到控制台但不显示在聊天中
      console.log("图像生成参数:", {
        prompt: response.parameters.prompt,
        negative_prompt: response.parameters.negative_prompt,
        dimensions: `${response.parameters.width}x${response.parameters.height}`,
        steps: response.parameters.steps,
        cfg_scale: response.parameters.cfg_scale,
        sampler: response.parameters.sampler_index,
        seed: response.parameters.seed
      });
      
      let assistantContent = '';
      
      if (imgSrc) {
        // 直接使用完整的URL字符串，不使用模板插值以确保URL完整性
        const imageMarkdown = `![生成的图像](${imgSrc})`;
        console.log("生成的图像Markdown:", imageMarkdown);
        
        // 只返回图像，不包含参数信息
        assistantContent = `${imageMarkdown}`;
      } else {
        assistantContent = `图像生成失败，没有获取到有效的图像数据。`;
      }
      
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: assistantContent
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage, assistantMessage]);
      
      // 在结果区域显示图像
      message.success('图像生成成功，已显示在聊天区域');
      
      // 自动切换到聊天标签页显示图像
      setActiveTab('chat');
      
    } catch (error) {
      console.error('生成图像失败:', error);
      
      // 处理CORS错误
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          setImageError(`CORS错误: 无法连接到Stable Diffusion API。请重启服务并添加参数 --api --cors-allow-origins=http://localhost:3000`);
        } else {
          setImageError(error.message);
        }
      } else {
        setImageError('未知错误');
      }
      
      message.error('生成图像失败，请检查控制台日志');
    } finally {
      setGeneratingImage(false);
    }
  };

  // 处理历史记录点击
  const handleHistoryClick = (id: string) => {
    // TODO: 加载历史对话
    message.info(`加载历史对话: ${id}`);
  };

  // 处理删除历史记录
  const handleDeleteHistory = (id: string) => {
    setChatHistory(chatHistory.filter(item => item.id !== id));
    message.success('删除成功');
  };

  // 处理新建对话
  const handleNewChat = () => {
    setMessages([]);
    setCurrentRole('tutor');
    message.success('已开启新对话');
  };

  // 修改"在新窗口查看图像"按钮代码（用于主界面的操作按钮）
  const handleViewInNewWindow = () => {
    if (!imageParams?.imageUrl && !generatedImage) return;
    
    // 创建一个新的标签页并显示图像
    const imgSrc = imageParams?.imageUrl || (generatedImage ? `data:image/png;base64,${generatedImage}` : '');
    
    if (!imgSrc) {
      message.error('没有可显示的图像');
      return;
    }
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>生成的图像</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; text-align: center; }
              img { max-width: 90%; max-height: 80vh; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              .controls { margin-top: 20px; }
              button { padding: 8px 16px; margin: 0 8px; cursor: pointer; background: #1890ff; color: white; border: none; border-radius: 4px; }
              .info { margin-top: 20px; font-size: 12px; color: #666; text-align: left; max-width: 800px; margin-left: auto; margin-right: auto; }
              .error { color: red; margin: 20px; font-size: 16px; }
            </style>
          </head>
          <body>
            <h2>生成的图像</h2>
            <div>
              <img src="${imgSrc}" alt="生成的图像" onerror="handleImageError()" onload="handleImageLoad()" />
              <div id="error-message" class="error" style="display:none;">图像加载失败，请检查图像URL是否正确</div>
            </div>
            <div class="controls">
              <button onclick="downloadImage()">下载图像</button>
              <button onclick="copyImageUrl()">复制图像URL</button>
              <button onclick="window.close()">关闭窗口</button>
            </div>
            <div class="info">
              <h3>图像信息</h3>
              <p>图像来源: ${imageParams?.imageUrl ? 'Blob URL' : 'Base64'}</p>
              <p>图像URL: <span id="image-url">${imgSrc}</span></p>
              <p>图像尺寸: ${imageParams?.width || '未知'}x${imageParams?.height || '未知'}</p>
              <p>提示词: ${imageParams?.prompt || '未知'}</p>
            </div>
            
            <script>
              function handleImageError() {
                console.error('图片加载失败');
                document.getElementById('error-message').style.display = 'block';
              }
              
              function handleImageLoad() {
                console.log('图片成功加载');
                document.getElementById('error-message').style.display = 'none';
              }
              
              function downloadImage() {
                const link = document.createElement('a');
                link.href = "${imgSrc}";
                link.download = "generated_image_${Date.now()}.png";
                link.click();
              }
              
              function copyImageUrl() {
                const url = document.getElementById('image-url').textContent;
                navigator.clipboard.writeText(url)
                  .then(() => alert('图像URL已复制到剪贴板'))
                  .catch(err => alert('复制失败: ' + err));
              }
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <MainLayout
      sidebarContent={
        <SidebarContent
          chatHistory={chatHistory}
          onHistoryClick={handleHistoryClick}
          onDeleteHistory={handleDeleteHistory}
          onNewChat={handleNewChat}
        />
      }
    >
      <div className={styles.container}>
        <Card className={styles.aiCard}>
          <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>AI学习助手</Title>
          <Tabs defaultActiveKey="chat" activeKey={activeTab} onChange={setActiveTab} size="large" className={styles.tabsContainer}>
            <TabPane 
              tab={<span><RobotOutlined />智能问答</span>}
              key="chat"
            >
              <div className={styles.chatContainer}>
                <div className={styles.messageList}>
                  {messages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`${styles.message} ${
                        msg.role === 'assistant' ? styles.assistant : styles.user
                      }`}
                    >
                  <div className={styles.messageContent}>
                        {msg.role === 'assistant' ? (
                          <div className={styles.markdown}>
                            <ReactMarkdown 
                              components={markdownComponents}
                              rehypePlugins={[rehypeRaw]}
                              urlTransform={(url: string) => url}
                            >
                              {msg.content}
                            </ReactMarkdown>
                </div>
              ) : (
                          <Paragraph>{msg.content}</Paragraph>
                        )}
                      </div>
            </div>
          ))}
                  <div ref={messagesEndRef} />
        </div>
        
                <Divider style={{ margin: '0 0 16px 0' }} />

                <div className={styles.inputArea}>
                  <Select
                    value={currentRole}
                    onChange={setCurrentRole}
                    className={styles.roleSelect}
                  >
                    <Option value="tutor">辅导专家</Option>
                    <Option value="solver">解题专家</Option>
                    <Option value="planner">规划专家</Option>
                    <Option value="assistant">学习助手</Option>
                  </Select>
            <TextArea
              value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="请输入你的问题..."
              autoSize={{ minRows: 2, maxRows: 6 }}
                    onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                        handleSend();
                }
              }}
            />
              <Button 
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    loading={loading}
                  >
                    发送
                  </Button>
                </div>
              </div>
            </TabPane>

            <TabPane
              tab={<span><QuestionCircleOutlined />解题助手</span>}
              key="solver"
            >
              <Form
                form={solverForm}
                layout="vertical"
                onFinish={handleSolveProblem}
                className={styles.formContainer}
              >
                <Form.Item
                  name="subject"
                  label="科目"
                  rules={[{ required: true, message: '请选择科目' }]}
                >
                  <Select placeholder="请选择科目">
                    <Option value="数学">数学</Option>
                    <Option value="英语">英语</Option>
                    <Option value="政治">政治</Option>
                    <Option value="专业课">专业课</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="question"
                  label="题目内容"
                  rules={[{ required: true, message: '请输入题目内容' }]}
                >
                  <TextArea
                    placeholder="请输入题目内容..."
                    autoSize={{ minRows: 4, maxRows: 8 }}
                  />
                </Form.Item>

                <Form.Item
                  name="image"
                  label="题目图片（选填）"
                >
                  <Upload
                    maxCount={1}
                    beforeUpload={() => false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    提交题目
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane
              tab={<span><CalendarOutlined />学习规划</span>}
              key="planner"
            >
              <Form
                form={plannerForm}
                layout="vertical"
                onFinish={handleCreatePlan}
                className={styles.formContainer}
              >
                <Form.Item
                  name="targetSchool"
                  label="目标院校"
                  rules={[{ required: true, message: '请输入目标院校' }]}
                >
                  <Input placeholder="请输入目标院校" />
                </Form.Item>

                <Form.Item
                  name="targetMajor"
                  label="目标专业"
                  rules={[{ required: true, message: '请输入目标专业' }]}
                >
                  <Input placeholder="请输入目标专业" />
                </Form.Item>

                <Form.Item
                  name="currentLevel"
                  label="当前学历"
                  rules={[{ required: true, message: '请选择当前学历' }]}
                >
                  <Select placeholder="请选择当前学历">
                    <Option value="本科">本科</Option>
                    <Option value="专科">专科</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="availableTime"
                  label="每日可用学习时间（小时）"
                  rules={[{ required: true, message: '请输入可用时间' }]}
                >
                  <InputNumber min={1} max={24} />
                </Form.Item>

                <Form.Item
                  name="startDate"
                  label="开始时间"
                  rules={[{ required: true, message: '请选择开始时间' }]}
                >
                  <DatePicker />
                </Form.Item>

                <Form.Item
                  name="examDate"
                  label="考试时间"
                  rules={[{ required: true, message: '请选择考试时间' }]}
                >
                  <DatePicker />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    生成计划
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane
              tab={<span><FileTextOutlined />笔记整理</span>}
              key="notes"
            >
              <Form
                form={notesForm}
                layout="vertical"
                onFinish={handleOrganizeNotes}
                className={styles.formContainer}
              >
                <Form.Item
                  name="subject"
                  label="科目"
                  rules={[{ required: true, message: '请选择科目' }]}
                >
                  <Select placeholder="请选择科目">
                    <Option value="数学">数学</Option>
                    <Option value="英语">英语</Option>
                    <Option value="政治">政治</Option>
                    <Option value="专业课">专业课</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="content"
                  label="笔记内容"
                  rules={[{ required: true, message: '请输入笔记内容' }]}
                >
                  <TextArea
                    placeholder="请输入需要整理的笔记内容..."
                    autoSize={{ minRows: 6, maxRows: 12 }}
                  />
                </Form.Item>

                <Form.Item
                  name="format"
                  label="整理格式"
                  rules={[{ required: true, message: '请选择整理格式' }]}
                >
                  <Select placeholder="请选择整理格式">
                    <Option value="markdown">Markdown格式</Option>
                    <Option value="outline">大纲格式</Option>
                    <Option value="mindmap">思维导图格式</Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    开始整理
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            {/* 文生图 - 简化UI，移除服务检测逻辑 */}
            <TabPane
              tab={<span><PictureOutlined />文生图</span>}
              key="image"
            >
              <div className={styles.formContainer}>
                {imageError && (
                  <Alert
                    message="生成图像失败"
                    description={
                      <div>
                        <p>{imageError}</p>
                        <p>建议操作：</p>
                        <ol>
                          <li>确保Stable Diffusion WebUI已启动并使用参数: <code>--api --cors-allow-origins=http://localhost:3000</code></li>
                          <li>检查浏览器控制台查看详细错误信息</li>
                          <li>尝试点击下方的"快速测试"按钮进行简单测试</li>
                          <li>尝试使用较小的图像尺寸 (512x512) 和较低的步数 (30)</li>
                        </ol>
                      </div>
                    }
                    type="error"
                    showIcon
                    style={{ marginBottom: '20px' }}
                  />
                )}
                
                {generatedImage && (
                  <Alert
                    message="图像生成成功"
                    description={
                      <div>
                        <p>图像已生成成功，但图像不会自动保存到本地文件系统中。如需保存，请使用下方的"下载图像"按钮。</p>
                        {imageParams?.imageUrl && (
                          <p>当前Blob URL: <Text code copyable>{imageParams.imageUrl}</Text></p>
                        )}
                      </div>
                    }
                    type="success"
                    showIcon
                    style={{ marginBottom: '20px' }}
                  />
                )}
                
                <div style={{ marginBottom: '20px' }}>
              <Button 
                    type="default" 
                icon={<PictureOutlined />} 
                    onClick={() => {
                      // 直接尝试生成简单的测试图像
                      const testValues = {
                        description: "一只可爱的猫",
                        negativePrompt: "",
                        steps: 30,
                        width: 512,
                        height: 512,
                        sampler_index: "Euler",
                        cfg_scale: 7.0,
                        seed: -1,
                        enhance_prompt: false
                      };
                      
                      // 正确设置表单字段值
                      imageForm.setFieldsValue(testValues);
                      handleGenerateImage(testValues);
                    }}
                  >
                    快速测试（生成猫图像）
                  </Button>
                  <Text type="secondary" style={{ marginLeft: '10px' }}>
                    点击此按钮直接测试API是否可用
                  </Text>
                </div>
                
                <Form
                  form={imageForm}
                  layout="vertical"
                  onFinish={handleGenerateImage}
                  initialValues={{
                    width: 512,
                    height: 512,
                    steps: 50,
                    cfg_scale: 7.0,
                    sampler_index: "Euler",
                    seed: -1,
                    enhance_prompt: true
                  }}
                >
                  <Form.Item
                    name="description"
                    label="图像描述"
                    rules={[{ required: true, message: '请输入图像描述' }]}
                  >
                    <TextArea
                      placeholder="请描述您想要生成的图像内容..."
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="enhance_prompt"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="启用提示词增强" unCheckedChildren="关闭提示词增强" />
                  </Form.Item>
                  
                  <Form.Item
                    name="negativePrompt"
                    label="反向提示词"
                  >
                    <TextArea
                      placeholder="描述您不希望出现在图像中的内容..."
                      autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                  </Form.Item>
                  
                  <Divider orientation="left">高级设置</Divider>
                  
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Form.Item
                      name="width"
                      label="宽度"
                      style={{ minWidth: '120px' }}
                    >
                      <Select>
                        <Option value={512}>512</Option>
                        <Option value={768}>768</Option>
                        <Option value={1024}>1024</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      name="height"
                      label="高度"
                      style={{ minWidth: '120px' }}
                    >
                      <Select>
                        <Option value={512}>512</Option>
                        <Option value={768}>768</Option>
                        <Option value={1024}>1024</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      name="steps"
                      label="步数"
                      style={{ minWidth: '120px' }}
                    >
                      <InputNumber min={10} max={100} />
                    </Form.Item>
                    
                    <Form.Item
                      name="cfg_scale"
                      label="CFG Scale"
                      style={{ minWidth: '120px' }}
                    >
                      <InputNumber min={1} max={30} step={0.5} />
                    </Form.Item>
                    
                    <Form.Item
                      name="sampler_index"
                      label="采样器"
                      style={{ minWidth: '200px' }}
                    >
                      <Select>
                        <Option value="Euler">Euler</Option>
                        <Option value="Euler a">Euler a</Option>
                        <Option value="LMS">LMS</Option>
                        <Option value="Heun">Heun</Option>
                        <Option value="DPM2">DPM2</Option>
                        <Option value="DPM++ 2M">DPM++ 2M</Option>
                        <Option value="DPM++ SDE">DPM++ SDE</Option>
                        <Option value="DPM++ 2M Karras">DPM++ 2M Karras</Option>
                        <Option value="DDIM">DDIM</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      name="seed"
                      label="种子"
                      style={{ minWidth: '180px' }}
                    >
                      <Input placeholder="-1为随机种子" />
                    </Form.Item>
            </div>
                  
                  <Form.Item>
          <Button 
            type="primary" 
                      htmlType="submit" 
                      loading={generatingImage} 
                      icon={<PictureOutlined />} 
                      size="large"
                    >
                      生成图像
                    </Button>
                  </Form.Item>
                </Form>
                
                {generatingImage && (
                  <div className={styles.generatingStatus}>
                    <Spin size="large" />
                    <div style={{ marginTop: '10px' }}>正在生成图像，请稍候...</div>
                  </div>
                )}
                
                {generatedImage && (
                  <div className={styles.generatedImageContainer}>
                    <Divider orientation="left">生成结果</Divider>
                    <div className={styles.generatedImage}>
                      <ImageDisplay 
                        imageBase64={generatedImage}
                        imageUrl={imageParams?.imageUrl || null}
          />
        </div>
                    <div className={styles.imageInfo}>
                      <Title level={5}>图像参数</Title>
                      
                      {originalPrompt !== enhancedPrompt && (
                        <div style={{ marginBottom: '16px' }}>
                          <Alert
                            message="提示词优化"
                            description={
                              <div>
                                <p><strong>原始描述:</strong></p>
                                <Paragraph copyable ellipsis={{ rows: 2, expandable: true }}>{originalPrompt}</Paragraph>
                                <p><strong>优化后的提示词:</strong></p>
                                <Paragraph copyable ellipsis={{ rows: 3, expandable: true }}>{enhancedPrompt}</Paragraph>
                                <p><Text type="secondary">*查看浏览器控制台获取更多日志信息</Text></p>
        </div>
                            }
                            type="info"
                            showIcon
                          />
                        </div>
                      )}
                      
                      <p>提示词: <Text copyable>{imageParams?.prompt}</Text></p>
                      <p>反向提示词: <Text copyable>{imageParams?.negative_prompt}</Text></p>
                      <p>尺寸: {imageParams?.width}x{imageParams?.height}</p>
                      <p>步数: {imageParams?.steps}</p>
                      <p>CFG Scale: {imageParams?.cfg_scale}</p>
                      <p>采样器: {imageParams?.sampler_index}</p>
                      <p>种子: {imageParams?.seed}</p>
                      
                      <Button 
                        type="link" 
                        onClick={() => {
                          console.log('===== 完整参数 =====');
                          console.log(JSON.stringify(imageParams, null, 2));
                        }}
                      >
                        在控制台打印完整参数
                      </Button>
                      
                      <Button 
                        type="link" 
                        onClick={() => {
                          console.log('===== 图像数据 =====');
                          console.log('数据长度:', generatedImage?.length);
                          console.log('数据前50个字符:', generatedImage?.substring(0, 50));
                          // 检查是否为有效的Base64格式
                          const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(generatedImage || '');
                          console.log('是否为有效的Base64格式:', isValidBase64);
                        }}
                      >
                        检查图像数据
                      </Button>
                      
                      <Button 
                        type="link" 
                        onClick={handleViewInNewWindow}
                      >
                        在新窗口查看图像
                      </Button>
                      
                      <br />
                      <Divider plain>常见问题</Divider>
                      <div style={{ textAlign: "left" }}>
                        <Paragraph>
                          <Text strong>1. 为什么没有在 /images 目录下找到生成的图像?</Text>
                          <br />
                          浏览器环境不能直接写入文件系统。生成的图像是以Blob URL形式存在于内存中，在页面关闭后会被清理。如需保存，请使用"下载图像"按钮。
                        </Paragraph>
                        <Paragraph>
                          <Text strong>2. 生成的图像只显示alt文本而看不到图像?</Text>
                          <br />
                          可能是Blob URL访问问题，请尝试"使用Base64显示"按钮或"在新窗口查看图像"按钮。
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AIAssistant; 