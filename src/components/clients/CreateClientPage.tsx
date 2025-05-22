import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Plus, X, Loader2 } from 'lucide-react';
import type { Client, Contact } from '../../types/client';
import { createClient } from '../../services/clientservice';
import { countries } from '../../data/countries';

interface CreateClientPageProps {
  onSuccess: (client: Client) => void | Promise<void>;
}

export function CreateClientPage({ onSuccess }: CreateClientPageProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Add a ref to track submission status across re-renders and prevent StrictMode double-calls
  const submissionInProgress = useRef(false);
  
  const [formData, setFormData] = useState({
    clientName: '',
    hqCountry: '',
    clientCode: '',
    clientContactNo: '',
    clientMail: '',
    chatId: '',
  });
  
  const [alternateContacts, setAlternateContacts] = useState<Contact[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Alternate contacts handlers
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
    
    if (submissionInProgress.current) {
      console.log('Submission already in progress, ignoring duplicate call');
      return;
    }
    
    submissionInProgress.current = true;
    setIsSubmitting(true);
    
    try {
      const clientData = {
        clientName: formData.clientName,
        hqCountry: formData.hqCountry,
        clientCode: formData.clientCode,
        clientContactNo: formData.clientContactNo,
        clientMail: formData.clientMail,
        chatId: formData.chatId,
        alternateContacts: alternateContacts.map(contact => ({
          name: contact.name,
          contactNo: contact.contactNo,
          jobTitle: contact.jobTitle
        }))
      };
      
      console.log("Client data being sent:", JSON.stringify(clientData));
      const response = await createClient(clientData);
      console.log("Response received:", response);
      
      if (response.data) {
        const newClient = response.data as Client;
        await onSuccess(newClient);
        setSubmitSuccess(true);
        navigate('/clients');
      }
    } catch (err) {
      console.error('Error creating client:', err);
      submissionInProgress.current = false;
      setIsSubmitting(false);
    } finally {
      if (submissionInProgress.current) {
        setIsSubmitting(false);
        submissionInProgress.current = false;
      }
    }
  };
  
  // Form field components for reuse
  const renderFormFields = () => (
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
          placeholder="Enter client name"
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
          placeholder="Enter client code"
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
          placeholder="Enter contact number"
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
          placeholder="Enter email address"
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
          placeholder="Enter chat ID"
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        />
      </div>
    </div>
  );
  
  // Alternate contacts section component for reuse
  const renderAlternateContacts = () => (
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
                  placeholder="Contact name"
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
                  placeholder="Contact number"
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
                  placeholder="Job title"
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
  );
  
  // Submit button component for reuse
  const renderSubmitButton = () => (
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex items-center px-6 py-3 text-base border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Creating...
        </>
      ) : (
        'Create Client'
      )}
    </button>
  );
  
  // Success message component for reuse
  const renderSuccessMessage = () => (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-green-600 font-medium">
        Client created successfully! Redirecting...
      </p>
    </div>
  );

  return (
    <div className="bg-white p-8 w-full">
      <div className="flex items-center space-x-3 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl text-gray-900 font-semibold">Create New Client</h1>
      </div>
      
      {submitSuccess && renderSuccessMessage()}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFormFields()}
        {renderAlternateContacts()}
        
        <div className="flex justify-end pt-6 border-t border-gray-200 mt-8 mb-10">
          {renderSubmitButton()}
        </div>
      </form>
    </div>
  );
} 