'use client';

import { useEffect } from 'react';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
}

export default function ContentModal({ isOpen, onClose, title, subtitle, icon, children }: ContentModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[85vh] sm:max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl border border-slate-200/80 overflow-hidden">
        <div className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-slate-200/80 bg-slate-50/80">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center text-xl flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="content-modal-title" className="font-bold text-primary-dark text-lg truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-primary-dark/70 truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-primary-dark/70 hover:bg-slate-200/80 hover:text-primary-dark transition-colors touch-manipulation"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
