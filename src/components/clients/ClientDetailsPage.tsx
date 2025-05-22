import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { clientService } from '../../services/clientservice';
import { type Client } from '../../types/client';
import { 
  Mail, Phone, Globe, Hash, Users, MessageSquare, 
  Calendar, Clipboard, Pencil, 
} from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useAuth } from '../../contexts/AuthContext';
import { ModalLayout } from '../../Modal/ModalLayout';
import { EditButton } from '../EditButton';

export function ClientDetailsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const { user } = useAuth();

  // Only allow editing if the user is admin - case insensitive check
  const isEditAllowed = user && user.role.toUpperCase() === "ADMIN";

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await clientService.getClient(clientId!);
        setClient(response.data);
        setEditedClient(response.data); // Initialize edited client state
      } catch (err) {
        setError('Failed to load client details');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedClient(client); // Reset changes
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedClient((prev) => ({
      ...prev!,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveClick = async () => {
    if (editedClient) {
      try {
        await clientService.updateClient(clientId!, editedClient);
        setClient(editedClient);
        setIsEditing(false);
      } catch (err) {
        setError('Failed to update client details');
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading client details...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{client?.clientName}</h2>
          <p className="text-gray-500 text-sm">Below are the client details</p>
        </div>
        {/* Render Edit button only if editing is allowed (i.e. user is admin) */}
        {isEditAllowed && (
          <EditButton onClick={handleEditClick} />
        )}
      </div>

      {/* Client ID */}
      <div className="mb-6 flex items-center space-x-3">
        <Clipboard className="w-5 h-5 text-gray-500" />
        <p className="text-gray-700">
          <strong>Client ID:</strong> {clientId}
        </p>
      </div>

      {/* Client Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Email', name: 'clientMail', icon: <Mail className="w-5 h-5 text-blue-500" /> },
          { label: 'Contact', name: 'clientContactNo', icon: <Phone className="w-5 h-5 text-green-500" /> },
          { label: 'HQ Country', name: 'hqCountry', icon: <Globe className="w-5 h-5 text-indigo-500" /> },
          { label: 'Client Code', name: 'clientCode', icon: <Hash className="w-5 h-5 text-gray-500" /> },
          { label: 'Chat ID', name: 'chatId', icon: <MessageSquare className="w-5 h-5 text-orange-500" /> },
        ].map(({ label, name, icon }) => (
          <div key={name} className="flex items-center space-x-3">
            {icon}
            <p className="text-gray-700">
              <strong>{label}:</strong>{' '}
              {(() => {
                const value = client?.[name as keyof Client];
                if (value instanceof Date) {
                  return value.toLocaleDateString();
                }
                if (Array.isArray(value)) {
                  return value.join(', ');
                }
                return value?.toString() || 'N/A';
              })()}
            </p>
          </div>
        ))}

        {/* Created At (Read-Only) */}
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-red-500" />
          <p className="text-gray-700">
            <strong>Created At:</strong>{' '}
            {client?.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        {/* Alternate Contacts */}
        <div className="col-span-2">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-purple-500 inline-block mr-2" />
            <h3 className="text-lg font-bold inline-block">Alternate Contacts</h3>
          </div>
          <div className="mt-4 space-y-4">
            {client?.alternateContacts && client.alternateContacts.length > 0 ? (
              client.alternateContacts.map((contact, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <p><strong>Name:</strong> {contact.name}</p>
                  <p><strong>Contact No:</strong> {contact.contactNo}</p>
                  <p><strong>Job Title:</strong> {contact.jobTitle}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ModalLayout
        isOpen={isEditing}
        onClose={handleCancelClick}
        title="Edit Client Details"
        icon={<Pencil className="w-6 h-6 text-blue-500" />}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Email', name: 'clientMail', icon: <Mail className="w-5 h-5 text-blue-500" /> },
              { label: 'Contact', name: 'clientContactNo', icon: <Phone className="w-5 h-5 text-green-500" /> },
              { label: 'HQ Country', name: 'hqCountry', icon: <Globe className="w-5 h-5 text-indigo-500" /> },
              { label: 'Client Code', name: 'clientCode', icon: <Hash className="w-5 h-5 text-gray-500" /> },
              { label: 'Chat ID', name: 'chatId', icon: <MessageSquare className="w-5 h-5 text-orange-500" /> },
            ].map(({ label, name, icon }) => (
              <div key={name} className="flex items-center space-x-3">
                {icon}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={(() => {
                      const value = editedClient?.[name as keyof Client];
                      if (value instanceof Date) {
                        return value.toLocaleDateString();
                      }
                      if (Array.isArray(value)) {
                        return value.join(', ');
                      }
                      return value?.toString() || '';
                    })()}
                    onChange={handleChange}
                    className="border p-2 rounded-md w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Alternate Contacts Section */}
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-bold">Alternate Contacts</h3>
            </div>
            <div className="space-y-4">
              {editedClient?.alternateContacts?.map((contact, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => {
                          const updatedContacts = [...(editedClient?.alternateContacts || [])];
                          updatedContacts[index] = { ...updatedContacts[index], name: e.target.value };
                          setEditedClient(prev => prev ? { ...prev, alternateContacts: updatedContacts } : prev);
                        }}
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={contact.contactNo}
                        onChange={(value) => {
                          const updatedContacts = [...(editedClient?.alternateContacts || [])];
                          updatedContacts[index] = { ...updatedContacts[index], contactNo: value || '' };
                          setEditedClient(prev => prev ? { ...prev, alternateContacts: updatedContacts } : prev);
                        }}
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={contact.jobTitle}
                        onChange={(e) => {
                          const updatedContacts = [...(editedClient?.alternateContacts || [])];
                          updatedContacts[index] = { ...updatedContacts[index], jobTitle: e.target.value };
                          setEditedClient(prev => prev ? { ...prev, alternateContacts: updatedContacts } : prev);
                        }}
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const updatedContacts = [...(editedClient?.alternateContacts || [])];
                  updatedContacts.push({ name: '', contactNo: '', jobTitle: '' });
                  setEditedClient(prev => prev ? { ...prev, alternateContacts: updatedContacts } : prev);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Alternate Contact
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </ModalLayout>
    </div>
  );
}
