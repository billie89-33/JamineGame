/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gamesApi } from '../../games.api';
import { articlesApi } from '@/features/articles/articles.api'; // Reuse image upload

export function AdminGameForm({ initialData, gameId }: { initialData?: any, gameId?: string } = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    coverImage: initialData?.coverImage || '',
    developer: initialData?.developer || '',
    publisher: initialData?.publisher || '',
    releaseDate: initialData?.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : '',
    rating: initialData?.rating || '',
  });

  const [platformsInput, setPlatformsInput] = useState(initialData?.platforms?.join(', ') || '');
  const [genresInput, setGenresInput] = useState(initialData?.genres?.join(', ') || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleImageUpload = async (file: File) => {
    const res = await articlesApi.uploadImage(file);
    return res.url;
  };

  const processCommaSeparated = (str: string) => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(item => item !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let finalCoverImage = formData.coverImage;
      if (coverFile) {
        finalCoverImage = await handleImageUpload(coverFile);
      }

      const payload = {
        ...formData,
        ...(finalCoverImage ? { coverImage: finalCoverImage } : {}),
        rating: formData.rating ? parseFloat(formData.rating as string) : undefined,
        platforms: processCommaSeparated(platformsInput),
        genres: processCommaSeparated(genresInput),
      };

      if (gameId) {
        await gamesApi.updateGame(gameId, payload);
        alert('Update game success!');
      } else {
        await gamesApi.createGame(payload);
        alert('Create game success!');
      }

      router.push('/admin/games');
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto bg-[#f7ebc6] p-8 rounded-3xl border border-[#d4c38d] shadow-sm">
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">COVER IMAGE</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          className="text-sm text-[#1a241b] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#1a241b] file:text-[#f7ebc6] hover:file:bg-[#2e3b2c] cursor-pointer"
        />
        {(coverFile || formData.coverImage) && (
          <div className="w-full h-64 mt-2 rounded-xl border border-[#d4c38d] overflow-hidden bg-[#e8d7a5]">
            {coverFile ? (
              <img src={URL.createObjectURL(coverFile)} alt="Cover preview" className="w-full h-full object-cover" />
            ) : formData.coverImage ? (
              <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-[#1a241b] font-black text-lg">GAME TITLE</label>
          <input 
            type="text" 
            required
            value={formData.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              setFormData(prev => ({ ...prev, title: newTitle, slug: autoSlug }))
            }}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] font-bold outline-none focus:border-[#1a241b]"
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-[#1a241b] font-black text-lg">SLUG (URL)</label>
          <input 
            type="text" 
            required
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">DESCRIPTION</label>
        <textarea 
          required
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[#1a241b] font-black text-lg">DEVELOPER</label>
          <input 
            type="text" 
            value={formData.developer}
            onChange={(e) => setFormData(prev => ({ ...prev, developer: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[#1a241b] font-black text-lg">PUBLISHER</label>
          <input 
            type="text" 
            value={formData.publisher}
            onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[#1a241b] font-black text-lg">RELEASE DATE</label>
          <input 
            type="date" 
            value={formData.releaseDate}
            onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[#1a241b] font-black text-lg">RATING (0-10)</label>
          <input 
            type="number" 
            step="0.1"
            min="0"
            max="10"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">PLATFORMS (Comma separated)</label>
        <input 
          type="text" 
          placeholder="e.g. PC, PS5, Xbox Series X, Switch"
          value={platformsInput}
          onChange={(e) => setPlatformsInput(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">GENRES (Comma separated)</label>
        <input 
          type="text" 
          placeholder="e.g. Action, RPG, Open World"
          value={genresInput}
          onChange={(e) => setGenresInput(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] outline-none focus:border-[#1a241b]"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-4 mt-6 bg-[#1a241b] text-[#f7ebc6] font-black text-xl rounded-xl hover:bg-[#2e3b2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (gameId ? 'UPDATING...' : 'SAVING...') : (gameId ? 'UPDATE GAME' : 'SAVE GAME')}
      </button>
    </form>
  );
}
