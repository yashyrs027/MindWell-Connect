import React, { useState } from 'react';

const crisisHelplines = [
  { country: 'US', number: '988 or text HOME to 741741' },
  { country: 'UK', number: '111 or text SHOUT to 85258' },
  { country: 'Canada', number: '988 or text HOME to 686868' },
  { country: 'Australia', number: '13 11 14 (Lifeline)' },
  { country: 'India', number: '1800-599-0019 (KIRAN) or 1-800-891-4416 (Tele-MANAS)' },
  { country: 'International', number: 'Visit findahelpline.com for local resources' },
];

const CrisisBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 relative animate-fade-in shadow-sm rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Experiencing a crisis or emergency? You are not alone.
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              If you or someone you know is in immediate danger, please reach out to emergency services or a crisis helpline immediately.
            </p>
            {expanded ? (
              <ul className="mt-3 list-disc pl-5 space-y-1">
                {crisisHelplines.map((helpline) => (
                  <li key={helpline.country}>
                    <span className="font-semibold">{helpline.country}:</span> {helpline.number}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">
                <button
                  onClick={() => setExpanded(true)}
                  className="font-semibold underline text-red-800 hover:text-red-600 focus:outline-none"
                >
                  View International Helplines
                </button>
              </p>
            )}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => setVisible(false)}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisBanner;
