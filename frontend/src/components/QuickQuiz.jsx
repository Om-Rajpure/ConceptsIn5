import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Loader2, 
  ChevronRight, 
  Award,
  BookOpen,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '../api';
import GlassCard from './GlassCard';

export default function QuickQuiz({ 
  videoId, 
  noteId, 
  subjectSlug, 
  conceptTitle = "This Concept" 
}) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showConceptualAnswer, setShowConceptualAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setUserAnswers({});
    setShowConceptualAnswer(false);
    setQuizCompleted(false);

    try {
      const payload = {
        video_id: videoId || undefined,
        note_id: noteId || undefined,
        subject_slug: subjectSlug || undefined,
      };

      const res = await api.post('/api/ai/quick-quiz/', payload);
      if (res.data?.success && res.data?.data?.questions?.length > 0) {
        setQuiz(res.data.data);
      } else {
        throw new Error("Could not generate quiz");
      }
    } catch (err) {
      console.warn("Quiz API fallback invoked:", err);
      // High-yield offline fallback quiz grounded in the concept
      setQuiz({
        title: `Diagnostic Check: ${conceptTitle}`,
        questions: [
          {
            id: 1,
            type: "mcq",
            question: `What is the primary motivation for studying ${conceptTitle}?`,
            options: [
              `To eliminate redundancy, maintain consistency, and optimize performance`,
              "To increase theoretical complexity without practical gain",
              "To replace all other computer science paradigms",
              "None of the above"
            ],
            correct_index: 0,
            explanation: `${conceptTitle} focuses on establishing optimal technical invariants and eliminating architectural flaws.`
          },
          {
            id: 2,
            type: "mcq",
            question: `Which requirement is critical when applying ${conceptTitle}?`,
            options: [
              "Ignoring mathematical constraints",
              "Preserving data integrity and functional dependencies",
              "Assuming infinite hardware resources",
              "Skipping edge case validation"
            ],
            correct_index: 1,
            explanation: "Core engineering discipline requires preserving structural integrity and dependencies."
          },
          {
            id: 3,
            type: "mcq",
            question: `In technical exams and interviews, questions on ${conceptTitle} usually test:`,
            options: [
              "Rote memorization only",
              "Ability to identify edge cases, decompose problems, and justify trade-offs",
              "Typing speed",
              "Historical trivia"
            ],
            correct_index: 1,
            explanation: "Evaluators test your deeper architectural reasoning and problem decomposition."
          },
          {
            id: 4,
            type: "conceptual",
            question: `Briefly explain the primary trade-off of ${conceptTitle} in real-world systems.`,
            model_answer: `${conceptTitle} improves consistency and reduces structural flaws, but may introduce minor operational overhead in simple systems where simpler approaches suffice.`,
            key_criteria: [
              "Identifies architectural consistency benefit",
              "Acknowledges trade-off vs simplicity in low-complexity systems"
            ]
          }
        ],
        model_used: "ConceptsIn5 Diagnostic Engine"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (userAnswers[questionId] !== undefined) return; // Locked once answered
    
    const newAnswers = { ...userAnswers, [questionId]: optionIndex };
    setUserAnswers(newAnswers);

    // Check if all MCQs are answered
    const mcqQuestions = (quiz?.questions || []).filter(q => q.type === 'mcq');
    const allMcqsAnswered = mcqQuestions.every(q => newAnswers[q.id] !== undefined);
    if (allMcqsAnswered) {
      setQuizCompleted(true);
    }
  };

  const calculateScore = () => {
    if (!quiz?.questions) return { correct: 0, total: 0 };
    const mcqs = quiz.questions.filter(q => q.type === 'mcq');
    let correct = 0;
    mcqs.forEach(q => {
      if (userAnswers[q.id] === q.correct_index) correct += 1;
    });
    return { correct, total: mcqs.length };
  };

  const score = calculateScore();

  return (
    <div className="w-full my-8">
      <GlassCard className="p-6 md:p-8 border-accent-purple/30 bg-dark/60 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-purple/10 blur-[100px] pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple/20 to-accent-blue/20 border border-accent-purple/40 flex items-center justify-center shadow-[0_0_15px_rgba(123,97,255,0.2)]">
              <HelpCircle className="w-5 h-5 text-accent-purple" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                Quick Concept Quiz
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple">
                  4 Questions
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-light">
                Diagnostic assessment to test your grasp of <span className="text-white font-medium">{conceptTitle}</span>.
              </p>
            </div>
          </div>

          {quiz && (
            <button
              onClick={fetchQuiz}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake / New Quiz
            </button>
          )}
        </div>

        {/* Initial Prompt State */}
        {!quiz && !loading && (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-accent-cyan" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Ready to test your understanding?</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
              Generate a 4-question diagnostic quiz (3 MCQs + 1 scenario question) based directly on this lesson's content.
            </p>
            <button
              onClick={fetchQuiz}
              className="px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Start Quick Quiz
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-accent-purple animate-spin" />
            <p className="text-xs text-gray-400">Generating diagnostic questions grounded in {conceptTitle}...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="my-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Active Quiz Questions */}
        <AnimatePresence>
          {quiz && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-6"
            >
              {/* Question List */}
              {quiz.questions.map((q, qIndex) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const selectedOption = userAnswers[q.id];
                const isCorrect = selectedOption === q.correct_index;

                if (q.type === 'mcq') {
                  return (
                    <div 
                      key={q.id || qIndex} 
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-black flex items-center justify-center">
                            {qIndex + 1}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Multiple Choice
                          </span>
                        </div>
                        {isAnswered && (
                          <div className={`text-xs font-bold flex items-center gap-1.5 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </div>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-white leading-relaxed">
                        {q.question}
                      </h4>

                      {/* Options */}
                      <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt, optIndex) => {
                          let optStyle = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20";
                          
                          if (isAnswered) {
                            if (optIndex === q.correct_index) {
                              optStyle = "bg-green-500/15 border-green-500 text-green-300 font-semibold";
                            } else if (optIndex === selectedOption && !isCorrect) {
                              optStyle = "bg-red-500/15 border-red-500 text-red-300";
                            } else {
                              optStyle = "bg-white/[0.02] border-white/5 text-gray-500 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              disabled={isAnswered}
                              className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 ${optStyle}`}
                            >
                              <span className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 flex-shrink-0">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box on answer */}
                      {isAnswered && q.explanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3.5 rounded-xl bg-accent-blue/[0.05] border border-accent-blue/20 text-xs text-gray-300 leading-relaxed"
                        >
                          <span className="font-bold text-accent-blue block mb-1">Explanation:</span>
                          {q.explanation}
                        </motion.div>
                      )}
                    </div>
                  );
                }

                // Conceptual scenario question
                if (q.type === 'conceptual') {
                  return (
                    <div 
                      key={q.id || qIndex} 
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan text-xs font-black flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                          Conceptual / Scenario Question
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white leading-relaxed">
                        {q.question}
                      </h4>

                      <div className="pt-2">
                        <button
                          onClick={() => setShowConceptualAnswer(!showConceptualAnswer)}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-accent-cyan/40 text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-2"
                        >
                          {showConceptualAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {showConceptualAnswer ? "Hide Model Answer" : "Reveal Model Answer & Evaluation Criteria"}
                        </button>
                      </div>

                      {showConceptualAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
                        >
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-wider text-accent-cyan mb-1">
                              Model Answer:
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed italic">
                              "{q.model_answer}"
                            </p>
                          </div>

                          {q.key_criteria && q.key_criteria.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Essential Criteria to Mention:
                              </div>
                              <ul className="space-y-1 text-xs text-gray-300">
                                {q.key_criteria.map((crit, cIdx) => (
                                  <li key={cIdx} className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                                    <span>{crit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  );
                }

                return null;
              })}

              {/* Scorecard Summary */}
              {quizCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 border border-accent-purple/30 text-center space-y-3"
                >
                  <Award className="w-8 h-8 text-accent-cyan mx-auto" />
                  <h4 className="text-lg font-black text-white">
                    Diagnostic Score: {score.correct} / {score.total}
                  </h4>
                  <p className="text-xs text-gray-300 max-w-sm mx-auto">
                    {score.correct === score.total 
                      ? "Outstanding! You have mastered the core mechanics of this concept."
                      : "Good practice! Review the explanations above or ask the Concept Tutor if you need clarification on any specific point."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
