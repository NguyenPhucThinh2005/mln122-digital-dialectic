import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TitleReveal } from '../components/TitleReveal';
import { Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    question: 'Theo triết học Mác-Lênin, việc người tiêu dùng bị cuốn vào vòng xoáy "săn sale" vô tận, mất đi khả năng kiểm soát nhu cầu thực sự của bản thân thể hiện khái niệm nào?',
    options: ['Sự Tha Hóa', 'Tích lũy tư bản', 'Bàn tay vô hình', 'Lực lượng sản xuất'],
    correctIndex: 0
  },
  {
    id: 2,
    question: 'Thuật toán theo dõi mọi hành vi click, xem, mua hàng của nền tảng (như Shopee, TikTok) được ví như khái niệm nào trong xã hội học?',
    options: ['Tháp Nhu Cầu', 'Panopticon (Nhà tù toàn cảnh)', 'Khế ước xã hội', 'Thặng dư tuyệt đối'],
    correctIndex: 1
  },
  {
    id: 3,
    question: 'Khi bạn cố mua thêm một món đồ mình không cần chỉ để lấy mã Freeship 15k, bạn đang mắc phải bẫy tâm lý nào do nền tảng giăng ra?',
    options: ['Hiệu ứng bầy đàn', 'Hiệu ứng chim mồi', 'Bẫy chi phí chìm (Sunk Cost)', 'FOMO'],
    correctIndex: 2
  },
  {
    id: 4,
    question: 'Trong "Nền kinh tế sự chú ý" (Attention Economy), thứ gì bị các nền tảng biến thành "nguyên liệu thô" để bóc lột?',
    options: ['Tiền trong ví của bạn', 'Sự tập trung và thời gian của bạn', 'Hàng hóa tồn kho', 'Mã giảm giá'],
    correctIndex: 1
  },
  {
    id: 5,
    question: 'Việc nhà bán hàng phải liên tục giảm giá, cắn răng chịu lỗ để được thuật toán ưu tiên hiển thị phản ánh bản chất gì trong kinh tế chính trị?',
    options: ['Quy luật cung cầu', 'Cạnh tranh hoàn hảo', 'Sự bóc lột Giá trị thặng dư', 'Sự điều tiết của thị trường'],
    correctIndex: 2
  }
];

type GameState = 'START' | 'PLAYING' | 'RESULT';

