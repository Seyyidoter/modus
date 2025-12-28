import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, FileAddOutlined, MinusCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { demandApi } from '../api/demands';
import { productApi } from '../api/products';
import type { Demand } from '../types';
import { DemandStatus, Priority } from '../types';
import { useNotification } from '../hooks/useNotification';
import dayjs from 'dayjs';

const { Option } = Select;

export const DemandsPage: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { notifySuccess } = useNotification();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const { data: demands, isLoading } = useQuery({
        queryKey: ['demands'],
        queryFn: demandApi.getAll
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getAll
    });

    const createMutation = useMutation({
        mutationFn: demandApi.create,
        onSuccess: () => {
            notifySuccess('Demand created successfully');
            setIsModalVisible(false);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ['demands'] });
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: DemandStatus }) => demandApi.updateStatus(id, status),
        onSuccess: () => {
            notifySuccess('Status updated');
            queryClient.invalidateQueries({ queryKey: ['demands'] });
        }
    });

    const handleCreate = (values: any) => {
        const payload = {
            ...values,
            dueDate: values.dueDate ? values.dueDate.toISOString() : null,
            items: values.items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                note: item.note
            }))
        };
        createMutation.mutate(payload);
    };

    const handleStatusUpdate = (id: string, status: DemandStatus) => {
        statusMutation.mutate({ id, status });
    };

    const columns = [
        {
            title: t('demands.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: DemandStatus) => {
                let color = 'default';
                if (status === 'PENDING') color = 'orange';
                if (status === 'PROCESSED') color = 'green';
                if (status === 'CANCELLED') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        { title: t('demands.title'), dataIndex: 'title', key: 'title' },
        { title: t('demands.requester'), dataIndex: 'requesterName', key: 'requesterName' },
        {
            title: t('demands.priority'),
            dataIndex: 'priority',
            key: 'priority',
            render: (p: Priority) => {
                let color = 'blue';
                if (p === 'HIGH') color = 'red';
                return <Tag color={color}>{p}</Tag>;
            }
        },
        {
            title: t('demands.dueDate'),
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-'
        },
        {
            title: t('common.actions'),
            key: 'action',
            render: (_: any, record: Demand) => (
                <Space>
                    {record.status === 'DRAFT' && (
                        <Popconfirm title="Submit for approval?" onConfirm={() => handleStatusUpdate(record.id, 'PENDING')}>
                            <Button size="small" type="primary">Submit</Button>
                        </Popconfirm>
                    )}
                    {record.status === 'PENDING' && (
                        <>
                            <Popconfirm title="Approve demand?" onConfirm={() => handleStatusUpdate(record.id, 'PROCESSED')}>
                                <Button size="small" type="primary" icon={<CheckOutlined />} style={{ backgroundColor: 'green' }} />
                            </Popconfirm>
                            <Popconfirm title="Reject demand?" onConfirm={() => handleStatusUpdate(record.id, 'CANCELLED')}>
                                <Button size="small" danger icon={<CloseOutlined />} />
                            </Popconfirm>
                        </>
                    )}

                    {/* Placeholder for Offer Creation */}
                    <Button
                        size="small"
                        icon={<FileAddOutlined />}
                        disabled={record.status !== 'PROCESSED'}
                        title="Create Offer (Only Processed)"
                        onClick={() => navigate('/offers', { state: { createFromDemand: record } })}
                    >
                        Offer
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1 className="text-2xl font-bold">{t('demands.title')}</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    {t('demands.add')}
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={demands}
                rowKey="id"
                loading={isLoading}
                expandable={{
                    expandedRowRender: (record) => (
                        <ul style={{ margin: 0 }}>
                            {record.items.map(item => (
                                <li key={item.id}>
                                    {item.productName} (x{item.quantity}) - {item.note}
                                </li>
                            ))}
                        </ul>
                    )
                }}
            />

            <Modal
                title={t('demands.add')}
                open={isModalVisible}
                onOk={form.submit}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="requesterName" label={t('demands.requester')}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="priority" label={t('demands.priority')} initialValue="MEDIUM">
                            <Select>
                                {Object.values(Priority).map(p => (
                                    <Option key={p} value={p}>{p}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="dueDate" label={t('demands.dueDate')}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <h4>Items</h4>
                    <Form.List name="items" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'productId']}
                                            rules={[{ required: true, message: 'Missing product' }]}
                                            style={{ width: 250 }}
                                        >
                                            <Select placeholder="Select Product" showSearch optionFilterProp="children">
                                                {products?.map(p => (
                                                    <Option key={p.id} value={p.id}>{p.name} ({p.sku})</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            rules={[{ required: true, message: 'Missing qty' }]}
                                        >
                                            <InputNumber min={1} placeholder="Qty" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'note']}
                                        >
                                            <Input placeholder="Note" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Item
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};
