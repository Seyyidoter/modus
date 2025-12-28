import React, { type ReactNode } from 'react';
import { Card } from 'antd';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
    loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading }) => {
    return (
        <Card loading={loading} bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center' }} hoverable style={{ borderRadius: 12 }}>
            <div
                style={{
                    backgroundColor: `${color}20`, // %20 opacity
                    color: color,
                    padding: 16,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                }}
            >
                {icon}
            </div>
            <div style={{ marginLeft: 20 }}>
                <div style={{ color: '#8c8c8c', fontSize: 14, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', lineHeight: 1 }}>{value}</div>
            </div>
        </Card>
    );
};
