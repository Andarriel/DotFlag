import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function BrandLogo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className ?? ''}`}>
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
        <Shield className="w-7 h-7 text-white" />
      </div>
      <span className="text-3xl font-bold">
        <span className="text-white">Dot</span>
        <span className="text-indigo-500">Flag</span>
      </span>
    </Link>
  );
}
