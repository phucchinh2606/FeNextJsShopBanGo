"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = ({
  images,
  productName,
}: ProductGalleryProps) => {
  // Ảnh mặc định nếu không có danh sách
  const displayImages = images.length > 0 ? images : ["/placeholder-wood.jpg"];
  const [selectedImage, setSelectedImage] = useState(displayImages[0]);

  return (
    <div className="space-y-4">
      {/* Ảnh Lớn Chính */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-300"
        />
      </div>

      {/* Danh sách Ảnh Thu Nhỏ (Thumbnails) */}
      {displayImages.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                selectedImage === img
                  ? "border-amber-800 ring-2 ring-amber-800/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${index}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
