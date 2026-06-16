'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useRouter } from 'next/navigation';
import { logout } from '../../../store/slices/authSlice';
import { LogOut, Calendar, Video } from 'lucide-react';
import api from '../../../lib/axios';

export default function CandidateDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
    // Fetch meetings
    api.get('/meetings').then(res => setMeetings(res.data)).catch(err => console.error(err));
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">SyncSphere</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={user?.profileImage || 'https://via.placeholder.com/40'} alt="Profile" className="w-10 h-10 rounded-full border-2 border-teal-100" />
            <div className="text-sm">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500">Here are your assigned meetings.</p>
        </div>

        <div className="space-y-4">
          {meetings.length === 0 ? (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
               <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
               <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming meetings</h3>
               <p className="text-gray-500">You're all caught up! Enjoy your day.</p>
             </div>
          ) : (
            meetings.map((m: any) => (
              <div key={m._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                    <Video size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{m.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(m.startTime).toLocaleString()} • {m.meetingType}</p>
                    <p className="text-xs text-gray-400 mt-1">Organizer: {m.organizerId?.name}</p>
                  </div>
                </div>
                <a 
                  href={m.meetLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Join Meeting
                </a>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
