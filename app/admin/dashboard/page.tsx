'use client';

import { useEffect, useState } from 'react';
import { Users, Users2, CalendarDays, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Add types for recent activity
interface AmbassadorRecent {
  name: string;
  university: string;
  bio: string;
  lastModifiedBy?: string;
}
interface CoreTeamRecent {
  name: string;
  role: string;
  lastModifiedBy?: string;
}
interface SessionRecent {
  name: string;
  date: string;
  time: string;
  description: string;
  lastModifiedBy?: string;
}

interface ActivityLogEntry {
  _id: string;
  entityType: string;
  entityId: string;
  action: string;
  adminUsername: string;
  timestamp: string;
  details?: { name?: string; university?: string; role?: string; date?: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    ambassadors: 0,
    coreTeam: 0,
    sessions: 0,
    loading: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [recentItems, setRecentItems] = useState<{
    ambassador: AmbassadorRecent | null;
    coreTeam: CoreTeamRecent | null;
    session: SessionRecent | null;
  }>({
    ambassador: null,
    coreTeam: null,
    session: null,
  });

  // Animated count up
  const [displayStats, setDisplayStats] = useState({
    ambassadors: 0,
    coreTeam: 0,
    sessions: 0,
  });

  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    fetchStats();
    fetchActivityLog();
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
    setRecentItems({
      ambassador: Array.isArray(ambassadors) && ambassadors[0] ? ambassadors[0] : null,
      coreTeam: Array.isArray(coreTeam) && coreTeam[0] ? coreTeam[0] : null,
      session: Array.isArray(sessions) && sessions[0] ? sessions[0] : null,
    });
    setRefreshing(false);
  }

  async function fetchActivityLog() {
    const res = await fetch('/api/admin/activity-log?limit=20');
    if (res.ok) {
      setActivityLog(await res.json());
    }
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
        <div className="space-y-4">
          {activityLog.length === 0 && <div className="text-muted-foreground">No recent activity.</div>}
          {activityLog.map((log) => (
            <div key={log._id} className="p-4 bg-card rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <span className="font-semibold capitalize">{log.action}</span> {log.entityType}
                {log.details?.name && <span>: <span className="font-semibold">{log.details.name}</span></span>}
                {log.details?.university && <span className="ml-2 text-xs text-muted-foreground">({log.details.university})</span>}
                {log.details?.role && <span className="ml-2 text-xs text-muted-foreground">({log.details.role})</span>}
                {log.details?.date && <span className="ml-2 text-xs text-muted-foreground">({log.details.date})</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                By <span className="font-semibold">{log.adminUsername}</span> &middot; {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 