
import React, { useState } from 'react';
import type { Counselor } from '../types';
import Card from './common/Card';

const counselors: Counselor[] = [
  { id: 1, name: 'Dr. Priya Sharma', specialties: ['Anxiety', 'Depression', 'Relationships'], imageUrl: 'https://picsum.photos/200/200?random=10', languages: ['English', 'Hindi'] },
  { id: 2, name: 'Mr. Rohan Desai', specialties: ['Stress Management', 'Burnout', 'Career Counseling'], imageUrl: 'https://picsum.photos/200/200?random=11', languages: ['English', 'Gujarati'] },
  { id: 3, name: 'Ms. Aisha Khan', specialties: ['Trauma', 'Grief', 'Family Issues'], imageUrl: 'https://picsum.photos/200/200?random=12', languages: ['English', 'Urdu'] },
  { id: 4, name: 'Dr. Vikram Singh', specialties: ['Academic Pressure', 'Time Management', 'Mindfulness'], imageUrl: 'https://picsum.photos/200/200?random=13', languages: ['English', 'Punjabi'] },
];

const TimeSlot: React.FC<{time: string, isSelected: boolean, onSelect: () => void}> = ({time, isSelected, onSelect}) => (
    <button
      onClick={onSelect}
      className={`px-4 py-2 rounded-lg border transition-colors ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100'}`}
    >
      {time}
    </button>
);


const CounselorCard: React.FC<{counselor: Counselor, onBook: (c: Counselor) => void}> = ({ counselor, onBook }) => (
    <Card className="p-6 text-center flex flex-col items-center">
        <img src={counselor.imageUrl} alt={counselor.name} className="w-24 h-24 rounded-full object-cover mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{counselor.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{counselor.languages.join(', ')}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
            {counselor.specialties.map(spec => (
                <span key={spec} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full">{spec}</span>
            ))}
        </div>
        <button onClick={() => onBook(counselor)} className="mt-auto w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            Book Appointment
        </button>
    </Card>
);

const BookingModal: React.FC<{counselor: Counselor, onClose: () => void}> = ({ counselor, onClose}) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    if(isConfirmed) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="p-8 text-center max-w-sm">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">Appointment Confirmed!</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">Your session with {counselor.name} at {selectedTime} is booked. You'll receive a confirmation email shortly.</p>
                    <button onClick={onClose} className="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        Close
                    </button>
                </Card>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Book with {counselor.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400">Select an available time slot for today.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-6">
                    {['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map(time => (
                        <TimeSlot key={time} time={time} isSelected={selectedTime === time} onSelect={() => setSelectedTime(time)} />
                    ))}
                </div>

                <button 
                  onClick={() => setIsConfirmed(true)} 
                  disabled={!selectedTime}
                  className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                    {selectedTime ? `Confirm for ${selectedTime}` : 'Select a time'}
                </button>
            </div>
        </div>
    )
}

const Booking: React.FC = () => {
    const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Counselor Booking</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Connect with our team of professional counselors. All sessions are confidential.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {counselors.map(c => (
                    <CounselorCard key={c.id} counselor={c} onBook={setSelectedCounselor} />
                ))}
            </div>
            {selectedCounselor && <BookingModal counselor={selectedCounselor} onClose={() => setSelectedCounselor(null)} />}
        </div>
    );
};

export default Booking;
