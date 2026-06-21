import React from 'react';
import { Hero } from '../components/Hero';
import { Section1 } from '../components/Section1';
import { Section2 } from '../components/Section2';
import { Section3 } from '../components/Section3';
import { Section4 } from '../components/Section4';
import { SimulacraSection } from '../components/SimulacraSection';
import { DialecticLoopSection } from '../components/DialecticLoopSection';
import { PhilosophySection } from '../components/PhilosophySection';
import { DarkPatternsSection } from '../components/DarkPatternsSection';
import { StudentImplicationsSection } from '../components/StudentImplicationsSection';

export const Home: React.FC = () => {
  return (
    <div className="relative z-10 w-full">
      <Hero />
      <PhilosophySection />
      <Section1 />
      <Section2 />
      <Section3 />
      <SimulacraSection />
      <DialecticLoopSection />
      <DarkPatternsSection />
      <StudentImplicationsSection />
      <Section4 />
    </div>
  );
};
