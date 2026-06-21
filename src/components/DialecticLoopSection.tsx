import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Crosshair, TrendingUp, RefreshCw, Zap } from 'lucide-react';
import { TitleReveal } from './TitleReveal';
import { GlossaryWord } from './GlossaryWord';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    id: 1,
    title: "Thu Thập Dữ Liệu",
    date: "Bước 1",
    content: "Mọi tương tác, cú click, thời gian xem của người dùng đều bị ghi lại. Chúng ta biến thành những dòng dữ liệu thô phục vụ cho việc phân tích.",
    category: "Foucault",
    icon: Database,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Định Tuyến Hành Vi",
    date: "Bước 2",
    content: "Dữ liệu được dùng để huấn luyện thuật toán. Nền tảng dự đoán và định hướng những gì chúng ta sẽ xem, sẽ mua tiếp theo.",
    category: "Algorithm",
    icon: Crosshair,
    relatedIds: [3],
    status: "in-progress",
    energy: 85,
  },
  {
    id: 3,
    title: "Tối Đa Lợi Nhuận",
    date: "Bước 3",
    content: "Nhu cầu tiêu dùng bị kích thích liên tục qua Flash Sale, Voucher. Các nhà bán hàng buộc phải chạy đua giảm giá để được hiển thị.",
    category: "Shopee",
    icon: TrendingUp,
    relatedIds: [4],
    status: "pending",
    energy: 60,
  },
  {
    id: 4,
    title: <>Sự <GlossaryWord id="alienation">Tha Hóa</GlossaryWord></>,
    date: "Bước 4",
    content: "Người dùng phụ thuộc vào nền tảng. Nhà bán hàng bị ép giá. Shipper vắt kiệt sức lao động. Nền tảng thu lợi lớn nhất.",
    category: "Marx",
    icon: RefreshCw,
    relatedIds: [1],
    status: "pending",
    energy: 40,
  }
];

export const DialecticLoopSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    stRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=300%", // Cuộn 300% chiều cao màn hình để xoay đủ 4 node
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        // self.progress (0 -> 1)
        // 4 items => mỗi item chiếm 0.25 progress
        const progress = self.progress;
        
        setScrollProgress(progress);
        
        let newIndex;
        // Điểm ở đỉnh tương ứng với các mức progress: 0, 0.25, 0.5, 0.75, 1.0
        // Ta chia khoảng để Node gần đỉnh nhất sẽ active
        if (progress < 0.125) newIndex = 0;
        else if (progress < 0.375) newIndex = 1;
        else if (progress < 0.625) newIndex = 2;
        else if (progress < 0.875) newIndex = 3;
        else newIndex = 0; // Vượt quá 0.875 nghĩa là Node 0 đang tiến lại về đỉnh (hoàn thành 1 vòng lặp)

        if (newIndex !== currentIndexRef.current) {
          currentIndexRef.current = newIndex;
          setActiveIndex(newIndex);
        }

        // Tính góc xoay của Orbit (từ 0 đến 360 độ) để Node hiện tại nằm ở vị trí trung tâm trên cùng (góc 270)
        const targetAngle = (progress * 360);
        setRotationAngle(-targetAngle); // Xoay ngược chiều kim đồng hồ
      }
    });

  }, { scope: containerRef });

  const calculateNodePosition = (index: number, total: number) => {
    // Để Node 1 ở đỉnh, góc xuất phát phải là -90 độ (270)
    const angle = ((index / total) * 360 - 90);
    const radius = 320; // Tăng bán kính lên 320 để chữ không đè vào giữa
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    return { x, y };
  };

  const handleNodeClick = (index: number) => {
    if (stRef.current) {
      const st = stRef.current;
      // Trở lại đúng điểm progress mà Node đó ở vị trí đỉnh cao nhất
      const targetProgress = index * 0.25;
      const targetY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const activeItem = timelineData[activeIndex];

  return (
    <section ref={containerRef} className="w-full h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-black to-black flex flex-col items-center justify-center overflow-hidden relative z-20">
      
      <div className="absolute top-16 left-0 right-0 z-50 text-center pointer-events-none">
        <TitleReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-white flex gap-x-3 justify-center">
            <span className="word-animate inline-block">Vòng Lặp</span>
            <span className="word-animate inline-block text-orange-500">Biện Chứng</span>
          </h2>
        </TitleReveal>
        <p className="text-stone-400 mt-4 text-lg">Sự tuần hoàn của dữ liệu và sức lao động</p>
      </div>

      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center mt-20">
        
        {/* Orbit Container (Xoay theo cuộn) */}
        <div 
          ref={orbitRef} 
          className="absolute w-full h-full flex items-center justify-center"
          style={{ transform: `rotate(${rotationAngle}deg)` }}
        >
          {/* Lõi trung tâm */}
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(249,115,22,0.5)]">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md"></div>
          </div>

          {/* Đường tròn quỹ đạo nền (Đứt nét) */}
          <div className="absolute w-[640px] h-[640px] rounded-full border border-white/10 border-dashed"></div>

          {/* Cung tròn Highlight nối các Node */}
          <svg className="absolute w-[640px] h-[640px] -rotate-90 pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <circle
              cx="320"
              cy="320"
              r="320"
              fill="none"
              stroke="url(#orbit-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 320}
              strokeDashoffset={2 * Math.PI * 320 * (1 - scrollProgress)}
              className="transition-all duration-75 ease-linear"
            />
          </svg>

          {/* Các Node */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isActive = index === activeIndex;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleNodeClick(index)}
                className="absolute flex flex-col items-center justify-center cursor-pointer group"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${-rotationAngle}deg)`, // Node tự xoay ngược lại để luôn đứng thẳng
                  zIndex: isActive ? 50 : 10 
                }}
              >
                <div
                  className={`
                  w-14 h-14 rounded-full flex items-center justify-center shadow-lg
                  ${isActive ? "bg-orange-500 text-white shadow-orange-500/50 scale-125" : "bg-black text-white/50 border border-white/20"}
                  transition-all duration-300 transform
                `}
                >
                  <Icon size={24} />
                </div>
                <div className={`mt-4 whitespace-nowrap text-sm font-semibold tracking-wider transition-all duration-300 ${isActive ? "text-orange-400 scale-110" : "text-white/40"}`}>
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bảng Context (Không xoay) */}
        <div className="absolute z-50 pointer-events-none flex items-center justify-center">
          <div className="w-72 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl shadow-orange-500/10 transform transition-all duration-500 scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-white/80 font-mono">{activeItem.category}</span>
              <span className="text-xs font-mono text-orange-400">{activeItem.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{activeItem.title}</h3>
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              {activeItem.content}
            </p>
            
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="flex items-center text-stone-400">
                  <Zap size={12} className="mr-1 text-orange-400" /> Cường độ
                </span>
                <span className="font-mono text-white">{activeItem.energy}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
                  style={{ width: `${activeItem.energy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
