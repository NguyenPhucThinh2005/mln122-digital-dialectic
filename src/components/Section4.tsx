import React from 'react';
import { TitleReveal } from './TitleReveal';

export const Section4: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-transparent py-32 px-6 flex flex-col items-center justify-center relative overflow-hidden z-20">
      
      {/* Hiệu ứng hào quang tròn mềm ở trung tâm */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        
        {/* Tiêu đề cảm ơn động */}
        <TitleReveal className="mb-2">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tight text-white flex flex-wrap gap-x-4 justify-center">
            <span className="word-animate inline-block text-orange-500 font-serif italic">Thank</span>
            <span className="word-animate inline-block text-orange-500 font-serif italic">you!</span>
          </h2>
        </TitleReveal>

        {/* Thông điệp ý nghĩa */}
        <p className="text-xl md:text-2xl text-stone-300 max-w-2xl mx-auto leading-relaxed my-16 animate-[fadeIn_1.5s_ease-out_0.5s_both]">
          Chúc mọi người luôn giữ vững <strong className="text-orange-400 font-medium">Tư duy phản biện</strong> và tỉnh táo trước mọi thuật toán của nền kinh tế số.
        </p>
      </div>
      
      {/* Footer info */}
      <div className="mt-32 text-stone-400 text-sm font-light">
        Sản phẩm sáng tạo - Học phần MLN122
      </div>
    </section>
  );
};
