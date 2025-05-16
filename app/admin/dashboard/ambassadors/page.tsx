'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface Ambassador {
  _id: string;
  name: string;
  university: string;
  bio: string;
  image: string;
  linkedin: string;
  github?: string;
  leetcode?: string;
}

export default function AmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    bio: '',
    image: '',
    linkedin: '',
    github: '',
    leetcode: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [view, setView] = useState<'card' | 'table'>('card');

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const fetchAmbassadors = async () => {
    try {
      const response = await fetch('/api/admin/ambassadors');
      if (!response.ok) throw new Error('Failed to fetch ambassadors');
      const data = await response.json();
      setAmbassadors(data);
    } catch (error) {
      setError('Failed to load ambassadors');
      console.error('Error fetching ambassadors:', error);
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
    setFormData({
      name: '',
      university: '',
      bio: '',
      image: '',
      linkedin: '',
      github: '',
      leetcode: ''
    });
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
      // First, upload the image if there's a file
      let imageUrl = formData.image;
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const { url } = await uploadResponse.json();
        imageUrl = url;
      }

      // Then create or update the ambassador
      const url = editingId 
        ? `/api/admin/ambassadors?id=${editingId}`
        : '/api/admin/ambassadors';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (!response.ok) throw new Error(editingId ? 'Failed to update ambassador' : 'Failed to add ambassador');
      
      const updatedAmbassador = await response.json();
      
      if (editingId) {
        setAmbassadors(ambassadors.map(a => 
          a._id === editingId ? updatedAmbassador : a
        ));
      } else {
        setAmbassadors([updatedAmbassador, ...ambassadors]);
      }
      
      resetForm();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ambassador: Ambassador) => {
    setFormData({
      name: ambassador.name,
      university: ambassador.university,
      bio: ambassador.bio,
      image: ambassador.image,
      linkedin: ambassador.linkedin,
      github: ambassador.github || '',
      leetcode: ambassador.leetcode || ''
    });
    setImagePreview(ambassador.image);
    setEditingId(ambassador._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ambassador?')) return;

    try {
      const response = await fetch(`/api/admin/ambassadors?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete ambassador');
      
      setAmbassadors(ambassadors.filter(a => a._id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading && !isAdding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading ambassadors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ambassadors</h1>
        <div className="flex gap-2 items-center">
          <Button
            variant={view === 'card' ? 'default' : 'outline'}
            onClick={() => setView('card')}
          >
            Card View
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            onClick={() => setView('table')}
          >
            <Table className="w-4 h-4 mr-2" /> Table View
          </Button>
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Ambassador
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Ambassador' : 'Add New Ambassador'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetForm}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                >
                  Choose Image
                </Button>
                {imagePreview && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leetcode">LeetCode URL</Label>
              <Input
                id="leetcode"
                type="url"
                value={formData.leetcode}
                onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? 'Update Ambassador' : 'Add Ambassador'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ambassadors.map((ambassador) => (
            <Card key={ambassador._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={ambassador.image || '/placeholder-ambassador.jpg'}
                    alt={ambassador.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-ambassador.jpg';
                    }}
                    unoptimized={!ambassador.image?.startsWith('http')}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{ambassador.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{ambassador.university}</p>
                  <p className="text-sm mb-4 line-clamp-2">{ambassador.bio}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {ambassador.linkedin && (
                        <a
                          href={ambassador.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-1 rounded-full hover:opacity-80 transition-colors border"
                          aria-label={`LinkedIn profile of ${ambassador.name}`}
                        >
                          <Image
                            src="/linkedin.png"
                            alt="LinkedIn"
                            width={18}
                            height={18}
                          />
                        </a>
                      )}
                      {ambassador.github && (
                        <a
                          href={ambassador.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-1 rounded-full hover:opacity-80 transition-colors border"
                          aria-label={`GitHub profile of ${ambassador.name}`}
                        >
                          <svg className="w-5 h-5" fill="#24292f" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                          </svg>
                        </a>
                      )}
                      {ambassador.leetcode && (
                        <a
                          href={ambassador.leetcode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-1 rounded-full hover:opacity-80 transition-colors border"
                          aria-label={`LeetCode profile of ${ambassador.name}`}
                        >
                          <Image
                            src="/leetcode.png"
                            alt="LeetCode"
                            width={18}
                            height={18}
                          />
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(ambassador)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(ambassador._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">LinkedIn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">GitHub</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">LeetCode</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ambassadors.map((ambassador) => (
                <tr key={ambassador._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        src={ambassador.image || '/placeholder-ambassador.jpg'}
                        alt={ambassador.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="ml-3 font-medium">{ambassador.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{ambassador.university}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground max-w-xs truncate">{ambassador.bio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ambassador.linkedin && (
                      <a href={ambassador.linkedin} target="_blank" rel="noopener noreferrer" className="p-1 rounded-full hover:opacity-80 transition-colors border flex items-center justify-center bg-white" title="LinkedIn">
                        <Image src="/linkedin.png" alt="LinkedIn" width={18} height={18} />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ambassador.github && (
                      <a
                        href={ambassador.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-full hover:opacity-80 transition-colors border"
                        aria-label={`GitHub profile of ${ambassador.name}`}
                      >
                        <svg className="w-5 h-5" fill="#24292f" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ambassador.leetcode && (
                      <a href={ambassador.leetcode} target="_blank" rel="noopener noreferrer" className="p-1 rounded-full hover:opacity-80 transition-colors border flex items-center justify-center bg-white" title="LeetCode">
                        <Image src="/leetcode.png" alt="LeetCode" width={18} height={18} />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(ambassador)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(ambassador._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 