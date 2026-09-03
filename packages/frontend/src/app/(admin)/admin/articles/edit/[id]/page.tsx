/* eslint-disable */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminArticleForm } from '@/features/articles/components/AdminArticleForm/AdminArticleForm';
import { articlesApi } from '@/features/articles/articles.api';

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<import('@/features/articles/articles.api').Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticle = async () => {
    try {
      const data = await articlesApi.getArticleById(id);
      setInitialData(data);
    } catch (error) {
      console.error('Failed to load article:', error);
      alert('Failed to load article data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

    if (isLoading) {
    return <div className="text-center py-20 text-[#f7ebc6] font-bold">กำลังโหลดข้อมูลบทความ...</div>;
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[#f7ebc6] mb-8 tracking-wider">แก้ไขบทความ</h1>
        {initialData && (
          <AdminArticleForm 
            initialData={initialData} 
            articleId={id} 
          />
        )}
      </div>
    </div>
  );
}
