"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: Props) {
  const [validImages, setValidImages] = useState(images.length > 0 ? images : ["/spots/default.jpg"]);
  const [selectedImage, setSelectedImage] = useState(0);

  if (validImages.length === 0) return null;

  // Fonction pour retirer une image du tableau si elle échoue à se charger
  const handleImageError = (index: number) => {
    setValidImages((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      if (newArr.length === 0) {
        newArr.push("/spots/default.jpg");
      }
      // Si l'image supprimée était sélectionnée, on revient à la première
      if (selectedImage >= newArr.length) setSelectedImage(0);
      return newArr;
    });
  };

  return (
    <div className="gallery-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        className="gallery-main"
        style={{
          position: 'relative',
          width: '100%',
          height: validImages.length > 1 ? 'calc(100% - 52px)' : '100%', // 52px = hauteur miniatures + margin
          flex: '1 1 0',
        }}
      >
        <Image
          src={validImages[selectedImage]}
          alt={`${title} - Image ${selectedImage + 1}`}
          fill
          className="gallery-main-image"
          priority={selectedImage === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          onError={() => handleImageError(selectedImage)}
        />
      </div>

      {validImages.length > 1 && (
        <div className="gallery-thumbnails gallery-thumbnails--below">
          {validImages.map((image, index) => (
            <button
              key={index}
              className={`gallery-thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`${title} - Miniature ${index + 1}`}
                fill
                className="gallery-thumbnail-image"
                sizes="(max-width: 768px) 80px, 100px"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 