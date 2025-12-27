import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stat, Document } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats: Stat[] = [
    { label: 'PDFs Analyzed', value: '12', icon: 'picture_as_pdf', color: 'text-primary', bgColor: 'bg-blue-50', trend: '+2 this week' },
    { label: 'Questions Solved', value: '154', icon: 'quiz', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Study Hours Saved', value: '8.5h', icon: 'timer', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const recentDocs: Document[] = [
    { id: '1', title: 'Physics_Midterm_Fall2024.pdf', size: '4.2 MB', date: 'Just now', status: 'Processing', type: 'pdf' },
    { id: '2', title: 'Calculus_Final_2023.pdf', size: '2.8 MB', date: '2 hours ago', status: 'Ready', type: 'pdf' },
    { id: '3', title: 'Biology_101_Quiz.pdf', size: '1.5 MB', date: 'Yesterday', status: 'Ready', type: 'pdf' },
  ];

  return (
    <div className="flex-1 px-4 md:px-8 py-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Welcome & Stats */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-text-main text-3xl font-bold mb-1">Welcome back, Ahmed</h1>
          <p className="text-text-secondary">Here's what's happening with your exams today.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col justify-between gap-4 rounded-xl p-6 bg-white border border-[#e7ebf3] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className={`p-2 ${stat.bgColor} rounded-lg ${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                {stat.trend && (
                  <span className="text-green-600 bg-green-50 text-xs font-bold px-2 py-1 rounded-full">{stat.trend}</span>
                )}
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                <p className="text-text-main text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Action Area: Upload */}
      <div className="flex flex-col gap-4">
        <h3 className="text-text-main text-lg font-bold">Upload New Exam</h3>
        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-2">
          <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
          <div>
            <p className="text-text-main text-sm font-semibold">Pro Tip:</p>
            <p className="text-text-secondary text-sm">Ensure scanned PDFs are legible and oriented correctly for the best AI accuracy.</p>
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/library')}
          className="group relative flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-[#cfd7e7] hover:border-primary bg-white px-6 py-16 transition-all hover:bg-primary/5 cursor-pointer"
        >
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-50 text-primary mb-2 transition-transform group-hover:scale-110 duration-300">
            <span className="material-symbols-outlined text-[40px]">cloud_upload</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-text-main text-xl font-bold leading-tight">Drag & drop exam papers here</p>
            <p className="text-text-secondary text-sm font-normal max-w-sm">Supports PDF up to 20MB. AI Analysis starts automatically upon upload.</p>
          </div>
          <button className="mt-2 flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
            <span>Browse Files</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-4 pb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-text-main text-lg font-bold">Recent Activity</h3>
          <button onClick={() => navigate('/history')} className="text-primary text-sm font-semibold hover:underline">View All History</button>
        </div>
        <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#e7ebf3] bg-gray-50/50 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <div className="col-span-6 md:col-span-5">File Name</div>
            <div className="col-span-3 md:col-span-3">Status</div>
            <div className="col-span-3 md:col-span-2">Date</div>
            <div className="col-span-0 md:col-span-2 hidden md:block text-left">Action</div>
          </div>
          
          {recentDocs.map((doc) => (
            <div key={doc.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-[#e7ebf3] last:border-0 hover:bg-gray-50 transition-colors">
              <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-red-50 text-red-500 shrink-0">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-text-main font-medium truncate">{doc.title}</span>
                  <span className="text-xs text-text-secondary">{doc.size}</span>
                </div>
              </div>
              <div className="col-span-3 md:col-span-3">
                {doc.status === 'Processing' ? (
                  <div className="flex flex-col gap-1.5 max-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-xs font-semibold text-primary">Analyzing...</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    <span className="text-sm font-medium text-green-600">Ready</span>
                  </div>
                )}
              </div>
              <div className="col-span-3 md:col-span-2 text-sm text-text-secondary">{doc.date}</div>
              <div className="col-span-0 md:col-span-2 hidden md:flex justify-end">
                {doc.status === 'Ready' && (
                  <button onClick={() => navigate('/workspace')} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-primary bg-primary/10 hover:bg-primary/20 text-xs font-bold transition-colors">
                    View Answers
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;