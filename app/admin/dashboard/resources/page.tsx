'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save } from 'lucide-react';

type Item = { title: string; href?: string; description?: string; internalSlug?: string; isActive?: boolean };
type Category = { id: string; title: string; order?: number; isActive?: boolean; items: Item[] };

export default function ResourcesAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/resources')
      .then(r => {
        if (!r.ok) throw new Error('Unauthorized or failed to load');
        return r.json();
      })
      .then(data => setCategories(data?.categories || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addCategory = () => {
    setCategories(prev => [...prev, { id: `cat-${Date.now()}`, title: 'New Category', items: [], isActive: true }]);
  };

  const addItem = (ci: number) => {
    setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, items: [...c.items, { title: 'New Item', href: '' }] } : c));
  };

  const removeCategory = (ci: number) => setCategories(prev => prev.filter((_, idx) => idx !== ci));
  const removeItem = (ci: number, ii: number) => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, items: c.items.filter((_, j) => j !== ii) } : c));

  const save = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/admin/resources', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categories }) });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess('Saved successfully');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resources</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addCategory}><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
          <Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
      {error ? <div className="text-red-600">{error}</div> : null}
      {success ? <div className="text-green-600">{success}</div> : null}

      <div className="grid grid-cols-1 gap-6">
        {categories.map((cat, ci) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  <Input value={cat.title} onChange={e => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, title: e.target.value } : c))} />
                </CardTitle>
                <CardDescription>Category ID: <Input value={cat.id} onChange={e => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, id: e.target.value } : c))} /></CardDescription>
              </div>
              <Button variant="destructive" onClick={() => removeCategory(ci)}><Trash2 className="h-4 w-4 mr-2"/>Remove</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cat.items.map((it, ii) => (
                <div key={ii} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input placeholder="Title" value={it.title} onChange={e => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, items: c.items.map((x, j) => j===ii ? { ...x, title: e.target.value } : x) } : c))} />
                  <Input placeholder="Link (optional)" value={it.href || ''} onChange={e => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, items: c.items.map((x, j) => j===ii ? { ...x, href: e.target.value } : x) } : c))} />
                  <Input placeholder="Internal slug (optional)" value={it.internalSlug || ''} onChange={e => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, items: c.items.map((x, j) => j===ii ? { ...x, internalSlug: e.target.value } : x) } : c))} />
                  <div className="flex items-center gap-2">
                    <Textarea placeholder="Description" value={it.description || ''} onChange={e => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, items: c.items.map((x, j) => j===ii ? { ...x, description: e.target.value } : x) } : c))} />
                    <Button variant="ghost" onClick={() => removeItem(ci, ii)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => addItem(ci)}><Plus className="h-4 w-4 mr-2"/>Add Item</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


