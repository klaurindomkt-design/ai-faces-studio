import { useEffect, useState } from 'react';

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }
    
    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', onMouseMove);

    // Add visual triggers on interactable components
    const updateInteractives = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], .img-card');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    updateInteractives();

    // Use interval to catch newly mounted DOM elements
    const interval = setInterval(updateInteractives, 1000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let frameId: number;
    const animateRing = () => {
      setRingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
        };
      });
      frameId = requestAnimationFrame(animateRing);
    };

    frameId = requestAnimationFrame(animateRing);
    return () => cancelAnimationFrame(frameId);
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        id="cursor"
        className="fixed w-2 h-2 bg-gold rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        id="cursorRing"
        className="fixed w-9 h-9 border border-gold-dim rounded-full pointer-events-none z-[9998] transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2 opacity-60"
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.8 : 1})`,
        }}
      />
    </>
  );
}
