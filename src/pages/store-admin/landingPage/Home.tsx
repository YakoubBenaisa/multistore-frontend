import { Hero } from '../../../sections/store-admin/Hero';
import Features from '../../../sections/store-admin/Features';
import { Pricing } from '../../../sections/store-admin/Pricing';
import Navbar from '../../../shared/navigation/NavBar';

export default function Home() {
  

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      
      <Navbar />      
        <main>
        <Hero />
        <Features />
        <Pricing />
      </main>

     
    </div>
  );
}

