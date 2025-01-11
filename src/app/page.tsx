'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import PromptForm from './components/PromptForm';

// This ensures the page is dynamically rendered
export const fetchCache = 'force-no-store';
export const revalidate = 0;

async function getCategories() {
  'use server';
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories.map(cat => cat.name).sort((a, b) => a.localeCompare(b));
}

export default async function Home() {
  const sortedCategories = await getCategories();

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

        <Suspense fallback={<div>Loading...</div>}>
          <PromptForm initialCategories={sortedCategories} />
        </Suspense>
      </div>
    </main>
  );
}
