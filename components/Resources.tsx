
import React, { useState } from 'react';
import Card from './common/Card';

type ResourceCategory = 'articles' | 'videos' | 'audio';

const resourcesData = {
  articles: [
    { title: "Understanding Exam Anxiety", desc: "Tips to stay calm and focused during exam season.", img: "https://picsum.photos/400/200?random=1" },
    { title: "The Imposter Syndrome", desc: "How to overcome feelings of not being good enough.", img: "https://picsum.photos/400/200?random=2" },
    { title: "Building Healthy Friendships", desc: "Navigating social life at college.", img: "https://picsum.photos/400/200?random=3" },
    { title: "Digital Detox Guide", desc: "Finding balance in a connected world.", img: "https://picsum.photos/400/200?random=4" }
  ],
  videos: [
    { title: "5-Minute Guided Meditation", desc: "A short video to help you recenter yourself.", img: "https://picsum.photos/400/200?random=5" },
    { title: "Expert Talk: Coping with Burnout", desc: "Dr. Anjali Kumar discusses student burnout.", img: "https://picsum.photos/400/200?random=6" },
    { title: "Yoga for Stress Relief", desc: "A beginner-friendly yoga session.", img: "https://picsum.photos/400/200?random=7" }
  ],
  audio: [
    { title: "Calming Ocean Waves", desc: "30 minutes of soothing ocean sounds for relaxation or sleep.", icon: '🌊' },
    { title: "Forest Ambience", desc: "Listen to the gentle sounds of a forest.", icon: '🌳' },
    { title: "Mindful Breathing Exercise", desc: "A 10-minute guided breathing session.", icon: '🧘' }
  ]
};

const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceCategory>('articles');

  const renderContent = () => {
    switch (activeTab) {
      case 'articles':
        return resourcesData.articles.map((item, index) => (
          <Card key={index} className="group">
            <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
            </div>
          </Card>
        ));
      case 'videos':
        return resourcesData.videos.map((item, index) => (
          <Card key={index} className="group relative">
            <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
            </div>
          </Card>
        ));
      case 'audio':
        return resourcesData.audio.map((item, index) => (
          <Card key={index} className="flex items-center p-4">
            <div className="text-4xl mr-4">{item.icon}</div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
            </div>
            <button className="ml-auto bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            </button>
          </Card>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Resource Hub</h1>
        <p className="mt-2 text-slate-600">Knowledge and tools to empower your mental health journey.</p>
      </div>
      <div className="flex justify-center border-b border-slate-200">
        <TabButton label="Articles" isActive={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
        <TabButton label="Videos" isActive={activeTab === 'videos'} onClick={() => setActiveTab('videos')} />
        <TabButton label="Audio" isActive={activeTab === 'audio'} onClick={() => setActiveTab('audio')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderContent()}
      </div>
    </div>
  );
};

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>
        {label}
    </button>
)

export default Resources;
