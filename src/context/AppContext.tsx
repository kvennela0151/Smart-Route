import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext: React.FC<AppContextProps> = ({ children }) => {
  const { simulateWeatherChange } = useAppStore();
  const [weatherChangeTimer, setWeatherChangeTimer] = useState<NodeJS.Timeout | null>(null);

  // Set up a timer to simulate weather changes
  useEffect(() => {
    // Simulate a weather change after a random interval (between 20-40 seconds)
    const timeout = setTimeout(() => {
      simulateWeatherChange();
    }, 20000 + Math.random() * 20000);
    
    setWeatherChangeTimer(timeout);
    
    return () => {
      if (weatherChangeTimer) {
        clearTimeout(weatherChangeTimer);
      }
    };
  }, [simulateWeatherChange]);

  return <>{children}</>;
};

export const AppProvider: React.FC<AppContextProps> = ({ children }) => {
  return (
    <AppContext>
      {children}
    </AppContext>
  );
};