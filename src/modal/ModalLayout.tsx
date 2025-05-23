import React from 'react';
import { X } from 'lucide-react';

interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = 'max-w-3xl'
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 overflow-y-auto mt-16"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white shadow-xl rounded-lg w-full ${maxWidth} relative animate-scale-in my-auto`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon}
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};