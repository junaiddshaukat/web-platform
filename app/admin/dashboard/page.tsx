'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, Users2, CalendarDays, RefreshCw, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Add types for recent activity
interface AmbassadorRecent {
  name: string;
  university: string;
  bio: string;
}
interface CoreTeamRecent {
  name: string;
  role: string;
}
interface SessionRecent {
  name: string;
  date: string;
  time: string;
  description: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    ambassadors: 0,
    coreTeam: 0,
    sessions: 0,
    loading: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [recent, setRecent] = useState<{
    ambassador: AmbassadorRecent | null;
    coreTeam: CoreTeamRecent | null;
    session: SessionRecent | null;
  }>({
    ambassador: null,
    coreTeam: null,
    session: null,
  });
  const prevStats = useRef(stats);

  // Animated count up
  const [displayStats, setDisplayStats] = useState({
    ambassadors: 0,
    coreTeam: 0,
    sessions: 0,
  });

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Animate count up
    if (!stats.loading) {
      const duration = 600;
      const steps = 30;
      let frame = 0;
      const start = { ...displayStats };
      const { loading, ...end } = stats;
      const interval = setInterval(() => {
        frame++;
        setDisplayStats({
          ambassadors: Math.round(start.ambassadors + (end.ambassadors - start.ambassadors) * (frame / steps)),
          coreTeam: Math.round(start.coreTeam + (end.coreTeam - start.coreTeam) * (frame / steps)),
          sessions: Math.round(start.sessions + (end.sessions - start.sessions) * (frame / steps)),
        });
        if (frame >= steps) clearInterval(interval);
      }, duration / steps);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [stats.ambassadors, stats.coreTeam, stats.sessions, stats.loading]);

  async function fetchStats() {
    setRefreshing(true);
    setStats(s => ({ ...s, loading: true }));
    const [ambRes, coreRes, sessRes] = await Promise.all([
      fetch('/api/ambassadors'),
      fetch('/api/core-team'),
      fetch('/api/sessions'),
    ]);
    const [ambassadors, coreTeam, sessions] = await Promise.all([
      ambRes.json(),
      coreRes.json(),
      sessRes.json(),
    ]);
    setStats({
      ambassadors: Array.isArray(ambassadors) ? ambassadors.length : 0,
      coreTeam: Array.isArray(coreTeam) ? coreTeam.length : 0,
      sessions: Array.isArray(sessions) ? sessions.length : 0,
      loading: false,
    });
    setRecent({
      ambassador: Array.isArray(ambassadors) && ambassadors[0] ? ambassadors[0] : null,
      coreTeam: Array.isArray(coreTeam) && coreTeam[0] ? coreTeam[0] : null,
      session: Array.isArray(sessions) && sessions[0] ? sessions[0] : null,
    });
    setRefreshing(false);
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" size="icon" onClick={fetchStats} disabled={refreshing} title="Refresh Stats">
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-card rounded-lg border flex flex-col items-center">
          <Users className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-xl font-semibold mb-2">Ambassadors</h2>
          <div className="text-4xl font-bold mb-1">{displayStats.ambassadors}</div>
          <div className="text-muted-foreground">Total Ambassadors</div>
        </div>
        <div className="p-6 bg-card rounded-lg border flex flex-col items-center">
          <Users2 className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-xl font-semibold mb-2">Core Team</h2>
          <div className="text-4xl font-bold mb-1">{displayStats.coreTeam}</div>
          <div className="text-muted-foreground">Total Core Team Members</div>
        </div>
        <div className="p-6 bg-card rounded-lg border flex flex-col items-center">
          <CalendarDays className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-xl font-semibold mb-2">Sessions</h2>
          <div className="text-4xl font-bold mb-1">{displayStats.sessions}</div>
          <div className="text-muted-foreground">Total Sessions</div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Users className="w-5 h-5" /> Latest Ambassador</h3>
            {recent.ambassador ? (
              <div>
                <div className="font-bold">{recent.ambassador.name}</div>
                <div className="text-muted-foreground text-sm">{recent.ambassador.university}</div>
                <div className="text-xs mt-1 line-clamp-2">{recent.ambassador.bio}</div>
                <div className="text-xs text-muted-foreground mt-2">Last modified by: <span className="font-semibold">admin</span></div>
              </div>
            ) : <div className="text-muted-foreground text-sm">No ambassadors yet.</div>}
          </div>
          <div className="p-4 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Users2 className="w-5 h-5" /> Latest Core Team</h3>
            {recent.coreTeam ? (
              <div>
                <div className="font-bold">{recent.coreTeam.name}</div>
                <div className="text-muted-foreground text-sm">{recent.coreTeam.role}</div>
                <div className="text-xs text-muted-foreground mt-2">Last modified by: <span className="font-semibold">admin</span></div>
              </div>
            ) : <div className="text-muted-foreground text-sm">No core team members yet.</div>}
          </div>
          <div className="p-4 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><CalendarDays className="w-5 h-5" /> Latest Session</h3>
            {recent.session ? (
              <div>
                <div className="font-bold">{recent.session.name}</div>
                <div className="text-muted-foreground text-sm">{recent.session.date} at {recent.session.time}</div>
                <div className="text-xs mt-1 line-clamp-2">{recent.session.description}</div>
                <div className="text-xs text-muted-foreground mt-2">Last modified by: <span className="font-semibold">admin</span></div>
              </div>
            ) : <div className="text-muted-foreground text-sm">No sessions yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
} 