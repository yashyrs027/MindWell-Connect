import React, { useState } from 'react';
import Card from './common/Card';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

const features = [
  {
    title: 'AI Chatbot — Mindy',
    description: 'Talk to Mindy anytime. Our AI companion listens, supports, and guides you through tough moments — available 24/7.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
      </svg>
    ),
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    title: 'Mood Dashboard',
    description: 'Track your emotional well-being over time with daily check-ins and visual insights to understand your patterns.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    title: 'Peer Support Forum',
    description: 'Connect with fellow students in a safe, moderated space. Share experiences, ask questions, and lift each other up.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    title: 'Resource Hub',
    description: 'Access curated articles, videos, and audio content on mental health topics — all in one place, always free.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
];

const steps = [
  { step: '01', title: 'Create your account', description: 'Sign up in seconds — no personal details required beyond your email.' },
  { step: '02', title: 'Check in daily', description: 'Log your mood, chat with Mindy, or browse resources at your own pace.' },
  { step: '03', title: 'Get real support', description: 'Book a session with a counselor or connect with peers whenever you need it.' },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignup }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactErrors, setContactErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateContact = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    const trimmedName = contactName.trim();
    const trimmedEmail = contactEmail.trim();
    const trimmedMessage = contactMessage.trim();

    if (!trimmedName) newErrors.name = 'Name is required.';
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!trimmedMessage) newErrors.message = 'Message is required.';

    setContactErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearContactError = (field: 'name' | 'email' | 'message') => {
    if (contactErrors[field]) setContactErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleContactSubmit = () => {
    if (!validateContact()) return;
    // No backend yet — simulate success and reset the form.
    setIsSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setContactErrors({});

    // Hide the success message after a few seconds so the form is reusable.
    setTimeout(() => setIsSubmitted(false), 4000);
  };
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M15.5 12.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3.5 4c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          <span className="text-lg font-bold text-slate-800">MindWell Connect</span>
        </div>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button onClick={() => scrollTo('about')} className="hover:text-blue-600 transition-colors">About</button>
          <button onClick={() => scrollTo('workflow')} className="hover:text-blue-600 transition-colors">How It Works</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-blue-600 transition-colors">Contact</button>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToLogin}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-3 py-2"
          >
            Login
          </button>
          <button
            onClick={onNavigateToSignup}
            className="text-sm font-semibold bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-slate-50 to-purple-100 px-6 py-20 sm:py-28 text-center flex flex-col items-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
          Mental Wellness for Students
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight max-w-3xl">
          Your mind matters. <br />
          <span className="text-blue-600">We're here to help.</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-xl">
          MindWell Connect is a safe, student-focused platform offering AI support, peer community, counselor booking, and mental health resources — all in one place.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNavigateToSignup}
            className="bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-200 text-base"
          >
            Get Started — It's Free
          </button>
          <button
            onClick={onNavigateToLogin}
            className="bg-white text-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all duration-300 text-base"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Everything you need to thrive</h2>
            <p className="mt-3 text-slate-500">Four powerful tools, one platform, zero cost.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 flex flex-col items-start gap-4">
                <div className={`${feature.bg} ${feature.color} p-3 rounded-xl`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{feature.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="px-6 py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">How it works</h2>
            <p className="mt-3 text-slate-500">Up and running in under a minute.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-extrabold shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={onNavigateToSignup}
              className="bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-200 text-base"
            >
              Join MindWell Connect
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
<section id="contact" className="px-6 py-20 bg-white">
  <div className="max-w-2xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-slate-800">Get in touch</h2>
    <p className="mt-3 text-slate-500 mb-10">Have questions or feedback? We'd love to hear from you.</p>
    <Card className="p-8 text-left">
      {isSubmitted && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 text-green-700 text-sm font-medium px-4 py-3 rounded-md">
          Message sent! We'll get back to you soon.
        </div>
      )}
      <form
        onSubmit={(e) => { e.preventDefault(); handleContactSubmit(); }}
        noValidate
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={contactName}
            onChange={(e) => { setContactName(e.target.value); clearContactError('name'); }}
            aria-invalid={!!contactErrors.name}
            aria-describedby={contactErrors.name ? 'contact-name-error' : undefined}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
              contactErrors.name ? 'border-red-400' : 'border-slate-300'
            }`}
          />
          {contactErrors.name && (
            <p id="contact-name-error" className="text-red-500 text-xs mt-1">{contactErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={contactEmail}
            onChange={(e) => { setContactEmail(e.target.value); clearContactError('email'); }}
            aria-invalid={!!contactErrors.email}
            aria-describedby={contactErrors.email ? 'contact-email-error' : undefined}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
              contactErrors.email ? 'border-red-400' : 'border-slate-300'
            }`}
          />
          {contactErrors.email && (
            <p id="contact-email-error" className="text-red-500 text-xs mt-1">{contactErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
          <textarea
            placeholder="Write your message..."
            rows={4}
            value={contactMessage}
            onChange={(e) => { setContactMessage(e.target.value); clearContactError('message'); }}
            aria-invalid={!!contactErrors.message}
            aria-describedby={contactErrors.message ? 'contact-message-error' : undefined}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none ${
              contactErrors.message ? 'border-red-400' : 'border-slate-300'
            }`}
          />
          {contactErrors.message && (
            <p id="contact-message-error" className="text-red-500 text-xs mt-1">{contactErrors.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send Message
        </button>
      </form>
    </Card>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M15.5 12.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3.5 4c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            <span className="text-sm font-semibold text-slate-300">MindWell Connect</span>
          </div>
          <p className="text-xs text-slate-500 text-center sm:text-right">
            © 2025 MindWell Connect. Your well-being is our priority.
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-slate-700 text-center text-xs text-slate-500">
          If you are in crisis, please contact a crisis helpline immediately. MindWell Connect is not a substitute for professional mental health care.
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
