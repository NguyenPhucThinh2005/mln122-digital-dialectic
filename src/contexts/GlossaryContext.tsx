import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { glossaryData } from '../data/glossaryData';
import type { GlossaryItem } from '../data/glossaryData';

interface Position {
  x: number;
  y: number;
}

interface GlossaryContextType {
  activeWord: GlossaryItem | null;
  popupPosition: Position;
  openGlossary: (wordId: string, position: Position) => void;
  closeGlossary: () => void;
}

const GlossaryContext = createContext<GlossaryContextType>({
  activeWord: null,
  popupPosition: { x: 0, y: 0 },
  openGlossary: () => {},
  closeGlossary: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useGlossary = () => useContext(GlossaryContext);

export const GlossaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeWord, setActiveWord] = useState<GlossaryItem | null>(null);
  const [popupPosition, setPopupPosition] = useState<Position>({ x: 0, y: 0 });

  const openGlossary = (wordId: string, position: Position) => {
    const wordData = glossaryData[wordId];
    if (wordData) {
      setActiveWord(wordData);
      setPopupPosition(position);
    }
  };

  const closeGlossary = () => {
    setActiveWord(null);
  };

  return (
    <GlossaryContext.Provider value={{ activeWord, popupPosition, openGlossary, closeGlossary }}>
      {children}
    </GlossaryContext.Provider>
  );
};
