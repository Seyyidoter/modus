import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const useNotification = () => {
    const notify = (type: NotificationType, message: string, description?: string) => {
        notification[type]({
            message,
            description,
            placement: 'topRight'
        });
    };

    return {
        notifySuccess: (msg: string, desc?: string) => notify('success', msg, desc),
        notifyError: (msg: string, desc?: string) => notify('error', msg, desc),
        notifyInfo: (msg: string, desc?: string) => notify('info', msg, desc),
        notifyWarning: (msg: string, desc?: string) => notify('warning', msg, desc),
    };
};
