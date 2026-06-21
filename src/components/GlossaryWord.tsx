import React, { useRef } from 'react';
import { useGlossary } from '../contexts/GlossaryContext';
import { Info } from 'lucide-react';

interface GlossaryWordProps {
  id: string;
  children: React.ReactNode;
}

export const GlossaryWord: React.FC<GlossaryWordProps> = ({ id, children }) => {
  const { openGlossary } = useGlossary();
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      // Mở popup ngay phía trên hoặc bên dưới từ đó
      openGlossary(id, { x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  return (
    <span 
      ref={spanRef}
      onClick={handleClick}
      className="relative inline-flex items-center text-orange-400 font-semibold cursor-pointer border-b border-dashed border-orange-500/50 hover:text-orange-300 hover:border-orange-400 transition-colors duration-200 group z-10"
      style={{ textShadow: '0 0 10px rgba(249, 115, 22, 0)' }} // Sẽ animate bóng mờ bằng CSS nếu cần
    >
      {children}
      <span className="inline-flex items-center justify-center ml-1 w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 opacity-70 group-hover:opacity-100 group-hover:bg-orange-500/30 transition-all">
        <Info size={10} />
      </span>
      {/* Hiệu ứng Glow khi Hover */}
      <span className="absolute inset-0 bg-orange-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10 pointer-events-none"></span>
    </span>
  );
};
