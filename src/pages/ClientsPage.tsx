import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import { CreateClientPage } from '../components/clients/CreateClientPage';
import { getClients } from '../services/clientservice';
import type { Client } from '../types/client';
import { ModalLayout } from '../modal/ModalLayout';


export function ClientsPage() {
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClients();
      if (Array.isArray(response.data)) {
        setClients(response.data as Client[]);
      }
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      if (err?.response?.status === 401) {
        // Let the AuthLayout handle the redirect
        return;
      }
      setError('Failed to fetch clients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddNewClient = (newClient: Client) => {
    // Add the new client to the beginning of the list
    setClients(prevClients => [newClient, ...prevClients]);
    setShowCreateClientModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading clients...</div>
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
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        </div>
        <button
          onClick={() => setShowCreateClientModal(true)}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Create Client
        </button>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Contact</th>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {clients.map((client, index) => (
              <tr 
                key={client._id || `client-${index}`} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 text-sm">
                  <Link 
                    to={`/clients/${client._id || ''}`} 
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {client.clientName}
                  </Link>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {client.hqCountry || 'N/A'}
                </td>
                <td className="px-4 py-4 text-sm">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {client.clientCode || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {client.clientMail || 'N/A'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {client.clientContactNo || 'N/A'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {clients.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new client.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateClientModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Client
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {showCreateClientModal && (
    <ModalLayout
      isOpen={true}
      onClose={() => setShowCreateClientModal(false)}
      title="Create Client"
      icon={<Building className="w-6 h-6 text-blue-600" />}
    >
      <CreateClientPage onSuccess={handleAddNewClient} />
    </ModalLayout>
  )}
    </div>
  );
}