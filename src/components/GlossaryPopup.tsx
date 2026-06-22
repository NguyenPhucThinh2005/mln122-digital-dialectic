import React, { useEffect, useRef, useState } from 'react';
import { useGlossary } from '../contexts/GlossaryContext';
import gsap from 'gsap';
import { X } from 'lucide-react';

export const GlossaryPopup: React.FC = () => {
  const { activeWord, popupPosition, closeGlossary } = useGlossary();
  const popupRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Hiệu ứng mở/đóng bằng GSAP
  useEffect(() => {
    if (activeWord) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      gsap.fromTo(popupRef.current, 
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }
      );
    } else {
      if (isVisible) {
        gsap.to(popupRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 10,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => setIsVisible(false)
        });
      }
    }
  }, [activeWord, isVisible]);

  // Click ra ngoài để đóng
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closeGlossary();
      }
    };
    
    // Đợi 1 frame để tránh việc click mở popup cũng kích hoạt luôn click đóng
    if (activeWord) {
      setTimeout(() => {
        window.addEventListener('click', handleClickOutside);
      }, 10);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [activeWord, closeGlossary]);

  if (!isVisible && !activeWord) return null;

  // Xử lý vị trí để popup không bị lọt ra ngoài màn hình
  let left = popupPosition.x;
  let top = popupPosition.y - 20; // Cách trên từ khóa 20px
  
  // Tính toán sơ bộ nếu width của popup là 320px
  const popupWidth = 320;
  const popupHeight = 400; // Ước lượng
  
  // Căn giữa theo X
  left = left - popupWidth / 2;
  
  // Đảm bảo không tràn viền trái/phải
  if (left < 20) left = 20;
  if (left + popupWidth > window.innerWidth - 20) left = window.innerWidth - popupWidth - 20;
  
  // Đảm bảo không tràn viền trên
  let transformOrigin = "bottom center";
  if (top - popupHeight < 20) {
    // Nếu tràn trên, đẩy xuống dưới từ khóa
    top = popupPosition.y + 30;
    transformOrigin = "top center";
  } else {
    // Đẩy lên trên kích thước của popup
    top = top - popupHeight;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      {/* Background Overlay mờ để làm nổi bật popup */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${activeWord ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Popup Card */}
      {activeWord && (
        <div 
          ref={popupRef}
          className="absolute w-[320px] bg-stone-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto"
          style={{ 
            left: `${left}px`, 
            top: `${top}px`,
            transformOrigin: transformOrigin
          }}
        >
          {/* Nút đóng */}
          <button 
            onClick={(e) => { e.stopPropagation(); closeGlossary(); }}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:bg-black/80 hover:text-white transition-colors backdrop-blur-md border border-white/10"
          >
            <X size={16} />
          </button>

          {/* Ảnh minh họa */}
          <div className="h-40 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-0" />
            <img 
              src={activeWord.image} 
              alt={activeWord.title} 
              className="w-full h-full object-cover mix-blend-screen opacity-80"
            />
          </div>

          {/* Nội dung */}
          <div className="p-6 relative z-10 -mt-6">
            <div className="inline-block px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-3">
              Từ Điển Thuật Ngữ
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{activeWord.title}</h3>
            <p className="text-sm text-stone-300 leading-relaxed text-justify">
              {activeWord.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
