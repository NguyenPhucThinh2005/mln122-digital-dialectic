import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import gsap from 'gsap';
import { TitleReveal } from '../components/TitleReveal';

const NAMESPACE = import.meta.env.VITE_POLL_NAMESPACE || 'mln122_shopee_poll_default';

const pollOptions = [
  { id: 'A', text: 'Nửa đêm (Săn sale)', color: 'bg-red-500', apiColor: 'rgb(239 68 68)' },
  { id: 'B', text: 'Đang trong giờ học/làm', color: 'bg-blue-500', apiColor: 'rgb(59 130 246)' },
  { id: 'C', text: 'Chỉ khi có mã giảm giá', color: 'bg-orange-500', apiColor: 'rgb(249 115 22)' },
  { id: 'D', text: 'Buồn chán không có việc gì làm', color: 'bg-purple-500', apiColor: 'rgb(168 85 247)' },
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) return;
    setStatus('submitting');
    
    try {
      // Gửi request API tăng count cho từng option được chọn
      const promises = selectedOptions.map(id => 
        fetch(`https://countapi.mileshilliard.com/api/v1/hit/${NAMESPACE}_option_${id}`)
      );
      await Promise.all(promises);
      setStatus('success');
    } catch (error) {
      console.error("Lỗi khi gửi bình chọn:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="relative z-20 min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
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
    <div className="relative z-20 min-h-screen bg-black text-white flex flex-col items-center pt-12 px-6 pb-32">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center leading-relaxed">
          Khảo sát Thói quen Tiêu dùng
        </h2>
        <p className="text-stone-400 text-center mb-8">Bạn có thể chọn nhiều đáp án.</p>
        
        <div className="space-y-4">
          {pollOptions.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 active:scale-95 ${
                  isSelected ? 'border-orange-500 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-white/10 bg-stone-900/50 hover:bg-stone-800'
                }`}
              >
                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-orange-500 border-orange-500' : 'border-stone-500'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${option.color}`}>
                  {option.id}
                </div>
                <span className="text-lg font-medium">{option.text}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0 || status === 'submitting'}
          className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition-all ${
            selectedOptions.length > 0 
              ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          {status === 'submitting' ? 'Đang gửi...' : 'Gửi Bình Chọn'}
        </button>
      </div>
    </div>
  );
};

const PresenterScreen: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const countsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [voteLink, setVoteLink] = useState('');

  useEffect(() => {
    // Đảm bảo tạo QR code đúng theo domain hiện tại đang deploy
    setVoteLink(`${window.location.origin}/poll?mode=vote`);
    return () => stopPolling();
  }, []);

  const fetchVotes = async () => {
    try {
      const results: Record<string, number> = {};
      const promises = pollOptions.map(async (opt) => {
        const res = await fetch(`https://countapi.mileshilliard.com/api/v1/get/${NAMESPACE}_option_${opt.id}?t=${Date.now()}`);
        const data = await res.json();
        results[opt.id] = data.value || 0;
      });
      await Promise.all(promises);
      setVotes(results);
    } catch (e) {
      console.error("Lỗi khi lấy dữ liệu bình chọn:", e);
      setVotes({ error: 1, message: String(e) } as any);
    }
  };

  // Cập nhật hiệu ứng Bar chart mỗi khi votes thay đổi
  useEffect(() => {
    if (Object.keys(votes).length === 0) return;
    
    // Tìm max vote để tính phần trăm thanh tiến độ (Bar chart)
    const maxVotes = Math.max(...Object.values(votes), 10); // Căn chuẩn thấp nhất là 10 để thanh không bị quá dài nếu vote ít
    
    pollOptions.forEach((opt, index) => {
      const currentVote = votes[opt.id] || 0;
      const targetPercent = (currentVote / maxVotes) * 100;
      
      const bar = barsRef.current[index];
      const countEl = countsRef.current[index];
      
      if (bar) {
        gsap.to(bar, {
          width: `${targetPercent}%`,
          duration: 1,
          ease: "power2.out"
        });
      }
      
      if (countEl) {
        // Animate counter text
        gsap.to(countEl, {
          innerHTML: currentVote,
          duration: 1,
          snap: { innerHTML: 1 },
          ease: "power1.inOut"
        });
      }
    });
  }, [votes]);

  const handleStart = () => {
    setIsStarted(true);
    fetchVotes(); // Fetch ngay lần đầu
    
    // Bắt đầu polling mỗi 2 giây
    intervalRef.current = setInterval(() => {
      fetchVotes();
    }, 2000);
  };

  const handleStop = () => {
    stopPolling();
    setIsFinished(true);
  };

  const stopPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
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
          
          {/* Left Panel: QR Code & Controls */}
          <div className="w-full md:w-1/3 bg-stone-900/50 backdrop-blur-md rounded-3xl border border-stone-800 p-8 flex flex-col items-center text-center shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Quét để tham gia</h3>
            <div className="bg-white p-4 rounded-2xl mb-4 border-4 border-orange-500/20">
              {voteLink && (
                <QRCodeSVG value={voteLink} size={200} bgColor={"#ffffff"} fgColor={"#000000"} />
              )}
            </div>
            <p className="text-stone-400 font-mono text-sm break-all mb-8">
              {voteLink}
            </p>
            
            {!isStarted ? (
              <button 
                onClick={handleStart}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] active:scale-95"
              >
                Bắt Đầu Khảo Sát
              </button>
            ) : !isFinished ? (
              <div className="w-full flex flex-col gap-4">
                <div className="py-3 bg-green-600/20 text-green-500 font-bold rounded-xl border border-green-500/30 flex justify-center items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Đang nhận kết quả Live...
                </div>
                <button 
                  onClick={handleStop}
                  className="w-full py-3 bg-stone-800 hover:bg-red-600 hover:text-white text-stone-400 font-bold rounded-xl transition-colors border border-stone-700"
                >
                  Kết Thúc Bình Chọn
                </button>
              </div>
            ) : (
              <div className="w-full py-4 bg-stone-800 text-stone-400 font-bold rounded-xl border border-stone-700">
                Đã Khóa Bình Chọn
              </div>
            )}
          </div>

          {/* Right Panel: Live Chart */}
          <div className="w-full md:w-2/3 bg-stone-900/50 backdrop-blur-md rounded-3xl border border-stone-800 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 leading-relaxed text-white">
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
                  <div className="w-full h-8 bg-black rounded-lg overflow-hidden border border-white/10 shadow-inner">
                    <div 
                      ref={el => { barsRef.current[index] = el; }}
                      className={`h-full w-0 ${option.color} relative overflow-hidden`}
                    >
                      {/* Highlight sweep effect */}
                      {isStarted && !isFinished && (
                        <div className="absolute inset-0 w-[200%] translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Lời dẫn xuất hiện sau khi Start */}
            <div className={`mt-10 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 transition-all duration-1000 ${isFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
              <h4 className="text-orange-400 font-bold mb-2 uppercase text-sm tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Góc Nhìn Triết Học
              </h4>
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
