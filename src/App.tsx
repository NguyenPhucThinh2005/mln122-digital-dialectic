import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SmoothScroll } from './components/SmoothScroll';
import { NeuralBackground } from './components/NeuralBackground';
import { FloatingNavbar } from './components/FloatingNavbar';

import { Home } from './pages/Home';
import { LivePoll } from './pages/LivePoll';
import { Quiz } from './pages/Quiz';

import { useBackground } from './contexts/BackgroundContext';
import { GlossaryProvider } from './contexts/GlossaryContext';
import { GlossaryPopup } from './components/GlossaryPopup';

function App() {
  const { color, speed, particleCount } = useBackground();

  return (
    <Router>
      <SmoothScroll>
        <GlossaryProvider>
          <div className="relative bg-black text-stone-100 min-h-screen font-sans selection:bg-orange-500/30">
            
            {/* Background Neural Toàn Cục */}
            <div className="fixed inset-0 z-0 pointer-events-auto">
              <NeuralBackground color={color} particleCount={particleCount} speed={speed} trailOpacity={0.1} />
            </div>

            {/* Nội dung các trang */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/poll" element={<LivePoll />} />
              <Route path="/quiz" element={<Quiz />} />
            </Routes>

            {/* Thanh điều hướng */}
            <FloatingNavbar />

            {/* Từ điển toàn cục */}
            <GlossaryPopup />
          </div>
        </GlossaryProvider>
      </SmoothScroll>
    </Router>
  );
}

export default App;
