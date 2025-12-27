import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../types';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Simulated Vercel Blob Upload function
  const uploadToBlob = async (file: File) => {
    // In a real app, this would use the Vercel Blob SDK:
    // const { url } = await put(file.name, file, { access: 'public' });
    // return url;
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`https://blob.vercel-storage.com/${file.name}`);
      }, 1500);
    });
  };

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', title: 'Introduction to Modern Biology 101.pdf', size: '2.3 MB', date: 'Oct 24, 2023', status: 'Processed', type: 'pdf' },
    { id: '2', title: 'Advanced Calculus Midterm Review.pdf', size: '1.8 MB', date: '2 hours ago', status: 'New', type: 'pdf' },
    { id: '3', title: 'History of Art - Renaissance Period.pdf', size: '5.1 MB', date: 'Oct 20, 2023', status: 'Draft', type: 'pdf' },
    { id: '4', title: 'Organic Chemistry - Chapter 4.pdf', size: '3.2 MB', date: 'Sep 15, 2023', status: 'Processed', type: 'pdf' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-blue-100 text-blue-700';
      case 'New': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-gray-100 text-gray-600';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleUploadClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported.');
      return;
    }

    setIsUploading(true);

    // Create optimistic UI entry
    const newDoc: Document = {
      id: Date.now().toString(),
      title: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      date: 'Just now',
      status: 'Processing',
      type: 'pdf'
    };

    setDocuments(prev => [newDoc, ...prev]);

    try {
      await uploadToBlob(file);
      
      // Simulate AI processing completion after upload
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(d => d.id === newDoc.id ? { ...d, status: 'New' } : d)
        );
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      // In a real app, handle error state here
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 px-4 md:px-8 py-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
            <span>Exam Resources</span>
          </div>
          <h1 className="text-3xl font-black leading-tight text-text-main">
            Document Library
          </h1>
          <p className="text-text-secondary text-base font-normal max-w-2xl">
            Upload your course materials, PDF textbooks, and lecture notes. Our AI will analyze them to help you prepare for exams.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-[#e7ebf3]">
        <label className="flex items-center flex-1 h-12 bg-[#f8f9fc] rounded-lg px-4 gap-3 group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">search</span>
          <input className="flex-1 bg-transparent border-none outline-none text-base text-text-main placeholder:text-gray-400 focus:ring-0 p-0" placeholder="Search documents..." />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 px-1">
          <span className="text-sm font-medium text-gray-400 whitespace-nowrap mr-1 pl-2">Filter by:</span>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/10 text-primary px-4 hover:bg-primary/20 transition-colors text-sm font-bold">All Files</button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f8f9fc] hover:bg-gray-200 text-gray-600 px-4 transition-colors text-sm font-medium">Recent</button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {/* Upload Card */}
        <div 
          onClick={handleUploadClick}
          className={`group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-300 min-h-[280px] ${isUploading ? 'border-primary bg-primary/5 cursor-wait' : 'border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary cursor-pointer'}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="size-16 flex items-center justify-center">
                 <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center px-6">
                <h3 className="text-lg font-bold text-primary mb-1">Uploading...</h3>
                <p className="text-sm text-text-secondary">Processing document</p>
              </div>
            </div>
          ) : (
            <>
              <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
              </div>
              <div className="text-center px-6">
                <h3 className="text-lg font-bold text-primary mb-1">Upload New PDF</h3>
                <p className="text-sm text-text-secondary">Drag & drop or click to browse</p>
              </div>
            </>
          )}
        </div>

        {/* Documents */}
        {documents.map((doc) => (
          <div key={doc.id} className="flex flex-col bg-white rounded-xl shadow-sm border border-[#e7ebf3] overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="size-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
                  <span className="material-symbols-outlined text-xl">more_vert</span>
                </button>
              </div>
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`${getStatusColor(doc.status)} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                    {doc.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-main leading-tight mb-1 line-clamp-2" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="text-xs text-text-secondary flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  {doc.date}
                </p>
              </div>
              <div className="pt-6 mt-2 border-t border-[#e7ebf3] flex gap-2">
                <button 
                  onClick={() => navigate('/workspace')}
                  disabled={doc.status === 'Draft' || doc.status === 'Processing'}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg transition-colors text-sm font-bold ${
                    (doc.status === 'Draft' || doc.status === 'Processing')
                    ? 'bg-[#e7ebf3] text-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-blue-700 text-white'
                  }`}
                >
                  {doc.status === 'Processing' ? (
                     <>
                      <div className="size-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                     </>
                  ) : (
                     <>
                      <span className="material-symbols-outlined text-[18px]">smart_display</span>
                      <span>{doc.status === 'Draft' ? 'Processing...' : 'Start Exam'}</span>
                     </>
                  )}
                </button>
                <button className="size-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;