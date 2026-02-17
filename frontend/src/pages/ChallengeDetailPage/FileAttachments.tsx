import { Download, File } from 'lucide-react';
import type { ChallengeFile } from '../../types';

function FileItem({ file }: { file: ChallengeFile }) {
  return (
    <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition">
      <div className="flex items-center gap-3">
        <File className="w-5 h-5 text-slate-400" />
        <div>
          <p className="text-sm font-medium text-white">{file.name}</p>
          <p className="text-xs text-slate-500">{file.size}</p>
        </div>
      </div>
      <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function FileAttachments({ files }: { files: ChallengeFile[] }) {
  if (files.length === 0) return null;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Attachments</h3>
      <div className="space-y-2">
        {files.map(file => <FileItem key={file.id} file={file} />)}
      </div>
    </div>
  );
}
