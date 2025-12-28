import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Tag, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { customerApi } from '../api/customers';
import type { Customer, CustomerRequest } from '../types';
import { CustomerType } from '../types';

const { Option } = Select;

export const CustomersPage: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    const { data: customers, isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: customerApi.getAll
    });

    const createMutation = useMutation({
        mutationFn: customerApi.create,
        onSuccess: () => {
            notification.success({ message: t('customers.success') });
            setIsModalVisible(false);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: (err: any) => {
            if (err?.fieldErrors) {
                const fields = Object.keys(err.fieldErrors).map(key => ({
                    name: key,
                    errors: [err.fieldErrors[key]]
                }));
                form.setFields(fields);
            }
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CustomerRequest }) => customerApi.update(id, data),
        onSuccess: () => {
            notification.success({ message: t('customers.success') });
            setIsModalVisible(false);
            setEditingId(null);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: (err: any) => {
            if (err?.fieldErrors) {
                const fields = Object.keys(err.fieldErrors).map(key => ({
                    name: key,
                    errors: [err.fieldErrors[key]]
                }));
                form.setFields(fields);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: customerApi.delete,
        onSuccess: () => {
            notification.success({ message: t('common.delete') + ' success' });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
    });

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: Customer) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingId) {
                updateMutation.mutate({ id: editingId, data: values });
            } else {
                createMutation.mutate(values);
            }
        });
    };

    const filteredCustomers = customers?.filter(c =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: any = [
        {
            title: t('customers.name'),
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Customer, b: Customer) => a.name.localeCompare(b.name)
        },
        {
            title: t('customers.type'),
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => { // type is string at runtime from enum
                let color = 'geekblue';
                if (type === 'SUPPLIER') color = 'green';
                if (type === 'BOTH') color = 'purple';
                return (
                    <Tag color={color}>
                        {/*  @ts-ignore */}
                        {t(`customers.types.${type}`)}
                    </Tag>
                );
            }
        },
        {
            title: t('customers.email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('customers.phone'),
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: t('customers.taxId'),
            dataIndex: 'taxId',
            key: 'taxId',
        },
        {
            title: t('common.actions'),
            key: 'action',
            render: (_: any, record: Customer) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title={t('customers.deleteConfirm')}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t('common.delete')}
                        cancelText={t('common.cancel')}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1 className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('customers.title')}</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    {t('customers.add')}
                </Button>
            </div>

            <div className="mb-4" style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name or email"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredCustomers}
                rowKey="id"
                loading={isLoading}
            />

            <Modal
                title={editingId ? t('customers.edit') : t('customers.add')}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText={t('common.save')}
                cancelText={t('common.cancel')}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label={t('customers.name')}
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label={t('customers.type')}
                        rules={[{ required: true, message: 'Please select type' }]}
                    >
                        <Select>
                            <Option value={CustomerType.CUSTOMER}>{t('customers.types.CUSTOMER')}</Option>
                            <Option value={CustomerType.SUPPLIER}>{t('customers.types.SUPPLIER')}</Option>
                            <Option value={CustomerType.BOTH}>{t('customers.types.BOTH')}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="email" label={t('customers.email')} rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label={t('customers.phone')}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="taxId" label={t('customers.taxId')}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label={t('customers.address')}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
