export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface Counselor {
  id: number;
  name: string;
  specialties: string[];
  imageUrl: string;
  languages: string[];
}

export interface ForumPost {
  id: number;
  author: string;
  title: string;
  content: string;
  replies: number;
  timestamp: string;
}

export type View = 'home' | 'chatbot' | 'resources' | 'booking' | 'forum' | 'dashboard';
export type UserRole = 'guest' | 'user' | 'admin';
