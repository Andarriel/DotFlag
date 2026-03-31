interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  rawIcon?: boolean;
}

export default function PageHeader({ icon, title, description, rawIcon }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.07] via-transparent to-purple-600/[0.05]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center gap-4 mb-3">
          {rawIcon ? icon : (
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center glow-indigo">
              {icon}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">{title}</h1>
        </div>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl pl-0 sm:pl-[calc(3rem+1rem)]">{description}</p>
      </div>
    </div>
  );
}
