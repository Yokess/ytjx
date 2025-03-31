import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message, 
  Switch, 
  Tooltip, 
  Popconfirm, 
  Tree, 
  Drawer 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  KeyOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

interface RoleType {
  id: number;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  createTime: string;
  updateTime: string;
  status: number;
  userCount: number;
}

// 模拟权限数据
const permissionTree: DataNode[] = [
  {
    title: '系统管理',
    key: 'system',
    children: [
      {
        title: '用户管理',
        key: 'user:view',
        children: [
          { title: '查看用户', key: 'user:list' },
          { title: '添加用户', key: 'user:add' },
          { title: '编辑用户', key: 'user:edit' },
          { title: '删除用户', key: 'user:delete' },
          { title: '禁用用户', key: 'user:disable' },
        ]
      },
      {
        title: '角色管理',
        key: 'role:view',
        children: [
          { title: '查看角色', key: 'role:list' },
          { title: '添加角色', key: 'role:add' },
          { title: '编辑角色', key: 'role:edit' },
          { title: '删除角色', key: 'role:delete' },
          { title: '设置权限', key: 'role:setPermission' },
        ]
      },
      {
        title: '菜单管理',
        key: 'menu:view',
        children: [
          { title: '查看菜单', key: 'menu:list' },
          { title: '添加菜单', key: 'menu:add' },
          { title: '编辑菜单', key: 'menu:edit' },
          { title: '删除菜单', key: 'menu:delete' },
        ]
      },
      {
        title: '系统设置',
        key: 'setting:view',
        children: [
          { title: '查看设置', key: 'setting:list' },
          { title: '修改设置', key: 'setting:edit' },
        ]
      },
    ]
  },
  {
    title: '考试管理',
    key: 'exam',
    children: [
      {
        title: '试卷管理',
        key: 'paper:view',
        children: [
          { title: '查看试卷', key: 'paper:list' },
          { title: '添加试卷', key: 'paper:add' },
          { title: '编辑试卷', key: 'paper:edit' },
          { title: '删除试卷', key: 'paper:delete' },
        ]
      },
      {
        title: '题库管理',
        key: 'question:view',
        children: [
          { title: '查看题目', key: 'question:list' },
          { title: '添加题目', key: 'question:add' },
          { title: '编辑题目', key: 'question:edit' },
          { title: '删除题目', key: 'question:delete' },
          { title: '导入题目', key: 'question:import' },
          { title: '导出题目', key: 'question:export' },
        ]
      },
    ]
  },
  {
    title: '课程管理',
    key: 'course',
    children: [
      {
        title: '课程管理',
        key: 'course:view',
        children: [
          { title: '查看课程', key: 'course:list' },
          { title: '添加课程', key: 'course:add' },
          { title: '编辑课程', key: 'course:edit' },
          { title: '删除课程', key: 'course:delete' },
          { title: '上架/下架', key: 'course:publish' },
        ]
      },
      {
        title: '章节管理',
        key: 'chapter:view',
        children: [
          { title: '查看章节', key: 'chapter:list' },
          { title: '添加章节', key: 'chapter:add' },
          { title: '编辑章节', key: 'chapter:edit' },
          { title: '删除章节', key: 'chapter:delete' },
        ]
      },
      {
        title: '评论管理',
        key: 'comment:view',
        children: [
          { title: '查看评论', key: 'comment:list' },
          { title: '回复评论', key: 'comment:reply' },
          { title: '删除评论', key: 'comment:delete' },
        ]
      },
    ]
  },
  {
    title: '社区管理',
    key: 'community',
    children: [
      {
        title: '帖子管理',
        key: 'post:view',
        children: [
          { title: '查看帖子', key: 'post:list' },
          { title: '删除帖子', key: 'post:delete' },
          { title: '置顶帖子', key: 'post:sticky' },
          { title: '精华帖子', key: 'post:essence' },
        ]
      },
      {
        title: '评论管理',
        key: 'postComment:view',
        children: [
          { title: '查看评论', key: 'postComment:list' },
          { title: '删除评论', key: 'postComment:delete' },
        ]
      },
    ]
  },
];

