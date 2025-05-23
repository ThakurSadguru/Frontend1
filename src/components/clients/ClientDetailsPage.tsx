import { useEffect, useState } from 'react';
import { 
  Mail, Phone, Globe, Hash, Users, MessageSquare, 
  Calendar, Clipboard, Building, ArrowLeft, Pencil
} from 'lucide-react';
import { getClientById } from '../../services/clientservice';
import type { Client } from '../../types/client';
import { useNavigate, useParams } from 'react-router-dom';
import { EditClientPage } from './EditClientPage';
import { ModalLayout } from '../../modal/ModalLayout';

export function ClientDetailsPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { clientId } = useParams();

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!clientId) {
        setError('Client ID is required');
        setLoading(false);
        return;
      }

      try {
        const response = await getClientById(clientId);
        if (response.data) {
          setClient(response.data);
        }
      } catch (err) {
        setError('Failed to load client details');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 max-w-md">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={() => navigate('/clients')}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/clients')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Clients
          </button>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{client?.clientName}</h2>
                  <p className="text-gray-500 text-sm mt-1">Client Information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Client
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Email', name: 'clientMail', icon: <Mail className="w-5 h-5 text-blue-500" /> },
                  { label: 'Contact', name: 'clientContactNo', icon: <Phone className="w-5 h-5 text-green-500" /> },
                  { label: 'HQ Country', name: 'hqCountry', icon: <Globe className="w-5 h-5 text-indigo-500" /> },
                  { label: 'Client Code', name: 'clientCode', icon: <Hash className="w-5 h-5 text-gray-500" /> },
                  { label: 'Chat ID', name: 'chatId', icon: <MessageSquare className="w-5 h-5 text-orange-500" /> },
                ].map(({ label, name, icon }) => (
                  <div key={name} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{label}</p>
                      <p className="mt-1 text-gray-900">
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
                  </div>
                ))}
              </div>
            </div>

            {/* Alternate Contacts Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Alternate Contacts</h3>
                </div>
              </div>
              <div className="space-y-4">
                {client?.alternateContacts && client.alternateContacts.length > 0 ? (
                  client.alternateContacts.map((contact, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Name</p>
                          <p className="mt-1 text-gray-900">{contact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Contact Number</p>
                          <p className="mt-1 text-gray-900">{contact.contactNo}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Job Title</p>
                          <p className="mt-1 text-gray-900">{contact.jobTitle}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-500">No alternate contacts available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Information Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Clipboard className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Client ID</p>
                    <p className="mt-1 text-gray-900 break-all">{clientId}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created At</p>
                    <p className="mt-1 text-gray-900">
                      {client?.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ModalLayout
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Client"
        icon={<Pencil className="w-6 h-6 text-blue-600" />}
      >
        {client && (
          <EditClientPage
            clientId={clientId!}
            onSuccess={(updatedClient) => {
              setClient(updatedClient);
              setIsEditModalOpen(false);
            }}
            onCancel={() => setIsEditModalOpen(false)}
            onDelete={() => {
              setIsEditModalOpen(false);
              navigate('/clients');
            }}
          />
        )}
      </ModalLayout>
    </div>
  );
} 