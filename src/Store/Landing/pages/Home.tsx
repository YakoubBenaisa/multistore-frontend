import { Hero } from '../components/Sections/Hero';
import Features from '../components/Sections/Features';
import { Pricing } from '../components/Sections/Pricing';
import Navbar from '../components/navigation/NavBar';
import { redirect } from 'react-router-dom';

export default function Home() {
  

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      
      <Navbar  onSignInClick={()=>{}}/>      
        <main>
        <Hero />
        <Features />
        <Pricing />
      </main>

     
    </div>
  );
}

