import React, { useState } from 'react';
import { Table, Select, Card, Alert, Button, Modal, Tag } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { warehouseApi } from '../api/warehouses';
import { stockApi } from '../api/stock';
import { useTranslation } from 'react-i18next';
import type { StockSummary } from '../types';
import dayjs from 'dayjs';

export const StockPage: React.FC = () => {
    const { t } = useTranslation();
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
    const [historyProductId, setHistoryProductId] = useState<string | null>(null);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    const { data: warehouses } = useQuery({
        queryKey: ['warehouses'],
        queryFn: warehouseApi.getAll
    });

    const { data: stock, isLoading } = useQuery({
        queryKey: ['stock', selectedWarehouseId],
        queryFn: () => stockApi.getOverview(selectedWarehouseId!),
        enabled: !!selectedWarehouseId,
        refetchInterval: 10000
    });

    // Query for history, enabled only when modal is open and productId is set
    const { data: history, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['stockHistory', historyProductId],
        queryFn: () => stockApi.getHistory(historyProductId!),
        enabled: !!historyProductId && isHistoryVisible
    });

    const showHistory = (productId: string) => {
        setHistoryProductId(productId);
        setIsHistoryVisible(true);
    };

    const columns = [
        { title: t('stock.table.sku'), dataIndex: 'sku', key: 'sku' },
        { title: t('stock.table.product'), dataIndex: 'productName', key: 'productName' },
        { title: t('stock.table.quantity'), dataIndex: 'quantity', key: 'quantity', render: (val: number) => <strong>{val}</strong> },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: StockSummary) => (
                <Button
                    icon={<HistoryOutlined />}
                    size="small"
                    onClick={() => showHistory(record.productId)}
                    title="View History"
                />
            )
        }
    ];

    const historyColumns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')
        },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag>{type}</Tag> },
        { title: 'Warehouse', dataIndex: 'warehouseName', key: 'warehouseName' },
        { title: 'Qty', dataIndex: 'quantity', key: 'quantity', render: (val: number) => <strong>{val}</strong> },
        { title: 'Note', dataIndex: 'note', key: 'note' },
    ];

    return (
        <div className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1 className="text-2xl font-bold">{t('stock.title')}</h1>
            </div>

            <Card style={{ marginBottom: 20 }}>
                <span>{t('stock.selectWarehouse')} </span>
                <Select
                    style={{ width: 250, marginLeft: 10 }}
                    placeholder={t('stock.placeholder')}
                    options={warehouses?.map(w => ({ label: w.name, value: w.id }))}
                    onChange={setSelectedWarehouseId}
                />
            </Card>

            {!selectedWarehouseId ? (
                <Alert message={t('stock.alert')} type="info" showIcon />
            ) : (
                <Table
                    dataSource={stock}
                    columns={columns}
                    rowKey="productId"
                    loading={isLoading}
                />
            )}

            <Modal
                title="Product Stock History"
                open={isHistoryVisible}
                onCancel={() => setIsHistoryVisible(false)}
                footer={null}
                width={800}
            >
                <Table
                    dataSource={history}
                    columns={historyColumns}
                    rowKey="id"
                    loading={isHistoryLoading}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </div>
    );
};
