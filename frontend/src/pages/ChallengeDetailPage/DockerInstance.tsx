import { useState } from 'react';
import { Play, Square, Terminal, Clock, Wifi, Copy, Check } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import type { DockerImage } from '../../types';

export default function DockerInstance({ docker }: { docker: DockerImage }) {
  const [status, setStatus] = useState(docker.status);
  const [copied, setCopied] = useState(false);

  const toggleInstance = () => setStatus(prev => prev === 'running' ? 'stopped' : 'running');

  const copyCommand = () => {
    navigator.clipboard.writeText(`nc ${docker.ip} ${docker.port}`);
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
          <StatusBadge status={status} />
        </div>

        {status === 'running' && (
          <div className="bg-slate-950/60 border border-white/[0.04] rounded-xl p-4 mb-4 font-mono group">
            <p className="text-[11px] text-slate-600 mb-1.5 uppercase tracking-wider">Connect using</p>
            <div className="flex items-center justify-between">
              <p className="text-green-400 text-sm">nc {docker.ip} {docker.port}</p>
              <button onClick={copyCommand} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2.5 text-sm bg-slate-800/30 rounded-lg px-3 py-2">
            <Wifi className="w-4 h-4 text-slate-600" />
            <span className="text-slate-500">Address</span>
            <span className="text-white font-mono ml-auto">{docker.ip}:{docker.port}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm bg-slate-800/30 rounded-lg px-3 py-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-slate-500">Uptime</span>
            <span className="text-white ml-auto">{status === 'running' ? docker.uptime : '0m'}</span>
          </div>
        </div>

        <button onClick={toggleInstance}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
            status === 'running'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15'
              : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15'
          }`}>
          {status === 'running' ? <><Square className="w-4 h-4" /> Stop Instance</> : <><Play className="w-4 h-4" /> Start Instance</>}
        </button>
      </div>
    </div>
  );
}
