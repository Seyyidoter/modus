import React from 'react';
import { Card, Col, Row, Table, List, Typography } from 'antd';
import {
    ShoppingOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined,
    AlertOutlined,
    RightOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { reportApi } from '../api/reports';
import { StatCard } from '../components/StatCard';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: reportApi.getDashboardData
    });

    const lowStockColumns = [
        { title: t('dashboard.product'), dataIndex: 'productName', key: 'productName' },
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        {
            title: t('dashboard.quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty: number) => <span style={{ color: '#cf1322', fontWeight: 'bold', backgroundColor: '#fff1f0', padding: '2px 8px', borderRadius: 4, border: '1px solid #ffa39e' }}>{qty}</span>
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: any) => (
                <a onClick={() => navigate(`/stock`, { state: { selectedWarehouseId: null, productId: record.productId } })}>
                    <RightOutlined />
                </a>
            )
        }
    ];

    if (isLoading || !data) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    return (
        <div className="p-6">
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>{t('dashboard.title')}</Title>
                <div style={{ color: '#8c8c8c' }}>Overview of your business performance</div>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={t('dashboard.totalProducts')}
                        value={data.totalProducts}
                        icon={<ShoppingOutlined />}
                        color="#1890ff"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={t('dashboard.totalCustomers')}
                        value={data.totalCustomers}
                        icon={<TeamOutlined />}
                        color="#52c41a"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={t('dashboard.pendingDemands')}
                        value={data.pendingDemands}
                        icon={<FileTextOutlined />}
                        color="#faad14"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={t('dashboard.totalRevenue')}
                        value={`$${data.totalAcceptedOfferValue.toLocaleString()}`}
                        icon={<DollarOutlined />}
                        color="#722ed1"
                    />
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <Card
                        title={<><AlertOutlined style={{ color: '#cf1322', marginRight: 8 }} /> {t('dashboard.lowStock')}</>}
                        style={{ borderRadius: 12, height: '100%' }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Table
                            dataSource={data.lowStockItems}
                            columns={lowStockColumns}
                            rowKey="productId"
                            pagination={false}
                            size="middle"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title={t('dashboard.recentActivity')}
                        style={{ borderRadius: 12, height: '100%' }}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={data.recentActivities}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1890ff', marginTop: 8 }} />}
                                        title={<span style={{ fontWeight: 500 }}>{item.description}</span>}
                                        description={item.timestamp}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
