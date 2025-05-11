import { NextResponse } from 'next/server';
import { Ambassador } from '@/models/Ambassador';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const ambassadors = await Ambassador.find()
      .sort({ createdAt: -1 })
      .select('name university bio image linkedin'); // Only select public fields
    
    return NextResponse.json(ambassadors);
  } catch (error) {
    console.error('Error fetching ambassadors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ambassadors' },
      { status: 500 }
    );
  }
} 