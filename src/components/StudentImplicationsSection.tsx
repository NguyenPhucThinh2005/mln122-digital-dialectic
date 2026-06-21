import React, { useState, useRef, useEffect } from 'react';
import { TitleReveal } from './TitleReveal';

const data = [
  {
    id: "opportunity",
    title: 'Cơ Hội Vàng',
    description: 'Kinh tế số mở ra các mô hình kinh doanh không cần vốn lớn (Affiliate, Dropshipping). Đồng thời, những ai sở hữu kỹ năng công nghệ (IT, tối ưu hệ thống) sẽ nắm giữ quyền lực khi trực tiếp xây dựng và vận hành các nền tảng.',
    image: '/images/opportunity.jpg',
  },
  {
    id: "risk",
    title: 'Rủi Ro Kép',
    description: 'Nguy cơ lệ thuộc hoàn toàn vào "Quyền lực thuật toán". Nếu không hiểu luật chơi, bạn sẽ dễ dàng bị đào thải hoặc trở thành "lao động số" bị vắt kiệt sức (áp lực chạy đơn của shipper hay thuật toán trừ lương).',
    image: '/images/risk.jpg',
  },
  {
    id: "skills",
    title: 'Năng Lực Cốt Lõi',
    description: 'Trang bị Tư duy phản biện để không trở thành nạn nhân của Ma trận thao túng. Nắm vững khả năng thích ứng công nghệ và liên tục cập nhật các quy luật thị trường số để tồn tại.',
    image: '/images/skills.jpg',
  }
];

export const StudentImplicationsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      
      // Calculate current slide based on scroll position
      const slideWidth = scrollRef.current.children[0]?.clientWidth || 1;
      const index = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.children[0]?.clientWidth || 0;
      scrollRef.current.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 bg-black text-stone-100 z-20 relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Tiêu đề & Nút bấm (Top Section) */}
        <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <TitleReveal>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold flex gap-x-3">
                <span className="word-animate inline-block text-white">Lời Giải</span>
                <span className="word-animate inline-block text-orange-500">Thực Tiễn</span>
              </h2>
            </TitleReveal>
            <p className="text-stone-400 text-lg">
              Nền kinh tế số tàn nhẫn nhưng đầy tiềm năng. Là thế hệ sinh viên tiếp nối, chúng ta phải làm gì để không trở thành nạn nhân của vòng lặp này?
            </p>
          </div>
          
        </div>

        {/* Carousel Content */}
        <div className="w-full relative">
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {data.map((item) => (
              <div 
                key={item.id}
                className="shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] snap-center snap-always group rounded-2xl cursor-pointer"
              >
                <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay Gradient (Tối dần từ dưới lên) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Text Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-8 md:p-10 text-white transform transition-transform duration-500">
                    <h3 className="mb-4 text-3xl font-bold text-white drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="mb-0 text-stone-300 leading-relaxed drop-shadow-sm text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Dots Pagination */}
          <div className="mt-4 flex justify-center gap-3 md:hidden">
            {data.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-8 bg-orange-500" : "w-2.5 bg-white/20"
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
