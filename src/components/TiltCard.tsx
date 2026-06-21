import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  imageSrc: string;
  name: string;
  role: React.ReactNode;
  quote: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ imageSrc, name, role, quote, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-2xl ${className}`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})`, transform: "translateZ(0px)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" style={{ transform: "translateZ(0px)" }} />
      
      {/* Content that pops out slightly using translateZ */}
      <div 
        className="absolute inset-0 p-6 flex flex-col justify-end text-white"
        style={{ transform: "translateZ(50px)" }}
      >
        <p className="text-sm md:text-base italic mb-4 text-stone-300 font-light leading-relaxed">
          "{quote}"
        </p>
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-orange-400 uppercase tracking-widest">{role}</p>
      </div>
    </motion.div>
  );
};
