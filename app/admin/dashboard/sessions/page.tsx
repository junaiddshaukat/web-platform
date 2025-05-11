'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  'Web',
  'CP & DSA',
  'AI/ML',
  'DevOps',
  'Remote Job',
  'Open Source',
  'Other',
];

interface Session {
  _id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  speaker: string;
}

export default function SessionsAdminPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    date: '',
    time: '',
    speaker: '',
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/admin/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      setError('Failed to load sessions');
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', date: '', time: '', speaker: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = editingId
        ? `/api/admin/sessions?id=${editingId}`
        : '/api/admin/sessions';
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(editingId ? 'Failed to update session' : 'Failed to add session');
      const updatedSession = await response.json();
      if (editingId) {
        setSessions(sessions.map(s => s._id === editingId ? updatedSession : s));
      } else {
        setSessions([updatedSession, ...sessions]);
      }
      resetForm();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session: Session) => {
    setFormData({
      name: session.name,
      description: session.description,
      category: session.category,
      date: session.date,
      time: session.time,
      speaker: session.speaker,
    });
    setEditingId(session._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      const response = await fetch(`/api/admin/sessions?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete session');
      setSessions(sessions.filter(s => s._id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading && !isAdding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <Button onClick={() => setIsAdding(true)} className="flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Add Session
        </Button>
      </div>
      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>
      )}
      {isAdding && (
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Session' : 'Add New Session'}</h2>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Session Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full border rounded px-3 py-2"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date (e.g. Every Saturday or 2024-06-15)</Label>
                <Input id="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time (e.g. 3:30 PM PKT)</Label>
                <Input id="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker</Label>
              <Input id="speaker" value={formData.speaker} onChange={e => setFormData({ ...formData, speaker: e.target.value })} required />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editingId ? 'Update Session' : 'Add Session'}</Button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Card key={session._id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col p-6">
                <h3 className="text-lg font-semibold mb-1">{session.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{session.category}</p>
                <p className="text-sm mb-2">{session.description}</p>
                <div className="flex flex-col text-xs mb-2">
                  <span>Date: {session.date}</span>
                  <span>Time: {session.time}</span>
                  <span>Speaker: {session.speaker}</span>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(session)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(session._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 