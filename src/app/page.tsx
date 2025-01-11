'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    negativePrompt: '',
    category: '',
    newCategory: '',
  });

  const [categories, setCategories] = useState([
    'Character', 'Landscape', 'Abstract', 'Sci-fi', 'Fantasy'
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save prompt
    console.log(formData);
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-2">Art Prompt Collector</h1>
        <p className="text-green-400">Collect and organize your AI art prompts</p>
      </header>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">Prompt Name (Optional)</label>
          <input
            type="text"
            id="name"
            className="input-field"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter a name for your prompt"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block mb-2">Prompt *</label>
          <textarea
            id="prompt"
            className="input-field min-h-[100px]"
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            placeholder="Enter your prompt here"
            required
          />
        </div>

        <div>
          <label htmlFor="negativePrompt" className="block mb-2">Negative Prompt (Optional)</label>
          <textarea
            id="negativePrompt"
            className="input-field"
            value={formData.negativePrompt}
            onChange={(e) => setFormData({ ...formData, negativePrompt: e.target.value })}
            placeholder="Enter things to avoid in the generation"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block mb-2">Category *</label>
            <select
              id="category"
              className="input-field"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="new">+ Add new category</option>
            </select>
          </div>

          {formData.category === 'new' && (
            <div>
              <label htmlFor="newCategory" className="block mb-2">New Category *</label>
              <input
                type="text"
                id="newCategory"
                className="input-field"
                value={formData.newCategory}
                onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                placeholder="Enter new category name"
                required
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary w-full">
          Save Prompt
        </button>
      </form>
    </div>
  );
}
