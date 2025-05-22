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
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 overflow-y-auto mt-16"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white shadow-xl rounded-lg w-full ${maxWidth} max-h-[80vh] overflow-hidden relative animate-scale-in my-auto`}>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon}
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-200 fixed right-4 top-4 z-30"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto rounded-b-lg custom-scrollbar" style={{ maxHeight: "calc(80vh - 60px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}; 