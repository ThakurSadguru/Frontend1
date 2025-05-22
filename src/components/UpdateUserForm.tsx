import React, { useState } from 'react';
import type { User } from '../types/auth';
import type { RoleOption } from '../types/user';
import { userService } from '../services/userService';

interface UpdateUserFormProps {
  user: User;
  roleOptions: RoleOption[];
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  user,
  roleOptions,
  onSuccess,
  onCancel
}) => {
  const [updateForm, setUpdateForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await userService.updateUser(user._id, updateForm);
      setUpdateSuccess(true);
      
      // Notify parent component of success
      onSuccess();
      
      // Close form after successful update with a short delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpdateSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={updateForm.firstName}
              onChange={handleUpdateFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={updateForm.lastName}
              onChange={handleUpdateFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={updateForm.email}
            onChange={handleUpdateFormChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={updateForm.role}
            onChange={handleUpdateFormChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a role</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white transition ${isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
      
      {updateSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          User updated successfully!
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default UpdateUserForm;
