import React from "react";
import { Plus, Trash2 } from "lucide-react";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

const LessonQuizEditor = ({ questions = [], onChange }) => {
  const addQuestion = () => {
    onChange([...questions, emptyQuestion()]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    onChange(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q;
      const options = [...q.options];
      options[oIndex] = value;
      return { ...q, options };
    });
    onChange(updated);
  };

  const removeQuestion = (index) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="md:col-span-2 border border-purple-100 rounded-lg p-3 bg-purple-50/30 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xxs font-bold text-purple-800 uppercase tracking-wider">
          Multiple Choice Questions (optional)
        </p>
        <button
          type="button"
          onClick={addQuestion}
          className="inline-flex items-center gap-1 text-xxs font-semibold text-purple-700 hover:text-purple-900"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Question
        </button>
      </div>

      {questions.length === 0 && (
        <p className="text-xxs text-slate-500 italic">
          Add quiz questions for this lesson. Correct answers can be revealed to students at the end of the course.
        </p>
      )}

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xxs focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((opt, oIndex) => (
              <input
                key={oIndex}
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                value={opt}
                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded text-xxs focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xxs text-slate-600 font-medium">Correct answer:</label>
            <select
              value={q.correctIndex}
              onChange={(e) => updateQuestion(qIndex, "correctIndex", parseInt(e.target.value, 10))}
              className="px-2 py-1 border border-slate-200 rounded text-xxs bg-white"
            >
              {q.options.map((opt, oIndex) => (
                <option key={oIndex} value={oIndex}>
                  {String.fromCharCode(65 + oIndex)} — {opt || `Option ${oIndex + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonQuizEditor;
