import { useState } from 'react';
import { RefreshCw, FileText, Container, Trash2, Settings, Save, X } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import { useAdminContext } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { dockerAdminService } from '../../services/dockerAdminService';
import { useAxios } from '../../context/AxiosContext';
import { useToast } from '../../context/ToastContext';
import { USE_MOCK } from '../../config';
import type { ApiDockerContainer } from '../../types/api';

function ContainerRow({ container, onKill, onRestart, onLogs }: {
  container: ApiDockerContainer;
  onKill: () => void;
  onRestart: () => void;
  onLogs: () => void;
}) {
  return (
    <tr className="hover:bg-slate-800/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{container.challengeName}</span>
          <span className="text-[11px] text-slate-600 font-mono">{container.containerId.slice(0, 12)}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-300 hidden sm:table-cell">{container.username}</td>
      <td className="px-4 py-3"><StatusBadge status={container.status as any} /></td>
      <td className="px-4 py-3 text-sm text-slate-300 font-mono hidden md:table-cell">:{container.hostPort}</td>
      <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">
        {container.expiresAt ? new Date(container.expiresAt).toLocaleTimeString() : 'Never'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          <button onClick={onRestart} title="Restart"
            className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={onLogs} title="View logs"
            className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition">
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button onClick={onKill} title="Kill"
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

const inputClass = "w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const labelClass = "block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

export default function DockerMonitor() {
  const { dockerContainers, dockerSettings, killDockerContainer, restartDockerContainer, updateDockerSettings, refreshDocker } = useAdminContext();
  const { user } = useAuth();
  const api = useAxios();
  const toast = useToast();
  const isOwner = user?.role === 'Owner';

  const [pendingKill, setPendingKill] = useState<ApiDockerContainer | null>(null);
  const [logsContainer, setLogsContainer] = useState<ApiDockerContainer | null>(null);
  const [logs, setLogs] = useState('');
  const [logsLoading, setLogsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    host: dockerSettings?.host ?? 'tcp://localhost:2375',
    maxGlobalInstances: dockerSettings?.maxGlobalInstances ?? 20,
    instanceTimeoutMinutes: dockerSettings?.instanceTimeoutMinutes ?? 60,
  });

  const containers = USE_MOCK ? [] : dockerContainers;
  const running = containers.filter(c => c.status === 'running').length;

  const handleViewLogs = async (container: ApiDockerContainer) => {
    setLogsContainer(container);
    setLogs('');
    setLogsLoading(true);
    try {
      const data = await dockerAdminService.getLogs(api, container.instanceId);
      setLogs(data.logs || '(no output)');
    } catch {
      setLogs('Failed to fetch logs.');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    await updateDockerSettings(settingsForm);
    setShowSettings(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Docker Monitor</h2>
        <div className="flex gap-2">
          <button onClick={refreshDocker}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          {isOwner && (
            <button onClick={() => {
              setSettingsForm({
                host: dockerSettings?.host ?? 'tcp://localhost:2375',
                maxGlobalInstances: dockerSettings?.maxGlobalInstances ?? 20,
                instanceTimeoutMinutes: dockerSettings?.instanceTimeoutMinutes ?? 60,
              });
              setShowSettings(true);
            }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition">
              <Settings className="w-3.5 h-3.5" /> Settings
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total', value: containers.length, color: 'text-white', border: 'border-white/[0.06]' },
          { label: 'Running', value: running, color: 'text-green-400', border: 'border-green-500/20' },
          { label: 'Max Allowed', value: dockerSettings?.maxGlobalInstances ?? '—', color: 'text-indigo-400', border: 'border-indigo-500/20' },
        ].map(s => (
          <div key={s.label} className={`glass rounded-xl p-4 border ${s.border}`}>
            <p className="text-[11px] text-slate-500 mb-0.5">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {dockerSettings && (
        <div className="glass rounded-xl px-4 py-3 mb-5 flex items-center gap-3 text-sm border border-white/[0.04]">
          <Container className="w-4 h-4 text-slate-600 shrink-0" />
          <span className="text-slate-500">Docker host:</span>
          <span className="text-white font-mono">{dockerSettings.host}</span>
          {dockerSettings.instanceTimeoutMinutes > 0 && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">Timeout: {dockerSettings.instanceTimeoutMinutes}m</span>
            </>
          )}
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden gradient-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/30 border-b border-white/[0.04]">
              <tr>
                {['Challenge', 'User', 'Status', 'Port', 'Expires', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${
                    i === 1 ? 'hidden sm:table-cell' : i === 3 ? 'hidden md:table-cell' : i === 4 ? 'hidden lg:table-cell' : ''
                  }`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {containers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-600">No active instances</td>
                </tr>
              ) : containers.map(c => (
                <ContainerRow key={c.instanceId} container={c}
                  onKill={() => setPendingKill(c)}
                  onRestart={() => restartDockerContainer(c.instanceId)}
                  onLogs={() => handleViewLogs(c)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kill confirmation modal */}
      <Modal
        isOpen={pendingKill != null}
        onClose={() => setPendingKill(null)}
        title="Kill Instance"
        onConfirm={async () => { if (pendingKill) await killDockerContainer(pendingKill.instanceId); setPendingKill(null); }}
        confirmLabel="Kill"
        confirmVariant="danger"
      >
        <p className="text-sm text-slate-400">
          Remove instance for <span className="text-white font-semibold">{pendingKill?.username}</span> running <span className="text-white font-semibold">{pendingKill?.challengeName}</span>?
        </p>
      </Modal>

      {/* Logs modal */}
      <Modal
        isOpen={logsContainer != null}
        onClose={() => setLogsContainer(null)}
        title={`Logs — ${logsContainer?.challengeName}`}
      >
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-green-400 max-h-96 overflow-y-auto whitespace-pre-wrap">
          {logsLoading ? 'Loading...' : logs}
        </div>
      </Modal>

      {/* Settings modal (Owner only) */}
      {isOwner && (
        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="Docker Server Settings"
          onConfirm={handleSaveSettings}
          confirmLabel="Save"
        >
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Docker Host</label>
              <input type="text" className={inputClass} value={settingsForm.host}
                onChange={e => setSettingsForm(p => ({ ...p, host: e.target.value }))}
                placeholder="tcp://192.168.1.100:2375" />
              <p className="text-[11px] text-slate-600 mt-1">TCP endpoint of your Docker host (e.g. tcp://192.168.1.100:2375)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Max Global Instances</label>
                <input type="number" className={inputClass} min={1} max={500}
                  value={settingsForm.maxGlobalInstances}
                  onChange={e => setSettingsForm(p => ({ ...p, maxGlobalInstances: Number(e.target.value) }))} />
              </div>
              <div>
                <label className={labelClass}>Timeout (minutes)</label>
                <input type="number" className={inputClass} min={0} max={1440}
                  value={settingsForm.instanceTimeoutMinutes}
                  onChange={e => setSettingsForm(p => ({ ...p, instanceTimeoutMinutes: Number(e.target.value) }))} />
                <p className="text-[11px] text-slate-600 mt-1">0 = no timeout</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
