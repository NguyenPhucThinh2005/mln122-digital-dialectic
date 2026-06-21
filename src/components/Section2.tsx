import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Smartphone, Banknote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

import { TitleReveal } from './TitleReveal';
import { useBackground } from '../contexts/BackgroundContext';

export const Section2: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const leftText = useRef<HTMLDivElement>(null);
  const rightVisuals = useRef<HTMLDivElement>(null);
  const { setBackgroundState } = useBackground();

  useGSAP(() => {
    // Đổi màu background khi vào Section 2 (Shopee)
    ScrollTrigger.create({
      trigger: container.current,
      start: "top center",
      end: "bottom center",
      onEnter: () => setBackgroundState({ color: '#ea580c', speed: 1.2 }), // Orange Red Shopee
      onLeaveBack: () => setBackgroundState({ color: '#f97316', speed: 0.8 }), // Normal Orange
    });

    // Pin the left text container
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "bottom bottom",
      pin: leftText.current,
    });

    const visuals = gsap.utils.toArray('.visual-card');
    
    // Animate visuals appearing
    visuals.forEach((visual: any) => {
      gsap.fromTo(visual, 
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: visual,
            start: "top center",
            end: "bottom center",
            scrub: true,
          }
        }
      );
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full bg-transparent text-stone-100 pb-[30vh]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row relative">
        
        {/* Left Side: Pinned Text */}
        <div className="w-full md:w-1/2 md:h-screen flex flex-col justify-center py-20 pr-10 z-10" ref={leftText}>
          <TitleReveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white flex flex-wrap gap-x-3">
              <span className="word-animate inline-block">Case</span>
              <span className="word-animate inline-block">Study:</span>
              <span className="word-animate inline-block w-full text-orange-500">Shopee</span>
            </h2>
          </TitleReveal>
          <p className="text-xl text-stone-300 mb-6 leading-relaxed">
            Trong bối cảnh kinh tế số, Shopee không chỉ là một cái "chợ" truyền thống. Nó hoạt động với hai tư cách:
          </p>
          <ul className="space-y-6 text-lg">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">1</div>
              <p><strong>Trung gian kết nối:</strong> Cung cấp hạ tầng công nghệ để giảm chi phí giao dịch, kết nối hàng triệu người mua và người bán.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">2</div>
              <p><strong>Chủ thể kinh doanh:</strong> Lợi ích của sàn hoàn toàn độc lập, đến từ Phí sàn, Bán quảng cáo, và Dịch vụ vận chuyển (SPX).</p>
            </li>
          </ul>
        </div>

        {/* Right Side: Scrolling Visuals */}
        <div className="w-full md:w-1/2 pt-[20vh] md:pt-[50vh] pb-[50vh] flex flex-col gap-[30vh]" ref={rightVisuals}>
          
          <div className="visual-card w-full aspect-square bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-center">
            <Smartphone className="w-24 h-24 text-orange-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-white">App / Nền tảng lõi</h3>
            <p className="text-stone-300">Hạ tầng công nghệ xóa nhòa khoảng cách địa lý.</p>
            <div className="mt-8 px-4 py-2 bg-white/5 text-stone-400 rounded-lg text-sm border border-dashed border-white/20">
              [Placeholder: Ảnh UI Shopee App]
            </div>
          </div>

          <div className="visual-card w-full aspect-square bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-center">
            <Store className="w-24 h-24 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-white">Gian hàng & Dịch vụ</h3>
            <p className="text-stone-300">Kết nối người bán và người mua. Freeship Extra, Mall.</p>
            <div className="mt-8 px-4 py-2 bg-white/5 text-stone-400 rounded-lg text-sm border border-dashed border-white/20">
              [Placeholder: Ảnh UI Gian hàng]
            </div>
          </div>

          <div className="visual-card w-full aspect-square bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-center">
            <Banknote className="w-24 h-24 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-white">Doanh thu chủ thể</h3>
            <p className="text-stone-300">Thu phí sàn, đấu thầu từ khóa, bán vị trí hiển thị.</p>
            <div className="mt-8 px-4 py-2 bg-white/5 text-stone-400 rounded-lg text-sm border border-dashed border-white/20">
              [Placeholder: Ảnh Tiền / Quảng cáo]
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
