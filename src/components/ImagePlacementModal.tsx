import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface ImagePlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  imageNum: string;
  onImageUploaded: (base64String: string) => void;
}

export default function ImagePlacementModal({
  isOpen,
  onClose,
  modelName,
  imageNum,
  onImageUploaded,
}: ImagePlacementModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process selected file with canvas compression
  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Por favor, envie um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const imageSrc = reader.result;

        // Custom canvas compression to prevent LocalStorage Quota Exceeded error
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Standardized portrait sizes perfect for professional grid (height bound to 950px max)
          const MAX_HEIGHT = 950;
          const MAX_WIDTH = 750;

          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Apply high quality image scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Output JPEG at 0.78 compression factor (yields sub-120KB files with premium clarity)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.78);
            setPreviewUrl(compressedBase64);
            setBase64Data(compressedBase64);
          } else {
            // Fallback to original
            setPreviewUrl(imageSrc);
            setBase64Data(imageSrc);
          }
        };

        img.onerror = () => {
          setError('Não foi possível ler as dimensões da imagem. Tente outro arquivo.');
        };

        img.src = imageSrc;
      }
    };
    reader.onerror = () => {
      setError('Ocorreu um erro ao processar o arquivo. Tente outro.');
    };
    reader.readAsDataURL(file);
  };

  // Drag listeners
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Drop listener
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // File click change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (base64Data) {
      onImageUploaded(base64Data);
      setPreviewUrl(null);
      setBase64Data(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black-pure/95 flex items-center justify-center p-4 backdrop-blur-md">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface-bg border border-surface-card rounded-[2px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface-card flex justify-between items-center bg-dark-matte">
          <div>
            <h3 className="font-serif text-lg text-white-pure font-light">
              Substituir Imagem <span className="text-gold italic font-serif">Nº {imageNum}</span>
            </h3>
            <p className="text-[0.6rem] tracking-wider text-txt-muted uppercase mt-1">
              Galeria de {modelName}
            </p>
          </div>
          <button
            onClick={() => {
              setPreviewUrl(null);
              setBase64Data(null);
              onClose();
            }}
            className="text-txt-muted hover:text-gold transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-300 text-xs tracking-wide flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!previewUrl ? (
            /* Drag & Drop zone */
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleButtonClick}
              className={`border-2 border-dashed rounded-[2px] p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                dragActive 
                  ? 'border-gold bg-gold/5' 
                  : 'border-surface-card bg-black-pure/60 hover:border-gold-dim hover:bg-gold/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              <Upload className="w-10 h-10 text-gold-dim mb-4 stroke-[1.5]" />
              <p className="text-xs text-white-pure font-light tracking-wide">
                Arraste e solte sua foto aqui, ou <span className="text-gold font-normal">clique para navegar</span>
              </p>
              <p className="text-[0.62rem] text-txt-muted tracking-wider uppercase mt-2">
                Formatos recomendados: JPG, PNG, WebP (máx. 8MB)
              </p>
            </div>
          ) : (
            /* Preview Area */
            <div className="space-y-4">
              <p className="text-[0.58rem] tracking-[0.2em] text-gold uppercase text-left">
                Pré visualização do upload:
              </p>
              <div className="relative aspect-[3/4] w-48 mx-auto border border-surface-card bg-black-pure overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Upload Preview"
                  className="w-full h-full object-cover object-top"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setBase64Data(null);
                  }}
                  className="absolute top-2 right-2 bg-black-pure/80 p-2 text-txt-light hover:text-red-400 rounded-full transition-colors duration-200"
                  title="Remover foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-dark-matte border-t border-surface-card flex justify-end gap-3">
          <button
            onClick={() => {
              setPreviewUrl(null);
              setBase64Data(null);
              onClose();
            }}
            className="px-5 py-3 border border-surface-card text-txt-muted text-[0.6rem] tracking-[0.25em] uppercase hover:text-white-pure transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!base64Data}
            className="px-6 py-3 bg-gold text-black-pure font-normal text-[0.6rem] tracking-[0.25em] uppercase hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirmar Imagem</span>
          </button>
        </div>
      </div>
    </div>
  );
}
