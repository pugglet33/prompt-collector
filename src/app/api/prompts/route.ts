import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, prompt, negativePrompt, category, newCategory } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Handle category creation/selection
    let categoryRecord;
    
    if (newCategory) {
      // Try to create new category
      try {
        categoryRecord = await prisma.category.create({
          data: { name: newCategory }
        });
        console.log('Created new category:', categoryRecord);
      } catch (error: any) {
        // If category already exists, try to use it
        if (error.code === 'P2002') {
          categoryRecord = await prisma.category.findUnique({
            where: { name: newCategory }
          });
          console.log('Using existing category:', categoryRecord);
        } else {
          console.error('Failed to create category:', error);
          return NextResponse.json(
            { error: 'Failed to create new category' },
            { status: 500 }
          );
        }
      }
    } else if (category) {
      // Use existing category
      categoryRecord = await prisma.category.findUnique({
        where: { name: category }
      });
      console.log('Using selected category:', categoryRecord);
    }

    if (!categoryRecord) {
      return NextResponse.json(
        { error: 'Category not found and no new category provided' },
        { status: 400 }
      );
    }

    // Create prompt
    try {
      const promptRecord = await prisma.prompt.create({
        data: {
          name: name || 'none',
          prompt,
          negativePrompt: negativePrompt || null,
          categoryId: categoryRecord.id,
        },
        include: {
          category: true
        }
      });

      console.log('Created prompt:', promptRecord);
      return NextResponse.json(promptRecord);
    } catch (error) {
      console.error('Failed to create prompt:', error);
      return NextResponse.json(
        { error: 'Failed to save prompt to database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to process request:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
