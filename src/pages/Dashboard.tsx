import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Welcome</h2>
          <p className="text-gray-600">
            This is your dashboard page. From here you can manage your campaigns and view analytics.
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Recent Activity</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Campaign "Summer Promo" created
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              New user invitation sent
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              File uploaded successfully
            </li>
          </ul>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-700">12</p>
              <p className="text-sm text-gray-600">Active Campaigns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-700">3,487</p>
              <p className="text-sm text-gray-600">Total Subscribers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-700">68%</p>
              <p className="text-sm text-gray-600">Open Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-700">5</p>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 