"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title = "Xác nhận hành động",
  description,
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-2xl shadow-xl overflow-hidden p-5 sm:p-6 text-center space-y-3.5 sm:space-y-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shrink-0">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-1.5 sm:pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition font-semibold"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="w-full py-2.5 text-xs text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition font-semibold flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Đồng ý xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
