import { useEffect } from 'react';
import { ImageCard } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageCard[];
  currentIndex: number;
  onNavigate: (direction: number) => void;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onNavigate, onClose]);

  if (!isOpen || images.length === 0 || currentIndex === -1) return null;

  const currentImg = images[currentIndex];

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[200] bg-black-pure/98 flex items-center justify-center backdrop-blur-md transition-opacity duration-300"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-[210] flex items-center gap-2 text-txt-muted hover:text-gold text-xs tracking-[0.3em] uppercase transition-colors duration-300"
      >
        <span>Fechar</span>
        <X className="w-4 h-4 text-gold-dim" />
      </button>

      {/* Prev Navigation Trigger */}
      <button
        onClick={() => onNavigate(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 border border-surface-card hover:border-gold hover:text-gold text-txt-muted flex items-center justify-center transition-all duration-300 bg-black-pure/60"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Primary Lightbox Media display */}
      <div className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center">
        <img
          src={currentImg.src}
          alt={`${currentImg.modelName} — ${currentImg.num}`}
          referrerPolicy="no-referrer"
          className="max-w-[85vw] max-h-[75vh] object-contain border border-surface-card"
        />
        
        {/* Detail Caption */}
        <div className="mt-6 text-center">
          <p className="text-[0.655rem] md:text-xs tracking-[0.3em] text-gold uppercase">
            {currentImg.modelName}
          </p>
          <p className="text-[0.55rem] md:text-[0.62rem] tracking-[0.2em] text-txt-muted uppercase mt-1">
            Imagens em Alta Resolução — {currentImg.num} de {String(images.length).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Next Navigation Trigger */}
      <button
        onClick={() => onNavigate(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 border border-surface-card hover:border-gold hover:text-gold text-txt-muted flex items-center justify-center transition-all duration-300 bg-black-pure/60"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
