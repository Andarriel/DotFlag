import { RefreshCw, FileText, Container } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import type { DockerImage } from '../../types';

function DockerRow({ image }: { image: DockerImage }) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Container className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">{image.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={image.status} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-300 font-mono">{image.ip}:{image.port}</td>
      <td className="px-4 py-3 text-sm text-slate-400">{image.uptime}</td>
      <td className="px-4 py-3 text-sm text-slate-400">{new Date(image.expiresAt).toLocaleTimeString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button title="Restart" className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded transition">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button title="View logs" className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition">
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function DockerMonitor({ images }: { images: DockerImage[] }) {
  const running = images.filter(i => i.status === 'running').length;
  const errored = images.filter(i => i.status === 'error').length;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Docker Monitor</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400">Total Images</p>
          <p className="text-2xl font-bold text-white">{images.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-sm text-slate-400">Running</p>
          <p className="text-2xl font-bold text-green-400">{running}</p>
        </div>
        <div className="bg-slate-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-sm text-slate-400">Errors</p>
          <p className="text-2xl font-bold text-red-400">{errored}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                {['Image', 'Status', 'Address', 'Uptime', 'Expires', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {images.map(img => <DockerRow key={img.id} image={img} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
