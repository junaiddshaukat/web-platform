import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

// Import models in correct order to ensure proper registration
import { Tag } from '@/models/Tag';
import { Mentor } from '@/models/Mentor';
import { Mentee } from '@/models/Mentee';

// In-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    // Connect to DB first
    await connectDB();
    
    // Ensure models are registered by accessing them
    if (!Tag || !Mentor || !Mentee) {
      throw new Error('Models not properly loaded');
    }

    // Check cache first
    const cacheKey = 'mentorship-data';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
        }
      });
    }
    
    // Optimized queries with timeout
    const [mentors, mentees] = await Promise.all([
      Mentor.find()
        .populate({
          path: 'mentees',
          select: 'name university picture',
        })
        .populate('tags', 'name color description')
        .select('name university picture email phone linkedin github leetcode tags mentees')
        .lean()
        .maxTimeMS(15000), // 15 second timeout
      
      Mentee.find()
        .populate({
          path: 'mentor',
          select: 'name university picture',
        })
        .populate('tags', 'name color description')
        .select('name university picture email phone linkedin github leetcode mentor tags')
        .lean()
        .maxTimeMS(15000) // 15 second timeout
    ]);

    const data = { mentors, mentees };
    
    // Cache the result
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching mentorship data:', error);
    
    // Try to return stale cache if available
    const cacheKey = 'mentorship-data';
    const staleCache = cache.get(cacheKey);
    
    if (staleCache) {
      return NextResponse.json(staleCache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch mentorship data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 