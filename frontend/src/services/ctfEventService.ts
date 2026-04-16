import type { AxiosInstance } from 'axios';
import type { ApiCtfStatus, ActionResponse, UpdateCtfEventPayload } from '../types/api';

export const ctfEventService = {
  getStatus: (api: AxiosInstance) =>
    api.get<ApiCtfStatus>('/ctf/status').then(res => res.data),

  update: (api: AxiosInstance, data: UpdateCtfEventPayload) =>
    api.put<ActionResponse>('/ctf/event', data).then(res => res.data),
};
