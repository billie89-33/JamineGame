import React from 'react';
import { AdminArticleForm } from '@/features/articles/components/AdminArticleForm/AdminArticleForm';

export default function CreateArticlePage() {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[#f7ebc6] mb-8 tracking-wider">เขียนบทความใหม่</h1>
        <AdminArticleForm />
      </div>
    </div>
  );
}
