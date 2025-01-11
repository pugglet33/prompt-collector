'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    negativePrompt: '',
    category: '',
    newCategory: '',
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      console.log('Fetched categories:', data);
      if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
      setCategories(data.map((cat: any) => cat.name));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          prompt: formData.prompt,
          negativePrompt: formData.negativePrompt,
          category: formData.category,
          newCategory: formData.category === 'new' ? formData.newCategory : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save prompt');
      }
      
      // Reset form and refresh categories
      setFormData({
        name: '',
        prompt: '',
        negativePrompt: '',
        category: '',
        newCategory: '',
      });
      
      // Fetch updated categories after successful submission
      await fetchCategories();
    } catch (error) {
      console.error('Failed to save prompt:', error);
      setError(error instanceof Error ? error.message : 'Failed to save prompt');
    } finally {
      setIsLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 bg-red-100/10 p-4 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-green-500 mb-2">
              Prompt Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-green-500 rounded p-2 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-green-500 mb-2">
              Prompt *
            </label>
            <textarea
              id="prompt"
              required
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              className="w-full bg-black border border-green-500 rounded p-2 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
            />
          </div>

          <div>
            <label htmlFor="negativePrompt" className="block text-green-500 mb-2">
              Negative Prompt (Optional)
            </label>
            <textarea
              id="negativePrompt"
              value={formData.negativePrompt}
              onChange={(e) => setFormData({ ...formData, negativePrompt: e.target.value })}
              className="w-full bg-black border border-green-500 rounded p-2 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-green-500 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black border border-green-500 rounded p-2 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="new">+ Add new category</option>
              </select>
            </div>

            {formData.category === 'new' && (
              <div>
                <label htmlFor="newCategory" className="block text-green-500 mb-2">
                  New Category *
                </label>
                <input
                  id="newCategory"
                  type="text"
                  required
                  value={formData.newCategory}
                  onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                  className="w-full bg-black border border-green-500 rounded p-2 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-500 text-black font-bold py-2 px-4 rounded ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-400'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Prompt'}
          </button>
        </form>
      </div>
    </main>
  );
}
