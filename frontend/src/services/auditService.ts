import type { AxiosInstance } from 'axios';
import type {
  ApiAuditLogPage,
  AuditLogFilter,
  ActionResponse,
} from '../types/api';

export const auditService = {
  getAll: (api: AxiosInstance, filter: AuditLogFilter = {}) =>
    api.get<ApiAuditLogPage>('/admin/logs', { params: filter }).then(res => res.data),

  deleteById: (api: AxiosInstance, id: number) =>
    api.delete<ActionResponse>(`/admin/logs/${id}`).then(res => res.data),

  deleteOlderThan: (api: AxiosInstance, cutoff: string) =>
    api.delete<ActionResponse>('/admin/logs/older-than', { params: { cutoff } }).then(res => res.data),

  exportCsv: (api: AxiosInstance, filter: AuditLogFilter = {}) =>
    api.get<Blob>('/admin/logs/export', { params: filter, responseType: 'blob' }).then(res => res.data),
};
