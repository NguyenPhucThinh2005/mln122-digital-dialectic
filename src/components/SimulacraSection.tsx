import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlossaryWord } from './GlossaryWord';

gsap.registerPlugin(ScrollTrigger);

export const SimulacraSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !mediaRef.current || !textRef.current || !contextRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", // Đưa về 200% vì bỏ đi phase Ink Fade
        scrub: 1,
        pin: true,
      }
    });

    // 1. Phóng to Media
    tl.to(mediaRef.current, {
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
      duration: 1,
      ease: "power2.inOut"
    });

    // 2. Chữ title "Siêu Thực" tách sang 2 bên
    tl.to('.split-text-left', { x: '-50vw', opacity: 0, duration: 0.8 }, 0);
    tl.to('.split-text-right', { x: '50vw', opacity: 0, duration: 0.8 }, 0);

    // 3. Hiện Context sau khi video phóng to
    tl.fromTo(contextRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.2"
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative z-20">
      
      {/* Nền đệm: Hàng Hóa Hiện Thực (Thế giới vật chất) */}
      <div className="absolute inset-0 z-0">
        {/* Người dùng sẽ tải ảnh này sau */}
        <img 
          src="/images/real-goods-bg.jpg" 
          alt="Thế giới vật chất"
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-stone-900/50"></div>
      </div>

      {/* Khung chứa Text tách đôi ban đầu */}
      <div ref={textRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-difference">
        <h2 className="text-5xl md:text-7xl font-bold text-white flex gap-6">
          <span className="split-text-left transition-none">Hàng Hóa</span>
          <span className="split-text-right transition-none text-orange-500">Siêu Thực</span>
        </h2>
      </div>

      {/* Video / Ảnh được phóng to */}
      <div 
        ref={mediaRef} 
        className="relative z-10 overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center"
        style={{ width: '400px', height: '300px' }}
      >
        {/* Lớp nền mờ để chữ dễ đọc */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        {/* Hàng Hóa Siêu Thực (Simulacra Video) */}
        <video 
          src="/images/vr-simulacra.mp4" 
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none"
        />
        
        {/* Context hiện ra khi cuộn xong */}
        <div ref={contextRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8 opacity-0">
          <div className="max-w-2xl bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-4 text-orange-500">Jean Baudrillard</h3>
            <p className="text-stone-300 text-lg leading-relaxed mb-6">
              Trong nền kinh tế số, chúng ta không còn tiêu thụ "giá trị sử dụng" của sản phẩm, mà tiêu thụ "giá trị ký hiệu" của chúng. Lượt Like, View, các phiên bản Limited Edition ảo... tạo ra một thực tại mô phỏng (<GlossaryWord id="simulacra">Simulacra</GlossaryWord>) hấp dẫn hơn cả đời thực.
            </p>
            <p className="text-stone-400 italic">"Sự thật đã bị xóa nhòa, chỉ còn lại những ký hiệu."</p>
          </div>
        </div>
      </div>
      
    </section>
  );
};
