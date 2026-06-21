import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from './TiltCard';
import { TitleReveal } from './TitleReveal';

gsap.registerPlugin(ScrollTrigger);

const philosophers = [
  {
    id: 'marx',
    name: 'Karl Marx',
    role: 'Giá Trị Thặng Dư',
    imageSrc: '/images/karl_marx.jpg',
    quote: 'Dữ liệu người dùng và sức lao động của shipper bị bóc lột để tạo ra giá trị khổng lồ cho nền tảng.'
  },
  {
    id: 'foucault',
    name: 'Michel Foucault',
    role: 'Giám Sát Toàn Cảnh',
    imageSrc: '/images/foucault.jpg',
    quote: 'Chúng ta sống trong một Panopticon kỹ thuật số, nơi mọi cú click đều bị theo dõi để thao túng hành vi.'
  },
  {
    id: 'baudrillard',
    name: 'Jean Baudrillard',
    role: 'Tính Siêu Thực',
    imageSrc: '/images/baudrillard.jpg',
    quote: 'Sự thật bị xóa nhòa bởi thế giới ảo. Lượt like, view và xu hướng trở thành hệ quy chiếu giá trị mới.'
  }
];

export const PhilosophySection: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const adamCardSlotRef = useRef<HTMLDivElement>(null);
  const adamCardRealRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !stickyRef.current || !heroImageRef.current || !adamCardSlotRef.current) return;

    const updateAnimation = () => {
      // Clean up previous ScrollTriggers if we are refreshing
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === container.current) {
          st.kill();
        }
      });

      // Tính toán tọa độ tương đối của Slot so với Sticky Container
      const parentRect = stickyRef.current!.getBoundingClientRect();
      const slotRect = adamCardSlotRef.current!.getBoundingClientRect();
      
      const targetTop = slotRect.top - parentRect.top;
      const targetLeft = slotRect.left - parentRect.left;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=200%", // Đưa về 200% vì bỏ qua phase reveal
          scrub: 1,
          pin: stickyRef.current,
        }
      });

      // 0. Ảnh Adam Smith mặc định bao phủ toàn bộ vùng PhilosophySection
      // Không cần clip-path ẩn đi nữa, vì nó sẽ tự trượt đè lên Hero
      gsap.set(heroImageRef.current, { 
        clipPath: 'none',
        scale: 1,
        filter: 'brightness(1) blur(0px)'
      });

      // 1. Thu nhỏ ảnh Absolute Hero vào đúng vị trí tương đối của Grid Slot
      tl.to(heroImageRef.current, {
        top: targetTop,
        left: targetLeft,
        width: slotRect.width,
        height: slotRect.height,
        borderRadius: '1rem',
        duration: 1,
        ease: "power2.inOut"
      });

      // 3. Chuyển đổi mượt mà
      tl.to(heroImageRef.current, { opacity: 0, duration: 0.1 }, "-=0.1");
      tl.to(adamCardRealRef.current, { opacity: 1, duration: 0.1 }, "<");

      // 4. Hiện Tiêu đề
      tl.fromTo('.philosophy-title', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.5"
      );

      // 5. Hiện 3 Triết gia còn lại
      tl.fromTo('.philosophy-card',
        { opacity: 0, y: 100, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)" },
        "-=0.2"
      );
    };

    // Chạy ngay lập tức, vì aspect-[3/4] đã định hình kích thước sẵn
    updateAnimation();

    const handleResize = () => {
      // Re-calculate the animation on window resize to ensure correct slot targeting
      updateAnimation();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full bg-transparent z-20">
      <div className="h-[300vh]">
        <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6 pt-16 bg-transparent">
          
          {/* Ảnh được đưa vào bên trong sticky container, dùng absolute thay vì fixed */}
          <img 
            ref={heroImageRef}
            src="/images/adam_smith_2.jpg" 
            alt="Adam Smith"
            className="absolute top-0 left-0 w-full h-full object-cover object-[center_top] z-50 pointer-events-none"
          />

          <div className="relative z-30 w-full max-w-7xl mx-auto flex flex-col items-center">
            
            <div className="philosophy-title text-center mb-12 opacity-0">
              <TitleReveal>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 flex flex-wrap justify-center gap-x-3">
                  <span className="word-animate">Nền</span>
                  <span className="word-animate">Tảng</span>
                  <span className="word-animate text-orange-500">Lý Luận</span>
                </h2>
              </TitleReveal>
              <p className="text-stone-300 max-w-2xl mx-auto text-lg">
                Nền kinh tế số không chỉ là công nghệ, nó là sự tiến hóa của các học thuyết triết học và kinh tế học kinh điển.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {/* Slot 1: Dành cho Adam Smith */}
              <div ref={adamCardSlotRef} className="w-full aspect-[3/4]">
                <div ref={adamCardRealRef} className="opacity-0 w-full h-full">
                  <TiltCard
                    name="Adam Smith"
                    role="Bàn Tay Vô Hình"
                    quote="Trong kinh tế số, thuật toán chính là bàn tay vô hình mới, tự động điều tiết và định hình thị trường."
                    imageSrc="/images/adam_smith_2.jpg"
                  />
                </div>
              </div>

              {/* Slot 2, 3, 4: Các triết gia khác */}
              {philosophers.map((phil) => (
                <div key={phil.id} className="philosophy-card opacity-0">
                  <TiltCard
                    name={phil.name}
                    role={phil.role}
                    quote={phil.quote}
                    imageSrc={phil.imageSrc}
                  />
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
