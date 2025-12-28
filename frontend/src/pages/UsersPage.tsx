import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Typography, message } from 'antd';
import { userApi } from '../api/users';
import type { UserDTO } from '../types';

const { Title } = Typography;

export const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.getAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (_: string, record: UserDTO) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
                    {role}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Title level={2}>Users</Title>
            </div>
            <Card>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                />
            </Card>
        </div>
    );
};
