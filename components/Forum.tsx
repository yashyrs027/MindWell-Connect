
import React, { useState } from 'react';
import type { ForumPost } from '../types';
import Card from './common/Card';

const initialPosts: ForumPost[] = [
  { id: 1, author: 'Student_23', title: 'Feeling overwhelmed with final exams', content: "Does anyone have tips for managing stress during finals week? I feel like I can't keep up.", replies: 5, timestamp: '2 hours ago' },
  { id: 2, author: 'Anonymous_User', title: 'How do you make friends in a new city?', content: "I just moved here for college and I'm feeling really lonely. It's hard to meet new people.", replies: 12, timestamp: '1 day ago' },
  { id: 3, author: 'HopefulSoul', title: 'A small victory today!', content: "Just wanted to share that I finally finished a project I've been procrastinating on for weeks. It feels so good!", replies: 8, timestamp: '3 days ago' },
];

const Forum: React.FC = () => {
  const [posts] = useState<ForumPost[]>(initialPosts);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Peer Support Forum</h1>
        <p className="mt-2 text-slate-600">A space to connect, share, and support each other.</p>
      </div>

      <Card className="p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-400">
        <h4 className="font-bold text-yellow-800">Important Disclaimer</h4>
        <p className="text-sm text-yellow-700 mt-1">This is a peer-support forum, not a substitute for professional help. It is moderated by trained student volunteers. Please be respectful and supportive. For immediate help, contact a crisis line or use our counselor booking service.</p>
      </Card>
      
      <div className="flex justify-end mb-4">
        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Create New Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="p-5" onClick={() => {}}>
            <h3 className="text-xl font-bold text-blue-600 hover:underline">{post.title}</h3>
            <p className="text-sm text-slate-500 mt-1">by {post.author} &bull; {post.timestamp}</p>
            <p className="text-slate-700 mt-3 truncate">{post.content}</p>
            <div className="mt-4 text-sm text-slate-600">
              {post.replies} replies
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Forum;
