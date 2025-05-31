import { NextResponse } from 'next/server';
import { Mentor } from '@/models/Mentor';
import { Mentee } from '@/models/Mentee';
import { Tag } from '@/models/Tag';
import connectDB from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { ActivityLog } from '@/models/ActivityLog';

// Import cache invalidation functions
import { clearMentorshipCache } from '@/app/api/mentorship/route';
import { clearAdminMentorCache } from '@/app/api/admin/mentors/route';
import { clearAdminMenteeCache } from '@/app/api/admin/mentees/route';
import { clearPublicMentorCache } from '@/app/api/mentors/route';
import { clearPublicMenteeCache } from '@/app/api/mentees/route';

const JWT_SECRET = process.env.JWT_SECRET;

// Function to clear all related caches
function invalidateAllCaches() {
  try {
    clearMentorshipCache();
    clearAdminMentorCache();
    clearAdminMenteeCache();
    clearPublicMentorCache();
    clearPublicMenteeCache();
  } catch (error) {
    // If cache clearing fails, log it but don't break the operation
    console.error('Failed to clear some caches:', error);
  }
}

// Middleware to check admin authentication
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  
  if (!token || !JWT_SECRET) {
    return null;
  }
  
  try {
    const decoded: any = verify(token, JWT_SECRET);
    return decoded.username || 'Unknown';
  } catch {
    return null;
  }
}

// POST assign/unassign tags to mentor or mentee
export async function POST(request: Request) {
  try {
    const adminUsername = await checkAdmin();
    if (!adminUsername) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.personId || !data.personType || !Array.isArray(data.tagIds)) {
      return NextResponse.json(
        { error: 'Person ID, person type, and tag IDs array are required' },
        { status: 400 }
      );
    }

    const { personId, personType, tagIds } = data;

    // Validate person type
    if (!['mentor', 'mentee'].includes(personType)) {
      return NextResponse.json(
        { error: 'Person type must be either "mentor" or "mentee"' },
        { status: 400 }
      );
    }

    // Validate tag IDs exist (only if tagIds is not empty)
    if (tagIds.length > 0) {
      const validTags = await Tag.find({ _id: { $in: tagIds } });
      if (validTags.length !== tagIds.length) {
        return NextResponse.json(
          { error: 'One or more tag IDs are invalid' },
          { status: 400 }
        );
      }
    }

    let updatedPerson;
    let personName = '';

    if (personType === 'mentor') {
      // First get the current mentor to track changes
      const currentMentor = await Mentor.findById(personId);
      if (!currentMentor) {
        return NextResponse.json(
          { error: 'Mentor not found' },
          { status: 404 }
        );
      }

      updatedPerson = await Mentor.findByIdAndUpdate(
        personId,
        { tags: tagIds },
        { new: true }
      ).populate('tags');
      
      personName = updatedPerson.name;
    } else {
      // First get the current mentee to track changes
      const currentMentee = await Mentee.findById(personId);
      if (!currentMentee) {
        return NextResponse.json(
          { error: 'Mentee not found' },
          { status: 404 }
        );
      }

      updatedPerson = await Mentee.findByIdAndUpdate(
        personId,
        { tags: tagIds },
        { new: true }
      ).populate('tags');
      
      personName = updatedPerson.name;
    }

    // Clear all caches after successful tag update
    invalidateAllCaches();

    // Log activity
    await ActivityLog.create({
      entityType: personType.charAt(0).toUpperCase() + personType.slice(1),
      entityId: personId,
      action: 'edit',
      adminUsername,
      details: { 
        name: personName,
        action: 'Tag assignment updated',
        tagCount: tagIds.length
      },
    });

    return NextResponse.json({
      message: 'Tags assigned successfully',
      person: updatedPerson
    });
  } catch (error) {
    console.error('Error assigning tags:', error);
    return NextResponse.json(
      { error: 'Failed to assign tags' },
      { status: 500 }
    );
  }
} 