export const Quiz: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  
  const screenRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = () => {
    setGameState('PLAYING');
    setCurrentQuestionIndex(0);
    setScore(0);
    resetTurn();
  };

  const resetTurn = () => {
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeOut = () => {
    setIsAnswerRevealed(true);
    triggerWrongAnimation();
    setTimeout(nextQuestion, 3000);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswerRevealed) return; // Prevent double clicking
    
    setSelectedOption(index);
    setIsAnswerRevealed(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = index === quizQuestions[currentQuestionIndex].correctIndex;
    
    if (isCorrect) {
      setScore(s => s + 1);
      triggerCorrectAnimation();
    } else {
      triggerWrongAnimation();
    }

    setTimeout(nextQuestion, 3000);
  };

  const triggerWrongAnimation = () => {
    if (!screenRef.current) return;
    
    // Screen shake & red flash
    gsap.timeline()
      .to(screenRef.current, { backgroundColor: 'rgba(220, 38, 38, 0.4)', duration: 0.1 })
      .to(screenRef.current, { x: -20, duration: 0.05 })
      .to(screenRef.current, { x: 20, duration: 0.05 })
      .to(screenRef.current, { x: -10, duration: 0.05 })
      .to(screenRef.current, { x: 10, duration: 0.05 })
      .to(screenRef.current, { x: 0, backgroundColor: 'transparent', duration: 0.5 });
  };

  const triggerCorrectAnimation = () => {
    if (!screenRef.current) return;
    // Green flash
    gsap.timeline()
      .to(screenRef.current, { backgroundColor: 'rgba(34, 197, 94, 0.4)', duration: 0.1 })
      .to(screenRef.current, { backgroundColor: 'transparent', duration: 0.8 });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetTurn();
    } else {
      setGameState('RESULT');
    }
  };

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div ref={screenRef} className="relative z-10 w-full min-h-screen flex items-center justify-center pt-24 px-6 pb-32 transition-colors duration-300">
      <div className="max-w-4xl w-full">
        
        {/* ==================== START SCREEN ==================== */}
        {gameState === 'START' && (
          <div className="text-center">
            <TitleReveal>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-orange-500 flex flex-wrap gap-x-3 justify-center drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">
                <span className="word-animate inline-block">Thử</span>
                <span className="word-animate inline-block text-white">Thách</span>
                <span className="word-animate inline-block text-white">Cuối</span>
                <span className="word-animate inline-block text-white">Giờ</span>
              </h2>
            </TitleReveal>
            <p className="text-stone-300 text-xl mb-12 max-w-2xl mx-auto">
              5 câu hỏi trắc nghiệm để xem ai là người tỉnh táo nhất thoát khỏi sự thao túng của thuật toán!
            </p>
            <button 
              onClick={startGame}
              className="px-12 py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-2xl rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.5)] active:scale-95"
            >
              BẮT ĐẦU NGAY
            </button>
          </div>
        )}

        {/* ==================== PLAYING SCREEN ==================== */}
        {gameState === 'PLAYING' && (
          <div className="w-full bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-stone-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Header info */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <span className="text-stone-400 font-mono text-lg tracking-widest">
                CÂU {currentQuestionIndex + 1}/{quizQuestions.length}
              </span>
              <div className={`flex items-center gap-2 text-2xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                <Clock className={timeLeft <= 5 ? 'text-red-500' : 'text-orange-500'} />
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
            </div>

            {/* Progress bar timer */}
            <div className="absolute top-0 left-0 w-full h-1 bg-stone-800">
              <div 
                className={`h-full transition-all duration-1000 linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-orange-500'}`}
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              ></div>
            </div>

            {/* Question */}
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-relaxed">
              {quizQuestions[currentQuestionIndex].question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizQuestions[currentQuestionIndex].options.map((option, index) => {
                const isCorrectOption = index === quizQuestions[currentQuestionIndex].correctIndex;
                const isSelected = selectedOption === index;
                
                let btnClass = "bg-stone-800/50 hover:bg-stone-700 border-stone-600 text-stone-200";
                
                if (isAnswerRevealed) {
                  if (isCorrectOption) {
                    btnClass = "bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"; // Right answer glows green
                  } else if (isSelected && !isCorrectOption) {
                    btnClass = "bg-red-600 border-red-500 text-white opacity-80"; // Wrong answer turns red
                  } else {
                    btnClass = "bg-stone-900 border-stone-800 text-stone-600 opacity-50"; // Others fade out
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswerRevealed}
                    className={`relative w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 ${btnClass} flex justify-between items-center`}
                  >
                    <span className="text-lg md:text-xl font-medium">{option}</span>
                    {isAnswerRevealed && isCorrectOption && <CheckCircle2 className="text-white" />}
                    {isAnswerRevealed && isSelected && !isCorrectOption && <XCircle className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== RESULT SCREEN ==================== */}
        {gameState === 'RESULT' && (
          <div className="text-center w-full bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-stone-800 p-12 shadow-[0_0_50px_rgba(249,115,22,0.2)]">
            <Trophy className="w-24 h-24 text-orange-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Hoàn Thành Thử Thách!</h2>
            
            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600 my-8">
              {score}/{quizQuestions.length}
            </div>

            <p className="text-2xl text-stone-300 mb-12">
              {score === quizQuestions.length ? "Tuyệt vời! Bạn đã thoát khỏi Ma trận thao túng." : 
               score >= 3 ? "Khá lắm! Bạn đã bắt đầu nhận thức được hệ thống." : 
               "Cẩn thận nhé, bạn vẫn đang là con cừu ngoan ngoãn của thuật toán đấy!"}
            </p>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-white hover:bg-stone-200 text-black font-bold text-lg rounded-xl transition-all hover:scale-105"
            >
              CHƠI LẠI
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
