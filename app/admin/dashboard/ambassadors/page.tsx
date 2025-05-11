'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
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
    linkedin: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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
      linkedin: ''
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
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
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
      linkedin: ambassador.linkedin
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
        <Button
          onClick={() => setIsAdding(true)}
          className="flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Ambassador
        </Button>
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
                <div className="flex justify-end space-x-2">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 