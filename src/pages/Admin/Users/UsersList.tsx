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
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import * as adminActions from '../../../store/actions/adminActions';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface UserType {
  userId: number;
  username: string;
  avatar: string;
  email: string;
  phone: string;
  userType: number;
  status: number;
  gender?: number;
  major?: string;
  target?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const UsersList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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

  // 获取用户数据
  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      const result = await dispatch(adminActions.fetchUserList({
        page: pagination.current,
        size: pagination.pageSize,
        keyword: searchForm.getFieldValue('keyword'),
        userType: searchForm.getFieldValue('userType'),
        status: searchForm.getFieldValue('status')
      }));
      
      // 类型断言，将result视为ApiResponse类型
      const response = result as unknown as ApiResponse;
      
      if (response.success && response.data) {
        setUsers(response.data.records || []);
        setPagination({
          ...pagination,
          total: response.data.total || 0
        });
      }
    } catch (error) {
      console.error('获取用户列表失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索用户
  const handleSearch = (values: any) => {
    setPagination({ ...pagination, current: 1 });
    fetchUsers();
  };

  // 表格列定义
  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
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
      dataIndex: 'userType',
      key: 'userType',
      render: (userType) => {
        let color = 'blue';
        let text = '学生';
        if (userType === 1) {
          color = 'green';
          text = '教师';
        } else if (userType === 2) {
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
        return status === 0 ? 
          <Tag color="success">正常</Tag> : 
          <Tag color="error">禁用</Tag>;
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime(),
    },
    {
      title: '最后登录',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt || '').getTime() - new Date(b.updatedAt || '').getTime(),
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
          {record.status === 0 ? (
            <Tooltip title="禁用">
              <Button 
                type="text" 
                danger 
                icon={<LockOutlined />} 
                onClick={() => showDisableModal(record.userId)} 
              />
            </Tooltip>
          ) : (
            <Tooltip title="启用">
              <Button 
                type="text" 
                icon={<UnlockOutlined />} 
                onClick={() => handleEnable(record.userId)} 
              />
            </Tooltip>
          )}
          <Dropdown overlay={
            <Menu>
              <Menu.Item key="1" icon={<ReloadOutlined />} onClick={() => handleResetPassword(record.userId)}>
                重置密码
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="2" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.userId)}>
                删除
              </Menu.Item>
            </Menu>
          } trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 表格分页、排序、筛选变化
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination);
  };

  // 编辑用户
  const handleEdit = (user: UserType) => {
    setCurrentUser(user);
    setVisible(true);
  };

  // 显示禁用用户确认框
  const showDisableModal = (userId: number) => {
    setDisableUserId(userId);
    setDisableModalVisible(true);
  };

  // 禁用用户
  const handleDisable = async () => {
    if (!disableUserId) return;
    
    setConfirmLoading(true);
    try {
      const result = await dispatch(adminActions.updateUserStatus(disableUserId, 1));
      const response = result as unknown as ApiResponse;
      
      if (response.success) {
        setDisableModalVisible(false);
        // 刷新用户列表
        fetchUsers();
      }
    } catch (error) {
      console.error('禁用用户失败', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 启用用户
  const handleEnable = async (userId: number) => {
    setLoading(true);
    try {
      const result = await dispatch(adminActions.updateUserStatus(userId, 0));
      const response = result as unknown as ApiResponse;
      
      if (response.success) {
        // 刷新用户列表
        fetchUsers();
      }
    } catch (error) {
      console.error('启用用户失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = (userId: number) => {
    Modal.confirm({
      title: '确定要重置该用户的密码吗？',
      content: '重置后密码将变为默认密码，用户需要重新登录。',
      onOk: async () => {
        try {
          const result = await dispatch(adminActions.resetUserPassword(userId));
          const response = result as unknown as ApiResponse;
          
          if (response.success && response.message) {
            message.success(response.message);
          }
        } catch (error) {
          console.error('重置密码失败', error);
        }
      }
    });
  };

  // 删除用户
  const handleDelete = (userId: number) => {
    Modal.confirm({
      title: '确定要删除该用户吗？',
      content: '删除后用户账号将无法恢复，用户的所有数据将被清除。',
      okType: 'danger',
      onOk: async () => {
        try {
          const result = await dispatch(adminActions.deleteUser(userId));
          const response = result as unknown as ApiResponse;
          
          if (response.success) {
            fetchUsers();
          }
        } catch (error) {
          console.error('删除用户失败', error);
        }
      }
    });
  };

  // 导入用户
  const handleImportUsers = () => {
    message.info('导入用户功能正在开发中...');
  };

  // 导出用户
  const handleExportUsers = () => {
    message.info('导出用户功能正在开发中...');
  };

  return (
    <AdminLayout>
      <Card 
        title="用户管理" 
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>添加用户</Button>
            <Button icon={<ImportOutlined />} onClick={handleImportUsers}>导入</Button>
            <Button icon={<ExportOutlined />} onClick={handleExportUsers}>导出</Button>
          </Space>
        }
      >
        {/* 搜索表单 */}
        <Form 
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword">
            <Input 
              placeholder="用户名/邮箱/手机号" 
              prefix={<SearchOutlined />} 
              allowClear 
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="userType">
            <Select 
              placeholder="用户角色" 
              allowClear
              style={{ width: 120 }}
            >
              <Option value={0}>学生</Option>
              <Option value={1}>教师</Option>
              <Option value={2}>管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select 
              placeholder="用户状态" 
              allowClear
              style={{ width: 120 }}
            >
              <Option value={0}>正常</Option>
              <Option value={1}>禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => {
              searchForm.resetFields();
              handleSearch({});
            }}>重置</Button>
          </Form.Item>
        </Form>

        {/* 用户列表 */}
        <Table 
          rowKey="userId"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户"
        visible={visible}
        onCancel={() => setVisible(false)}
        confirmLoading={confirmLoading}
        footer={null}
      >
        {currentUser && (
          <Form
            initialValues={{
              username: currentUser.username,
              email: currentUser.email,
              phone: currentUser.phone,
              userType: currentUser.userType,
              status: currentUser.status,
              gender: currentUser.gender,
              major: currentUser.major,
              target: currentUser.target
            }}
            onFinish={async (values) => {
              if (!currentUser) return;
              
              setConfirmLoading(true);
              try {
                const result = await dispatch(adminActions.updateUser(currentUser.userId, values));
                const response = result as unknown as ApiResponse;
                
                if (response.success) {
                  setVisible(false);
                  fetchUsers();
                }
              } catch (error) {
                console.error('更新用户失败', error);
              } finally {
                setConfirmLoading(false);
              }
            }}
            layout="vertical"
          >
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="手机号">
              <Input />
            </Form.Item>
            <Form.Item name="gender" label="性别">
              <Select>
                <Option value={0}>女</Option>
                <Option value={1}>男</Option>
                <Option value={2}>其他</Option>
              </Select>
            </Form.Item>
            <Form.Item name="major" label="专业">
              <Input />
            </Form.Item>
            <Form.Item name="target" label="考研目标">
              <Input />
            </Form.Item>
            <Form.Item name="userType" label="用户角色" rules={[{ required: true, message: '请选择用户角色' }]}>
              <Select>
                <Option value={0}>学生</Option>
                <Option value={1}>教师</Option>
                <Option value={2}>管理员</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="用户状态" rules={[{ required: true, message: '请选择用户状态' }]}>
              <Select>
                <Option value={0}>正常</Option>
                <Option value={1}>禁用</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Button block onClick={() => setVisible(false)}>取消</Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" htmlType="submit" block loading={confirmLoading}>保存</Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 禁用用户弹窗 */}
      <Modal
        title="禁用用户"
        visible={disableModalVisible}
        onCancel={() => setDisableModalVisible(false)}
        onOk={handleDisable}
        confirmLoading={confirmLoading}
      >
        <Form layout="vertical">
          <Form.Item label="禁用原因">
            <Input.TextArea rows={4} value={disableReason} onChange={e => setDisableReason(e.target.value)} />
          </Form.Item>
          <Form.Item label="禁用时长">
            <Select value={disableDuration} onChange={value => setDisableDuration(value)}>
              <Option value={1}>1天</Option>
              <Option value={3}>3天</Option>
              <Option value={7}>7天</Option>
              <Option value={30}>30天</Option>
              <Option value={-1}>永久禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default UsersList; 