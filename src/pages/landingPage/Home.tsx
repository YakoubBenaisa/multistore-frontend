import { useState, useEffect } from 'react';
import { Hero } from './Sections/Hero';
import Features from './Sections/Features';
import { Pricing } from './Sections/Pricing';
import { AuthModal } from '../../modules/auth/components/AuthModal';
import Navbar from '../../components/navigation/NavBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../states/store';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  

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

