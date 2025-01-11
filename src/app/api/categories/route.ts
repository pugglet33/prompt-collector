import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching categories...');
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { prompts: true }
        }
      }
    });
    
    console.log('Raw categories from DB:', categories);
    
    // Map categories to a simpler format
    const mappedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      promptCount: cat._count.prompts,
      createdAt: cat.createdAt.toISOString()
    }));
    
    console.log('Returning all categories:', mappedCategories);
    return NextResponse.json(mappedCategories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
