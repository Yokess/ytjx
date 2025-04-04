import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Form,
  Row,
  Col,
  Modal,
  message,
  Popconfirm,
  TablePaginationConfig
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import { getSections, createSection, updateSection, deleteSection } from '../../../api/communityApi';

// 定义板块类型
interface SectionType {
  sectionId: number;
  sectionName: string;
  sectionDescription: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

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
    try {
      const response = await getSections();
      if (response.code === 200) {
        setSections(response.data);
        setPagination({
          ...pagination,
          total: response.data.length,
        });
      } else {
        message.error(response.message || '获取板块列表失败');
      }
    } catch (error) {
      console.error('获取板块列表失败:', error);
      message.error('获取板块列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索板块
  const handleSearch = (values: any) => {
    setLoading(true);
    
    if (!values.keyword) {
      fetchSections();
      return;
    }
    
    const keyword = values.keyword.toLowerCase();
    const filteredSections = sections.filter(section => 
      section.sectionName.toLowerCase().includes(keyword) || 
      section.sectionDescription.toLowerCase().includes(keyword)
    );
    
    setSections(filteredSections);
    setPagination({
      ...pagination,
      current: 1,
      total: filteredSections.length,
    });
    setLoading(false);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    fetchSections();
  };

  // 添加/编辑板块
  const handleAddOrEditSection = () => {
    form.validateFields().then(async values => {
      setLoading(true);
      try {
        if (editingSection) {
          // 编辑现有板块
          const result = await updateSection(editingSection.sectionId, {
            sectionName: values.sectionName,
            sectionDescription: values.sectionDescription
          });
          
          if (result.code === 200) {
            // 更新本地数据
            const updatedSection = {
              ...editingSection,
              sectionName: values.sectionName,
              sectionDescription: values.sectionDescription,
              updatedAt: new Date().toISOString()
            };
            
            setSections(prevSections => 
              prevSections.map(section => 
                section.sectionId === editingSection.sectionId ? updatedSection : section
              )
            );
            message.success('板块已更新');
            setSectionModalVisible(false);
            setEditingSection(null);
            form.resetFields();
            // 刷新列表
            fetchSections();
          } else {
            message.error(result.message || '更新板块失败');
          }
        } else {
          // 添加新板块
          const result = await createSection({
            sectionName: values.sectionName,
            sectionDescription: values.sectionDescription
          });
          
          if (result.code === 200) {
            message.success('板块已创建');
            setSectionModalVisible(false);
            setEditingSection(null);
            form.resetFields();
            // 刷新列表
            fetchSections();
          } else {
            message.error(result.message || '创建板块失败');
          }
        }
      } catch (error) {
        console.error('操作板块失败:', error);
        message.error('操作失败，请重试');
      } finally {
        setLoading(false);
      }
    });
  };

  // 删除板块
  const handleDeleteSection = (id: number) => {
    const section = sections.find(s => s.sectionId === id);
    if (section && section.postCount > 0) {
      Modal.confirm({
        title: '删除确认',
        content: `该板块包含 ${section.postCount} 个帖子，删除后所有帖子将被移至回收站，是否继续？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          performDeleteSection(id);
        }
      });
    } else {
      performDeleteSection(id);
    }
  };

  // 执行删除
  const performDeleteSection = async (id: number) => {
    setLoading(true);
    try {
      const result = await deleteSection(id);
      
      if (result.code === 200) {
        message.success('板块已删除');
        // 刷新列表
        fetchSections();
      } else {
        message.error(result.message || '删除板块失败');
      }
    } catch (error) {
      console.error('删除板块失败:', error);
      message.error('删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 编辑板块
  const handleEditSection = (section: SectionType) => {
    setEditingSection(section);
    form.setFieldsValue({
      sectionName: section.sectionName,
      sectionDescription: section.sectionDescription,
    });
    setSectionModalVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<SectionType> = [
    {
      title: 'ID',
      dataIndex: 'sectionId',
      key: 'sectionId',
      width: 80,
    },
    {
      title: '板块名称',
      dataIndex: 'sectionName',
      key: 'sectionName',
    },
    {
      title: '描述',
      dataIndex: 'sectionDescription',
      key: 'sectionDescription',
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (text) => new Date(text).toLocaleString(),
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
          <Popconfirm
            title="确认删除"
            description="确定要删除这个板块吗？"
            onConfirm={() => handleDeleteSection(record.sectionId)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
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
          rowKey="sectionId"
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
        open={sectionModalVisible}
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
            name="sectionName"
            label="板块名称"
            rules={[{ required: true, message: '请输入板块名称' }]}
          >
            <Input placeholder="请输入板块名称" />
          </Form.Item>
          <Form.Item
            name="sectionDescription"
            label="板块描述"
            rules={[{ required: true, message: '请输入板块描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入板块描述" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default SectionsList; 