
import React, { useState } from 'react';
import Card from './common/Card';
// Fix: The 'View' type should be imported from '../types' instead of '../App'.
import type { View } from '../types';

interface HomeProps {
  setActiveView: (view: View) => void;
}

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '😟', label: 'Worried' },
  { emoji: '😢', label: 'Sad' },
];

const Home: React.FC<HomeProps> = ({ setActiveView }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (label: string) => {
    setSelectedMood(label);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">Welcome, Student!</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Your space for mental well-being and support.</p>
      </div>

      <Card className="p-6 bg-white dark:bg-slate-800 shadow-lg">
        <h2 className="text-xl font-semibold text-center text-slate-700 dark:text-slate-200 mb-4">Daily Check-in</h2>
        {!selectedMood ? (
          <>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-6">How are you feeling today?</p>
            <div className="flex justify-center items-center space-x-2 sm:space-x-4">
              {moods.map(({ emoji, label }) => (
                <button
                  key={label}
                  onClick={() => handleMoodSelect(label)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <span className="text-4xl">{emoji}</span>
                  <span className="text-xs mt-2 text-slate-500 dark:text-slate-400">{label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">Thanks for checking in! You're feeling <span className="font-semibold text-blue-600">{selectedMood.toLowerCase()}</span> today.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Remember to be kind to yourself. Explore the resources below if you need support.</p>
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HomeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          title="AI Assistant"
          description="Chat with our supportive AI for immediate guidance and coping strategies."
          bgColor="bg-blue-500"
          onClick={() => setActiveView('chatbot')}
        />
        <HomeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" /></svg>}
          title="Book a Counselor"
          description="Confidentially schedule a session with a professional counselor."
          bgColor="bg-teal-500"
          onClick={() => setActiveView('booking')}
        />
        <HomeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" /></svg>}
          title="Resource Hub"
          description="Explore articles, videos, and relaxation audio to support your well-being."
          bgColor="bg-purple-500"
          onClick={() => setActiveView('resources')}
        />
      </div>
    </div>
  );
};

interface HomeCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgColor: string;
    onClick: () => void;
}

const HomeCard: React.FC<HomeCardProps> = ({ icon, title, description, bgColor, onClick }) => (
    <Card onClick={onClick} className="relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-full h-full ${bgColor} transition-all duration-300 transform group-hover:scale-150 opacity-20 group-hover:opacity-30`}></div>
        <div className="p-6 relative">
            <div className={`p-4 rounded-full inline-block ${bgColor}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mt-4 text-slate-800 dark:text-white">{title}</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-2">{description}</p>
        </div>
    </Card>
);

export default Home;