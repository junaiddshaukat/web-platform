import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

// Import models in correct order to ensure proper registration
import { Tag } from '@/models/Tag';
import { Mentee } from '@/models/Mentee';

// In-memory cache for public mentees
const publicMenteesCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// GET all mentees with their mentors (public view)
export async function GET() {
  try {
    // Connect to DB first
    await connectDB();
    
    // Ensure models are registered by accessing them
    if (!Tag || !Mentee) {
      throw new Error('Models not properly loaded');
    }

    // Check cache first
    const cacheKey = 'public-mentees';
    const cached = publicMenteesCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
        }
      });
    }

    const mentees = await Mentee.find()
      .populate({
        path: 'mentor',
        select: 'name university picture',
      })
      .populate('tags', 'name color description')
      .select('name university picture email phone linkedin github leetcode mentor tags')
      .lean()
      .maxTimeMS(15000); // 15 second timeout

    // Cache the result
    publicMenteesCache.set(cacheKey, {
      data: mentees,
      timestamp: Date.now()
    });
    
    return NextResponse.json(mentees, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching mentees:', error);
    
    // Try to return stale cache if available
    const cacheKey = 'public-mentees';
    const staleCache = publicMenteesCache.get(cacheKey);
    
    if (staleCache) {
      return NextResponse.json(staleCache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch mentees',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 