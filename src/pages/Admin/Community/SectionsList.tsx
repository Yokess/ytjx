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
  Modal,
  message,
  Popconfirm,
  Switch,
  Tooltip,
  Badge,
  TablePaginationConfig
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  OrderedListOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

// 定义板块类型
interface SectionType {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
  status: number;  // 0: 禁用, 1: 启用
  postCount: number;
  createdTime: string;
  updatedTime: string;
}

// 模拟板块数据
const mockSections: SectionType[] = [
  {
    id: 1,
    name: '考研经验交流',
    description: '分享考研经验，交流备考心得',
    icon: 'team',
    order: 1,
    status: 1,
    postCount: 1258,
    createdTime: '2023-01-01 10:00:00',
    updatedTime: '2023-03-15 16:30:00'
  },
  {
    id: 2,
    name: '考研资料分享',
    description: '分享各类考研资料，包括电子书、真题等',
    icon: 'file-pdf',
    order: 2,
    status: 1,
    postCount: 952,
    createdTime: '2023-01-02 11:00:00',
    updatedTime: '2023-04-10 09:15:00'
  },
  {
    id: 3,
    name: '院校信息讨论',
    description: '讨论各院校招生信息、录取情况等',
    icon: 'bank',
    order: 3,
    status: 1,
    postCount: 687,
    createdTime: '2023-01-03 14:30:00',
    updatedTime: '2023-02-28 11:45:00'
  },
  {
    id: 4,
    name: '考研政治',
    description: '考研政治学科交流讨论',
    icon: 'read',
    order: 4,
    status: 1,
    postCount: 523,
    createdTime: '2023-01-05 09:00:00',
    updatedTime: '2023-05-12 14:20:00'
  },
  {
    id: 5,
    name: '考研英语',
    description: '考研英语学科交流讨论',
    icon: 'global',
    order: 5,
    status: 1,
    postCount: 731,
    createdTime: '2023-01-06 16:45:00',
    updatedTime: '2023-06-01 10:30:00'
  },
  {
    id: 6,
    name: '考研数学',
    description: '考研数学学科交流讨论',
    icon: 'calculator',
    order: 6,
    status: 1,
    postCount: 489,
    createdTime: '2023-01-07 13:15:00',
    updatedTime: '2023-04-20 15:40:00'
  },
  {
    id: 7,
    name: '专业课交流',
    description: '各专业课程交流讨论',
    icon: 'experiment',
    order: 7,
    status: 1,
    postCount: 612,
    createdTime: '2023-01-08 10:20:00',
    updatedTime: '2023-03-25 11:10:00'
  },
  {
    id: 8,
    name: '跨专业考研',
    description: '跨专业考研经验分享与交流',
    icon: 'sync',
    order: 8,
    status: 1,
    postCount: 346,
    createdTime: '2023-01-10 11:30:00',
    updatedTime: '2023-05-05 09:45:00'
  },
  {
    id: 9,
    name: '调剂信息',
    description: '考研调剂信息分享与讨论',
    icon: 'swap',
    order: 9,
    status: 1,
    postCount: 278,
    createdTime: '2023-01-12 14:00:00',
    updatedTime: '2023-06-10 16:50:00'
  },
  {
    id: 10,
    name: '心理健康',
    description: '考研心理调适与压力缓解',
    icon: 'heart',
    order: 10,
    status: 0,
    postCount: 197,
    createdTime: '2023-01-15 09:30:00',
    updatedTime: '2023-04-30 13:25:00'
  }
];

