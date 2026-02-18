import { Download, File } from 'lucide-react';
import type { ChallengeFile } from '../../types';

function FileItem({ file }: { file: ChallengeFile }) {
  return (
    <div className="flex items-center justify-between glass rounded-xl p-3.5 hover:bg-slate-800/40 transition-all group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 bg-slate-800/50 border border-white/[0.04] rounded-lg flex items-center justify-center shrink-0">
          <File className="w-4 h-4 text-slate-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{file.name}</p>
          <p className="text-[11px] text-slate-600">{file.size}</p>
        </div>
      </div>
      <button className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition shrink-0">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function FileAttachments({ files }: { files: ChallengeFile[] }) {
  if (files.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 gradient-border">
      <h3 className="text-base font-bold text-white mb-4">Attachments</h3>
      <div className="space-y-2">
        {files.map(file => <FileItem key={file.id} file={file} />)}
      </div>
    </div>
  );
}
