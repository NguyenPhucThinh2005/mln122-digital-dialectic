import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { MoveRight, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  
  // Framer Motion state for animated text
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["thao túng", "cạnh tranh", "đào thải", "sinh tồn"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  useGSAP(() => {
    // Scroll animation for Hero
    gsap.to(container.current, {
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        pinSpacing: false, // Ngăn chặn tạo khoảng trống, cho phép section tiếp theo trượt đè lên
      },
      y: -50, // Parallax nhẹ lùi về sau
      opacity: 0,
      scale: 0.95
    });
  }, { scope: container });

  return (
    <section 
      ref={container}
      className="relative min-h-screen w-full overflow-hidden bg-transparent text-white"
    >
      <div className="relative z-10 container mx-auto px-6 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          
          {/* Cột trái: Nội dung chữ */}
          <div className="flex flex-col justify-center items-start pt-20 lg:pt-0">
            <h1 className="text-5xl md:text-7xl font-regular flex flex-col gap-2 w-full text-left">
              <span className="text-white">Luật chơi</span>
              <span className="relative flex overflow-hidden h-[1.2em] w-full text-left">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-orange-500 origin-left"
                    initial={{ opacity: 0, y: "100%" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? "-150%" : "150%",
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-stone-300 max-w-xl text-left mt-8">
              Nền kinh tế số đang tạo ra một mặt bằng mới. Nơi thuật toán quyết định sự hiển thị, lợi ích đan xen và sự đào thải khốc liệt. Khám phá cách các ông lớn như Shopee thao túng thị trường.
            </p>
            
            <div className="flex flex-row gap-4 mt-10">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all font-medium">
                Khám phá <Play className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-lg shadow-orange-600/30 font-medium">
                Live Poll <MoveRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cột phải: Vùng chứa hình ảnh / 3D Model Adam Smith */}
          <div className="relative flex items-center justify-center min-h-[400px] w-full lg:h-[600px]">
            {/* Vòng tròn hiệu ứng sáng đằng sau (tôn thêm vẻ thần bí) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
            
            <div className="relative z-10 w-full h-[400px] lg:h-full flex flex-col items-center justify-center">
              <iframe 
                title="Adam Smith" 
                className="w-full h-full border-0 outline-none scale-125 lg:scale-150 mb-8"
                allowFullScreen 
                allow="autoplay; fullscreen; xr-spatial-tracking" 
                xr-spatial-tracking="true" 
                execution-while-out-of-viewport="true" 
                execution-while-not-rendered="true" 
                web-share="true" 
                src="https://sketchfab.com/models/6786577f645e4c33a46367a658b63b8d/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_stop=0&ui_theme=dark&dnt=1&ui_inspector=0&ui_settings=0&ui_help=0&ui_animations=0&ui_hint=0"
              >
              </iframe>
              
              {/* Caption */}
              <div className="absolute bottom-[-20px] lg:bottom-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 text-center pointer-events-none transform translate-y-10">
                <h3 className="text-xl font-bold text-white mb-1">Adam Smith</h3>
                <p className="text-sm text-stone-300">
                  Cha đẻ của khái niệm <span className="text-orange-400 font-medium">"Bàn tay vô hình"</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
