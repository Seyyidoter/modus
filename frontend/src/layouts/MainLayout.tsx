import React from 'react';
import { Layout, Menu, Select, Space } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    AppstoreOutlined,
    DropboxOutlined,
    SwapOutlined,
    GlobalOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Button } from 'antd';

const { Header, Content, Sider } = Layout;

export const MainLayout: React.FC = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();

    const items = [
        {
            key: '/',
            icon: <AppstoreOutlined />,
            label: <Link to="/">{t('dashboard.title')}</Link>,
        },
        {
            key: '/products',
            icon: <AppstoreOutlined />,
            label: <Link to="/products">{t('menu.products')}</Link>,
        },
        {
            key: '/stock',
            icon: <DropboxOutlined />,
            label: <Link to="/stock">{t('menu.stock')}</Link>,
        },
        {
            key: '/customers',
            icon: <TeamOutlined />,
            label: <Link to="/customers">Müşteriler</Link>,
        },
        {
            key: '/demands',
            icon: <FileTextOutlined />,
            label: <Link to="/demands">Talepler</Link>,
        },
        {
            key: '/offers',
            icon: <DollarOutlined />,
            label: <Link to="/offers">Teklifler</Link>,
        },
        {
            key: '/movements',
            icon: <SwapOutlined />,
            label: <Link to="/movements">{t('menu.movements')}</Link>,
        },
    ];

    if (user?.role === 'ADMIN') {
        items.push({
            key: '/users',
            icon: <TeamOutlined />, // Reusing TeamOutlined or use UserOutlined
            label: <Link to="/users">Kullanıcılar</Link>,
        });
    }

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                width={250}
                style={{ height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
            >
                <div style={{
                    height: '64px',
                    margin: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    borderRadius: '6px'
                }}>
                    MODUS V1
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={items}
                />
            </Sider>
            <Layout style={{ marginLeft: 250 }}>
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Space>
                        <GlobalOutlined />
                        <Select
                            defaultValue={i18n.language || 'en'}
                            style={{ width: 120 }}
                            onChange={changeLanguage}
                            options={[
                                { value: 'en', label: 'English' },
                                { value: 'tr', label: 'Türkçe' },
                            ]}
                        />
                        <span style={{ marginLeft: 16 }}>{user?.firstName} {user?.lastName}</span>
                        <Button type="link" onClick={logout} icon={<LogoutOutlined />}>
                            {t('auth.logout', 'Logout')}
                        </Button>
                    </Space>
                </Header>
                <Content style={{ margin: '16px 16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
