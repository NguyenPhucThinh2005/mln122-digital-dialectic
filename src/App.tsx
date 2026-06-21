import { SmoothScroll } from './components/SmoothScroll';
import { Hero } from './components/Hero';
import { Section1 } from './components/Section1';
import { Section2 } from './components/Section2';
import { Section3 } from './components/Section3';
import { Section4 } from './components/Section4';
import { NeuralBackground } from './components/NeuralBackground';
import { PhilosophySection } from './components/PhilosophySection';

import { useBackground } from './contexts/BackgroundContext';

function App() {
  const { color, speed, particleCount } = useBackground();

  return (
    <SmoothScroll>
      <div className="relative bg-black text-stone-100 min-h-screen font-sans selection:bg-orange-500/30">
        
        {/* Background Neural Toàn Cục */}
        <div className="fixed inset-0 z-0 pointer-events-auto">
          <NeuralBackground color={color} particleCount={particleCount} speed={speed} trailOpacity={0.1} />
        </div>

        {/* Nội dung trang web */}
        <div className="relative z-10">
          <Hero />
          <PhilosophySection />
          <Section1 />
          <Section2 />
          <Section3 />
          <Section4 />
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;
