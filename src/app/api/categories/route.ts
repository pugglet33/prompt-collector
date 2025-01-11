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
        },
        prompts: {
          take: 1  // Just check if there are any prompts
        }
      }
    });
    
    console.log('Raw categories from DB:', categories);
    
    // Map categories to a simpler format and ensure createdAt is handled properly
    const mappedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      promptCount: cat._count.prompts,
      hasPrompts: cat.prompts.length > 0,
      createdAt: cat.createdAt.toISOString()
    }));
    
    console.log('Mapped categories:', mappedCategories);
    
    // Calculate the cutoff time for recently created categories (48 hours ago)
    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000);
    console.log('Cutoff time for recent categories:', cutoffTime);
    
    // Only return categories that have prompts or were recently created
    const activeCategories = mappedCategories.filter(cat => {
      const createdAt = new Date(cat.createdAt);
      const isRecent = createdAt > cutoffTime;
      const hasPrompts = cat.promptCount > 0;
      
      console.log(`Category ${cat.name}:`, {
        createdAt,
        isRecent,
        hasPrompts,
        promptCount: cat.promptCount
      });
      
      return hasPrompts || isRecent;
    });
    
    console.log('Final active categories:', activeCategories);
    
    // Sort by name and return
    const sortedCategories = activeCategories.sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    return NextResponse.json(sortedCategories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
