import React from 'react';
import { HistoryItem } from '../types';

const History: React.FC = () => {
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      question: 'Explain the impact of inflation on purchasing power in developing economies?',
      preview: 'Inflation significantly reduces purchasing power by devaluing currency. In developing economies, this effect is often amplified due to...',
      course: 'Economics',
      date: 'Oct 24, 2023 10:42 AM',
      sourcePdf: 'Econ_Final_23.pdf'
    },
    {
      id: '2',
      question: 'Calculate the derivative of f(x) = x^3 - 4x^2 + 7 at x = 2',
      preview: "Using the power rule, the derivative f'(x) is 3x^2 - 8x. Substituting x = 2 gives 3(4) - 8(2) = 12 - 16 = -4.",
      course: 'Calculus II',
      date: 'Oct 20, 2023 02:15 PM',
      sourcePdf: 'Math_Midterm.pdf'
    },
    {
      id: '3',
      question: 'Analyze the recurring theme of madness in Hamlet\'s soliloquies',
      preview: 'Hamlet\'s madness serves as both a political tool and a manifestation of his genuine grief. In "To be or not to be", he contemplates...',
      course: 'English Lit',
      date: 'Sep 15, 2023 09:30 AM',
      sourcePdf: 'Shakespeare_Notes.pdf'
    },
    {
      id: '4',
      question: 'What are the three laws of thermodynamics?',
      preview: '1. Energy cannot be created or destroyed. 2. Entropy of an isolated system always increases. 3. Entropy approaches a constant value as...',
      course: 'Physics 101',
      date: 'Sep 10, 2023 11:15 AM',
      sourcePdf: 'Physics_CheatSheet.pdf'
    }
  ];

  return (
    <div className="flex-1 px-4 md:px-8 lg:px-20 py-8">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-text-main">Past Exams History</h1>
            <p className="text-text-secondary text-base">Review your previous AI-assisted study sessions and answers.</p>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-blue-700 text-white px-6 py-3 font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Start New Session</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 lg:col-span-9">
            <label className="flex w-full items-center h-12 rounded-lg bg-white border border-[#e7ebf3] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
              <div className="flex items-center justify-center pl-4 text-text-secondary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="w-full bg-transparent border-none text-text-main placeholder:text-text-secondary px-4 focus:ring-0 text-base h-full outline-none" placeholder="Search by question content or course name..." />
            </label>
          </div>
          <div className="md:col-span-4 lg:col-span-3">
             <div className="relative w-full">
                <select className="h-12 w-full appearance-none rounded-lg bg-white border border-[#e7ebf3] text-text-main px-4 pr-10 focus:border-primary focus:ring-0 cursor-pointer shadow-sm outline-none">
                  <option>All Courses</option>
                  <option>Economics</option>
                  <option>Calculus II</option>
                  <option>English Lit</option>
                  <option>Physics 101</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                  <span className="material-symbols-outlined">filter_list</span>
                </div>
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e7ebf3] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-[#e7ebf3]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider w-[40%]">Question & Answer Preview</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider w-[15%]">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider w-[15%]">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider w-[20%]">Source PDF</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7ebf3]">
                {historyItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-text-main leading-snug">{item.question}</p>
                        <div className="flex items-start gap-1.5 text-xs text-text-secondary">
                          <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">smart_toy</span>
                          <span className="line-clamp-2">{item.preview}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.course}</span>
                    </td>
                    <td className="px-6 py-5 align-top">
                       <div className="text-sm text-text-main">{item.date.split(' ')[0]} {item.date.split(' ')[1]} {item.date.split(' ')[2]}</div>
                       <div className="text-xs text-text-secondary">{item.date.split(' ').slice(3).join(' ')}</div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2 group/pdf cursor-pointer">
                        <div className="flex items-center justify-center size-8 rounded bg-red-50 text-red-500 group-hover/pdf:bg-red-100 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                        </div>
                        <span className="text-sm font-medium text-text-secondary group-hover/pdf:text-primary transition-colors truncate max-w-[140px]">{item.sourcePdf}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                       <button className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-[#e7ebf3] hover:text-primary transition-all">
                         <span className="material-symbols-outlined">open_in_new</span>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;