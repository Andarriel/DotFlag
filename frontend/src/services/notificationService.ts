import type { AxiosInstance } from 'axios';

export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  type: string;
  createdOn: string;
  isRead: boolean;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: string;
}

export const notificationService = {
  getAll: (api: AxiosInstance) =>
    api.get<NotificationDto[]>('/notifications').then(res => res.data),

  getUnreadCount: (api: AxiosInstance) =>
    api.get<{ count: number }>('/notifications/unread-count').then(res => res.data.count),

  markAllAsRead: (api: AxiosInstance) =>
    api.put('/notifications/read-all').then(res => res.data),

  create: (api: AxiosInstance, payload: CreateNotificationPayload) =>
    api.post('/notifications', payload).then(res => res.data),
};
