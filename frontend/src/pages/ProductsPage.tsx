import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, notification } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/products';
import type { ProductRequest } from '../types';
import { useTranslation } from 'react-i18next';

export const ProductsPage: React.FC = () => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getAll
    });

    const createMutation = useMutation({
        mutationFn: productApi.create,
        onSuccess: () => {
            notification.success({ message: t('products.success') });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setIsModalOpen(false);
            form.resetFields();
        },
        onError: (err: any) => {
            if (err.fieldErrors) {
                const fields = Object.keys(err.fieldErrors).map(key => ({
                    name: key,
                    errors: [err.fieldErrors[key]]
                }));
                form.setFields(fields);
            } else {
                // If it's not a validation error, notification is already handled by interceptor
                // But we can fallback here if needed.
            }
        }
    });

    const columns = [
        { title: t('products.table.sku'), dataIndex: 'sku', key: 'sku' },
        { title: t('products.table.name'), dataIndex: 'name', key: 'name' },
        { title: t('products.table.unit'), dataIndex: 'unit', key: 'unit' },
        { title: t('products.table.price'), dataIndex: 'unitPrice', key: 'unitPrice', render: (val: number) => `$${val}` },
    ];

    const handleCreate = (values: ProductRequest) => {
        createMutation.mutate(values);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>{t('products.title')}</h2>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    {t('products.addProduct')}
                </Button>
            </div>

            <Table dataSource={products} columns={columns} rowKey="id" loading={isLoading} />

            <Modal
                title={t('products.form.createTitle')}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={form.submit}
                confirmLoading={createMutation.isPending}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="sku" label={t('products.form.sku')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label={t('products.form.name')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="unit" label={t('products.form.unit')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="unitPrice" label={t('products.form.price')} rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item name="description" label={t('products.form.desc')}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
