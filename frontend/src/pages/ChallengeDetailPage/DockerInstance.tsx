import { useState } from 'react';
import { Play, Square, Terminal, Clock, Wifi } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import type { DockerImage } from '../../types';

export default function DockerInstance({ docker }: { docker: DockerImage }) {
  const [status, setStatus] = useState(docker.status);

  const toggleInstance = () => {
    setStatus(prev => prev === 'running' ? 'stopped' : 'running');
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Docker Instance
        </h3>
        <StatusBadge status={status} />
      </div>

      {status === 'running' && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 font-mono">
          <p className="text-xs text-slate-500 mb-2">Connect using:</p>
          <p className="text-green-400 text-sm">nc {docker.ip} {docker.port}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Wifi className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400">Address:</span>
          <span className="text-white font-mono">{docker.ip}:{docker.port}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400">Uptime:</span>
          <span className="text-white">{status === 'running' ? docker.uptime : '0m'}</span>
        </div>
      </div>

      <button
        onClick={toggleInstance}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
          status === 'running'
            ? 'bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600/20'
            : 'bg-green-600/10 text-green-400 border border-green-500/30 hover:bg-green-600/20'
        }`}
      >
        {status === 'running' ? <><Square className="w-4 h-4" /> Stop Instance</> : <><Play className="w-4 h-4" /> Start Instance</>}
      </button>
    </div>
  );
}
