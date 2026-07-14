import React, { useState, useEffect } from 'react';

export default function StudentExam() {
  // Mock Question Bank data structure
  const questions = [
    {
      id: 1,
      question: "Which data structure operates on a Last-In, First-Out (LIFO) basis?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1
    },
    {
      id: 2,
      question: "What does the 'C' stand for in ACID properties of Database Systems?",
      options: ["Concurrency", "Consistency", "Clustering", "Command"],
      correct: 1
    },
    {
      id: 3,
      question: "Which of the following is an advantage of a normalized database structure?",
      options: ["Minimizes data redundancy", "Increases duplicate records", "Slower query performance", "Requires more disk space"],
      correct: 0
    }
  ];

  // State Management Engine
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores mapping of { questionIdx: selectedOptionIdx }
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes allocated in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Countdown timer loop hook logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Formats remaining timestamp counter integer directly into standard clean mm:ss format strings
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    alert("Time has elapsed. Your exam session has been automatically compiled and submitted.");
  };

  const handleSubmitExam = () => {
    if (window.confirm("Are you sure you want to finalize and submit your assessment answers now?")) {
      setIsSubmitted(true);
    }
  };

  // Score Calculation Pipeline
  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount++;
      }
    });
    return {
      score: ((correctCount / questions.length) * 100).toFixed(1),
      correct: correctCount,
      total: questions.length
    };
  };

  if (isSubmitted) {
    const results = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center text-gray-800">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
          <div className="text-5xl">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900">Exam Session Finished</h2>
          <p className="text-sm text-gray-500">Your examination responses have been locked, synchronized, and logged in the record registry database.</p>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <p className="text-sm font-semibold text-gray-600">Final Grade Outcome</p>
            <p className="text-4xl font-black text-indigo-600">{results.score}%</p>
            <p className="text-xs text-gray-400">Correct Answers: {results.correct} / {results.total}</p>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
          >
            Exit Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col lg:flex-row">
      
      {/* Primary Left Hand Workspace View */}
      <main className="flex-1 p-8 space-y-6">
        
        {/* Exam Title & Active Progress Layout Block */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mid-Term Assessment: Computer Science Core</h1>
            <p className="text-xs text-gray-400 mt-0.5">Question {currentIdx + 1} of {questions.length}</p>
          </div>
          {/* Dynamic timer display alert badge toggled based on remaining window buffers */}
          <div className={`px-4 py-2 rounded-xl font-mono font-bold text-lg border shadow-sm flex items-center gap-2 ${timeLeft < 60 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <span>⏳</span> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Dynamic Interactive Question Area Board */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-800">
            {questions[currentIdx].question}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {questions[currentIdx].options.map((option, oIdx) => (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                className={`w-full text-left px-5 py-4 border rounded-xl transition-all text-sm font-medium ${
                  answers[currentIdx] === oIdx
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="inline-block w-6 text-gray-400 font-mono text-xs">{String.fromCharCode(65 + oIdx)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls Navigation Row */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-5 py-2 border rounded-xl bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-all font-semibold text-sm"
          >
            ← Previous Question
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-sm shadow-sm"
            >
              Finish & Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold text-sm shadow-sm"
            >
              Next Question →
            </button>
          )}
        </div>
      </main>

      {/* Right Hand Sticky Status Sidebar Tracker Grid Layout */}
      <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-6 space-y-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Question Status Tracker</h3>
          <div className="grid grid-cols-4 gap-2.5">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-11 rounded-xl font-bold font-mono text-xs flex items-center justify-center border transition-all ${
                  currentIdx === idx
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                    : ''
                } ${
                  answers[idx] !== undefined
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {(idx + 1).toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Answered Questions
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-200"></span> Unanswered Questions
          </p>
        </div>
      </aside>

    </div>
  );
}