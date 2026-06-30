import React, { useState } from "react";
import { CheckCircle, XCircle, HelpCircle, ClipboardCheck } from "lucide-react";

const CourseQuiz = ({ questions = [], lessonTitle, showAnswerKey = false }) => {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(showAnswerKey);

  if (!questions.length) return null;

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted || revealed) return;
    setSelections((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = questions.reduce((acc, q, i) => {
    return acc + (selections[i] === q.correctIndex ? 1 : 0);
  }, 0);

  const allAnswered = questions.every((_, i) => selections[i] !== undefined);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xxs space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <HelpCircle className="h-5 w-5 text-purple-700" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">
            {lessonTitle ? `Quiz: ${lessonTitle}` : "Multiple Choice Questions"}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Select the best answer for each question. Submit to check your score, or view the answer key when you're ready.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selected = selections[qIndex];
          const isCorrect = selected === q.correctIndex;
          const showResult = submitted || revealed;

          return (
            <div key={qIndex} className="border border-slate-150 rounded-xl p-4 space-y-3">
              <p className="font-semibold text-slate-800 text-sm">
                {qIndex + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => {
                  const isSelected = selected === oIndex;
                  const isCorrectOption = q.correctIndex === oIndex;
                  let optionClass =
                    "border-slate-200 hover:border-purple-300 hover:bg-purple-50/50";

                  if (showResult) {
                    if (isCorrectOption) {
                      optionClass = "border-emerald-400 bg-emerald-50 text-emerald-900";
                    } else if (isSelected && !isCorrectOption) {
                      optionClass = "border-red-300 bg-red-50 text-red-900";
                    } else {
                      optionClass = "border-slate-200 opacity-60";
                    }
                  } else if (isSelected) {
                    optionClass = "border-purple-500 bg-purple-50 text-purple-900";
                  }

                  return (
                    <button
                      key={oIndex}
                      type="button"
                      onClick={() => handleSelect(qIndex, oIndex)}
                      disabled={showResult}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-2 ${optionClass} ${
                        showResult ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span className="font-bold text-xs uppercase w-5 shrink-0">
                        {String.fromCharCode(65 + oIndex)}.
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrectOption && (
                        <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrectOption && (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <p className={`text-xs font-medium ${isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                  {isCorrect
                    ? "Correct!"
                    : `Incorrect. The correct answer is ${String.fromCharCode(65 + q.correctIndex)}.`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
        {!submitted && !revealed && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg disabled:opacity-40 transition"
          >
            Submit Answers
          </button>
        )}
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition inline-flex items-center gap-1.5"
          >
            <ClipboardCheck className="h-4 w-4" />
            View Answer Key
          </button>
        )}
        {submitted && !revealed && (
          <p className="text-sm font-semibold text-purple-700 self-center">
            Score: {score} / {questions.length}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseQuiz;
