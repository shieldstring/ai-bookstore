import React from "react";
import { ClipboardCheck } from "lucide-react";

const CourseAnswerKey = ({ sections = [] }) => {
  const allQuestions = [];

  sections.forEach((section) => {
    section.lessons?.forEach((lesson) => {
      if (lesson.questions?.length) {
        lesson.questions.forEach((q) => {
          allQuestions.push({
            sectionTitle: section.title,
            lessonTitle: lesson.title,
            ...q,
          });
        });
      }
    });
  });

  if (!allQuestions.length) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl p-6 md:p-8 text-white space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-white/10 rounded-lg">
          <ClipboardCheck className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Course Answer Key</h3>
          <p className="text-purple-200 text-sm mt-1">
            Correct answers for all multiple choice questions in this course.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {allQuestions.map((q, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <p className="text-[#D4AF37] text-xxs font-bold uppercase tracking-wider mb-1">
              {q.sectionTitle} · {q.lessonTitle}
            </p>
            <p className="font-semibold text-sm mb-2">{index + 1}. {q.question}</p>
            <p className="text-sm text-purple-100">
              <span className="text-[#D4AF37] font-bold">Answer: </span>
              {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseAnswerKey;
