import { useState, useEffect } from 'react';
import { Server, Database, Shield, Activity, Github, Layout, Code, Cpu, Palette } from 'lucide-react';

export function SystemStatus() {
  const [heartbeat, setHeartbeat] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [dbeat, setDbHeartbeat] = useState<number | null>(null);
  const [dBstatus, setDbOnline] = useState(false);

  useEffect(() => {
    const checkHeartbeat = async () => {
      const start = performance.now();
      try {
        const res = await fetch('/api/auth/heartbeat', { cache: 'no-store' });
        const res2 = await fetch('/api/auth/heartbeat-db', { cache: 'no-store' });

        if (res.ok || res.status === 401) {
          const end = performance.now();
          setHeartbeat(Math.round(end - start));
          setIsOnline(true);
        } else {
          setHeartbeat(null);
          setIsOnline(false);
        }

        if (res2.ok || res2.status === 401) {
          const end2 = performance.now();
          setDbHeartbeat(Math.round(end2 - start));
          setDbOnline(true);
        } else {
          setDbHeartbeat(null);
          setDbOnline(false);
        }
      } catch {
        setHeartbeat(null);
        setIsOnline(false);
        setDbHeartbeat(null);
        setDbOnline(false);
      }
    };

    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 10000);
    return () => clearInterval(interval);
  }, []);

  const pingText = heartbeat ? `${heartbeat}ms` : '-';
  const dbText = dbeat ? `${dbeat}ms` : '-';
  const statusText = isOnline ? 'Operational' : 'Offline';
  const statusColor = isOnline
    ? 'bg-green-400/10 text-green-400 border-green-500/15'
    : 'bg-red-400/10 text-red-400 border-red-500/15';
  const randText = Math.floor(Math.random() * 51);

  const systems = [
    { name: 'API Gateway', ping: pingText, icon: Server },
    { name: 'Database', ping: dbText, icon: Database },
    { name: 'Containers', ping: `${randText} Active`, icon: Shield },
    { name: 'Core Engine', ping: pingText, icon: Activity },
  ];

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 mb-8 gradient-border noise animate-fade-in-up">
      <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <Activity className="w-5 h-5 text-green-400" /> System Status
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {systems.map((sys) => (
          <div key={sys.name} className="flex items-center justify-between p-3.5 glass rounded-xl">
            <div className="flex items-center gap-3">
              <sys.icon className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-slate-300 font-medium">{sys.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-600">{sys.ping}</span>
              <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusColor}`}>
                {statusText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  const stack = [
    { name: '.NET Core', icon: Code, color: 'text-purple-400' },
    { name: 'React', icon: Layout, color: 'text-cyan-400' },
    { name: 'TypeScript', icon: Code, color: 'text-blue-400' },
    { name: 'PostgreSQL', icon: Database, color: 'text-blue-500' },
    { name: 'TailwindCSS', icon: Palette, color: 'text-teal-400' },
    { name: 'Git & GitHub', icon: Github, color: 'text-orange-400' },
  ];

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 mb-8 gradient-border">
      <h2 className="text-lg font-bold text-white mb-5 text-center">Tech Stack</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stack.map((tech) => (
          <div key={tech.name}
            className="flex items-center gap-3 p-3.5 glass rounded-xl hover:bg-slate-800/30 transition-all group">
            <tech.icon className={`h-5 w-5 ${tech.color}`} />
            <span className={`text-sm font-medium ${tech.color}`}>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeamSection() {
  const team = [
    { name: 'Pavel', role: 'Developer Member 1', github: 'https://github.com/Pabblusansky', avatar: 'https://github.com/Pabblusansky.png' },
    { name: 'Ivan', role: 'Developer Member 2', github: 'https://github.com/Andarriel', avatar: 'https://github.com/Andarriel.png' },
    { name: 'Marius', role: 'Developer Member 3', github: 'https://github.com/Vlanatex', avatar: 'https://github.com/Vlanatex.png' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-5 text-center">Core Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {team.map((member, i) => (
          <div key={member.name} className={`glass rounded-2xl p-6 text-center gradient-border hover:bg-slate-800/30 transition-all animate-fade-in-up opacity-0 stagger-${i + 1}`}>
            <img
              src={member.avatar}
              alt={member.name}
              className="mx-auto h-16 w-16 rounded-xl object-cover mb-4"
            />
            <h3 className="text-base font-bold text-white">{member.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{member.role}</p>
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition"
              aria-label={`${member.name}'s GitHub profile`}
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
