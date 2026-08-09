import React, { useState } from 'react';
import type { View, UserRole } from '../types';
import ThemeToggle from './common/ThemeToggle';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const NavLink: React.FC<{
  label: string;
  view: View;
  activeView: View;
  onClick: (view: View) => void;
}> = ({ label, view, activeView, onClick }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-slate-800 text-white'
          : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
      }`}
    >
      {label}
    </button>
  );
};

const userNavLinks: { label: string; view: View }[] = [
  { label: 'Home', view: 'home' },
  { label: 'AI Assistant', view: 'chatbot' },
  { label: 'Resources', view: 'resources' },
  { label: 'Booking', view: 'booking' },
  { label: 'Forum', view: 'forum' },
];

const adminNavLinks: { label: string; view: View }[] = [
  { label: 'Admin Dashboard', view: 'dashboard' },
];

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, userRole, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = userRole === 'admin' ? adminNavLinks : userNavLinks;

  const handleLogoClick = () => {
    if (userRole === 'user') {
      setActiveView('home');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (view: View) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M15.5 12.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3.5 4c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
             <span className="font-bold text-xl text-slate-800 dark:text-slate-100">MindWell Connect</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav>
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map(({ label, view }) => (
                  <NavLink key={view} label={label} view={view} activeView={activeView} onClick={setActiveView} />
                ))}
              </div>
            </nav>
            <ThemeToggle className="ml-4" />
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-slate-600 bg-slate-100 hover:bg-red-100 hover:text-red-700 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-red-900/40 dark:hover:text-red-400"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 shadow-lg animate-fade-in-up">
          <div className="flex flex-col space-y-1">
            {navLinks.map(({ label, view }) => {
              const isActive = activeView === view;
              return (
                <button
                  key={view}
                  onClick={() => handleNavClick(view)}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
