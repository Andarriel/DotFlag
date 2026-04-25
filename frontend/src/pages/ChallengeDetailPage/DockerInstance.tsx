import { useState, useEffect } from 'react';
import { Play, Square, Terminal, Clock, Wifi, Copy, Check, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { instanceService } from '../../services/instanceService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import type { ApiChallengeInstance } from '../../types/api';

export default function DockerInstance({ challengeId }: { challengeId: number }) {
  const api = useAxios();
  const toast = useToast();
  const [instance, setInstance] = useState<ApiChallengeInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    instanceService.get(api, challengeId)
      .then(data => setInstance(data))
      .catch(() => setInstance(null))
      .finally(() => setLoading(false));
  }, [api, challengeId]);

  const startInstance = async () => {
    setActionLoading(true);
    try {
      const data = await instanceService.start(api, challengeId);
      setInstance(data);
      toast.success('Instance started!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to start instance');
    } finally {
      setActionLoading(false);
    }
  };

  const stopInstance = async () => {
    setActionLoading(true);
    try {
      await instanceService.stop(api, challengeId);
      setInstance(null);
      toast.success('Instance stopped');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to stop instance');
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

  return (
    <div className="glass rounded-2xl gradient-border overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-indigo-400" /> Docker Instance
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
                  <div className="flex items-center gap-2.5 text-sm bg-slate-800/30 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-500">Expires</span>
                    <span className="text-white ml-auto">
                      {instance.expiresAt
                        ? new Date(instance.expiresAt).toLocaleTimeString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={instance ? stopInstance : startInstance}
              disabled={actionLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                instance
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15'
              }`}>
              {actionLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : instance
                  ? <><Square className="w-4 h-4" /> Stop Instance</>
                  : <><Play className="w-4 h-4" /> Start Instance</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
