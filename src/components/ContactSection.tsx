import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, AlertCircle, MessageCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    style: 'Moda e Luxo',
    details: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate reliable API endpoint
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form save for styling key values
      setFormData({
        name: '',
        email: '',
        company: '',
        style: 'Moda e Luxo',
        details: '',
      });
    }, 1500);
  };

  return (
    <section id="cta" className="relative py-28 px-6 md:px-16 text-center border-t border-surface-card bg-black-pure/70">
      {/* Decorative center background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-gold-dim to-transparent" />

      <div className="max-w-4xl mx-auto">
        <span className="text-[0.6rem] tracking-[0.35em] text-gold uppercase mb-4 block font-light">
          Vamos Criar Juntos
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-white-pure leading-tight mb-6">
          Sua influenciadora <br />
          <span className="italic text-gold italic font-light font-serif">do zero ao viral.</span>
        </h2>
        <p className="text-xs md:text-sm tracking-[0.12em] text-txt-muted max-w-[500px] mx-auto leading-relaxed mb-12 font-light">
          Do conceito à identidade visual completa. Personas 100% originais, geradas com técnicas avançadas de IA, prontas para monetização e crescimento orgânico.
        </p>

        {/* Dynamic Booking/Contact Form */}
        <div className="max-w-xl mx-auto text-left bg-surface-bg border border-surface-card p-6 md:p-10 rounded-[2px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Clara Silva"
                  className="w-full bg-black-pure border border-surface-card px-4 py-3 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px]"
                />
              </div>
              <div>
                <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2">
                  E-mail de Contato *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex: clara@empresa.com"
                  className="w-full bg-black-pure border border-surface-card px-4 py-3 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2">
                  Nome da Empresa / Marca
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Ex: Lux Wear"
                  className="w-full bg-black-pure border border-surface-card px-4 py-3 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px]"
                />
              </div>
              <div>
                <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2">
                  Estilo de Personagem Pretendido
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  className="w-full bg-black-pure border border-surface-card px-4 py-3 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px] appearance-none"
                >
                  <option value="Moda e Luxo">Fashion & Moda de Luxo</option>
                  <option value="Fitness e Wellness">Fitness & Wellness</option>
                  <option value="Gaming e Streetwear">Streetwear & Gaming (Cyberpunk)</option>
                  <option value="Outro">Outro conceito original</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[0.58rem] tracking-[0.2em] text-gold uppercase mb-2">
                Conte-nos sobre a sua visão
              </label>
              <textarea
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Breve descrição da influenciadora virtual que deseja construir..."
                className="w-full bg-black-pure border border-surface-card p-4 text-xs text-white-pure tracking-wider focus:outline-none focus:border-gold transition-colors duration-300 rounded-[1px] resize-none"
              />
            </div>

            {/* Response notifications */}
            <AnimatePresence mode="wait">
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-gold/10 border border-gold/30 text-gold text-xs tracking-wider"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Proposta solicitada com sucesso! Entraremos em contato em até 24 horas.</span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-500/30 text-red-300 text-xs tracking-wider"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Por favor, preencha os campos obrigatórios (*).</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative inline-block px-10 py-4 border border-gold text-gold font-sans text-[0.655rem] tracking-[0.3em] uppercase bg-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold hover:text-black-pure cursor-pointer"
              >
                {isSubmitting ? 'Processando...' : 'Solicitar Proposta'}
              </button>
              
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/5511994480618?text=Olá!%20Gostaria%20de%20solicitar%20uma%20proposta%20focada%20na%20criação%20de%20influenciadoras%2520virtuais."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 scale-100 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-950/20 cursor-pointer"
                  title="Falar no WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 fill-emerald-500/10" />
                </a>

                <span className="text-gold-dim/20">•</span>

                <a
                  href="mailto:klaurindomkt@gmail.com?subject=AI%20Faces%20Studio%20-%20Contato&body=Olá,%20gostaria%20de%20saber%20mais%20sobre%20a%20criação%2520de%20influenciadoras%2520virtuais."
                  className="text-xs text-txt-muted hover:text-gold tracking-[0.1em] flex items-center gap-2 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-gold-dim" />
                  <span>E-mail Direto</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
