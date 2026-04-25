import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Trash2, Filter, AlertTriangle, X, Download } from 'lucide-react';
import { auditService } from '../../services/auditService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { AuditAction } from '../../types/api';
import type { ApiAuditLog, AuditLogFilter } from '../../types/api';

const ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.ChallengeCreated]: 'Challenge Created',
  [AuditAction.ChallengeUpdated]: 'Challenge Updated',
  [AuditAction.ChallengeDisabled]: 'Challenge Disabled',
  [AuditAction.ChallengeEnabled]: 'Challenge Enabled',
  [AuditAction.FlagChanged]: 'Flag Changed',
  [AuditAction.HintAdded]: 'Hint Added',
  [AuditAction.HintRemoved]: 'Hint Removed',
  [AuditAction.FileUploaded]: 'File Uploaded',
  [AuditAction.FileRemoved]: 'File Removed',
  [AuditAction.UserBanned]: 'User Banned',
  [AuditAction.UserUnbanned]: 'User Unbanned',
  [AuditAction.UserPromoted]: 'User Promoted',
  [AuditAction.UserDemoted]: 'User Demoted',
  [AuditAction.LoginSuccess]: 'Login Success',
  [AuditAction.LoginFailed]: 'Login Failed',
  [AuditAction.PasswordChanged]: 'Password Changed',
  [AuditAction.UserRegistered]: 'User Registered',
  [AuditAction.TeamDisbanded]: 'Team Disbanded',
  [AuditAction.SystemCleanup]: 'System Cleanup',
  [AuditAction.DockerInstanceStarted]: 'Docker Instance Started',
  [AuditAction.DockerInstanceStopped]: 'Docker Instance Stopped',
  [AuditAction.DockerInstanceKilled]: 'Docker Instance Killed',
};

const CHALLENGE_ACTIONS = new Set<AuditAction>([
  AuditAction.ChallengeCreated, AuditAction.ChallengeUpdated, AuditAction.ChallengeDisabled, AuditAction.ChallengeEnabled, AuditAction.FlagChanged,
]);
const EXTRA_ACTIONS = new Set<AuditAction>([
  AuditAction.HintAdded, AuditAction.HintRemoved, AuditAction.FileUploaded, AuditAction.FileRemoved,
]);
const USER_ACTIONS = new Set<AuditAction>([
  AuditAction.UserBanned, AuditAction.UserUnbanned, AuditAction.UserPromoted, AuditAction.UserDemoted,
]);
const SECURITY_ACTIONS = new Set<AuditAction>([
  AuditAction.LoginSuccess, AuditAction.LoginFailed, AuditAction.PasswordChanged, AuditAction.UserRegistered,
]);
const DANGER_ACTIONS = new Set<AuditAction>([
  AuditAction.LoginFailed, AuditAction.UserBanned, AuditAction.FlagChanged,
]);

function actionBadgeClass(action: AuditAction): string {
  if (DANGER_ACTIONS.has(action)) return 'bg-rose-500/15 text-rose-300 border-rose-500/20';
  if (CHALLENGE_ACTIONS.has(action)) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20';
  if (EXTRA_ACTIONS.has(action)) return 'bg-sky-500/15 text-sky-300 border-sky-500/20';
  if (USER_ACTIONS.has(action)) return 'bg-amber-500/15 text-amber-300 border-amber-500/20';
  if (SECURITY_ACTIONS.has(action)) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
  if (action === AuditAction.TeamDisbanded) return 'bg-purple-500/15 text-purple-300 border-purple-500/20';
  return 'bg-slate-500/15 text-slate-300 border-slate-500/20';
}

