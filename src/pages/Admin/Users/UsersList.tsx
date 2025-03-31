import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Button, Space, Tag, Dropdown, Menu, Modal, Form, Select, DatePicker, message, Row, Col, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LockOutlined, 
  UnlockOutlined, 
  MoreOutlined, 
  ReloadOutlined, 
  ExportOutlined, 
  ImportOutlined,
  DownOutlined
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface UserType {
  id: number;
  username: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  status: number;
  registerTime: string;
  lastLoginTime: string;
  major?: string;
  targetSchool?: string;
  loginCount: number;
}

// 模拟用户数据
const mockUsers: UserType[] = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  username: `user${index + 1}`,
  avatar: `https://api.ytjx.com/static/avatars/${index + 1}.jpg`,
  email: `user${index + 1}@example.com`,
  phone: `1380013${String(index + 1).padStart(4, '0')}`,
  role: ['student', 'teacher', 'admin'][Math.floor(Math.random() * 3)],
  status: Math.random() > 0.9 ? 2 : 1, // 1-正常，2-禁用
  registerTime: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  lastLoginTime: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  major: Math.random() > 0.5 ? ['计算机科学与技术', '软件工程', '人工智能', '数学', '物理学', '英语'][Math.floor(Math.random() * 6)] : undefined,
  targetSchool: Math.random() > 0.5 ? ['清华大学', '北京大学', '浙江大学', '复旦大学', '上海交通大学'][Math.floor(Math.random() * 5)] : undefined,
  loginCount: Math.floor(Math.random() * 100),
}));

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [disableModalVisible, setDisableModalVisible] = useState(false);
  const [disableUserId, setDisableUserId] = useState<number | null>(null);
  const [disableReason, setDisableReason] = useState('');
  const [disableDuration, setDisableDuration] = useState(7);

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  // 模拟获取用户数据
  const fetchUsers = async () => {
    setLoading(true);
    // 模拟 API 请求延迟
    setTimeout(() => {
      const { current, pageSize } = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      const filteredUsers = [...mockUsers];
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setPagination({
        ...pagination,
        total: filteredUsers.length,
      });
      setLoading(false);
    }, 500);
  };

  // 搜索用户
  const handleSearch = (values: any) => {
    setLoading(true);
    console.log('Search values:', values);
    // 在真实环境中这里应该调用 API 进行搜索
    setTimeout(() => {
      let filteredUsers = [...mockUsers];
      
      if (values.keyword) {
        const keyword = values.keyword.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(keyword) || 
          user.email.toLowerCase().includes(keyword) || 
          (user.phone && user.phone.includes(keyword))
        );
      }
      
      if (values.role) {
        filteredUsers = filteredUsers.filter(user => user.role === values.role);
      }
      
      if (values.status) {
        filteredUsers = filteredUsers.filter(user => user.status === values.status);
      }
      
      if (values.registerTime && values.registerTime.length === 2) {
        const startDate = values.registerTime[0].startOf('day').valueOf();
        const endDate = values.registerTime[1].endOf('day').valueOf();
        
        filteredUsers = filteredUsers.filter(user => {
          const registerDate = new Date(user.registerTime).valueOf();
          return registerDate >= startDate && registerDate <= endDate;
        });
      }
      
      const { current, pageSize } = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setPagination({
        ...pagination,
        current: 1,
        total: filteredUsers.length,
      });
      setLoading(false);
    }, 500);
  };

  // 表格列定义
  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <a>{text}</a>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue';
        let text = '学生';
        if (role === 'teacher') {
          color = 'green';
          text = '教师';
        } else if (role === 'admin') {
          color = 'purple';
          text = '管理员';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return status === 1 ? 
          <Tag color="success">正常</Tag> : 
          <Tag color="error">禁用</Tag>;
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      sorter: (a, b) => new Date(a.registerTime).getTime() - new Date(b.registerTime).getTime(),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      sorter: (a, b) => new Date(a.lastLoginTime).getTime() - new Date(b.lastLoginTime).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)} 
            />
          </Tooltip>
          {record.status === 1 ? (
            <Tooltip title="禁用">
              <Button 
                type="text" 
                danger 
                icon={<LockOutlined />} 
                onClick={() => showDisableModal(record.id)} 
              />
            </Tooltip>
          ) : (
            <Tooltip title="启用">
              <Button 
                type="text" 
                icon={<UnlockOutlined />} 
                onClick={() => handleEnable(record.id)} 
              />
            </Tooltip>
          )}
          <Dropdown overlay={
            <Menu>
              <Menu.Item key="1" icon={<ReloadOutlined />} onClick={() => handleResetPassword(record.id)}>
                重置密码
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="2" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>
                删除用户
              </Menu.Item>
            </Menu>
          }>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 处理表格分页
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination);
  };

  // 处理编辑用户
  const handleEdit = (user: UserType) => {
    setCurrentUser(user);
    setVisible(true);
  };

  // 处理禁用用户
  const showDisableModal = (userId: number) => {
    setDisableUserId(userId);
    setDisableModalVisible(true);
  };

  const handleDisable = () => {
    if (!disableUserId) return;
    
    setConfirmLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === disableUserId ? { ...user, status: 2 } : user
        )
      );
      setConfirmLoading(false);
      setDisableModalVisible(false);
      setDisableReason('');
      setDisableDuration(7);
      message.success('用户已禁用');
    }, 1000);
  };

  // 处理启用用户
  const handleEnable = (userId: number) => {
    // 模拟 API 请求
    setTimeout(() => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: 1 } : user
        )
      );
      message.success('用户已启用');
    }, 500);
  };

  // 处理重置密码
  const handleResetPassword = (userId: number) => {
    Modal.confirm({
      title: '重置密码',
      content: '确定要重置该用户的密码吗？重置后密码将发送到用户邮箱。',
      onOk() {
        // 模拟 API 请求
        setTimeout(() => {
          message.success('密码已重置并发送至用户邮箱');
        }, 1000);
      },
    });
  };

  // 处理删除用户
  const handleDelete = (userId: number) => {
    Modal.confirm({
      title: '删除用户',
      content: '确定要删除该用户吗？此操作不可逆。',
      okText: '删除',
      okType: 'danger',
      onOk() {
        // 模拟 API 请求
        setTimeout(() => {
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
          message.success('用户已删除');
        }, 1000);
      },
    });
  };

  // 批量导入用户
  const handleImportUsers = () => {
    message.info('此功能尚未实现');
  };

  // 导出用户数据
  const handleExportUsers = () => {
    message.info('正在导出用户数据...');
    // 模拟导出
    setTimeout(() => {
      message.success('用户数据已导出');
    }, 1000);
  };

  return (
    <AdminLayout>
      <Card title="用户管理" extra={
        <Space>
          <Button icon={<PlusOutlined />} type="primary">添加用户</Button>
          <Button icon={<ImportOutlined />} onClick={handleImportUsers}>批量导入</Button>
          <Button icon={<ExportOutlined />} onClick={handleExportUsers}>导出数据</Button>
        </Space>
      }>
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
                  placeholder="用户名/邮箱/手机号" 
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="role">
                <Select placeholder="选择角色" allowClear>
                  <Option value="student">学生</Option>
                  <Option value="teacher">教师</Option>
                  <Option value="admin">管理员</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status">
                <Select placeholder="选择状态" allowClear>
                  <Option value={1}>正常</Option>
                  <Option value={2}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="registerTime">
                <RangePicker placeholder={['注册起始日期', '注册结束日期']} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button 
                    onClick={() => {
                      searchForm.resetFields();
                      fetchUsers();
                    }}
                  >
                    重置
                  </Button>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 用户列表表格 */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1100 }}
        />

        {/* 编辑用户弹窗 */}
        <Modal
          title="编辑用户"
          visible={visible}
          onCancel={() => setVisible(false)}
          destroyOnClose
          footer={null}
        >
          {currentUser && (
            <Form
              initialValues={{
                username: currentUser.username,
                email: currentUser.email,
                phone: currentUser.phone,
                role: currentUser.role,
                status: currentUser.status
              }}
              layout="vertical"
              onFinish={(values) => {
                console.log('Form values:', values);
                setVisible(false);
                message.success('用户信息已更新');
              }}
            >
              <Form.Item 
                name="username" 
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                name="email" 
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                name="phone" 
                label="手机号"
              >
                <Input />
              </Form.Item>
              <Form.Item 
                name="role" 
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select>
                  <Option value="student">学生</Option>
                  <Option value="teacher">教师</Option>
                  <Option value="admin">管理员</Option>
                </Select>
              </Form.Item>
              <Form.Item 
                name="status" 
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value={1}>正常</Option>
                  <Option value={2}>禁用</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Space style={{ float: 'right' }}>
                  <Button onClick={() => setVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* 禁用用户弹窗 */}
        <Modal
          title="禁用用户"
          visible={disableModalVisible}
          onOk={handleDisable}
          onCancel={() => setDisableModalVisible(false)}
          confirmLoading={confirmLoading}
          okText="确认禁用"
          cancelText="取消"
        >
          <Form layout="vertical">
            <Form.Item
              label="禁用原因"
              rules={[{ required: true, message: '请输入禁用原因' }]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="请输入禁用原因，将通知给用户" 
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="禁用时长"
              rules={[{ required: true, message: '请选择禁用时长' }]}
            >
              <Select 
                value={disableDuration} 
                onChange={(value) => setDisableDuration(value)}
              >
                <Option value={1}>1天</Option>
                <Option value={3}>3天</Option>
                <Option value={7}>7天</Option>
                <Option value={30}>30天</Option>
                <Option value={0}>永久</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </AdminLayout>
  );
};

export default UsersList; 