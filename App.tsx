import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Chatbot from './components/Chatbot';
import Resources from './components/Resources';
import Booking from './components/Booking';
import Forum from './components/Forum';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import type { View, UserRole } from './types';

type AuthView = 'login' | 'signup' | 'app';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [authView, setAuthView] = useState<AuthView>('login');

  const handleLogin = (role: 'user' | 'admin') => {
    setUserRole(role);
    setAuthView('app');
    if (role === 'admin') {
      setActiveView('dashboard');
    } else {
      setActiveView('home');
    }
  };
  
  const handleSignup = () => {
    // On signup, automatically log in as a student user.
    setUserRole('user');
    setAuthView('app');
    setActiveView('home');
  };

  const handleLogout = () => {
    setUserRole('guest');
    setAuthView('login');
    setActiveView('home'); // Reset view on logout
  };

  const renderUserContent = () => {
    switch (activeView) {
      case 'home':
        return <Home setActiveView={setActiveView} />;
      case 'chatbot':
        return <Chatbot />;
      case 'resources':
        return <Resources />;
      case 'booking':
        return <Booking />;
      case 'forum':
        return <Forum />;
      // User cannot access dashboard
      default:
        return <Home setActiveView={setActiveView} />;
    }
  };

  if (authView === 'login') {
    return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setAuthView('signup')} />;
  }

  if (authView === 'signup') {
    return <SignupPage onSignup={handleSignup} onNavigateToLogin={() => setAuthView('login')} />;
  }


  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        userRole={userRole}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {userRole === 'admin' ? <Dashboard /> : renderUserContent()}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm border-t border-slate-200">
        © 2024 MindWell Connect. Your well-being is our priority.
      </footer>
    </div>
  );
};

export default App;
