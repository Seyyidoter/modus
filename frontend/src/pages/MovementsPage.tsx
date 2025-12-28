import React, { useState } from 'react';
import { Form, Select, InputNumber, Input, Button, Card, Radio, notification } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseApi } from '../api/warehouses';
import { productApi } from '../api/products';
import { stockApi } from '../api/stock';
import { StockMovementType } from '../types';
import { useTranslation } from 'react-i18next';

export const MovementsPage: React.FC = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [movementType, setMovementType] = useState<StockMovementType | 'TRANSFER'>(StockMovementType.IN);
    const queryClient = useQueryClient();

    const { data: warehouses } = useQuery({ queryKey: ['warehouses'], queryFn: warehouseApi.getAll });
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: productApi.getAll });

    const mutation = useMutation({
        mutationFn: (values: any) => {
            if (movementType === StockMovementType.TRANSFER_IN || movementType === 'TRANSFER') {
                return stockApi.createTransfer({
                    productId: values.productId,
                    sourceWarehouseId: values.sourceWarehouseId,
                    targetWarehouseId: values.targetWarehouseId,
                    quantity: values.quantity,
                    note: values.note
                });
            } else {
                return stockApi.createMovement({
                    productId: values.productId,
                    warehouseId: values.warehouseId,
                    type: movementType as StockMovementType,
                    quantity: values.quantity,
                    note: values.note
                });
            }
        },
        onSuccess: () => {
            notification.success({ message: t('movements.success') });
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ['stock'] });
        },
        onError: (err: any) => {
            if (err.fieldErrors) {
                const fields = Object.keys(err.fieldErrors).map(key => ({
                    name: key,
                    errors: [err.fieldErrors[key]]
                }));
                form.setFields(fields);
            }
        }
    });

    const onFinish = (values: any) => {
        mutation.mutate(values);
    };

    const isTransfer = movementType === 'TRANSFER';

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2>{t('movements.title')}</h2>
            <Card>
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ type: StockMovementType.IN }}>
                    <Form.Item label="" name="typeMode">
                        <Radio.Group
                            onChange={e => {
                                const val = e.target.value;
                                setMovementType(val);
                            }}
                            value={movementType}
                            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                        >
                            <Radio.Button value={StockMovementType.IN}>{t('movements.type.in')}</Radio.Button>
                            <Radio.Button value={StockMovementType.OUT}>{t('movements.type.out')}</Radio.Button>
                            <Radio.Button value="TRANSFER">{t('movements.type.transfer')}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="productId" label={t('movements.form.product')} rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder={t('movements.form.selectProduct')}
                            optionFilterProp="children"
                            options={products?.map(p => ({ label: `${p.sku} - ${p.name}`, value: p.id }))}
                        />
                    </Form.Item>

                    {!isTransfer && (
                        <Form.Item name="warehouseId" label={t('movements.form.warehouse')} rules={[{ required: true }]}>
                            <Select placeholder={t('movements.form.selectWarehouse')} options={warehouses?.map(w => ({ label: w.name, value: w.id }))} />
                        </Form.Item>
                    )}

                    {isTransfer && (
                        <>
                            <Form.Item name="sourceWarehouseId" label={t('movements.form.source')} rules={[{ required: true }]}>
                                <Select placeholder={t('movements.form.from')} options={warehouses?.map(w => ({ label: w.name, value: w.id }))} />
                            </Form.Item>
                            <Form.Item name="targetWarehouseId" label={t('movements.form.target')} rules={[{ required: true }]}>
                                <Select placeholder={t('movements.form.to')} options={warehouses?.map(w => ({ label: w.name, value: w.id }))} />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item name="quantity" label={t('movements.form.quantity')} rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0.001} />
                    </Form.Item>

                    <Form.Item name="note" label={t('movements.form.note')}>
                        <Input.TextArea />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={mutation.isPending} block>
                        {isTransfer ? t('movements.form.submitTransfer') : t('movements.form.submitMovement')}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};
