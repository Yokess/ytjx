import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Form,
  Select,
  Row,
  Col,
  Tooltip,
  message,
  Modal,
  Popconfirm,
  Badge,
  Switch,
  Divider,
  Image
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  CommentOutlined,
  DollarOutlined,
  SwapOutlined
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface CourseType {
  id: number;
  title: string;
  coverImg: string;
  teacherName: string;
  category: string;
  price: number;
  studentCount: number;
  lessonCount: number;
  status: number; // 0: 草稿, 1: 上架, 2: 下架
  createTime: string;
  updateTime: string;
  featured: boolean;
  rating: number;
  commentCount: number;
}

// 模拟课程数据
const mockCourses: CourseType[] = Array.from({ length: 50 }).map((_, index) => ({
  id: index + 1,
  title: `考研课程${index + 1}: ${['政治', '英语', '数学', '专业课', '复试技巧'][index % 5]}${['基础', '强化', '冲刺', '模拟', '实战'][Math.floor(Math.random() * 5)]}`,
  coverImg: `https://api.ytjx.com/static/courses/cover${(index % 10) + 1}.jpg`,
  teacherName: `讲师${(index % 8) + 1}`,
  category: ['政治', '英语', '数学', '专业课', '复试技巧'][index % 5],
  price: Math.floor(Math.random() * 5) * 100 + 99,
  studentCount: Math.floor(Math.random() * 1000),
  lessonCount: Math.floor(Math.random() * 20) + 5,
  status: [0, 1, 1, 1, 2][Math.floor(Math.random() * 5)],
  createTime: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  updateTime: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  featured: Math.random() > 0.7,
  rating: Math.floor(Math.random() * 5) + 3 + Math.random(),
  commentCount: Math.floor(Math.random() * 100),
}));

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // 添加以下状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchCourses();
  }, [pagination.current, pagination.pageSize]);

  // 模拟获取课程数据
  const fetchCourses = async () => {
    setLoading(true);
    // 模拟 API 请求延迟
    setTimeout(() => {
      const { current, pageSize } = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      const filteredCourses = [...mockCourses];
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
      
      setCourses(paginatedCourses);
      setPagination({
        ...pagination,
        total: filteredCourses.length,
      });
      setLoading(false);
    }, 500);
  };

  // 搜索课程
  const handleSearch = (values: any) => {
    setLoading(true);
    console.log('Search values:', values);
    
    // 在真实环境中这里应该调用 API 进行搜索
    setTimeout(() => {
      let filteredCourses = [...mockCourses];
      
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(keyword) || 
          course.teacherName.toLowerCase().includes(keyword)
        );
      }
      
      if (values.category) {
        filteredCourses = filteredCourses.filter(course => course.category === values.category);
      }
      
      if (values.status !== undefined) {
        filteredCourses = filteredCourses.filter(course => course.status === values.status);
      }
      
      if (values.featured !== undefined) {
        filteredCourses = filteredCourses.filter(course => course.featured === values.featured);
      }
      
      const { current, pageSize } = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
      
      setCourses(paginatedCourses);
      setPagination({
        ...pagination,
        current: 1,
        total: filteredCourses.length,
      });
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    fetchCourses();
  };

  // 处理表格分页
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // 处理删除课程
  const handleDelete = (id: number) => {
    // 模拟 API 请求
    setTimeout(() => {
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
      message.success('课程已删除');
    }, 500);
  };

  // 批量删除课程
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除课程',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个课程吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // 模拟 API 请求
        setTimeout(() => {
          setCourses(prevCourses => 
            prevCourses.filter(course => !selectedRowKeys.includes(course.id))
          );
          setSelectedRowKeys([]);
          message.success(`已删除 ${selectedRowKeys.length} 个课程`);
        }, 1000);
      },
    });
  };

  // 切换课程状态
  const handleToggleStatus = (id: number, status: number) => {
    const newStatus = status === 1 ? 2 : 1; // 切换上下架状态
    
    // 模拟 API 请求
    setTimeout(() => {
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === id ? { ...course, status: newStatus } : course
        )
      );
      message.success(`课程已${newStatus === 1 ? '上架' : '下架'}`);
    }, 500);
  };

  // 设置精选状态
  const handleToggleFeatured = (id: number, featured: boolean) => {
    // 模拟 API 请求
    setTimeout(() => {
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === id ? { ...course, featured: !featured } : course
        )
      );
      message.success(`课程已${!featured ? '设为' : '取消'}精选`);
    }, 500);
  };

  // 打开编辑课程模态框
  const handleEditCourse = (course: CourseType) => {
    setCurrentCourse(course);
    editForm.setFieldsValue({
      title: course.title,
      category: course.category,
      teacherName: course.teacherName,
      price: course.price,
      lessonCount: course.lessonCount,
      featured: course.featured,
      status: course.status,
      description: '这是一个示例课程描述，实际项目中应从服务器获取。'
    });
    setEditModalVisible(true);
  };

  // 查看课程详情
  const handleViewCourse = (course: CourseType) => {
    setCurrentCourse(course);
    setViewModalVisible(true);
  };

  // 保存编辑的课程
  const handleSaveCourse = () => {
    editForm.validateFields().then(values => {
      if (currentCourse) {
        // 编辑现有课程
        const updatedCourse = {
          ...currentCourse,
          ...values,
          updateTime: new Date().toLocaleString()
        };
        
        // 模拟 API 请求
        setTimeout(() => {
          setCourses(prevCourses =>
            prevCourses.map(course =>
              course.id === currentCourse.id ? updatedCourse : course
            )
          );
          message.success('课程已更新');
          setEditModalVisible(false);
        }, 500);
      } else {
        // 创建新课程
        const newCourse: CourseType = {
          id: Math.max(...courses.map(c => c.id), 0) + 1,
          ...values,
          coverImg: `https://api.ytjx.com/static/courses/cover${Math.floor(Math.random() * 10) + 1}.jpg`,
          studentCount: 0,
          commentCount: 0,
          rating: 5.0,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        };
        
        // 模拟 API 请求
        setTimeout(() => {
          setCourses(prevCourses => [newCourse, ...prevCourses]);
          message.success('课程已创建');
          setEditModalVisible(false);
        }, 500);
      }
    });
  };

  // 表格列定义
  const columns: ColumnsType<CourseType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '课程封面',
      dataIndex: 'coverImg',
      key: 'coverImg',
      width: 80,
      render: (coverImg) => (
        <Image
          src={coverImg}
          alt="课程封面"
          width={60}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '讲师',
      dataIndex: 'teacherName',
      key: 'teacherName',
      width: 100,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
    {
      title: '学生数',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 100,
    },
    {
      title: '课时数',
      dataIndex: 'lessonCount',
      key: 'lessonCount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : status === 2 ? 'error' : 'default'}>
          {status === 1 ? '已上架' : status === 2 ? '已下架' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
    {
      title: '精选',
      dataIndex: 'featured',
      key: 'featured',
      width: 100,
      render: (featured, record) => (
        <Switch
          checked={featured}
          onChange={() => handleToggleFeatured(record.id, featured)}
        />
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => handleEditCourse(record)}
          >
            编辑
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            size="small"
            onClick={() => handleViewCourse(record)}
          >
            查看
          </Button>
          <Button
            icon={<SwapOutlined />}
            type={record.status === 1 ? "primary" : "default"}
            size="small"
            onClick={() => handleToggleStatus(record.id, record.status)}
          >
            {record.status === 1 ? "下架" : "上架"}
          </Button>
        </Space>
      ),
    },
  ];

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <AdminLayout>
      <Card
        title="课程管理"
        extra={
          <Space>
            <Button 
              icon={<PlusOutlined />} 
              type="primary"
              onClick={() => {
                setCurrentCourse(null);
                editForm.resetFields();
                editForm.setFieldsValue({
                  status: 0, // 默认草稿状态
                  featured: false
                });
                setEditModalVisible(true);
              }}
            >
              添加课程
            </Button>
            <Button icon={<TeamOutlined />}>讲师管理</Button>
            <Button icon={<CommentOutlined />}>评论管理</Button>
            <Button icon={<DollarOutlined />}>价格调整</Button>
          </Space>
        }
      >
        {/* 搜索表单 */}
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="keyword">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="课程名称/讲师名称"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="category">
                <Select placeholder="选择分类" allowClear>
                  <Option value="政治">政治</Option>
                  <Option value="英语">英语</Option>
                  <Option value="数学">数学</Option>
                  <Option value="专业课">专业课</Option>
                  <Option value="复试技巧">复试技巧</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status">
                <Select placeholder="选择状态" allowClear>
                  <Option value={0}>草稿</Option>
                  <Option value={1}>已上架</Option>
                  <Option value={2}>已下架</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="featured" valuePropName="checked">
                <Switch checkedChildren="精选" unCheckedChildren="全部" />
              </Form.Item>
            </Col>
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  {selectedRowKeys.length > 0 && (
                    <Button danger onClick={handleBatchDelete}>
                      批量删除 ({selectedRowKeys.length})
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 课程列表表格 */}
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 编辑课程模态框 */}
      <Modal
        title="编辑课程"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveCourse}
        width={700}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="课程名称"
                rules={[{ required: true, message: '请输入课程名称' }]}
              >
                <Input placeholder="请输入课程名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="课程分类"
                rules={[{ required: true, message: '请选择课程分类' }]}
              >
                <Select placeholder="请选择课程分类">
                  <Option value="政治">政治</Option>
                  <Option value="英语">英语</Option>
                  <Option value="数学">数学</Option>
                  <Option value="专业课">专业课</Option>
                  <Option value="复试技巧">复试技巧</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacherName"
                label="讲师"
                rules={[{ required: true, message: '请输入讲师姓名' }]}
              >
                <Input placeholder="请输入讲师姓名" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="price"
                label="价格"
                rules={[{ required: true, message: '请输入课程价格' }]}
              >
                <Input type="number" addonBefore="¥" placeholder="价格" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="lessonCount"
                label="课时数"
                rules={[{ required: true, message: '请输入课时数' }]}
              >
                <Input type="number" placeholder="课时数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择课程状态' }]}
              >
                <Select placeholder="请选择课程状态">
                  <Option value={0}>草稿</Option>
                  <Option value={1}>上架</Option>
                  <Option value={2}>下架</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="featured"
                label="精选课程"
                valuePropName="checked"
              >
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="课程描述"
            rules={[{ required: true, message: '请输入课程描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入课程描述" />
          </Form.Item>
          <Form.Item label="课程封面">
            <Space>
              {currentCourse?.coverImg && (
                <Image
                  src={currentCourse.coverImg}
                  width={100}
                  height={60}
                  style={{ objectFit: 'cover' }}
                />
              )}
              <Button icon={<UploadOutlined />}>更换封面</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看课程详情模态框 */}
      <Modal
        title="课程详情"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentCourse && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Image
                  src={currentCourse.coverImg}
                  alt={currentCourse.title}
                  style={{ width: '100%', borderRadius: 4 }}
                />
              </Col>
              <Col span={16}>
                <h2>{currentCourse.title}</h2>
                <p>
                  <Tag color="blue">{currentCourse.category}</Tag>
                  <Tag color={currentCourse.status === 1 ? 'success' : currentCourse.status === 2 ? 'error' : 'default'}>
                    {currentCourse.status === 1 ? '已上架' : currentCourse.status === 2 ? '已下架' : '草稿'}
                  </Tag>
                  {currentCourse.featured && <Tag color="gold">精选</Tag>}
                </p>
                <div>
                  <p><strong>讲师：</strong>{currentCourse.teacherName}</p>
                  <p><strong>价格：</strong>¥{currentCourse.price}</p>
                  <p><strong>学生数：</strong>{currentCourse.studentCount}</p>
                  <p><strong>课时数：</strong>{currentCourse.lessonCount}</p>
                  <p><strong>评分：</strong>{currentCourse.rating.toFixed(1)}</p>
                  <p><strong>评论数：</strong>{currentCourse.commentCount}</p>
                  <p><strong>创建时间：</strong>{currentCourse.createTime}</p>
                  <p><strong>更新时间：</strong>{currentCourse.updateTime}</p>
                </div>
              </Col>
            </Row>
            <Divider />
            <div>
              <h3>课程描述</h3>
              <p>这是一个示例课程描述，实际项目中应从服务器获取。</p>
            </div>
            <Divider />
            <div>
              <h3>课程大纲</h3>
              <p>实际项目中应从服务器获取课程大纲数据。</p>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default CoursesList;
 