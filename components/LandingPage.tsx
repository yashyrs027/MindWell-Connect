import React from 'react';
import Card from './common/Card';

interface LandingPageProps {
  onLogin: (role: 'user' | 'admin') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-slate-50 to-purple-100 p-4">
      <Card className="max-w-md w-full text-center p-8 lg:p-12 shadow-2xl animate-fade-in-up">
        <div className="flex justify-center items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M15.5 12.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3.5 4c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
            <h1 className="text-3xl font-bold text-slate-800">MindWell Connect</h1>
        </div>
        <p className="text-slate-600 mb-8">Your space for mental well-being and support.</p>
        
        <div className="space-y-4">
          <button
            onClick={() => onLogin('user')}
            className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            I'm a Student
          </button>
          <button
            onClick={() => onLogin('admin')}
            className="w-full bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            I'm an Administrator
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LandingPage;
