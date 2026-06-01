import { useState } from 'react';
import { motion } from 'motion/react';
import { Model, ImageCard } from '../types';
import { Camera, Edit2, UploadCloud } from 'lucide-react';

interface ModelGalleryProps {
  model: Model;
  onImageClick: (imageIndex: number) => void;
  filteredImagesList: ImageCard[];
  isEditMode: boolean;
  onEditModelDetails: (model: Model) => void;
  onReplaceImage: (img: ImageCard) => void;
  key?: string | number;
}

export default function ModelGallery({
  model,
  onImageClick,
  filteredImagesList,
  isEditMode,
  onEditModelDetails,
  onReplaceImage,
}: ModelGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (idx: number) => {
    setLoadedImages((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="mb-24 last:mb-0"
    >
      {/* Model Header Details */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-10 pb-6 border-b border-surface-card justify-between">
        <div className="flex items-end gap-6 md:gap-10">
          <div className="font-serif text-6xl md:text-8xl font-light text-surface-card/60 leading-none select-none">
            {model.number}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-serif text-2xl md:text-4xl text-white-pure font-light tracking-wide leading-tight">
                <span className="italic text-gold">{model.firstName}</span> {model.lastName}
              </h3>
              
              {isEditMode && (
                <button
                  onClick={() => onEditModelDetails(model)}
                  type="button"
                  className="px-3 py-1 border border-gold/30 hover:border-gold hover:bg-gold/5 text-gold text-[9px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1 rounded-[1px] cursor-pointer"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  Editar Visão
                </button>
              )}
            </div>

            <p className="text-xs md:text-sm text-txt-muted tracking-wider mt-3 leading-relaxed max-w-2xl font-light">
              {model.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1 border border-gold-dim text-gold-dim rounded-[1px] md:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid Structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
        {model.images.map((img) => {
          // Find the corresponding index in the active filtered list
          const activeIndex = filteredImagesList.findIndex((item) => item.index === img.index);
          const isLarge = img.cardSize === 'large';
          const isLoaded = loadedImages[img.index];

          return (
            <div
              key={img.index}
              onClick={() => {
                if (isEditMode) {
                  onReplaceImage(img);
                } else if (activeIndex !== -1) {
                  onImageClick(activeIndex);
                }
              }}
              className={`relative overflow-hidden cursor-pointer bg-surface-bg group select-none transition-all duration-300 ${
                isLarge ? 'md:col-span-3 md:row-span-2' : 'md:col-span-1'
              }`}
              style={{
                aspectRatio: isLarge ? '16/10' : '3/4',
              }}
            >
              {/* Fade-in effect on actual image load */}
              <img
                src={img.src}
                alt={`${img.modelName} — ${img.num}`}
                onLoad={() => handleImageLoad(img.index)}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out brightness-[0.82] saturate-[0.88] ${
                  !isEditMode && 'group-hover:brightness-100 group-hover:saturate-[1.1] group-hover:scale-105'
                } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Image Loading Placeholder */}
              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-surface-card/60 bg-surface-bg">
                  <Camera className="w-8 h-8 animate-pulse text-txt-muted/30" />
                  <span className="text-[0.55rem] tracking-[0.2em] uppercase text-txt-muted/40">
                    Nº {img.num}
                  </span>
                </div>
              )}

              {/* Regular Mode: Hover Dark Overlay and Caption */}
              {!isEditMode ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                  <span className="font-serif text-sm md:text-base text-gold tracking-widest font-normal">
                    {img.num}
                  </span>
                </div>
              ) : (
                /* Edit Mode: Permanent Upload overlay */
                <div className="absolute inset-0 bg-black-pure/75 border border-dashed border-gold/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black-pure/60 transition-colors duration-200">
                  <UploadCloud className="w-6 h-6 text-gold mb-1 animate-bounce" />
                  <span className="text-[9px] tracking-[0.2em] text-gold uppercase text-center px-3 font-normal">
                    Substituir Nº {img.num}
                  </span>
                  <span className="text-[7.5px] text-txt-muted uppercase">Clique para Enviar</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
