import React, { useState, useEffect } from 'react';
import { Server, Database, Shield, Activity, Github, Layout, Code, Cpu, Palette } from 'lucide-react';

export function SystemStatus() {
  const [heartbeat, setHeartbeat] = useState<number | null>(null);
  const [isOnline, setIsOnline,] = useState(false);
  const [dbeat, setDbHeartbeat] = useState<number | null>(null);
  const [dBstatus, setDbOnline,] = useState(false);

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
      } catch (error) {
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
  const dBText = dBstatus ? 'Operational' : 'Offline';


  const statusText = isOnline ? 'Operational' : 'Offline';
  const statusColor = isOnline  ? 'bg-green-400/10 text-green-400 ring-green-400/20' : 'bg-red-400/10 text-red-400 ring-red-400/20';
  const randText = Math.floor(Math.random() * 51);

  const systems = [
    { name: 'API Gateway', status: statusText, ping: pingText, icon: Server, isLive: true },
    { name: 'Database', status: statusText, ping: dbText, icon: Database, isLive: true },
    { name: 'Containers', status: randText+' Active', ping: pingText, icon: Shield, isLive: true },
    { name: 'Core Engine', status: statusText, ping: pingText, icon: Activity, isLive: true },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Activity className="text-green-500" /> System Operational Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((sys) => (
          <div key={sys.name} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <sys.icon className="h-5 w-5 text-indigo-400" />
              <span className="text-slate-300 font-medium">{sys.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">{sys.ping}</span>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                // Use dynamic color for live systems, default green for static ones
                sys.isLive ? statusColor : 'bg-green-400/10 text-green-400 ring-green-400/20'
              }`}>
                {sys.status}
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
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Tech Stack</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stack.map((tech) => (
          <div 
            key={tech.name} 
            className="flex items-center gap-3 p-4 bg-slate-950 rounded-lg border border-slate-800 hover:border-indigo-500/50 transition"
          >
            <tech.icon className={`h-6 w-6 ${tech.color}`} />
            <span className={`font-medium ${tech.color}`}>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeamSection() {
  const team = [
    { name: 'Pavel', role: 'Developer Member 1', github: 'https://github.com/Pabblusansky' },
    { name: 'Ivan', role: 'Developer Member 2', github: 'https://github.com/IvanGazul' },
    { name: 'Marius', role: 'Developer Member 3', github: 'https://github.com/Vlanatex' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Core Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.name} className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 text-center hover:border-indigo-500/50 transition">
            <div className="mx-auto h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-indigo-400">
              {member.name[0]}
            </div>
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{member.role}</p>
            <div className="flex justify-center">
              <a 
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition"
                aria-label={`${member.name}'s GitHub profile`}
              >
                <Github className="w-5 h-5"/>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}