import { useState, useEffect } from 'react';
import { Play, Square, Terminal, Clock, Wifi, Copy, Check, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { instanceService } from '../../services/instanceService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import type { ApiChallengeInstance } from '../../types/api';

function useCountdown(expiresAt: string | null): string {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!expiresAt) { setText('Never'); return; }
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setText('Expired'); return; }
      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setText(h > 0
        ? `${h}h ${m}m ${s.toString().padStart(2, '0')}s`
        : `${m}m ${s.toString().padStart(2, '0')}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return text;
}

export default function DockerInstance({
  challengeId,
  runningChallengeId,
  onInstanceChange,
}: {
  challengeId: number;
  runningChallengeId?: number | null;
  onInstanceChange?: (id: number | null) => void;
}) {
  const api = useAxios();
  const toast = useToast();
  const [instance, setInstance] = useState<ApiChallengeInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState<'start' | 'stop' | 'restart' | null>(null);
  const countdown = useCountdown(instance?.expiresAt ?? null);

  useEffect(() => {
    instanceService.get(api, challengeId)
      .then(data => {
        setInstance(data);
        if (data) onInstanceChange?.(challengeId);
      })
      .catch(() => setInstance(null))
      .finally(() => setLoading(false));
  }, [api, challengeId]);

  const startInstance = async () => {
    setConfirm(null);
    setActionLoading(true);
    try {
      const data = await instanceService.start(api, challengeId);
      setInstance(data);
      onInstanceChange?.(challengeId);
      toast.success('Machine started!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to start machine');
    } finally {
      setActionLoading(false);
    }
  };

  const restartInstance = async () => {
    setConfirm(null);
    setRestartLoading(true);
    try {
      await instanceService.restart(api, challengeId);
      toast.success('Machine restarted');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to restart machine');
    } finally {
      setRestartLoading(false);
    }
  };

  const stopInstance = async () => {
    setConfirm(null);
    setActionLoading(true);
    try {
      await instanceService.stop(api, challengeId);
      setInstance(null);
      onInstanceChange?.(null);
      toast.success('Machine stopped');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to stop machine');
    } finally {
      setActionLoading(false);
    }
  };

  const copyCommand = () => {
    if (!instance) return;
    navigator.clipboard.writeText(`nc ${instance.host} ${instance.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const anotherRunning = runningChallengeId != null && runningChallengeId !== challengeId;

  const CONFIRM_LABELS: Record<NonNullable<typeof confirm>, string> = {
    start: 'Run this machine?',
    stop: 'Stop this machine?',
    restart: 'Restart this machine?',
  };

  return (
    <div className="glass rounded-2xl gradient-border overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-indigo-400" /> Machine Instance
          </h3>
          {!loading && (
            <StatusBadge status={(instance?.status ?? 'stopped') as any} />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <>
            {instance && (
              <>
                <div className="bg-slate-950/60 border border-white/[0.04] rounded-xl p-4 mb-4 font-mono">
                  <p className="text-[11px] text-slate-600 mb-1.5 uppercase tracking-wider">Connect using</p>
                  <div className="flex items-center justify-between">
                    <p className="text-green-400 text-sm">nc {instance.host} {instance.port}</p>
                    <button onClick={copyCommand} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2.5 text-sm bg-slate-800/30 rounded-lg px-3 py-2">
                    <Wifi className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-500">Address</span>
                    <span className="text-white font-mono ml-auto">{instance.host}:{instance.port}</span>
                  </div>
                  <div
                    title={instance.expiresAt
                      ? new Date(instance.expiresAt).toLocaleString()
                      : 'No expiry set'}
                    className="flex items-center gap-2.5 text-sm bg-slate-800/30 rounded-lg px-3 py-2 cursor-default"
                  >
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-500">Expires</span>
                    <span className={`ml-auto font-mono tabular-nums ${
                      countdown === 'Expired' ? 'text-red-400' :
                      countdown === 'Never'   ? 'text-slate-400' :
                                               'text-amber-400'
                    }`}>
                      {countdown}
                    </span>
                  </div>
                </div>
              </>
            )}

            {confirm ? (
              <div className="flex items-center gap-2 bg-slate-800/40 border border-white/[0.06] rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-sm text-slate-300 flex-1">{CONFIRM_LABELS[confirm]}</span>
                <button
                  onClick={
                    confirm === 'start'   ? startInstance :
                    confirm === 'stop'    ? stopInstance  :
                                           restartInstance
                  }
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition">
                  Confirm
                </button>
                <button
                  onClick={() => setConfirm(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {instance && (
                  <button
                    onClick={() => setConfirm('restart')}
                    disabled={restartLoading || actionLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800/50 text-slate-400 border border-white/[0.06] hover:text-white hover:bg-slate-700/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                    {restartLoading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><RefreshCw className="w-4 h-4" /> Restart</>}
                  </button>
                )}
                <button
                  onClick={
                    instance           ? () => setConfirm('stop') :
                    !anotherRunning    ? () => setConfirm('start') :
                    undefined
                  }
                  disabled={actionLoading || restartLoading || (!instance && anotherRunning)}
                  title={!instance && anotherRunning ? 'Stop your current machine first' : undefined}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                    instance
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15'
                      : anotherRunning
                      ? 'bg-slate-800/30 text-slate-600 border border-white/[0.04] cursor-not-allowed'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/15'
                  }`}>
                  {actionLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : instance
                    ? <><Square className="w-4 h-4" /> Stop</>
                    : <><Play className="w-4 h-4" /> Run</>}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
