import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, type NotificationDto } from '../services/notificationService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useNotifications() {
  const api = useAxios();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const prevCount = useRef(0);

  const fetchUnreadCount = useCallback(() => {
    if (!isAuthenticated) return;
    notificationService.getUnreadCount(api).then(count => {
      if (count > prevCount.current && prevCount.current > 0) {
        const diff = count - prevCount.current;
        toast.info(`${diff} new notification${diff > 1 ? 's' : ''}`);
      }
      prevCount.current = count;
      setUnreadCount(count);
    }).catch(() => {});
  }, [api, isAuthenticated, toast]);

  const fetchAll = useCallback(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    notificationService.getAll(api)
      .then(data => {
        setNotifications(data);
        const count = data.filter(n => !n.isRead).length;
        setUnreadCount(count);
        prevCount.current = count;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [api, isAuthenticated]);

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead(api).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    prevCount.current = 0;
  }, [api]);

  // Poll unread count every 30s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return { notifications, unreadCount, loading, fetchAll, markAllAsRead };
}
