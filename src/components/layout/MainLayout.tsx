
import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-inventory-primary py-6">
        <div className="container mx-auto px-4">
          <p className="text-white text-center">© {new Date().getFullYear()} Logicall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