// 模拟角色数据
const mockRoles: RoleType[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '拥有系统所有权限，不可编辑',
    isSystem: true,
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    status: 1,
    userCount: 1
  },
  {
    id: 2,
    name: '普通管理员',
    code: 'ADMIN',
    description: '拥有系统大部分权限，部分关键权限除外',
    isSystem: true,
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-02 10:30:00',
    status: 1,
    userCount: 5
  },
  {
    id: 3,
    name: '内容管理员',
    code: 'CONTENT_MANAGER',
    description: '只有内容管理相关权限',
    isSystem: false,
    createTime: '2023-01-10 09:15:00',
    updateTime: '2023-02-15 14:20:00',
    status: 1,
    userCount: 8
  },
  {
    id: 4,
    name: '教师',
    code: 'TEACHER',
    description: '教师角色，管理课程和题库',
    isSystem: true,
    createTime: '2023-01-05 11:20:00',
    updateTime: '2023-01-05 11:20:00',
    status: 1,
    userCount: 25
  },
  {
    id: 5,
    name: '运营',
    code: 'OPERATOR',
    description: '运营角色，管理内容和用户',
    isSystem: false,
    createTime: '2023-03-10 16:45:00',
    updateTime: '2023-05-20 09:30:00',
    status: 1,
    userCount: 12
  },
  {
    id: 6,
    name: '访客',
    code: 'VISITOR',
    description: '访客角色，只有查看权限',
    isSystem: true,
    createTime: '2023-01-15 08:00:00',
    updateTime: '2023-01-15 08:00:00',
    status: 1,
    userCount: 0
  },
  {
    id: 7,
    name: '测试角色',
    code: 'TEST_ROLE',
    description: '用于测试的角色',
    isSystem: false,
    createTime: '2023-04-01 10:00:00',
    updateTime: '2023-04-10 11:30:00',
    status: 2, // 禁用状态
    userCount: 2
  }
];

// 角色权限映射（模拟数据）
const rolePermissions: Record<number, string[]> = {
  1: ['system', 'exam', 'course', 'community'], // 超级管理员有所有权限
  2: ['user:view', 'role:view', 'menu:view', 'paper:view', 'question:view', 'course:view', 'chapter:view', 'comment:view', 'post:view', 'postComment:view'],
  3: ['course:view', 'chapter:view', 'comment:view', 'post:view', 'postComment:view'],
  4: ['course:view', 'chapter:view', 'question:view'],
  5: ['user:view', 'comment:view', 'post:view', 'postComment:view'],
  6: ['user:list', 'role:list', 'menu:list', 'paper:list', 'question:list', 'course:list', 'chapter:list', 'comment:list', 'post:list', 'postComment:list'],
  7: ['course:list', 'question:list']
};

