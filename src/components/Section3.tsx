import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingDown, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

import { TitleReveal } from './TitleReveal';
import { useBackground } from '../contexts/BackgroundContext';

export const Section3: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const { setBackgroundState } = useBackground();

  useGSAP(() => {
    // Đổi màu background sang đỏ máu và tăng tốc độ dòng chảy (Hút vào lỗ đen)
    ScrollTrigger.create({
      trigger: container.current,
      start: "top center",
      end: "bottom center",
      onEnter: () => setBackgroundState({ color: '#dc2626', speed: 2.5, particleCount: 800 }), // Red Blood
      onLeaveBack: () => setBackgroundState({ color: '#ea580c', speed: 1.2, particleCount: 600 }), // Back to Shopee
    });

    // Hiệu ứng hút vào lỗ đen (Phóng to từ trong ra ngoài)
    gsap.from(container.current, {
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "top 20%",
        scrub: true,
      },
      scale: 0.5,
      opacity: 0,
      filter: 'blur(30px)',
      ease: "power2.inOut"
    });

    // Chart animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 30%",
        end: "bottom 80%",
        scrub: 1,
      }
    });

    tl.fromTo(".line-shopee", { height: 0 }, { height: "100%", ease: "none" })
      .to(".line-tiki", { height: "20%", opacity: 0.2, ease: "none" }, "<")
      .to(".line-sendo", { height: "10%", opacity: 0.1, ease: "none" }, "<");

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full min-h-screen py-32 px-6 overflow-hidden bg-transparent text-white">

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-24">
        <TitleReveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-red-500 flex flex-wrap gap-x-3 justify-center">
            <span className="word-animate inline-block">Quyền</span>
            <span className="word-animate inline-block">Lực</span>
            <span className="word-animate inline-block">Thuật</span>
            <span className="word-animate inline-block">Toán</span>
          </h2>
        </TitleReveal>
        <p className="text-xl md:text-2xl text-stone-400 font-light leading-relaxed max-w-3xl mx-auto">
          Thuật toán thiết lập luật chơi. Không tuân theo sẽ bị đào thải. Nền tảng quyết định ai được lên trang đầu, ai bị "gậy sao quả tạ", ép buộc người bán vào vòng xoáy chiết khấu.
        </p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto bg-stone-900/50 backdrop-blur-md border border-stone-800 rounded-3xl p-8 md:p-16">
        <h3 className="text-2xl font-bold mb-12 text-center text-stone-300">Sự Đào Thải Của Thị Trường (Quy luật cạnh tranh)</h3>
        
        {/* Animated Bar Chart Placeholder */}
        <div className="h-[400px] flex items-end justify-center gap-4 md:gap-16 border-b border-stone-700 pb-4">
          
          {/* Sendo */}
          <div className="flex flex-col items-center w-24">
            <div className="w-full bg-red-600 line-sendo h-[60%] rounded-t-md flex justify-center items-start pt-4">
              <TrendingDown className="text-white/50" />
            </div>
            <span className="mt-4 font-bold text-stone-500">Sendo</span>
          </div>

          {/* Shopee */}
          <div className="flex flex-col items-center w-32 relative">
            {/* Glowing effect behind Shopee bar */}
            <div className="absolute bottom-10 w-full h-full bg-orange-500/20 blur-xl"></div>
            <div className="w-full bg-gradient-to-t from-orange-600 to-orange-400 line-shopee h-0 rounded-t-md relative z-10 flex justify-center items-start pt-4">
              <TrendingUp className="text-white" />
            </div>
            <span className="mt-4 font-bold text-orange-500 text-xl">Shopee</span>
          </div>

          {/* Tiki */}
          <div className="flex flex-col items-center w-24">
            <div className="w-full bg-blue-600 line-tiki h-[80%] rounded-t-md flex justify-center items-start pt-4">
              <TrendingDown className="text-white/50" />
            </div>
            <span className="mt-4 font-bold text-stone-500">Tiki</span>
          </div>

        </div>

        <div className="mt-16 text-center text-stone-400">
          [Placeholder: Designer sẽ vẽ hình Thuật toán ma trận ở đây và các logo thật]
        </div>
      </div>
    </section>
  );
};
