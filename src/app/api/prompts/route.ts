import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, prompt, negativePrompt, category, newCategory } = body;
    console.log('Received request body:', body);

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Handle category creation/selection
    let categoryRecord;
    const now = new Date();
    
    if (newCategory) {
      console.log('Attempting to create new category:', newCategory);
      // Try to create new category
      try {
        categoryRecord = await prisma.category.create({
          data: { 
            name: newCategory,
            createdAt: now
          }
        });
        console.log('Successfully created new category:', categoryRecord);
      } catch (error: any) {
        // If category already exists, try to use it
        if (error.code === 'P2002') {
          console.log('Category already exists, fetching existing category');
          categoryRecord = await prisma.category.findUnique({
            where: { name: newCategory }
          });
          console.log('Found existing category:', categoryRecord);
        } else {
          console.error('Failed to create category:', error);
          return NextResponse.json(
            { error: 'Failed to create new category' },
            { status: 500 }
          );
        }
      }
    } else if (category) {
      console.log('Looking up existing category:', category);
      // Use existing category
      categoryRecord = await prisma.category.findUnique({
        where: { name: category }
      });
      console.log('Found category:', categoryRecord);
    }

    if (!categoryRecord) {
      console.error('No category record found or created');
      return NextResponse.json(
        { error: 'Category not found and no new category provided' },
        { status: 400 }
      );
    }

    // Create prompt
    try {
      console.log('Creating prompt with category:', categoryRecord);
      const promptRecord = await prisma.prompt.create({
        data: {
          name: name || 'none',
          prompt,
          negativePrompt: negativePrompt || null,
          categoryId: categoryRecord.id,
          createdAt: now
        },
        include: {
          category: true
        }
      });

      console.log('Successfully created prompt:', promptRecord);
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
    
    // Map prompts to ensure dates are properly serialized
    const mappedPrompts = prompts.map(prompt => ({
      ...prompt,
      createdAt: prompt.createdAt.toISOString(),
      category: {
        ...prompt.category,
        createdAt: prompt.category.createdAt.toISOString()
      }
    }));
    
    return NextResponse.json(mappedPrompts);
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
