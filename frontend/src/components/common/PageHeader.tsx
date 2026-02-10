interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function PageHeader({ icon, title, description }: PageHeaderProps) {
  return (
    <div className="bg-slate-900/50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <h1 className="text-4xl font-bold text-white">{title}</h1>
        </div>
        <p className="text-slate-400 max-w-2xl">{description}</p>
      </div>
    </div>
  );
}
