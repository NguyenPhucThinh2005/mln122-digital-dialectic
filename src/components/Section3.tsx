import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';
import { TitleReveal } from './TitleReveal';
import { useBackground } from '../contexts/BackgroundContext';
import { GlossaryWord } from './GlossaryWord';

gsap.registerPlugin(ScrollTrigger);

const algorithmPowers = [
  {
    id: 'visibility',
    title: 'Quyền Lực Hiển Thị',
    icon: Eye,
    content: 'Thuật toán nắm quyền sinh sát bằng cách phân loại và xếp hạng. Ai xuất hiện trên Top tìm kiếm, ai được đẩy vào Xu hướng, ai bị "chìm vào quên lãng" đều do cỗ máy này định đoạt.',
    position: 'top-[-50px] md:top-[-100px] left-1/2 -translate-x-1/2',
    color: 'border-orange-500/50 shadow-orange-500/20 text-orange-400'
  },
  {
    id: 'discipline',
    title: 'Kỷ Luật Dữ Liệu',
    icon: ShieldAlert,
    content: <>Một mô hình <GlossaryWord id="panopticon">Panopticon</GlossaryWord> kiểu mới. Thuật toán giám sát mọi hành vi và tự động giáng "gậy sao quả tạ", bóp tương tác, khóa mõm người bán mà không cho họ quyền phản biện.</>,
    position: 'bottom-[-50px] md:bottom-[0px] left-[-20px] md:left-[-50px]',
    color: 'border-red-500/50 shadow-red-500/20 text-red-400'
  },
  {
    id: 'exploitation',
    title: 'Bóc Lột Tự Nguyện',
    icon: Cpu,
    content: <>Nền tảng buộc người bán phải tham gia vào vòng xoáy Flash Sale, Voucher để tồn tại. Sự bóc lột <GlossaryWord id="surplus-value">Giá trị thặng dư</GlossaryWord> diễn ra hoàn toàn "tự nguyện".</>,
    position: 'bottom-[-50px] md:bottom-[0px] right-[-20px] md:right-[-50px]',
    color: 'border-purple-500/50 shadow-purple-500/20 text-purple-400'
  }
];

export const Section3: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<SVGSVGElement>(null);
  const { setBackgroundState } = useBackground();
  
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useGSAP(() => {
    // Đổi màu background sang đỏ máu
    ScrollTrigger.create({
      trigger: container.current,
      start: "top center",
      end: "bottom center",
      onEnter: () => setBackgroundState({ color: '#dc2626', speed: 2.5, particleCount: 800 }),
      onLeaveBack: () => setBackgroundState({ color: '#ea580c', speed: 1.2, particleCount: 600 }),
    });

    // Hiệu ứng hút vào lỗ đen ban đầu
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

    // Core pulsing animation (Heartbeat of the Matrix)
    gsap.to(coreRef.current, {
      scale: 1.05,
      boxShadow: "0 0 60px 20px rgba(239, 68, 68, 0.4)",
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Reveal cards when scrolling into view
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: coreRef.current,
        start: "top 70%",
      }
    });

    // Pop the core first
    tl.fromTo(coreRef.current, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
    );

    // Then pop the cards
    cardsRef.current.forEach((card) => {
      if (!card) return;
      tl.fromTo(card, {
        opacity: 0,
        scale: 0.5,
        y: 50
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.2)"
      }, "-=0.4");
    });

    // SVG Lines drawing animation
    tl.from("path.data-line", {
      strokeDashoffset: 300,
      strokeDasharray: 300,
      duration: 1.5,
      stagger: 0.2,
      ease: "power2.inOut"
    }, "-=0.8");

  }, { scope: container });

  // Tọa độ tương đối của các đường kết nối SVG
  // SVG được scale lên bao trùm cả container
  return (
    <section ref={container} className="relative w-full min-h-screen py-32 px-6 bg-transparent text-white flex flex-col justify-center">

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-24 md:mb-32">
        <TitleReveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-red-500 flex flex-wrap gap-x-3 justify-center">
            <span className="word-animate inline-block">Quyền</span>
            <span className="word-animate inline-block">Lực</span>
            <span className="word-animate inline-block text-white">Thuật</span>
            <span className="word-animate inline-block text-white">Toán</span>
          </h2>
        </TitleReveal>
        <p className="text-xl md:text-2xl text-stone-400 font-light leading-relaxed max-w-3xl mx-auto">
          Thuật toán không chỉ là những đoạn code vô tri. Nó là một thiết chế quyền lực mới, thiết lập luật chơi và chi phối số phận của hàng triệu người tham gia.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto aspect-square md:aspect-[16/9] flex items-center justify-center mt-10">
        
        {/* Connection Lines (SVG) */}
        <svg 
          ref={linesRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0" 
          viewBox="0 0 1000 600" 
          preserveAspectRatio="none"
        >
          {/* Line 1 (Top) */}
          <path className="data-line" d="M 500,300 L 500,100" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          {/* Line 2 (Bottom Left) */}
          <path className="data-line" d="M 500,300 L 200,450" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          {/* Line 3 (Bottom Right) */}
          <path className="data-line" d="M 500,300 L 800,450" stroke="#a855f7" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          
          {/* Animated Data Pulses along the lines */}
          <circle cx="500" cy="100" r="4" fill="#f97316" filter="blur(2px)">
            <animate attributeName="cy" values="300;100" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="450" r="4" fill="#ef4444" filter="blur(2px)">
            <animate attributeName="cx" values="500;200" dur="2s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;450" dur="2s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="800" cy="450" r="4" fill="#a855f7" filter="blur(2px)">
            <animate attributeName="cx" values="500;800" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;450" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* The Core (Lõi Thuật Toán) */}
        <div 
          ref={coreRef}
          className="absolute z-20 w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-red-600 via-stone-900 to-black border-4 border-red-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] backdrop-blur-xl group cursor-crosshair"
        >
          <div className="absolute inset-0 rounded-full border border-red-400/20 animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-red-400/30 animate-[spin_3s_linear_infinite_reverse]" />
          <div className="absolute inset-4 rounded-full border border-red-400/40 animate-[spin_2s_linear_infinite]" />
          
          <div className="text-center">
            <Cpu className="w-10 h-10 md:w-16 md:h-16 text-white/80 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-red-300">The Core</span>
          </div>

          {/* Holographic Text appearing on hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none text-center">
            <span className="text-[10px] md:text-xs font-mono text-red-500/80 bg-black/80 px-2 py-1 rounded border border-red-500/30">
              ALGORITHM_MATRIX_ACTIVE
            </span>
          </div>
        </div>

        {/* 3 Satellite Cards */}
        {algorithmPowers.map((power, index) => {
          const Icon = power.icon;
          const isActive = activeNode === power.id;
          
          return (
            <div 
              key={power.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`absolute z-30 w-[280px] md:w-[320px] bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 cursor-pointer ${power.position} ${isActive ? power.color + ' scale-105 z-40 bg-stone-950' : 'hover:border-white/30 hover:shadow-2xl'}`}
              onMouseEnter={() => setActiveNode(power.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg bg-black/50 border border-white/5 ${power.color.split(' ')[0]}`}>
                  <Icon className={`w-6 h-6 ${power.color.split(' ')[2]}`} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">{power.title}</h3>
              </div>
              <p className="text-sm md:text-base text-stone-300 leading-relaxed">
                {power.content}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
};
