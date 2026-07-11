
import React, { useState } from 'react';
import Card from './common/Card';

type ResourceCategory = 'articles' | 'videos' | 'audio';

const resourcesData = {
  articles: [
    { title: "Understanding Exam Anxiety", desc: "Tips to stay calm and focused during exam season.", img: "https://picsum.photos/400/200?random=1", content: "Exam anxiety is a common experience among students. It can manifest as physical symptoms like racing heart or sweating, as well as cognitive symptoms like blanking out. To manage it, try preparing early, taking regular breaks, and practicing deep breathing before the test. Remember, a single exam does not define your worth." },
    { title: "The Imposter Syndrome", desc: "How to overcome feelings of not being good enough.", img: "https://picsum.photos/400/200?random=2", content: "Imposter syndrome is the internal psychological experience of feeling like a phony in some area of your life, despite any success you have achieved. Overcoming it involves acknowledging your feelings, talking to mentors or peers, reframing your thoughts, and accepting that perfection is impossible." },
    { title: "Building Healthy Friendships", desc: "Navigating social life at college.", img: "https://picsum.photos/400/200?random=3", content: "College is a time of immense social growth. Building healthy friendships requires active listening, mutual respect, and setting boundaries. Don't be afraid to reach out to new people, but also prioritize your own mental well-being and alone time when needed." },
    { title: "Digital Detox Guide", desc: "Finding balance in a connected world.", img: "https://picsum.photos/400/200?random=4", content: "Constant connectivity can lead to burnout and anxiety. A digital detox doesn't have to mean completely abandoning technology. Start by setting phone-free hours, disabling non-essential notifications, and replacing screen time with mindful activities like reading or taking a walk." }
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
  const [activeArticle, setActiveArticle] = useState<any>(null);

  const renderContent = () => {
    if (activeArticle) {
      return (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 animate-fade-in bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <button 
            onClick={() => setActiveArticle(null)}
            className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Resources
          </button>
          <img src={activeArticle.img} alt={activeArticle.title} className="w-full h-64 sm:h-96 object-cover rounded-xl mb-8 shadow-md" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{activeArticle.title}</h2>
          <p className="text-xl text-slate-600 mb-8 italic border-l-4 border-blue-500 pl-4 py-2 bg-slate-50">{activeArticle.desc}</p>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <p className="text-lg">{activeArticle.content}</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'articles':
        return resourcesData.articles.map((item, index) => (
          <Card key={index} className="group cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setActiveArticle(item)}>
            <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
              <div className="mt-4 text-blue-600 text-sm font-semibold flex items-center">
                Read full article <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
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
      {!activeArticle && (
        <div className="flex justify-center border-b border-slate-200">
          <TabButton label="Articles" isActive={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
          <TabButton label="Videos" isActive={activeTab === 'videos'} onClick={() => setActiveTab('videos')} />
          <TabButton label="Audio" isActive={activeTab === 'audio'} onClick={() => setActiveTab('audio')} />
        </div>
      )}
      <div className={`grid ${activeArticle ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
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
