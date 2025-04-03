
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent mt-auto dark:text-warning-25">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className={`col-span-1 md:text-right`}>
            <h3 className="text-lg font-bold mb-4 dark:text-warning-25">Store name</h3>
            <p className="text-sm text-muted-foreground dark:text-warning-25">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at est orci.
            </p>
          </div>

          <div className={`col-span-1 md:text-right `}>
            <h3 className="text-lg font-bold mb-4 dark:text-warning-25">About us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                
                </Link>
              </li>
            </ul>
          </div>

          <div className={`col-span-1 md:text-right`}>
            <h3 className="text-lg font-bold mb-4 dark:text-warning-25"></h3>
            <address className="not-italic dark:text-warning-25">
              <p className="text-sm text-muted-foreground">123 Street Name</p>
              <p className="text-sm text-muted-foreground">City, Country</p>
              <p className="text-sm text-muted-foreground">contact@shopease.com</p>
            </address>
          </div>

          <div className={`col-span-1 md:text-right`}>
            <h3 className="text-lg font-bold mb-4"></h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;