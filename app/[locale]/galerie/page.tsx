'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Category = 'all' | 'rooms' | 'exterior' | 'facilities';

export default function GalleryPage() {
  const t = useTranslations('gallery');
  const [activeTab, setActiveTab] = useState<Category>('all');

  const images = [
    { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', alt: 'Hôtel extérieur', category: 'exterior', span: 'md:col-span-2 md:row-span-2' },
    { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', alt: 'Chambre Deluxe', category: 'rooms', span: 'md:col-span-1 md:row-span-1' },
    { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', alt: 'Suite Junior', category: 'rooms', span: 'md:col-span-1 md:row-span-1' },
    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', alt: 'Salle de bain', category: 'rooms', span: 'md:col-span-1 md:row-span-1' },
    { src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80', alt: 'Piscine', category: 'facilities', span: 'md:col-span-1 md:row-span-1' },
    { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80', alt: 'Restaurant', category: 'facilities', span: 'md:col-span-2 md:row-span-1' },
    { src: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', alt: 'Lobby', category: 'facilities', span: 'md:col-span-1 md:row-span-1' },
    { src: 'https://images.unsplash.com/photo-1542314831-c6a4d14b83b3?auto=format&fit=crop&w=800&q=80', alt: 'Vue sur la colline', category: 'exterior', span: 'md:col-span-1 md:row-span-1' },
  ];

  const filteredImages = activeTab === 'all' 
    ? images 
    : images.filter(img => img.category === activeTab);

  const tabs: { id: Category; label: string }[] = [
    { id: 'all', label: t('all') },
    { id: 'rooms', label: t('rooms') },
    { id: 'exterior', label: t('exterior') },
    { id: 'facilities', label: t('facilities') },
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </header>

        {/* Boutons de filtre interactifs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grille d'images */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {filteredImages.map((img, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                <p className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                  {img.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Aucune image dans cette catégorie.
          </div>
        )}
      </div>
    </div>
  );
}