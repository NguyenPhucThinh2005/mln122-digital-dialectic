import React, { useState, useRef } from 'react';
import { Factory, ShoppingCart, Share2, Landmark } from 'lucide-react';

const participants = [
  {
    id: 1,
    title: 'Người Sản Xuất',
    desc: 'Cung cấp hàng hóa, dịch vụ ra thị trường nhằm thu lợi nhuận.',
    icon: Factory,
    imageUrl: '/images/Producer.jpg',
  },
  {
    id: 2,
    title: 'Người Tiêu Dùng',
    desc: 'Mua hàng hóa, dịch vụ để thỏa mãn nhu cầu cá nhân hoặc sản xuất.',
    icon: ShoppingCart,
    imageUrl: '/images/Consumer.jpg',
  },
  {
    id: 3,
    title: 'Trung Gian',
    desc: 'Kết nối người mua và người bán, làm tăng hiệu quả giao dịch.',
    icon: Share2,
    imageUrl: '/images/Intermediary.jpg',
  },
  {
    id: 4,
    title: 'Nhà Nước',
    desc: 'Quản lý, điều tiết và tạo lập môi trường vĩ mô cho thị trường.',
    icon: Landmark,
    imageUrl: '/images/State.jpg',
  }
];

import { TitleReveal } from './TitleReveal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Section1: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "+=150%", // Đóng băng và cuộn thêm 150% chiều cao màn hình
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Chia quá trình cuộn thành 4 phần đều nhau
        const progress = self.progress;
        let newIndex = 0;
        if (progress < 0.25) newIndex = 0;
        else if (progress < 0.5) newIndex = 1;
        else if (progress < 0.75) newIndex = 2;
        else newIndex = 3;

        if (newIndex !== currentIndexRef.current) {
          currentIndexRef.current = newIndex;
          setActiveIndex(newIndex);
        }
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="w-full min-h-screen bg-transparent py-32 px-6 flex flex-col justify-center relative z-20">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/3 text-center lg:text-left">
          <TitleReveal>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter flex flex-wrap gap-x-3 justify-center lg:justify-start">
              <span className="word-animate inline-block">Các</span>
              <span className="word-animate inline-block">Chủ</span>
              <span className="word-animate inline-block">Thể</span>
              <span className="word-animate inline-block text-orange-500">Thị</span>
              <span className="word-animate inline-block text-orange-500">Trường</span>
            </h2>
          </TitleReveal>
          <p className="mt-6 text-lg text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Lý thuyết Chương 2.2: Nền kinh tế thị trường được cấu thành từ 4 chủ thể chính, tạo nên một mạng lưới lợi ích và ràng buộc phức tạp.
          </p>
          
          {/* Hộp hiển thị chi tiết khi Hover */}
          <div className="mt-12 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-left h-[180px] transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
              {React.createElement(participants[activeIndex].icon, { className: "w-6 h-6 text-orange-400" })}
              {participants[activeIndex].title}
            </h3>
            <p className="text-stone-300">
              {participants[activeIndex].desc}
            </p>
          </div>
        </div>

        {/* Right Side: Image Accordion */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-row items-center justify-center lg:justify-end gap-2 md:gap-4 overflow-x-auto p-4">
            {participants.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.id}
                  className={`
                    relative h-[500px] rounded-3xl overflow-hidden cursor-pointer
                    transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border border-white/10
                    ${isActive ? 'w-[300px] md:w-[450px] shadow-2xl shadow-orange-500/20' : 'w-[60px] md:w-[80px] grayscale-[50%] hover:grayscale-0'}
                  `}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Dark overlay */}
                  <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-black/10' : 'bg-black/60'}`}></div>
                  
                  {/* Bottom Gradient for text readability */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80`}></div>

                  {/* Caption Text */}
                  <div
                    className={`
                      absolute text-white whitespace-nowrap flex items-center gap-3
                      transition-all duration-500 ease-in-out
                      ${
                        isActive
                          ? 'bottom-8 left-8 rotate-0' 
                          : 'w-auto text-left bottom-16 left-1/2 -translate-x-1/2 -rotate-90'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 hidden md:block'}`}>
                      <item.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className={`${isActive ? 'text-2xl font-bold' : 'text-xl font-semibold tracking-wider text-stone-300'}`}>
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
