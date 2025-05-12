import { NextResponse } from 'next/server';
import { Mentor } from '@/models/Mentor';
import { Mentee } from '@/models/Mentee';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const mentors = await Mentor.find().populate({
      path: 'mentees',
      select: 'name university picture',
    });
    const mentees = await Mentee.find().populate({
      path: 'mentor',
      select: 'name university picture',
    });
    return NextResponse.json({ mentors, mentees });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mentorship data' }, { status: 500 });
  }
} 