import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ResourceCatalog } from '@/models/Resource';
import { resourceCategories } from '@/lib/resources-data';

export async function GET() {
  try {
    await connectDB();
    let catalog = await ResourceCatalog.findOne().sort({ updatedAt: -1 });
    if (!catalog) {
      // Seed from static data on first access
      catalog = new ResourceCatalog({ categories: resourceCategories });
      await catalog.save();
    }

    const activeCategories = (catalog.toObject().categories || []).filter((c: any) => c.isActive !== false);
    activeCategories.forEach((c: any) => {
      c.items = (c.items || []).filter((i: any) => i.isActive !== false).sort((a: any, b: any) => (a.order||0)-(b.order||0));
    });

    activeCategories.sort((a: any, b: any) => (a.order||0)-(b.order||0));
    return NextResponse.json({ categories: activeCategories }, { headers: { 'Cache-Control': 'public, s-maxage=60' }});
  } catch (error: any) {
    console.error('GET /api/resources error', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}


