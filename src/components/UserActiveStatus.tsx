import React, { useState } from 'react';
import type { User } from '../types/auth';
import { userService } from '../services/userService';
import { ToggleRight, ToggleLeft } from 'lucide-react';

interface UpdateUserStatusProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserActiveStatus: React.FC<UpdateUserStatusProps> = ({
  user,
  onSuccess,
  onCancel
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(user.isActive !== false); // Default to true if not specified

  const toggleStatus = () => {
    setIsActive(!isActive);
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      console.log(`Attempting to update user ${user._id} status to: ${isActive ? 'Active' : 'Inactive'}`);
      
      // Call the API to update user status
      const result = await userService.updateUserStatus(user._id, isActive);
      
      console.log('Update status API response:', result);
      
      // Notify parent component of success
      onSuccess();
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      
      // Show more detailed error message if available
      if (error.response?.data?.message) {
        setError(`Error: ${error.response.data.message}`);
      } else {
        setError('Failed to update user status. Please try again.');
      }
      
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`border rounded-lg p-4 ${isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h3 className="text-lg font-medium mb-2">Update User Status</h3>
        <p>
          User: <span className="font-semibold">{user.firstName} {user.lastName}</span>
        </p>
        
        <div className="mt-4 flex items-center">
          <span className="mr-3">Status:</span>
          <button 
            type="button" 
            onClick={toggleStatus}
            className="flex items-center"
          >
            {isActive ? (
              <>
                <ToggleRight className="h-8 w-8 text-green-600 mr-2" />
                <span className="text-green-700 font-medium">Active</span>
              </>
            ) : (
              <>
                <ToggleLeft className="h-8 w-8 text-red-600 mr-2" />
                <span className="text-red-700 font-medium">Inactive</span>
              </>
            )}
          </button>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          {isActive 
            ? "Active users can log in and use the system." 
            : "Inactive users cannot log in or access the system."}
        </p>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          disabled={isUpdating}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleUpdateStatus}
          className={`px-4 py-2 rounded-md text-white transition ${isUpdating 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
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

export default UserActiveStatus;
