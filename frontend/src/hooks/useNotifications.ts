import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, type NotificationDto } from '../services/notificationService';
import { useAxios } from '../context/AxiosContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const TOAST_FN: Record<string, 'firstBlood' | 'info' | 'warning'> = {
  firstBlood: 'firstBlood',
  announcement: 'info',
  system: 'warning',
};

export function useNotifications() {
  const api = useAxios();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const knownIds = useRef<Set<number>>(new Set());
  const initialized = useRef(false);
  const polling = useRef(false);
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const pollForNew = useCallback(() => {
    if (!isAuthenticated || polling.current) return;
    polling.current = true;
    notificationService.getUnreadCount(api).then(count => {
      setUnreadCount(count);

      // First poll — just seed the known IDs, don't toast
      if (!initialized.current) {
        initialized.current = true;
        if (count > 0) {
          notificationService.getAll(api).then(data => {
            knownIds.current = new Set(data.map(n => n.id));
            setNotifications(data);
          }).catch(() => {}).finally(() => { polling.current = false; });
        } else {
          polling.current = false;
        }
        return;
      }

      // If count went up, fetch and toast new ones
      if (count > 0) {
        notificationService.getAll(api).then(data => {
          const newOnes = data.filter(n => !n.isRead && !knownIds.current.has(n.id));
          newOnes.forEach(n => {
            const fn = TOAST_FN[n.type] ?? 'info';
            toastRef.current[fn](n.message);
          });
          knownIds.current = new Set(data.map(n => n.id));
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.isRead).length);
        }).catch(() => {}).finally(() => { polling.current = false; });
      } else {
        polling.current = false;
      }
    }).catch(() => { polling.current = false; });
  }, [api, isAuthenticated]);

  const fetchAll = useCallback(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    notificationService.getAll(api)
      .then(data => {
        knownIds.current = new Set(data.map(n => n.id));
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [api, isAuthenticated]);

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead(api).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [api]);

  // Poll every 60s
  useEffect(() => {
    pollForNew();
    const interval = setInterval(pollForNew, 60000);
    return () => clearInterval(interval);
  }, [pollForNew]);

  return { notifications, unreadCount, loading, fetchAll, markAllAsRead };
}
