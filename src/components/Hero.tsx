import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden px-6">
      {/* Background radial overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(201,169,110,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_40%_at_20%_30%,rgba(201,169,110,0.04)_0%,transparent_60%)]" />
      </div>

      {/* Vertical Animated Line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: '300px' }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] bg-gradient-to-b from-transparent via-gold-dim to-transparent"
      />

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
        className="text-[0.62rem] md:text-xs tracking-[0.35em] text-gold uppercase mb-7 font-light relative z-10"
      >
        Criação de Influenciadoras Virtuais com IA
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
        className="font-serif text-5xl md:text-8xl lg:text-[7.5rem] font-light leading-[0.95] text-white-pure relative z-10"
      >
        Faces <br />
        <span className="italic text-gold italic font-light font-serif">Artificiais,</span> <br />
        Impacto Real
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 1.2 }}
        className="mt-6 md:mt-8 text-xs md:text-sm tracking-[0.2em] text-txt-muted max-w-[440px] leading-relaxed relative z-10 font-light"
      >
        Conceitos únicos. Personas construídas do zero. Conteúdo gerado inteiramente por inteligência artificial.
      </motion.p>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.div 
          animate={{ scaleY: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-[50px] bg-gradient-to-b from-gold-dim to-transparent origin-top"
        />
        <span className="text-[0.55rem] tracking-[0.3em] text-txt-muted uppercase">
          Explorar
        </span>
      </motion.div>
    </section>
  );
}
