import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import gsap from 'gsap';
import { TitleReveal } from '../components/TitleReveal';

const pollOptions = [
  { id: 'A', text: 'Nửa đêm (Săn sale)', color: 'bg-red-500' },
  { id: 'B', text: 'Đang trong giờ học/làm', color: 'bg-blue-500' },
  { id: 'C', text: 'Chỉ khi có mã giảm giá', color: 'bg-orange-500' },
  { id: 'D', text: 'Buồn chán không có việc gì làm', color: 'bg-purple-500' },
];

export const LivePoll: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  if (mode === 'vote') {
    return <VoterScreen />;
  }

  return <PresenterScreen />;
};

const VoterScreen: React.FC = () => {
  const [voted, setVoted] = useState(false);

  if (voted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Ghi nhận thành công!</h2>
        <p className="text-stone-400">Hãy nhìn lên màn hình lớn để xem kết quả trực tiếp.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-12 px-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-8 text-center leading-relaxed">
          Bạn thường lướt Shopee/TikTok để mua đồ vào thời điểm nào nhất?
        </h2>
        <div className="space-y-4">
          {pollOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setVoted(true)}
              className="w-full p-4 rounded-xl border border-white/10 bg-stone-900/50 hover:bg-stone-800 transition-colors text-left flex items-center gap-4 active:scale-95"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${option.color}`}>
                {option.id}
              </div>
              <span className="text-lg font-medium">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PresenterScreen: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const countsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [voteLink, setVoteLink] = useState('');

  useEffect(() => {
    // Dynamically set the link based on current origin
    setVoteLink(`${window.location.origin}/poll?mode=vote`);
  }, []);

  const handleStart = () => {
    setIsStarted(true);

    // Mocking the live vote accumulation using GSAP
    // We will animate the width of the bars and the inner text numbers over 15 seconds
    const targetPercentages = [35, 15, 20, 30]; // Must sum to 100 roughly, or just representing visual length
    
    barsRef.current.forEach((bar, index) => {
      if (!bar) return;
      
      const targetPercent = targetPercentages[index];
      const targetVotes = Math.floor(targetPercent * 1.5); // Random total votes representation

      // Animate width
      gsap.to(bar, {
        width: `${targetPercent}%`,
        duration: 15, // 15 seconds of voting simulation
        ease: "power2.out",
        onUpdate: function() {
          // Update the number inside
          const currentProgress = this.progress();
          if (countsRef.current[index]) {
            countsRef.current[index]!.innerText = Math.floor(currentProgress * targetVotes).toString();
          }
        }
      });
    });
  };

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-24 px-6 pb-32">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <TitleReveal>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-orange-500 flex flex-wrap gap-x-3 justify-center">
              <span className="word-animate inline-block">Khảo Sát:</span>
              <span className="word-animate inline-block text-white">Thói Quen Tiêu Dùng</span>
            </h2>
          </TitleReveal>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Panel: QR Code */}
          <div className="w-full md:w-1/3 bg-stone-900/50 backdrop-blur-md rounded-3xl border border-stone-800 p-8 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4">Quét để tham gia</h3>
            <div className="bg-white p-4 rounded-2xl mb-4">
              {voteLink && (
                <QRCodeSVG value={voteLink} size={200} bgColor={"#ffffff"} fgColor={"#000000"} />
              )}
            </div>
            <p className="text-stone-400 font-mono text-sm break-all">
              {voteLink}
            </p>
            
            {!isStarted ? (
              <button 
                onClick={handleStart}
                className="mt-8 w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
              >
                Bắt Đầu Bình Chọn
              </button>
            ) : (
              <div className="mt-8 w-full py-4 bg-green-600/20 text-green-500 font-bold rounded-xl border border-green-500/30 flex justify-center items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Đang nhận phản hồi...
              </div>
            )}
          </div>

          {/* Right Panel: Live Chart */}
          <div className="w-full md:w-2/3 bg-stone-900/50 backdrop-blur-md rounded-3xl border border-stone-800 p-8">
            <h3 className="text-2xl font-bold mb-8 leading-relaxed">
              Bạn thường lướt Shopee/TikTok để mua đồ vào thời điểm nào nhất?
            </h3>
            
            <div className="space-y-6">
              {pollOptions.map((option, index) => (
                <div key={option.id} className="relative">
                  <div className="flex justify-between text-sm mb-2 text-stone-300">
                    <span className="font-bold">{option.id}. {option.text}</span>
                    <span className="font-mono font-bold">
                      <span ref={el => { countsRef.current[index] = el; }}>0</span> votes
                    </span>
                  </div>
                  <div className="w-full h-8 bg-black rounded-lg overflow-hidden border border-white/5">
                    <div 
                      ref={el => { barsRef.current[index] = el; }}
                      className={`h-full w-0 ${option.color} transition-colors relative overflow-hidden`}
                    >
                      {/* Highlight sweep effect */}
                      <div className="absolute inset-0 w-[200%] translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Lời dẫn xuất hiện sau khi Start */}
            <div className={`mt-10 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 transition-all duration-1000 ${isStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
              <h4 className="text-orange-400 font-bold mb-2 uppercase text-sm tracking-wider">Góc Nhìn Triết Học</h4>
              <p className="text-stone-300 text-sm leading-relaxed italic">
                "Hầu hết chúng ta chọn mua sắm vào thời điểm mệt mỏi hoặc bị kích thích bởi mã giảm giá. Đây không phải sự lựa chọn tự do, mà là hệ quả của <strong className="text-orange-400">Nền kinh tế sự chú ý (Attention Economy)</strong> và <strong className="text-orange-400">Sự Tha Hóa</strong>. Thuật toán đã thành công trong việc tạo ra nhu cầu giả lập để bòn rút thời gian và tiền bạc của chúng ta."
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
