// App.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './states/store';
import AppRoutes from './routes';

const App: React.FC = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className='dark:bg-black'>
      <AppRoutes />
    </div>
    
  )
  
};

export default App;
