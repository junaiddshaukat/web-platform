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
  github?: string;
  leetcode?: string;
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
                    <div className="flex space-x-2">
                      {ambassador.github && (
                        <a
                          href={ambassador.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-1 rounded-full hover:opacity-80 transition-colors"
                          aria-label={`GitHub profile of ${ambassador.name}`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                          </svg>
                        </a>
                      )}
                      {ambassador.leetcode && (
                        <a
                          href={ambassador.leetcode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-1 rounded-full hover:opacity-80 transition-colors"
                          aria-label={`LeetCode profile of ${ambassador.name}`}
                        >
                          <Image
                            src="/leetcode.png"
                            alt="LeetCode"
                            width={20}
                            height={20}
                          />
                        </a>
                      )}
                      {ambassador.linkedin && (
                        <a
                          href={ambassador.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-1 rounded-full hover:opacity-80 transition-colors"
                          aria-label={`LinkedIn profile of ${ambassador.name}`}
                        >
                          <Image
                            src="/linkedin.png"
                            alt="LinkedIn"
                            width={20}
                            height={20}
                          />
                        </a>
                      )}
                    </div>
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
