import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Modal, Form, Select, DatePicker, InputNumber, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, SendOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { offerApi } from '../api/offers';
import { productApi } from '../api/products';
import { customerApi } from '../api/customers';
import type { Offer, Product } from '../types';
import { OfferStatus } from '../types';
import { useNotification } from '../hooks/useNotification';
import dayjs from 'dayjs';

const { Option } = Select;


export const OffersPage: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { notifySuccess, notifyError } = useNotification();
    const location = useLocation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // For handling pre-filled data from Demand
    const [preFillDemandId, setPreFillDemandId] = useState<string | null>(null);

    const { data: offers, isLoading } = useQuery({
        queryKey: ['offers'],
        queryFn: offerApi.getAll
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getAll
    });

    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: customerApi.getAll
    });

    // Handle navigation state from DemandsPage
    useEffect(() => {
        if (location.state?.createFromDemand && products) {
            const demand = location.state.createFromDemand;
            setPreFillDemandId(demand.id);

            // Map demand items to offer items
            const offerItems = demand.items.map((dItem: any) => {
                const product = products.find((p: Product) => p.id === dItem.productId);
                return {
                    productId: dItem.productId,
                    quantity: dItem.quantity,
                    unitPrice: product ? product.unitPrice : 0,
                    discount: 0
                };
            });

            form.setFieldsValue({
                items: offerItems,
                // If we had customer mapping, we would set customerId here
                // validUntil: dayjs().add(7, 'day') 
            });
            setIsModalVisible(true);

            // Clear state so it doesn't reopen on refresh (optional, hard to do completely in React Router without history replace)
            window.history.replaceState({}, document.title);
        }
    }, [location.state, products, form]);

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: OfferStatus }) => offerApi.updateStatus(id, status),
        onSuccess: () => {
            notifySuccess('Offer status updated');
            queryClient.invalidateQueries({ queryKey: ['offers'] });
        }
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => offerApi.create(data),
        onSuccess: () => {
            notifySuccess('Offer created successfully');
            setIsModalVisible(false);
            form.resetFields();
            setPreFillDemandId(null);
            queryClient.invalidateQueries({ queryKey: ['offers'] });
        },
        onError: (err) => {
            console.error(err);
            notifyError('Failed to create offer');
        }
    });

    const handleCreate = (values: any) => {
        const payload = {
            ...values,
            demandId: preFillDemandId,
            validUntil: values.validUntil ? values.validUntil.toISOString() : null,
            currency: values.currency,
            items: values.items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount || 0
            }))
        };
        createMutation.mutate(payload);
    };

    const handleProductChange = (productId: string, fieldKey: number) => {
        const product = products?.find(p => p.id === productId);
        if (product) {
            const items = form.getFieldValue('items');
            const newItems = [...items];
            newItems[fieldKey] = {
                ...newItems[fieldKey],
                productId,
                unitPrice: product.unitPrice
            };
            form.setFieldsValue({ items: newItems });
        }
    };

    const handleStatusUpdate = (id: string, status: OfferStatus) => {
        statusMutation.mutate({ id, status });
    };

    const columns = [
        {
            title: t('offers.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: OfferStatus) => {
                let color = 'default';
                if (status === 'SENT') color = 'blue';
                if (status === 'ACCEPTED') color = 'green';
                if (status === 'REJECTED') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        { title: t('offers.customer'), dataIndex: 'customerName', key: 'customerName' },
        {
            title: t('offers.total'),
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val: number, record: Offer) => `${val} ${record.currency}`
        },
        {
            title: t('offers.validUntil'),
            dataIndex: 'validUntil',
            key: 'validUntil',
            render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-'
        },
        {
            title: 'Demand',
            dataIndex: 'demandTitle',
            key: 'demandTitle',
            render: (val: string) => val ? <Tag>{val}</Tag> : '-'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Offer) => (
                <Space>
                    {record.status === 'DRAFT' && (
                        <Button
                            size="small"
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={() => handleStatusUpdate(record.id, 'SENT')}
                        >
                            Mark Sent
                        </Button>
                    )}
                    {record.status === 'SENT' && (
                        <>
                            <Popconfirm title="Mark as Accepted?" onConfirm={() => handleStatusUpdate(record.id, 'ACCEPTED')}>
                                <Button size="small" type="primary" icon={<CheckOutlined />} style={{ backgroundColor: 'green' }} />
                            </Popconfirm>
                            <Popconfirm title="Mark as Rejected?" onConfirm={() => handleStatusUpdate(record.id, 'REJECTED')}>
                                <Button size="small" danger icon={<CloseOutlined />} />
                            </Popconfirm>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1 className="text-2xl font-bold">{t('offers.title')}</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    {t('offers.add')}
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={offers}
                rowKey="id"
                loading={isLoading}
                expandable={{
                    expandedRowRender: (record) => (
                        <div style={{ padding: 10, background: '#f9f9f9', borderRadius: 4 }}>
                            <h4>Items:</h4>
                            <ul>
                                {record.items.map(item => (
                                    <li key={item.id}>
                                        {item.productName} (x{item.quantity}) - {item.unitPrice} {record.currency}
                                        {item.discount > 0 && ` (Disc: ${item.discount})`}
                                        = <b>{item.totalPrice}</b>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }}
            />

            <Modal
                title={preFillDemandId ? "Create Offer from Demand" : t('offers.add')}
                open={isModalVisible}
                onOk={form.submit}
                onCancel={() => { setIsModalVisible(false); setPreFillDemandId(null); form.resetFields(); }}
                width={900}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
                            <Select showSearch optionFilterProp="children">
                                {customers?.map(c => (
                                    <Option key={c.id} value={c.id}>{c.name} ({c.type})</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="validUntil" label="Valid Until">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="currency" label="Currency" initialValue="USD" rules={[{ required: true }]}>
                            <Select>
                                <Option value="USD">USD ($)</Option>
                                <Option value="EUR">EUR (€)</Option>
                                <Option value="TRY">TRY (₺)</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <h4>Items</h4>
                    <Form.List name="items" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'productId']}
                                                rules={[{ required: true, message: 'Required' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Select
                                                    placeholder="Product"
                                                    showSearch
                                                    optionFilterProp="children"
                                                    onChange={(val) => handleProductChange(val, name)}
                                                >
                                                    {products?.map(p => (
                                                        <Option key={p.id} value={p.id}>{p.name} - {p.unitPrice}$</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'quantity']}
                                                rules={[{ required: true, message: 'Req' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <InputNumber min={1} placeholder="Qty" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'unitPrice']}
                                                rules={[{ required: true, message: 'Req' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <InputNumber min={0} placeholder="Price" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'discount']}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <InputNumber min={0} placeholder="Disc" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Col>
                                    </Row>
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