const PAGE_SIZE = 25;
const ACTION_OPTIONS = (Object.entries(ACTION_LABELS) as [AuditAction, string][])
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export default function AuditLogsTable() {
  const api = useAxios();
  const toast = useToast();
  const { user } = useAuth();
  const isOwner = user?.role === 'Owner';

  const [items, setItems] = useState<ApiAuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [actionFilter, setActionFilter] = useState<AuditAction | ''>('');
  const [actorIdInput, setActorIdInput] = useState('');
  const [actorIdFilter, setActorIdFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const [confirmCutoff, setConfirmCutoff] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const timer = setTimeout(() => {
      setActorIdFilter(actorIdInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [actorIdInput]);

  const filter = useMemo<AuditLogFilter>(() => {
    const f: AuditLogFilter = { page, pageSize: PAGE_SIZE };
    if (actionFilter !== '') f.action = actionFilter;
    const actorId = parseInt(actorIdFilter, 10);
    if (!Number.isNaN(actorId) && actorId > 0) f.actorId = actorId;
    if (fromFilter) f.from = new Date(fromFilter).toISOString();
    if (toFilter) f.to = new Date(toFilter).toISOString();
    return f;
  }, [page, actionFilter, actorIdFilter, fromFilter, toFilter]);

  const load = useCallback(() => {
    setLoading(true);
    auditService.getAll(api, filter)
      .then(res => { setItems(res.items); setTotal(res.total); })
      .catch(() => toast.error('Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, [api, filter, toast]);

  useEffect(() => { load(); }, [load]);

  const resetFilters = () => {
    setActionFilter('');
    setActorIdInput('');
    setActorIdFilter('');
    setFromFilter('');
    setToFilter('');
    setPage(1);
  };

  const deleteOne = async (id: number) => {
    try {
      const res = await auditService.deleteById(api, id);
      if (res.isSuccess) {
        toast.success('Log entry deleted');
        load();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  const runBulkDelete = async () => {
    if (!confirmCutoff) return;
    setBulkDeleting(true);
    try {
      const iso = new Date(confirmCutoff).toISOString();
      const res = await auditService.deleteOlderThan(api, iso);
      if (res.isSuccess) {
        toast.success(res.message || 'Old logs deleted');
        setConfirmCutoff(null);
        setPage(1);
        load();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to delete old logs');
    } finally {
      setBulkDeleting(false);
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const { page: _p, pageSize: _ps, ...rest } = filter;
      const blob = await auditService.exportCsv(api, rest);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Export ready');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const filterByActor = (actorId: number) => {
    setActorIdInput(String(actorId));
    setActorIdFilter(String(actorId));
    setPage(1);
  };

  const filterByAction = (action: AuditAction) => {
    setActionFilter(action);
    setPage(1);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 gradient-border">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Audit Logs</h2>
            <p className="text-sm text-slate-500">Track admin actions, security events, and system changes.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              disabled={exporting || loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all disabled:opacity-50"
              title="Export current filter to CSV (up to 10,000 rows)"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Action</label>
            <select
              value={actionFilter}
              onChange={e => { setPage(1); setActionFilter(e.target.value === '' ? '' : e.target.value as AuditAction); }}
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">All actions</option>
              {ACTION_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Actor ID</label>
            <input
              type="text"
              inputMode="numeric"
              value={actorIdInput}
              onChange={e => { 
                const value = e.target.value.replace(/[^\d]/g, '');
                setActorIdInput(value);
              }}
              placeholder="e.g. 1"
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">From</label>
            <input
              type="datetime-local"
              value={fromFilter}
              onChange={e => { setPage(1); setFromFilter(e.target.value); }}
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">To</label>
            <input
              type="datetime-local"
              value={toFilter}
              onChange={e => { setPage(1); setToFilter(e.target.value); }}
              className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>{total.toLocaleString()} total entries</span>
          </div>
          <div className="flex items-center gap-3">
            {user?.id != null && (
              <button
                onClick={() => filterByActor(user.id)}
                className="text-slate-400 hover:text-indigo-300 transition-colors"
                title="Filter to only your own actions"
              >
                My actions
              </button>
            )}
            <button
              onClick={resetFilters}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-white/[0.04] rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.02] text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actor</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Target</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Metadata</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">IP</th>
                {isOwner && <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider"></th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={isOwner ? 7 : 6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={isOwner ? 7 : 6} className="px-4 py-8 text-center text-slate-500">No entries match these filters.</td></tr>
              ) : items.map(entry => (
                <tr key={entry.id} className="border-t border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">{formatDate(entry.createdOn)}</td>
                  <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">
                    {entry.actorUsername && entry.actorId != null ? (
                      <button
                        onClick={() => filterByActor(entry.actorId!)}
                        className="hover:text-indigo-300 transition-colors"
                        title="Filter by this actor"
                      >
                        {entry.actorUsername} <span className="text-slate-600">#{entry.actorId}</span>
                      </button>
                    ) : (
                      <span className="text-slate-600">system</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <button
                      onClick={() => filterByAction(entry.action)}
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border hover:brightness-125 transition-all ${actionBadgeClass(entry.action)}`}
                      title="Filter by this action"
                    >
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                    {entry.targetType ? <span>{entry.targetType}{entry.targetId != null && <span className="text-slate-600"> #{entry.targetId}</span>}</span> : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 max-w-sm truncate" title={entry.metadata ?? ''}>
                    {entry.metadata ?? <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap font-mono text-xs">
                    {entry.ipAddress ?? <span className="text-slate-600">—</span>}
                  </td>
                  {isOwner && (
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => deleteOne(entry.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded-lg border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded-lg border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="glass rounded-2xl p-6 border border-rose-500/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Danger Zone</h3>
              <p className="text-sm text-slate-500">Bulk delete audit history older than a chosen date. Owner only.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="datetime-local"
              value={confirmCutoff ?? ''}
              onChange={e => setConfirmCutoff(e.target.value || null)}
              className="flex-1 bg-slate-800/50 border border-white/[0.06] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500/50"
            />
            <button
              onClick={runBulkDelete}
              disabled={!confirmCutoff || bulkDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 border border-rose-500/30 text-rose-300 rounded-xl text-sm font-medium hover:bg-rose-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {bulkDeleting ? 'Deleting...' : 'Delete older than'}
            </button>
            {confirmCutoff && (
              <button
                onClick={() => setConfirmCutoff(null)}
                className="flex items-center gap-2 px-3 py-2 border border-white/[0.06] text-slate-400 rounded-xl text-sm hover:text-white hover:bg-white/[0.04]"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
