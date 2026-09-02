import React from 'react';
import { notFound } from 'next/navigation';
import { categoriesApi } from '@/features/categories/categories.api';
import { articlesApi } from '@/features/articles/articles.api';

// This makes the route static if we want, but since categories can be dynamic, we might want dynamic rendering or revalidate.
// For Next.js 13+ App Router, we can fetch data directly in the Server Component.

export default async function GameCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let category;
  
  try {
    category = await categoriesApi.getCategoryBySlug(resolvedParams.slug);
  } catch (error) {
    notFound(); // 404 if category slug doesn't exist
  }

  // Fetch articles for this category
  // For now we just use a generic fetch, in a real app you might have an API like articlesApi.getArticlesByCategory(category.id)
  // Let's assume we fetch all and filter for now, or just show mock if the API isn't ready
  
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12 min-h-[60vh]">
      <div className="flex items-center gap-4 mb-8">
        {category.icon && <span className="text-4xl">{category.icon}</span>}
        <h1 className="text-4xl font-black text-[#f7ebc6]">{category.name}</h1>
      </div>
      
      {category.description && (
        <p className="text-[#a0a8a1] text-lg mb-8">{category.description}</p>
      )}
      
      {/* Mock content for now until we have real articles matching this category */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-[#1a241b] rounded-xl overflow-hidden shadow-lg border border-[#2e3b2c] hover:scale-105 transition-transform cursor-pointer">
            <div className="w-full h-40 bg-gradient-to-br from-[#2e3b2c] to-[#1a241b] flex items-center justify-center">
              <span className="text-4xl opacity-50">{category.icon || '🎮'}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#f7ebc6]">{category.name} #{item}</h3>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
