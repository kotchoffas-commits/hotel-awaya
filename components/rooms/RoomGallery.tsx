'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function RoomGallery({ images, name }: { images: string[], name: string }) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        Aucune image disponible
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <Image src={mainImage} alt={name} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover transition-opacity duration-300" />
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={`relative h-20 md:h-24 rounded-xl overflow-hidden transition-all duration-200 ${
                mainImage === img 
                  ? 'ring-2 ring-emerald-600 ring-offset-2' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${name} miniature ${i + 1}`} fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
