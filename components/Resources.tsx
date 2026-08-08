
import React, { useState, useRef, useEffect } from 'react';
import Card from './common/Card';
import localVideo from '../video/v.mp4';

type ResourceCategory = 'articles' | 'videos' | 'audio';

interface VideoItem {
  title: string;
  desc: string;
  img: string;
  url: string;
}

interface AudioItem {
  title: string;
  desc: string;
  icon: string;
  url: string;
}

const resourcesData: {
  articles: Array<{ title: string; desc: string; img: string }>;
  videos: VideoItem[];
  audio: AudioItem[];
} = {
  articles: [
    { title: "Understanding Exam Anxiety", desc: "Tips to stay calm and focused during exam season.", img: "https://picsum.photos/400/200?random=1" },
    { title: "The Imposter Syndrome", desc: "How to overcome feelings of not being good enough.", img: "https://picsum.photos/400/200?random=2" },
    { title: "Building Healthy Friendships", desc: "Navigating social life at college.", img: "https://picsum.photos/400/200?random=3" },
    { title: "Digital Detox Guide", desc: "Finding balance in a connected world.", img: "https://picsum.photos/400/200?random=4" }
  ],
  videos: [
    { 
      title: "5-Minute Guided Meditation", 
      desc: "A short calming video to help you recenter yourself.", 
      img: "https://picsum.photos/400/200?random=5",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    { 
      title: "Expert Talk: Coping with Burnout", 
      desc: "Dr. Anjali Kumar discusses student burnout and recovery.", 
      img: "https://picsum.photos/400/200?random=6",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    { 
      title: "Yoga for Stress Relief", 
      desc: "A beginner-friendly yoga session for relaxation.", 
      img: "https://picsum.photos/400/200?random=7",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg"
    }
  ],
  audio: [
    { 
      title: "Calming Ocean Waves", 
      desc: "30 minutes of soothing ocean sounds for relaxation or sleep.", 
      icon: '🌊',
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    { 
      title: "Forest Ambience", 
      desc: "Listen to the gentle sounds of a forest.", 
      icon: '🌳',
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    { 
      title: "Mindful Breathing Exercise", 
      desc: "A 10-minute guided breathing session.", 
      icon: '🧘',
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ]
};

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceCategory>('articles');
  
  // Audio state
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Video state
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [videoError, setVideoError] = useState(false);

  // Initialize audio listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setAudioProgress(audio.currentTime);
    const handleLoadedMetadata = () => setAudioDuration(audio.duration || 0);
    const handleEnded = () => { setIsPlayingAudio(false); setAudioProgress(0); };
    const handlePlay = () => setIsPlayingAudio(true);
    const handlePause = () => setIsPlayingAudio(false);
    const handleVolumeChange = () => setIsMuted(audio.muted);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Handle Audio Play/Pause Toggle
  const handleToggleAudio = (index: number) => {
    // Pause any open video modal playback when launching audio
    if (activeVideo) {
      setActiveVideo(null);
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (playingAudioIndex === index) {
      if (isPlayingAudio) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
    } else {
      setPlayingAudioIndex(index);
      audio.src = resourcesData.audio[index].url;
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  };

  const handleStopAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    }
    setPlayingAudioIndex(null);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setAudioDuration(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (audio) {
      audio.currentTime = newTime;
      setAudioProgress(newTime);
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle Video Trigger
  const handlePlayVideo = (video: VideoItem) => {
    if (audioRef.current && isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    setVideoError(false);
    setActiveVideo(video);
  };

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
          <Card 
            key={index} 
            className="group relative cursor-pointer overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handlePlayVideo(item)}
          >
            <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-opacity-50 transition-all">
              <div className="bg-white/90 group-hover:bg-blue-600 group-hover:text-white text-slate-800 p-3 rounded-full shadow-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
            </div>
          </Card>
        ));
      case 'audio':
        return resourcesData.audio.map((item, index) => {
          const isThisPlaying = playingAudioIndex === index && isPlayingAudio;
          const isThisSelected = playingAudioIndex === index;

          return (
            <Card 
              key={index} 
              className={`flex items-center p-4 transition-all border-2 ${isThisSelected ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-transparent hover:border-slate-200'}`}
            >
              <div className="text-4xl mr-4 select-none">{item.icon}</div>
              <div className="flex-1 min-w-0 mr-3">
                <h3 className="font-bold text-lg text-slate-800 truncate">{item.title}</h3>
                <p className="text-slate-600 text-sm mt-0.5 line-clamp-2">{item.desc}</p>
              </div>
              <button 
                onClick={() => handleToggleAudio(index)}
                aria-label={isThisPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
                className={`flex-shrink-0 rounded-full p-3 transition-colors ${
                  isThisPlaying 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow'
                }`}
              >
                {isThisPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </Card>
          );
        });
      default:
        return null;
    }
  };

  const currentAudioItem = playingAudioIndex !== null ? resourcesData.audio[playingAudioIndex] : null;

  return (
    <div className="space-y-6 pb-24">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

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

      {/* Sticky Bottom Audio Player Bar */}
      {currentAudioItem && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-slate-900 text-white rounded-2xl shadow-2xl p-4 z-40 flex flex-col space-y-2 border border-slate-800 backdrop-blur-md bg-opacity-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className="text-2xl">{currentAudioItem.icon}</span>
              <div className="truncate">
                <h4 className="font-semibold text-sm truncate">{currentAudioItem.title}</h4>
                <p className="text-xs text-slate-400 truncate">{currentAudioItem.desc}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleToggleMute} 
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.414 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.414-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button 
                onClick={() => playingAudioIndex !== null && handleToggleAudio(playingAudioIndex)} 
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-2 shadow transition-colors"
              >
                {isPlayingAudio ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button 
                onClick={handleStopAudio} 
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition-colors"
                title="Close player"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>{formatTime(audioProgress)}</span>
            <input 
              type="range" 
              min={0} 
              max={audioDuration || 100} 
              value={audioProgress} 
              onChange={handleSeek}
              className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <span>{formatTime(audioDuration)}</span>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 text-white">
              <h3 className="font-bold text-lg truncate pr-4">{activeVideo.title}</h3>
              <button 
                onClick={() => setActiveVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close video player"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="relative bg-black flex items-center justify-center min-h-[260px]">
              <video
  key={videoError ? 'fallback' : 'primary'}
  controls
  autoPlay
  playsInline
  preload="auto"
  className="w-full max-h-[60vh] object-contain rounded-b-none"
  onError={() => {
    if (!videoError) {
      setVideoError(true);
    }
  }}
>
  <source
    src={videoError ? localVideo : activeVideo.url}
    type="video/mp4"
  />

  Your browser does not support the video tag.
</video>
              {videoError && !localVideo && (
                <p className="absolute text-slate-400 text-sm">Video unavailable.</p>
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 bg-slate-900 text-slate-300">
              <p className="text-sm">{activeVideo.desc}</p>
            </div>
          </div>
        </div>
      )}
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

