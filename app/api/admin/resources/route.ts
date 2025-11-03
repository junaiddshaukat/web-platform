import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { ResourceCatalog } from '@/models/Resource';

const JWT_SECRET = process.env.JWT_SECRET;

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token || !JWT_SECRET) return null;
  try {
    const decoded: any = verify(token, JWT_SECRET);
    return decoded?.username || 'Admin';
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const username = await requireAdmin();
    if (!username) return unauthorized();
    await connectDB();
    let catalog = await ResourceCatalog.findOne().sort({ updatedAt: -1 });
    if (!catalog) {
      catalog = new ResourceCatalog({ categories: [] });
      await catalog.save();
    }
    return NextResponse.json(catalog);
  } catch (e: any) {
    console.error('GET admin resources', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// Upsert entire catalog (simple first pass). Accepts { categories }
export async function PUT(request: Request) {
  try {
    const username = await requireAdmin();
    if (!username) return unauthorized();
    await connectDB();
    const body = await request.json();
    let catalog = await ResourceCatalog.findOne().sort({ updatedAt: -1 });
    if (!catalog) {
      catalog = new ResourceCatalog();
    }
    catalog.categories = Array.isArray(body.categories) ? body.categories : catalog.categories;
    catalog.lastModifiedBy = username;
    catalog.lastUpdated = new Date();
    await catalog.save();
    return NextResponse.json({ success: true, catalog });
  } catch (e: any) {
    console.error('PUT admin resources', e);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// Optional: POST to add one category quickly
export async function POST(request: Request) {
  try {
    const username = await requireAdmin();
    if (!username) return unauthorized();
    await connectDB();
    const body = await request.json();
    let catalog = await ResourceCatalog.findOne().sort({ updatedAt: -1 });
    if (!catalog) catalog = new ResourceCatalog({ categories: [] });
    catalog.categories.push({
      id: body.id || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: body.title || 'Untitled',
      order: body.order || 0,
      items: body.items || [],
      isActive: body.isActive !== false,
    });
    catalog.lastModifiedBy = username;
    catalog.lastUpdated = new Date();
    await catalog.save();
    return NextResponse.json({ success: true, catalog });
  } catch (e: any) {
    console.error('POST admin resources', e);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}


