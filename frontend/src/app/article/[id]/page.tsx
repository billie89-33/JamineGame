import React from 'react';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-12 z-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-[#f7ebc6] mb-8">Reading Article ID: {resolvedParams.id}</h1>
      <div className="w-full max-w-4xl bg-[#121813] border border-[#202d21] rounded-2xl p-8 shadow-inner min-h-[500px]">
        <p className="text-[#a5b8a6]">Content of the article will go here...</p>
      </div>
    </main>
  );
}
