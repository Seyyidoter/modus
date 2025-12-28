import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Row, Col } from 'antd';
import { LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onFinish = async (values: any) => {
        setLoading(true);
        setError('');
        try {
            const data = await authApi.register(values);
            login(data);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2}>Modus Register</Title>
                </div>

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                    layout="vertical"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                rules={[{ required: true, message: 'Please input your First Name!' }]}
                            >
                                <Input prefix={<IdcardOutlined />} placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                rules={[{ required: true, message: 'Please input your Last Name!' }]}
                            >
                                <Input prefix={<IdcardOutlined />} placeholder="Last Name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                            Register
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text>Already have an account? <Link to="/login">Log in</Link></Text>
                    </div>
                </Form>
            </Card>
        </div>
    );
};
