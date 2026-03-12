'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const allImages = images.length ? images : ['/placeholder-product.jpg'];

  return (
    <div className="space-y-3">
      <div className="relative h-80 w-full rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={allImages[active]}
          alt={name}
          fill
          className="object-cover"
          priority
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                active === i ? 'border-green-500' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
