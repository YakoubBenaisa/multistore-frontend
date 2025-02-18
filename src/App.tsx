import { useState, useEffect } from 'react';
import { useDarkModeStore } from './store/darkModeStore';
import { Hero } from './components/Hero';
import Features from './components/Features';
import { Pricing } from './components/Pricing';
import { AuthModal } from './components/AuthModal';
import Navbar from './components/NavBar';

function App() {
  const { darkMode, toggleDarkMode } = useDarkModeStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      
      <Navbar onSignInClick={() => setIsAuthModalOpen(true)} />      
        <main>
        <Hero />
        <Features />
        <Pricing />
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;