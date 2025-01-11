'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import PromptForm from './components/PromptForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch categories server-side
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  
  // Map and sort categories
  const sortedCategories = categories
    .map(cat => cat.name)
    .sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/logo.svg"
              alt="Prompt Harvester Logo"
              width={120}
              height={120}
              className="animate-float"
            />
          </div>
          <h1 className="text-4xl font-bold text-green-500 mb-2">
            Prompt & Styleguide Harvester
          </h1>
          <p className="text-green-400 text-lg">
            Collect and organize your creative prompts
          </p>
        </div>

        <PromptForm initialCategories={sortedCategories} />
      </div>
    </main>
  );
}
