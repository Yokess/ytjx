import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Select, Tag, Form, message, Card, Upload, Divider } from 'antd';
import type { InputRef } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, LoadingOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { getSections, createPost } from '../../api/communityApi';
import styles from './PostDetail.module.scss';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [sections, setSections] = useState<{ name: string; color: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = React.useRef<InputRef>(null);
  
  // 获取板块数据
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await getSections();
        setSections(res.data.map(section => ({
          name: section.name,
          color: section.color
        })));
      } catch (error) {
        console.error('获取板块数据失败', error);
        message.error('获取板块数据失败，请稍后重试');
      }
    };
    
    fetchSections();
  }, []);
  
  // 处理表单提交
  const handleSubmit = async (values: any) => {
    if (tags.length === 0) {
      message.error('请至少添加一个标签');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 准备提交数据
      const postData = {
        title: values.title,
        content: values.content,
        section: values.section,
        tags
      };
      
      // 提交创建请求
      const res = await createPost(postData);
      
      message.success('发布成功！');
      // 跳转到帖子详情页
      navigate(`/community/post/${res.data.id}`);
    } catch (error) {
      console.error('发布失败', error);
      message.error('发布失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 处理添加标签
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  
  // 显示标签输入框
  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  // 删除标签
  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };
  
  // 处理取消
  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      // 有修改，提示用户确认
      if (window.confirm('确定要放弃编辑吗？所有修改将丢失。')) {
        navigate('/community');
      }
    } else {
      navigate('/community');
    }
  };
  
  return (
    <MainLayout>
      <div className={styles.container}>
        <Card className={styles.createPostCard}>
          <div className={styles.pageHeader}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleCancel}
              className={styles.backButton}
            >
              返回社区
            </Button>
            <Title level={2}>发布帖子</Title>
          </div>
          
          <Divider />
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.createPostForm}
            initialValues={{ section: sections[0]?.name }}
          >
            {/* 标题 */}
            <Form.Item
              name="title"
              label="标题"
              rules={[
                { required: true, message: '请输入帖子标题' },
                { max: 50, message: '标题最多50个字符' }
              ]}
            >
              <Input placeholder="请输入帖子标题（5-50个字符）" maxLength={50} showCount />
            </Form.Item>
            
            {/* 所属板块 */}
            <Form.Item
              name="section"
              label="所属板块"
              rules={[{ required: true, message: '请选择所属板块' }]}
            >
              <Select placeholder="请选择所属板块">
                {sections.map((section, index) => (
                  <Option key={index} value={section.name}>
                    <Tag color={section.color}>{section.name}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            {/* 标签 */}
            <Form.Item label="标签">
              <div className={styles.tagsContainer}>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    color="#4f46e5"
                    onClose={() => handleTagClose(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
                
                {inputVisible ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    className={styles.tagInput}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                    maxLength={10}
                  />
                ) : (
                  <Tag 
                    className={styles.addTagBtn} 
                    onClick={showInput}
                  >
                    <PlusOutlined /> 添加标签
                  </Tag>
                )}
              </div>
              <div className={styles.tagsHint}>
                添加2-5个标签，每个标签不超过10个字符，用于更好地分类和被搜索到
              </div>
            </Form.Item>
            
            {/* 内容 */}
            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入帖子内容' }]}
            >
              <TextArea 
                placeholder="请输入帖子内容..." 
                autoSize={{ minRows: 10, maxRows: 20 }}
                maxLength={20000}
                showCount
              />
            </Form.Item>
            
            {/* 上传 */}
            <Form.Item label="附件">
              <Upload.Dragger
                name="files"
                action="/upload"
                multiple
                showUploadList
                beforeUpload={() => {
                  message.info('暂不支持附件上传');
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">支持单个或批量上传，每个文件不超过10MB</p>
              </Upload.Dragger>
            </Form.Item>
            
            {/* 提交按钮 */}
            <Form.Item className={styles.submitActions}>
              <Button onClick={handleCancel}>取消</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                disabled={tags.length === 0}
              >
                发布帖子
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreatePostPage; 