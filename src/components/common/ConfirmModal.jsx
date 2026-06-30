import React from "react";
import { AlertTriangle, Trash2, Info, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
}) {
  if (!isOpen) return null;

  const iconMap = {
    danger: (
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
        <Trash2 className="h-6 w-6" />
      </div>
    ),
    warning: (
      <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6" />
      </div>
    ),
    info: (
      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
        <Info className="h-6 w-6" />
      </div>
    ),
  };

  const confirmBtnClasses = {
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    warning: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500",
    info: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glass backdrop blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onCancel}
      ></div>

      {/* Modal card container */}
      <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100/50 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-250 z-10">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="pb-1">{iconMap[type] || iconMap.danger}</div>

        {/* Text */}
        <div className="space-y-1.5 w-full">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto font-medium">
            {message}
          </p>
        </div>

        {/* Buttons layout */}
        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition duration-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 font-bold rounded-xl shadow-xs transition duration-200 text-xs focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${confirmBtnClasses[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
