import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-7 flex justify-between items-center bg-gradient-to-b from-black-pure/95 to-transparent backdrop-blur-xs"
    >
      <div className="font-serif text-lg tracking-[0.25em] text-gold uppercase font-light">
        AI Faces Studio
      </div>
      <ul className="flex gap-10 list-none">
        <li>
          <a 
            href="#portfolio" 
            className="text-txt-muted hover:text-gold text-[0.655rem] tracking-[0.2em] uppercase transition-colors duration-300"
          >
            Portfolio
          </a>
        </li>
        <li>
          <a 
            href="#cta" 
            className="text-txt-muted hover:text-gold text-[0.655rem] tracking-[0.2em] uppercase transition-colors duration-300"
          >
            Contato
          </a>
        </li>
      </ul>
    </motion.nav>
  );
}
