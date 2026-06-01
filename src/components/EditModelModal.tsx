import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Model } from '../types';

interface EditModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model;
  onSave: (updatedModelData: Partial<Model>) => void;
}

export default function EditModelModal({
  isOpen,
  onClose,
  model,
  onSave,
}: EditModelModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (model) {
      setFirstName(model.firstName);
      setLastName(model.lastName);
      setDescription(model.description);
      setTags(model.tags.join(', '));
    }
  }, [model]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags back into array
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      firstName,
      lastName,
      description,
      tags: parsedTags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black-pure/95 flex items-center justify-center p-4 backdrop-blur-md">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-surface-bg border border-surface-card rounded-[2px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface-card flex justify-between items-center bg-dark-matte">
          <div>
            <h3 className="font-serif text-lg text-white-pure font-light">
              Editar Persona: <span className="text-gold italic font-serif">{model.firstName} {model.lastName}</span>
            </h3>
            <p className="text-[0.6rem] tracking-wider text-txt-muted uppercase mt-1">
              Editar descrição, nome e tags relevantes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-txt-muted hover:text-gold transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2 font-medium">
                Primeiro Nome *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-black-pure border border-surface-card px-4 py-3 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px]"
              />
            </div>
            <div>
              <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2 font-medium">
                Sobrenome
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-black-pure border border-surface-card px-4 py-3 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2 font-medium">
              Segmentos / Tags (Separados por vírgula)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: Moda, Luxo, Lifestyle"
              className="w-full bg-black-pure border border-surface-card px-4 py-3 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px]"
            />
          </div>

          <div>
            <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2 font-medium">
              Biografia / Descrição da Persona *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Influenciadora virtual criada para o nicho de alta gastronomia..."
              className="w-full bg-black-pure border border-surface-card p-4 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-dark-matte border-t border-surface-card flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-surface-card text-txt-muted text-[0.6rem] tracking-[0.25em] uppercase hover:text-white-pure transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gold text-black-pure font-normal text-[0.6rem] tracking-[0.25em] uppercase hover:bg-gold-light transition-all duration-200 flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
}
