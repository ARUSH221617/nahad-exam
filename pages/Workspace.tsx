import React, { useState, useRef, useEffect } from 'react';
import { generateResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const Workspace: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I've analyzed the **Calculus_Final_2023.pdf**. I can help you verify answers, solve specific problems, or summarize key topics.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Simulate mock context from PDF
    const mockPdfContext = `
      Problem 4: Find the derivative of f(x) = 3x^2 + sin(x).
      Basic Derivatives Rules:
      Power Rule: d/dx(x^n) = nx^(n-1)
      Trig Rule: d/dx(sin(x)) = cos(x)
    `;

    const responseText = await generateResponse(messages, userMsg.text, mockPdfContext);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setIsThinking(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Left Panel: PDF Viewer (Mock) */}
      <section className="flex flex-col w-1/2 lg:w-7/12 border-r border-[#e7ebf3] bg-gray-50 relative">
        <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-[#e7ebf3] shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-text-main truncate">Calculus_Final_2023.pdf</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-text-secondary">12 Pages</span>
          </div>
          <div className="flex gap-1">
            <button className="p-2 text-text-secondary hover:bg-gray-100 rounded-lg"><span className="material-symbols-outlined text-[20px]">add</span></button>
            <button className="p-2 text-text-secondary hover:bg-gray-100 rounded-lg"><span className="material-symbols-outlined text-[20px]">remove</span></button>
            <button className="p-2 text-text-secondary hover:bg-gray-100 rounded-lg"><span className="material-symbols-outlined text-[20px]">search</span></button>
          </div>
        </div>
        
        {/* Mock PDF Canvas */}
        <div className="flex-1 overflow-auto p-8 flex justify-center items-start bg-gray-100 relative">
          <div className="bg-white w-full max-w-[800px] aspect-[1/1.414] shadow-lg rounded-sm relative overflow-hidden group">
            {/* Background Image simulating PDF text */}
            <div 
              className="absolute inset-0 bg-contain bg-top bg-no-repeat opacity-90"
              style={{backgroundImage: 'url("https://picsum.photos/800/1132")'}} 
            ></div>
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                 <p className="text-gray-500 font-bold text-xl bg-white/80 p-4 rounded transform -rotate-12 border-4 border-gray-500/20">PDF MOCK VIEW</p>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-3">
             <span className="material-symbols-outlined text-[18px] cursor-pointer">chevron_left</span>
             <span>Page 1 of 12</span>
             <span className="material-symbols-outlined text-[18px] cursor-pointer">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Right Panel: Chat */}
      <section className="flex flex-col w-1/2 lg:w-5/12 bg-white relative">
        <div className="px-6 py-3 border-b border-[#e7ebf3] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-blue-400 p-1.5 rounded-lg shadow-sm shadow-primary/30">
              <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-text-main text-sm">AI Solver</h3>
              <p className="text-xs text-text-secondary">Online • Calculus Model v2</p>
            </div>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f8f9fc]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="bg-gradient-to-br from-primary to-blue-400 rounded-full w-8 h-8 shrink-0 flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
              )}
              
              <div className={`flex flex-col gap-1 max-w-[90%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-text-secondary text-[11px] font-medium mx-1">{msg.role === 'user' ? 'You' : 'AI Solver'}</span>
                <div className={`text-sm leading-relaxed px-4 py-3 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-2xl rounded-tr-none shadow-primary/20' 
                    : 'bg-white border border-[#e7ebf3] text-text-main rounded-2xl rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>

              {msg.role === 'user' && (
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 shrink-0 border border-[#e7ebf3] bg-gray-200"
                  style={{backgroundImage: 'url("https://picsum.photos/200")'}}
                ></div>
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="flex items-start gap-3">
               <div className="bg-gradient-to-br from-primary to-blue-400 rounded-full w-8 h-8 shrink-0 flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
                <div className="bg-white border border-[#e7ebf3] px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-[#e7ebf3] shrink-0">
          <div className="relative flex flex-col gap-2 p-2 bg-[#f8f9fc] rounded-xl border-2 border-transparent focus-within:border-primary/50 focus-within:bg-white transition-all">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm text-text-main placeholder-text-secondary resize-none min-h-[60px] outline-none" 
              placeholder="Ask a question about the exam..."
            ></textarea>
            <div className="flex justify-between items-center px-1 pb-1">
              <div className="flex gap-1">
                <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">attach_file</span></button>
                <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">image</span></button>
                <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">functions</span></button>
              </div>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="flex items-center gap-2 bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-primary/20"
              >
                <span>Solve</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-text-secondary">AI can make mistakes. Verify important information.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Workspace;