import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, prompt, negativePrompt, category, newCategory } = body;

    // Handle category creation/selection
    let categoryRecord = await prisma.category.findUnique({
      where: { name: newCategory || category }
    });

    if (!categoryRecord && newCategory) {
      categoryRecord = await prisma.category.create({
        data: { name: newCategory }
      });
    }

    if (!categoryRecord) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Create prompt
    const promptRecord = await prisma.prompt.create({
      data: {
        name: name || 'none',
        prompt,
        negativePrompt,
        categoryId: categoryRecord.id,
      }
    });

    return NextResponse.json(promptRecord);
  } catch (error) {
    console.error('Failed to create prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
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
