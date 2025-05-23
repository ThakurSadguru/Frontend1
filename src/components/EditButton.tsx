import { Pencil } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

export const EditButton: React.FC<EditButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer ${className}`}
    >
      <Pencil className="w-4 h-4 mr-2" /> Edit
    </button>
  );
}; 