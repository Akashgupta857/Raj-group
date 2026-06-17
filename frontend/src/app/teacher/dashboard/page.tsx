'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useRouter } from 'next/navigation';
import { logout } from '../../../store/slices/authSlice';
import { LogOut, Calendar, Users, Activity, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../lib/axios';

export default function TeacherDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', startTime: '', endTime: '', meetingType: 'Interview', candidateIds: [] as string[]
  });

  const fetchMeetings = () => {
    api.get('/meetings').then(res => setMeetings(res.data)).catch(err => console.error(err));
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
    fetchMeetings();
    api.get('/auth/candidates').then(res => setCandidates(res.data)).catch(err => console.error(err));
  }, [user, router]);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/meetings', formData);
      toast.success('Meeting scheduled successfully!');
      setIsModalOpen(false);
      fetchMeetings();
    } catch {
      toast.error('Failed to schedule meeting');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">SyncSphere</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user?.profileImage || 'https://via.placeholder.com/40'} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-100" />
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

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500">Here&apos;s what&apos;s happening with your classes today.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Schedule Meeting
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Meetings</p>
              <h3 className="text-3xl font-bold text-gray-900">{meetings.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg. Attendance</p>
              <h3 className="text-3xl font-bold text-gray-900">85%</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Activity size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming Today</p>
              <h3 className="text-3xl font-bold text-gray-900">2</h3>
            </div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Your Meetings</h2>
          </div>
          <div className="p-6">
            {meetings.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Calendar size={32} />
                </div>
                <p className="text-gray-500">No meetings scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {meetings.map((m: any) => (
                  <div key={m._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                    <div>
                      <h4 className="font-semibold text-gray-900">{m.title}</h4>
                      <p className="text-sm text-gray-500">{new Date(m.startTime).toLocaleString()} • {m.meetingType}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {m.status}
                      </span>
                      <a href={m.meetLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Join
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Schedule New Meeting</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input required type="datetime-local" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input required type="datetime-local" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.meetingType} onChange={e => setFormData({...formData, meetingType: e.target.value})}>
                  {['Interview', 'Technical Assessment', 'Training', 'Classroom', 'Mentorship', 'Mock Interview', 'Group Discussion'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Candidates</label>
                <div className="w-full px-4 py-3 border border-gray-200 rounded-lg max-h-32 overflow-y-auto bg-gray-50/50">
                  {candidates.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No candidates available.</p>
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    candidates.map((c: any) => (
                      <label key={c._id} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                          value={c._id}
                          checked={formData.candidateIds.includes(c._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, candidateIds: [...formData.candidateIds, c._id] });
                            } else {
                              setFormData({ ...formData, candidateIds: formData.candidateIds.filter(id => id !== c._id) });
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{c.name} ({c.email})</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-all">Schedule Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
