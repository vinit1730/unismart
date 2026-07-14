import React, { useState, useRef, useEffect } from 'react';

export default function StudentChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your EduPortal AI Assistant. How can I help you with your attendance, grades, or schedule today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll mechanism to keep the latest message visible
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle message processing
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isBot: false }]);
    setInput('');
    setIsTyping(true);

    // Simulate an AI network latency/response hook
    setTimeout(() => {
      let botResponse = "I'm processing that request. To connect this to live backend data, attach your AI engine endpoint here.";
      
      // Basic rule-matching simulation for common portal items
      const query = userMessage.toLowerCase();
      if (query.includes('attendance')) {
        botResponse = "Your overall attendance is currently at 93.3%. You are in good standing for all enrolled modules.";
      } else if (query.includes('result') || query.includes('grade') || query.includes('gpa')) {
        botResponse = "Your cumulative GPA is 3.85. You have achieved an A+ in Database Management Systems and an A in Data Structures.";
      } else if (query.includes('schedule') || query.includes('timetable') || query.includes('class')) {
        botResponse = "Your next scheduled class is Database Management Systems (CS 302) on Monday at 09:00 AM in Room 401.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[75vh]">
        
        {/* Chat Bot Header Layout */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-2xl flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Academic AI Assistant</h2>
            <p className="text-xs text-indigo-100 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Phase 6 Active Context Engine
            </p>
          </div>
        </div>

        {/* Message Stream Segment */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  msg.isBot
                    ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Simulated loading bubble indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* User Workspace Input Bar Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white rounded-b-2xl flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about attendance, grades, schedules..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl transition-all shadow-sm text-sm"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}