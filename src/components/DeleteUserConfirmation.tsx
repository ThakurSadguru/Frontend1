import React, { useState } from 'react';
import type { User } from '../types/auth';
import { userService } from '../services/userService';

interface DeleteUserConfirmationProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const DeleteUserConfirmation: React.FC<DeleteUserConfirmationProps> = ({
  user,
  onSuccess,
  onCancel
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await userService.deleteUser(user._id);
      
      // Notify parent component of success
      onSuccess();
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <h3 className="text-lg font-medium mb-2">Confirm Delete</h3>
        <p>
          Are you sure you want to delete user <span className="font-semibold">{user.firstName} {user.lastName}</span>?
        </p>
        <p className="mt-2 text-sm text-red-700">
          This action cannot be undone. All data associated with this user will be permanently removed.
        </p>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className={`px-4 py-2 rounded-md text-white transition ${isDeleting 
            ? 'bg-red-400 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700'}`}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete User'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeleteUserConfirmation;
