import { useState, useEffect } from 'react';
import { Hero } from './Sections/Hero';
import Features from './Sections/Features';
import { Pricing } from './Sections/Pricing';
import { AuthModal } from '../../modules/auth/components/AuthModal';
import Navbar from '../../shared/components/navigation/NavBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../states/store';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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

