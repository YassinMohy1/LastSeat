'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      text: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      text: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      text: 'text-blue-800'
    }
  };

  const { bg, border, icon, text } = config[type];

  return (
    <div
      className={`${bg} ${border} border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px] max-w-md animate-slideIn`}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <p className={`${text} flex-1 text-sm font-medium leading-relaxed`}>{message}</p>
      <button
        onClick={onClose}
        className={`${text} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