const SectionsList: React.FC = () => {
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionType | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  // 获取板块列表
  const fetchSections = async () => {
    setLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      setSections(mockSections);
      setPagination({
        ...pagination,
        total: mockSections.length,
      });
      setLoading(false);
    }, 500);
  };

  // 搜索板块
  const handleSearch = (values: any) => {
    setLoading(true);
    // 在真实环境中这里应该调用 API 进行搜索
    setTimeout(() => {
      let filteredSections = [...mockSections];
      
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filteredSections = filteredSections.filter(section => 
          section.name.toLowerCase().includes(keyword) || 
          section.description.toLowerCase().includes(keyword)
        );
      }
      
      if (values.status !== undefined) {
        filteredSections = filteredSections.filter(section => section.status === values.status);
      }
      
      setSections(filteredSections);
      setPagination({
        ...pagination,
        current: 1,
        total: filteredSections.length,
      });
      setLoading(false);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    fetchSections();
  };

  // 添加/编辑板块
  const handleAddOrEditSection = () => {
    form.validateFields().then(values => {
      // 模拟 API 请求
      const formData = {
        ...values,
        status: values.status ? 1 : 0
      };
      
      setTimeout(() => {
        if (editingSection) {
          // 编辑现有板块
          const updatedSection = {
            ...editingSection,
            ...formData,
            updatedTime: new Date().toLocaleString()
          };
          
          setSections(prevSections => 
            prevSections.map(section => 
              section.id === editingSection.id ? updatedSection : section
            )
          );
          message.success('板块已更新');
        } else {
          // 添加新板块
          const newSection: SectionType = {
            id: Math.max(...sections.map(s => s.id)) + 1,
            ...formData,
            postCount: 0,
            createdTime: new Date().toLocaleString(),
            updatedTime: new Date().toLocaleString()
          };
          
          setSections(prevSections => [...prevSections, newSection]);
          message.success('板块已创建');
        }
        
        setSectionModalVisible(false);
        setEditingSection(null);
        form.resetFields();
      }, 500);
    });
  };

  // 删除板块
  const handleDeleteSection = (id: number) => {
    const section = sections.find(s => s.id === id);
    if (section && section.postCount > 0) {
      Modal.confirm({
        title: '删除确认',
        content: `该板块包含 ${section.postCount} 个帖子，删除后所有帖子将被移至回收站，是否继续？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteSection(id);
        }
      });
    } else {
      deleteSection(id);
    }
  };

  // 执行删除
  const deleteSection = (id: number) => {
    // 模拟 API 请求
    setTimeout(() => {
      setSections(prevSections => prevSections.filter(section => section.id !== id));
      message.success('板块已删除');
    }, 500);
  };

  // 切换板块状态
  const handleToggleStatus = (id: number, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    
    // 模拟 API 请求
    setTimeout(() => {
      setSections(prevSections => 
        prevSections.map(section => 
          section.id === id ? { ...section, status: newStatus, updatedTime: new Date().toLocaleString() } : section
        )
      );
      message.success(`板块已${newStatus === 1 ? '启用' : '禁用'}`);
    }, 500);
  };

  // 移动板块顺序
  const handleMoveSection = (id: number, direction: 'up' | 'down') => {
    const index = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // 交换顺序号
    const orderTemp = newSections[index].order;
    newSections[index].order = newSections[targetIndex].order;
    newSections[targetIndex].order = orderTemp;
    
    // 交换位置
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    setSections(newSections);
    message.success('板块顺序已调整');
  };

  // 编辑板块
  const handleEditSection = (section: SectionType) => {
    setEditingSection(section);
    form.setFieldsValue({
      name: section.name,
      description: section.description,
      icon: section.icon,
      order: section.order,
      status: section.status === 1
    });
    setSectionModalVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<SectionType> = [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: '板块名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.status === 1 ? (
            <Badge status="success" />
          ) : (
            <Badge status="error" />
          )}
          {text}
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '帖子数',
      dataIndex: 'postCount',
      key: 'postCount',
      sorter: (a, b) => a.postCount - b.postCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={() => handleToggleStatus(record.id, status)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSection(record)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSection(record.id)}
          >
            删除
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              // 查看板块内容逻辑
            }}
          >
            查看帖子
          </Button>
          <Tooltip title="调整顺序">
            <Button type="text" icon={<OrderedListOutlined />}>
              <Tooltip title="上移">
                <Button
                  type="text"
                  size="small"
                  onClick={() => handleMoveSection(record.id, 'up')}
                  disabled={record.order === 1}
                >
                  ↑
                </Button>
              </Tooltip>
              <Tooltip title="下移">
                <Button
                  type="text"
                  size="small"
                  onClick={() => handleMoveSection(record.id, 'down')}
                  disabled={record.order === sections.length}
                >
                  ↓
                </Button>
              </Tooltip>
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Card
        title="社区板块管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingSection(null);
              form.resetFields();
              setSectionModalVisible(true);
            }}
          >
            添加板块
          </Button>
        }
      >
        {/* 搜索表单 */}
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="keyword">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="板块名称/描述"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status">
                <Select placeholder="状态" allowClear>
                  <Option value={1}>启用</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 板块列表 */}
        <Table
          columns={columns}
          dataSource={sections}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(newPagination: TablePaginationConfig) => {
            setPagination({
              ...pagination,
              current: newPagination.current || 1,
              pageSize: newPagination.pageSize || 10,
              total: pagination.total
            });
          }}
        />
      </Card>

      {/* 添加/编辑板块表单 */}
      <Modal
        title={editingSection ? '编辑板块' : '添加板块'}
        visible={sectionModalVisible}
        onOk={handleAddOrEditSection}
        onCancel={() => {
          setSectionModalVisible(false);
          setEditingSection(null);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="板块名称"
            rules={[{ required: true, message: '请输入板块名称' }]}
          >
            <Input placeholder="请输入板块名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="板块描述"
            rules={[{ required: true, message: '请输入板块描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入板块描述" />
          </Form.Item>
          <Form.Item
            name="icon"
            label="图标名称"
            rules={[{ required: true, message: '请输入图标名称' }]}
          >
            <Input placeholder="请输入图标名称，如：team, file-pdf, bank等" />
          </Form.Item>
          <Form.Item
            name="order"
            label="排序"
            rules={[{ required: true, message: '请输入排序数字' }]}
          >
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default SectionsList; 