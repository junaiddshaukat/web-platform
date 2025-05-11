'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface CoreTeamMember {
  _id: string;
  name: string;
  image: string;
  role: string;
  linkedin: string;
}

export default function CoreTeamPage() {
  const [members, setMembers] = useState<CoreTeamMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    role: '',
    linkedin: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/core-team');
      if (!response.ok) throw new Error('Failed to fetch core team members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      setError('Failed to load core team members');
      console.error('Error fetching core team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', image: '', role: '', linkedin: '' });
    setImageFile(null);
    setImagePreview('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const formDataImg = new FormData();
        formDataImg.append('file', imageFile);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImg,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const { url } = await uploadResponse.json();
        imageUrl = url;
      }
      const url = editingId
        ? `/api/admin/core-team?id=${editingId}`
        : '/api/admin/core-team';
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });
      if (!response.ok) throw new Error(editingId ? 'Failed to update member' : 'Failed to add member');
      const updatedMember = await response.json();
      if (editingId) {
        setMembers(members.map(m => m._id === editingId ? updatedMember : m));
      } else {
        setMembers([updatedMember, ...members]);
      }
      resetForm();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: CoreTeamMember) => {
    setFormData({
      name: member.name,
      image: member.image,
      role: member.role,
      linkedin: member.linkedin
    });
    setImagePreview(member.image);
    setEditingId(member._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const response = await fetch(`/api/admin/core-team?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete member');
      setMembers(members.filter(m => m._id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading && !isAdding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading core team...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Core Team</h1>
        <Button onClick={() => setIsAdding(true)} className="flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Add Member
        </Button>
      </div>
      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>
      )}
      {isAdding && (
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Member' : 'Add New Member'}</h2>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Avatar</Label>
              <div className="flex items-center space-x-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Button type="button" variant="outline" onClick={() => document.getElementById('image')?.click()}>
                  Choose Image
                </Button>
                {imagePreview && (
                  <div className="relative w-20 h-20">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-full" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" type="url" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} required />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}</Button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member._id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col items-center p-6">
                <div className="relative w-24 h-24 mb-4">
                  <Image src={member.image || '/placeholder-avatar.jpg'} alt={member.name} fill className="object-cover rounded-full" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mb-2">LinkedIn</a>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(member)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(member._id)}>
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