import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BackgroundState {
  color: string;
  speed: number;
  particleCount: number;
}

interface BackgroundContextType extends BackgroundState {
  setBackgroundState: (state: Partial<BackgroundState>) => void;
}

const defaultState: BackgroundState = {
  color: '#f97316', // Orange
  speed: 0.8,
  particleCount: 600,
};

const BackgroundContext = createContext<BackgroundContextType>({
  ...defaultState,
  setBackgroundState: () => {},
});

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BackgroundState>(defaultState);

  const setBackgroundState = React.useCallback((newState: Partial<BackgroundState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  return (
    <BackgroundContext.Provider value={{ ...state, setBackgroundState }}>
      {children}
    </BackgroundContext.Provider>
  );
};
