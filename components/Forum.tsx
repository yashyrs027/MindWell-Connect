import React, { useState } from 'react';
import type { ForumPost } from '../types';
import Card from './common/Card';

const initialPosts: ForumPost[] = [
  { id: 1, author: 'Student_23', title: 'Feeling overwhelmed with final exams', content: "Does anyone have tips for managing stress during finals week? I feel like I can't keep up.", replies: 5, timestamp: '2 hours ago' },
  { id: 2, author: 'Anonymous_User', title: 'How do you make friends in a new city?', content: "I just moved here for college and I'm feeling really lonely. It's hard to meet new people.", replies: 12, timestamp: '1 day ago' },
  { id: 3, author: 'HopefulSoul', title: 'A small victory today!', content: "Just wanted to share that I finally finished a project I've been procrastinating on for weeks. It feels so good!", replies: 8, timestamp: '3 days ago' },
];

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!content.trim()) newErrors.content = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: 'title' | 'content') => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newPost: ForumPost = {
      id: Date.now(),
      author: 'You',
      title: title.trim(),
      content: content.trim(),
      replies: 0,
      timestamp: 'Just now',
    };
    setPosts(prev => [newPost, ...prev]);
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Peer Support Forum</h1>
        <p className="mt-2 text-slate-600">A space to connect, share, and support each other.</p>
      </div>

      <Card className="p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-400">
        <h4 className="font-bold text-yellow-800">Important Disclaimer</h4>
        <p className="text-sm text-yellow-700 mt-1">
          This is a peer-support forum, not a substitute for professional help. It is moderated by trained student volunteers.
          Please be respectful and supportive. For immediate help, contact a crisis line or use our counselor booking service.
        </p>
      </Card>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Post
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="p-5">
            <h3 className="text-xl font-bold text-blue-600 hover:underline cursor-pointer">{post.title}</h3>
            <p className="text-sm text-slate-500 mt-1">by {post.author} &bull; {post.timestamp}</p>
            <p className="text-slate-700 mt-3 truncate">{post.content}</p>
            <div className="mt-4 text-sm text-slate-600">{post.replies} replies</div>
          </Card>
        ))}
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Post</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                    errors.title ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.title && (
                  <p id="title-error" className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  placeholder="Share your thoughts..."
                  value={content}
                  onChange={(e) => { setContent(e.target.value); clearError('content'); }}
                  rows={5}
                  aria-invalid={!!errors.content}
                  aria-describedby={errors.content ? 'content-error' : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none ${
                    errors.content ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.content && (
                  <p id="content-error" className="text-red-500 text-xs mt-1">{errors.content}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
