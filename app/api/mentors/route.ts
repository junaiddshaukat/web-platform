import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

// Import models in correct order to ensure proper registration
import { Tag } from '@/models/Tag';
import { Mentor } from '@/models/Mentor';

// In-memory cache for public mentors
export const publicMentorsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// GET all mentors with their mentees (public view)
export async function GET() {
  try {
    // Connect to DB first
    await connectDB();
    
    // Ensure models are registered by accessing them
    if (!Tag || !Mentor) {
      throw new Error('Models not properly loaded');
    }

    // Check cache first
    const cacheKey = 'public-mentors';
    const cached = publicMentorsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
        }
      });
    }

    const mentors = await Mentor.find()
      .populate('tags', 'name color description')
      .select('name university picture email phone linkedin github leetcode tags')
      .lean()
      .maxTimeMS(15000); // 15 second timeout

    // Cache the result
    publicMentorsCache.set(cacheKey, {
      data: mentors,
      timestamp: Date.now()
    });
    
    return NextResponse.json(mentors, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    
    // Try to return stale cache if available
    const cacheKey = 'public-mentors';
    const staleCache = publicMentorsCache.get(cacheKey);
    
    if (staleCache) {
      return NextResponse.json(staleCache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch mentors',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Export function to clear public mentor cache
export function clearPublicMentorCache() {
  publicMentorsCache.clear();
} 