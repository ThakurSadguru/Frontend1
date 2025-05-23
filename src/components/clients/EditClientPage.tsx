import React, { useState, useEffect } from 'react';
import { Pencil, Plus, X, Loader2, Trash2 } from 'lucide-react';
import type { Client, Contact } from '../../types/client';
import { getClientById, updateClient, deleteClient } from '../../services/clientservice';
import { countries } from '../../data/countries';

interface EditClientPageProps {
  clientId: string;
  onSuccess: (client: Client) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function EditClientPage({ clientId, onSuccess, onCancel, onDelete }: EditClientPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    hqCountry: '',
    clientCode: '',
    clientContactNo: '',
    clientMail: '',
    chatId: '',
  });
  
  const [alternateContacts, setAlternateContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await getClientById(clientId);
        if (response.data) {
          const client = response.data;
          setFormData({
            clientName: client.clientName || '',
            hqCountry: client.hqCountry || '',
            clientCode: client.clientCode || '',
            clientContactNo: client.clientContactNo || '',
            clientMail: client.clientMail || '',
            chatId: client.chatId || '',
          });
          setAlternateContacts(client.alternateContacts || []);
        }
      } catch (err) {
        setError('Failed to load client details');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAlternateContact = () => {
    setAlternateContacts(prev => [
      ...prev,
      { name: '', contactNo: '', jobTitle: '' }
    ]);
  };

  const removeAlternateContact = (index: number) => {
    setAlternateContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleAlternateContactChange = (
    index: number, 
    field: keyof Contact, 
    value: string
  ) => {
    setAlternateContacts(prev =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const clientData = {
        ...formData,
        alternateContacts: alternateContacts.map(contact => ({
          name: contact.name,
          contactNo: contact.contactNo,
          jobTitle: contact.jobTitle
        }))
      };
      
      const response = await updateClient(clientId, clientData);
      if (response.data) {
        onSuccess(response.data);
      }
    } catch (err) {
      setError('Failed to update client details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClient(clientId);
      onDelete?.();
    } catch (err) {
      setError('Failed to delete client');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Pencil className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl text-gray-900 font-semibold">Edit Client</h1>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Client</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="hqCountry" className="block text-sm font-medium text-gray-700 mb-1">
              HQ Country
            </label>
            <select
              id="hqCountry"
              name="hqCountry"
              value={formData.hqCountry}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors appearance-none bg-white"
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
            >
              <option value="">Select a country</option>
              {countries.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="clientCode" className="block text-sm font-medium text-gray-700 mb-1">
              Client Code
            </label>
            <input
              type="text"
              id="clientCode"
              name="clientCode"
              value={formData.clientCode}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="clientContactNo" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              id="clientContactNo"
              name="clientContactNo"
              value={formData.clientContactNo}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="clientMail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="clientMail"
              name="clientMail"
              value={formData.clientMail}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="chatId" className="block text-sm font-medium text-gray-700 mb-1">
              Chat ID (Skype/Teams username)
            </label>
            <input
              type="text"
              id="chatId"
              name="chatId"
              value={formData.chatId}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4 mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="block text-sm font-medium text-gray-700">
              Alternate Contacts
            </div>
            <button
              type="button"
              onClick={addAlternateContact}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Contact
            </button>
          </div>
          
          <div className="space-y-4">
            {alternateContacts.map((contact, index) => (
              <div key={index} className="relative p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
                <button
                  type="button"
                  onClick={() => removeAlternateContact(index)}
                  disabled={isSubmitting}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`contact-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id={`contact-name-${index}`}
                      value={contact.name}
                      onChange={(e) =>
                        handleAlternateContactChange(index, 'name', e.target.value)
                      }
                      disabled={isSubmitting}
                      className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor={`contact-number-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id={`contact-number-${index}`}
                      value={contact.contactNo}
                      onChange={(e) =>
                        handleAlternateContactChange(index, 'contactNo', e.target.value)
                      }
                      disabled={isSubmitting}
                      className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor={`contact-job-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id={`contact-job-${index}`}
                      value={contact.jobTitle}
                      onChange={(e) =>
                        handleAlternateContactChange(index, 'jobTitle', e.target.value)
                      }
                      disabled={isSubmitting}
                      className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {alternateContacts.length === 0 && (
            <div className="text-center p-6 text-gray-500 italic text-sm mt-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              No alternate contacts added yet. Click the "Add Contact" button to add contacts.
            </div>
          )}
        </div>
        
        <div className="flex justify-between space-x-3 pt-6 border-t border-gray-200 mt-8">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Client
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 text-base border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 