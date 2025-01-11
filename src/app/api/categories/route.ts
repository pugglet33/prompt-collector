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
    console.log('Found categories:', categories);
    
    // Map categories to a simpler format and ensure createdAt is handled properly
    const mappedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      promptCount: cat._count.prompts,
      createdAt: cat.createdAt.toISOString()
    }));
    
    // Only return categories that have prompts or were recently created
    const activeCategories = mappedCategories.filter(cat => 
      cat.promptCount > 0 || 
      (new Date(cat.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000) // Created in last 24 hours
    );
    
    console.log('Active categories:', activeCategories);
    return NextResponse.json(activeCategories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