const UserRoles: React.FC = () => {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [roleForm] = Form.useForm();
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState<number | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  // 模拟获取角色数据
  const fetchRoles = async () => {
    setLoading(true);
    // 模拟 API 请求延迟
    setTimeout(() => {
      setRoles(mockRoles);
      setLoading(false);
    }, 500);
  };

  // 处理添加/编辑角色
  const handleAddOrEditRole = () => {
    roleForm.validateFields().then((values) => {
      setConfirmLoading(true);
      
      // 模拟 API 请求
      setTimeout(() => {
        if (currentRole) {
          // 编辑角色
          setRoles(prevRoles =>
            prevRoles.map(role =>
              role.id === currentRole.id ? 
              { 
                ...role, 
                name: values.name, 
                code: values.code, 
                description: values.description,
                status: values.status ? 1 : 2,
                updateTime: new Date().toLocaleString()
              } : role
            )
          );
          message.success('角色已更新');
        } else {
          // 添加角色
          const newRole: RoleType = {
            id: mockRoles.length + 1,
            name: values.name,
            code: values.code,
            description: values.description,
            isSystem: false,
            createTime: new Date().toLocaleString(),
            updateTime: new Date().toLocaleString(),
            status: values.status ? 1 : 2,
            userCount: 0
          };
          setRoles(prevRoles => [...prevRoles, newRole]);
          message.success('角色已创建');
        }
        
        setVisible(false);
        setCurrentRole(null);
        roleForm.resetFields();
        setConfirmLoading(false);
      }, 1000);
    });
  };

  // 处理删除角色
  const handleDeleteRole = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      message.error('系统角色不允许删除');
      return;
    }
    
    if (role && role.userCount > 0) {
      Modal.confirm({
        title: '确认删除',
        icon: <ExclamationCircleOutlined />,
        content: `该角色下有 ${role.userCount} 个用户，删除后用户将失去该角色权限，是否继续？`,
        onOk() {
          deleteRole(roleId);
        }
      });
    } else {
      deleteRole(roleId);
    }
  };

  // 执行删除角色
  const deleteRole = (roleId: number) => {
    // 模拟 API 请求
    setTimeout(() => {
      setRoles(prevRoles => prevRoles.filter(role => role.id !== roleId));
      message.success('角色已删除');
    }, 500);
  };

  // 处理打开权限设置
  const handleOpenPermission = (roleId: number) => {
    setCurrentRoleId(roleId);
    setSelectedPermissions(rolePermissions[roleId] || []);
    setPermissionVisible(true);
  };

  // 处理保存权限设置
  const handleSavePermissions = () => {
    if (!currentRoleId) return;
    
    setConfirmLoading(true);
    // 模拟 API 请求
    setTimeout(() => {
      // 更新模拟的角色权限数据
      rolePermissions[currentRoleId] = selectedPermissions;
      
      setPermissionVisible(false);
      setCurrentRoleId(null);
      setConfirmLoading(false);
      message.success('权限已更新');
    }, 1000);
  };

  // 表格列定义
  const columns: ColumnsType<RoleType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      sorter: (a, b) => a.userCount - b.userCount,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch 
          checked={status === 1} 
          disabled={record.isSystem} 
          onChange={(checked) => handleToggleStatus(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              disabled={record.code === 'SUPER_ADMIN'} 
              onClick={() => {
                setCurrentRole(record);
                roleForm.setFieldsValue({
                  name: record.name,
                  code: record.code,
                  description: record.description,
                  status: record.status === 1
                });
                setVisible(true);
              }} 
            />
          </Tooltip>
          <Tooltip title="设置权限">
            <Button 
              type="text" 
              icon={<KeyOutlined />} 
              disabled={record.code === 'SUPER_ADMIN'} 
              onClick={() => handleOpenPermission(record.id)} 
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除该角色吗？"
              disabled={record.isSystem}
              onConfirm={() => handleDeleteRole(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                disabled={record.isSystem} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理切换角色状态
  const handleToggleStatus = (roleId: number, checked: boolean) => {
    // 模拟 API 请求
    setTimeout(() => {
      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === roleId ? { ...role, status: checked ? 1 : 2 } : role
        )
      );
      message.success(`角色已${checked ? '启用' : '禁用'}`);
    }, 500);
  };

  return (
    <AdminLayout>
      <Card 
        title="角色管理" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setCurrentRole(null);
              roleForm.resetFields();
              setVisible(true);
            }}
          >
            添加角色
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 添加/编辑角色弹窗 */}
      <Modal
        title={currentRole ? '编辑角色' : '添加角色'}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setCurrentRole(null);
          roleForm.resetFields();
        }}
        onOk={handleAddOrEditRole}
        confirmLoading={confirmLoading}
        maskClosable={false}
      >
        <Form
          form={roleForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码，如 ADMIN、OPERATOR" />
          </Form.Item>
          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
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

      {/* 权限设置抽屉 */}
      <Drawer
        title="设置角色权限"
        width={500}
        onClose={() => {
          setPermissionVisible(false);
          setCurrentRoleId(null);
        }}
        visible={permissionVisible}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setPermissionVisible(false);
                  setCurrentRoleId(null);
                }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                onClick={handleSavePermissions}
                loading={confirmLoading}
              >
                保存
              </Button>
            </Space>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <span>选择该角色拥有的权限：</span>
        </div>
        <Tree
          checkable
          checkStrictly
          defaultExpandAll
          checkedKeys={selectedPermissions}
          onCheck={(checkedKeys) => {
            setSelectedPermissions(checkedKeys as string[]);
          }}
          treeData={permissionTree}
        />
      </Drawer>
    </AdminLayout>
  );
};

export default UserRoles; 