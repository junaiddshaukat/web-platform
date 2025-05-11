'use client';

import { useState, useEffect } from "react"
import Image from "next/image"
import { Linkedin } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const fetchAmbassadors = async () => {
    try {
      const response = await fetch('/api/ambassadors');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-primary border-primary/20 animate-spin mb-4"></div>
          <div className="text-lg font-medium">Loading ambassadors...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-8 border border-red-200 rounded-lg bg-red-50">
          <div className="text-lg font-medium text-red-600 text-center">{error}</div>
          <button 
            onClick={fetchAmbassadors}
            className="mt-4 w-full py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Our <span className="border-b-4 border-primary-foreground pb-1">Ambassadors</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Meet the exceptional individuals who represent and grow the Dev Weekends community around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Ambassadors Grid */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-20 bg-border"></div>
          <span className="text-muted-foreground uppercase tracking-widest text-sm font-medium">
            OUR NETWORK
          </span>
          <div className="h-px w-20 bg-border"></div>
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-16 text-center">Meet Our Ambassadors</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ambassadors.map((ambassador) => (
            <Card
              key={ambassador._id}
              className="overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={ambassador.image || '/placeholder-ambassador.jpg'}
                    alt={ambassador.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-ambassador.jpg';
                    }}
                    unoptimized={!ambassador.image?.startsWith('http')}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{ambassador.name}</h3>
                    {ambassador.linkedin && (
                      <a
                        href={ambassador.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0077B5] text-white p-1.5 rounded-full hover:bg-[#0077B5]/80 transition-colors"
                        aria-label={`LinkedIn profile of ${ambassador.name}`}
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{ambassador.university}</p>
                  <p className="text-sm line-clamp-3">{ambassador.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
