import React from 'react';
import { AdminArticleForm } from '@/features/articles/components/AdminArticleForm/AdminArticleForm';

export default function CreateArticlePage() {
  return (
    <div className="min-h-screen bg-[#0b0f0c] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-lime-400 mb-8">WRITE NEW ARTICLE</h1>
        <AdminArticleForm />
      </div>
    </div>
  );
}
