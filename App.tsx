
import React, { useState, useEffect } from 'react';
import { Question, QuizState } from './types';
import { INITIAL_QUESTIONS, MAX_TIME } from './constants';
import Timer from './components/Timer';

const App: React.FC = () => {
  const [questions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>(QuizState.START);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    let timer: number | undefined;

    if (quizState === QuizState.PLAYING && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizState === QuizState.PLAYING) {
      setQuizState(QuizState.TIMEOUT);
    }

    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const handleStart = () => {
    setQuizState(QuizState.PLAYING);
    setTimeLeft(MAX_TIME);
    setCurrentIndex(0);
  };

  const handleShowAnswer = () => {
    setQuizState(QuizState.REVEALED);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(MAX_TIME);
      setQuizState(QuizState.PLAYING);
    } else {
      setQuizState(QuizState.FINISHED);
    }
  };

  const isAnswerVisible = quizState === QuizState.REVEALED || quizState === QuizState.TIMEOUT;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 relative overflow-hidden text-slate-900">
        
        {/* Top Indicator */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {quizState === QuizState.START && (
          <div className="text-center fade-in py-8">
            <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-indigo-50 rounded-full">
              <span className="text-5xl animate-pulse">🖼️</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Quiz Hình Ảnh</h1>
            <p className="text-slate-500 mb-10 text-lg max-w-md mx-auto leading-relaxed">
              Quan sát hình ảnh và đưa ra câu trả lời. Sau 15 giây, đáp án và hình ảnh minh họa sẽ tự động xuất hiện!
            </p>
            <button 
              onClick={handleStart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 text-xl"
            >
              Bắt đầu thử thách
            </button>
          </div>
        )}

        {(quizState === QuizState.PLAYING || quizState === QuizState.TIMEOUT || quizState === QuizState.REVEALED) && (
          <div className="fade-in space-y-6">
            <div className="flex justify-between items-center">
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em]">
                Câu hỏi {currentIndex + 1} / {questions.length}
              </span>
              {quizState === QuizState.PLAYING && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Live</span>
                </div>
              )}
            </div>

            {/* Media Area */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-video bg-slate-50">
              {/* Question Image */}
              {currentQuestion.imageUrl && (
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="Question" 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isAnswerVisible ? 'opacity-40 scale-110 blur-sm' : 'opacity-100'}`}
                />
              )}
              
              {/* Answer Image Overlay */}
              {isAnswerVisible && currentQuestion.answerImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center p-4 fade-in">
                  <img 
                    src={currentQuestion.answerImageUrl} 
                    alt="Answer" 
                    className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white transform transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}

              {/* Countdown Overlay during playing */}
              {quizState === QuizState.PLAYING && (
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full font-black text-xl">
                  {timeLeft}s
                </div>
              )}
            </div>

            {quizState === QuizState.PLAYING && (
              <Timer timeLeft={timeLeft} totalTime={MAX_TIME} />
            )}

            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Display */}
            <div className="min-h-[120px] flex flex-col items-center justify-center">
              {isAnswerVisible ? (
                <div className="w-full fade-in">
                  <div className="text-center text-indigo-600 font-black uppercase text-[10px] mb-3 tracking-[0.3em]">
                    Đáp án chính xác
                  </div>
                  <div className="bg-indigo-600 text-white text-center py-6 px-8 rounded-3xl text-3xl font-black shadow-xl transform animate-[wiggle_1s_ease-in-out]">
                    {currentQuestion.answer}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                   <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-indigo-200 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                   </div>
                   <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Đang suy nghĩ...</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              {quizState === QuizState.PLAYING ? (
                <button
                  onClick={handleShowAnswer}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-lg transition-all text-lg"
                >
                  Xem đáp án ngay
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all text-lg flex items-center justify-center gap-2 group"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>Câu tiếp theo <span className="group-hover:translate-x-2 transition-transform">→</span></>
                  ) : (
                    <>Xem kết quả chung cuộc 🏁</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {quizState === QuizState.FINISHED && (
          <div className="text-center fade-in py-10">
            <div className="mb-8 inline-flex items-center justify-center w-28 h-28 bg-indigo-50 rounded-full shadow-lg border-4 border-white">
              <span className="text-6xl">🌟</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Hoàn tất!</h1>
            <p className="text-slate-500 mb-10 text-lg">Bạn đã khám phá hết tất cả các câu đố hình ảnh hôm nay.</p>
            
            <button 
              onClick={handleStart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all text-lg"
            >
              Chơi lại từ đầu
            </button>
          </div>
        )}
      </div>

      <footer className="fixed bottom-6 text-slate-500 text-[10px] text-center w-full font-bold opacity-30 tracking-[0.5em] uppercase">
        Visual Quiz Studio • v2.0
      </footer>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
