import { RefreshCw, FileText, Container } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import type { DockerImage } from '../../types';

function DockerRow({ image }: { image: DockerImage }) {
  return (
    <tr className="hover:bg-slate-800/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Container className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-sm font-semibold text-white">{image.name}</span>
        </div>
      </td>
      <td className="px-4 py-3"><StatusBadge status={image.status} /></td>
      <td className="px-4 py-3 text-sm text-slate-300 font-mono hidden sm:table-cell">{image.ip}:{image.port}</td>
      <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">{image.uptime}</td>
      <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">{new Date(image.expiresAt).toLocaleTimeString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          <button title="Restart" className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button title="View logs" className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition">
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function DockerMonitor({ images }: { images: DockerImage[] }) {
  const running = images.filter(i => i.status === 'running').length;
  const errored = images.filter(i => i.status === 'error').length;

  const stats = [
    { label: 'Total Images', value: images.length, color: 'text-white', border: 'border-white/[0.06]' },
    { label: 'Running', value: running, color: 'text-green-400', border: 'border-green-500/20' },
    { label: 'Errors', value: errored, color: 'text-red-400', border: 'border-red-500/20' },
  ];

  const headers = [
    { label: 'Image', className: '' },
    { label: 'Status', className: '' },
    { label: 'Address', className: 'hidden sm:table-cell' },
    { label: 'Uptime', className: 'hidden md:table-cell' },
    { label: 'Expires', className: 'hidden lg:table-cell' },
    { label: 'Actions', className: '' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-5">Docker Monitor</h2>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className={`glass rounded-xl p-4 border ${s.border}`}>
            <p className="text-[11px] text-slate-500 mb-0.5">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden gradient-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/30 border-b border-white/[0.04]">
              <tr>
                {headers.map(h => (
                  <th key={h.label} className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${h.className}`}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {images.map(img => <DockerRow key={img.id} image={img} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
