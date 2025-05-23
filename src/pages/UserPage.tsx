import React, { useEffect, useState } from "react";
import { Edit, Shield, UserIcon, ToggleRight, ToggleLeft } from "lucide-react";
import { type User } from "../types/auth";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";
import type { RoleOption } from "../types/user";
import { useNavigate } from "react-router-dom";
import { ModalLayout } from "../modal/ModalLayout";
import UpdateUserForm from "../components/UpdateUser";
import UpdateUserStatus from "../components/UserActiveStatus";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchRoleOptions();
    } else {
      navigate("/");
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res: any = await userService.getUsers();

      setAllUsers(res.data);
      setUsers(res.data);

      // Apply existing filters
      if (
        filters.firstName ||
        filters.lastName ||
        filters.email ||
        filters.role
      ) {
        applyFilters();
      }
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleOptions = async () => {
    const res: any = await userService.getRoleOptions();

    setRoleOptions(res.data.map((item: any) => ({ value: item, label: item })));
  };

  const handleEditUser = (userId: string) => {
    console.log(userId);
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateSuccess = () => {
    // Refresh the users list to show updated data
    fetchUsers();

    // Close modal after successful update with a short delay
    setTimeout(() => {
      setIsEditModalOpen(false);
    }, 1500);
  };

  const handleUpdateStatus = (userId: string) => {
    console.log(`Preparing to update status for user: ${userId}`);
    const user = users.find((u) => u._id === userId);
    if (user) {
      console.log("Found user for status update:", user);
      console.log("Current isActive status:", user.isActive);
      setSelectedUser(user);
      setIsStatusModalOpen(true);
    } else {
      console.error("User not found for ID:", userId);
    }
  };

  const handleStatusUpdateSuccess = () => {
    // Refresh the users list to show updated data
    fetchUsers();

    // Close modal immediately after successful status update
    setIsStatusModalOpen(false);

    // Show a temporary success message (you could add state for this if desired)
    console.log("User status updated successfully");
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    // If role filter changes, apply it immediately
    if (name === "role") {
      applyFilters({ ...filters, role: value });
    }
  };

  // Apply filters to the allUsers array
  const applyFilters = (currentFilters = filters) => {
    // Apply filters to allUsers
    let filteredUsers = [...allUsers];

    if (currentFilters.firstName) {
      filteredUsers = filteredUsers.filter((u) =>
        u.firstName
          .toLowerCase()
          .includes(currentFilters.firstName.toLowerCase())
      );
    }

    if (currentFilters.lastName) {
      filteredUsers = filteredUsers.filter((u) =>
        u.lastName.toLowerCase().includes(currentFilters.lastName.toLowerCase())
      );
    }

    if (currentFilters.email) {
      filteredUsers = filteredUsers.filter((u) =>
        u.email.toLowerCase().includes(currentFilters.email.toLowerCase())
      );
    }

    if (currentFilters.role) {
      filteredUsers = filteredUsers.filter(
        (u) => u.role === currentFilters.role
      );
    }

    setUsers(filteredUsers);

    // Handle pagination
    const itemsPerPage = 10;
    setTotalPages(Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage)));
    setCurrentPage(1);
  };

  // Handle pagination
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return users.slice(startIndex, endIndex);
  };

  const handleRoleFilter = (role: string) => {
    setFilters({ ...filters, role });
    applyFilters({ ...filters, role });
  };

  const handleSearchClick = () => {
    applyFilters();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          User Management
        </h1>
        {!isAdmin && (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">
              Admin access required for user management actions
            </span>
          </div>
        )}
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={filters.firstName}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={filters.lastName}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={filters.email}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearchClick}
            className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-full font-semibold shadow hover:from-gray-700 hover:to-gray-600 transition transform active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      {/* Role Filter Buttons */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Quick Filter by Role:
        </h3>
        <div className="flex flex-wrap gap-2">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleRoleFilter(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                filters.role === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        /* Users Table */
        <div className="flex-1 overflow-auto bg-white rounded-lg shadow">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      First Name
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      Last Name
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      Role
                    </th>
                    <th className="px-6 py-4 text-right text-white uppercase text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageUsers().length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No users found matching your filters
                      </td>
                    </tr>
                  ) : (
                    getCurrentPageUsers().map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-500">{u._id}</td>
                        <td className="px-6 py-4 text-gray-800">
                          {u.firstName}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {u.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800 border border-purple-400"
                                : u.role === "CO_ADMIN"
                                ? "bg-blue-100 text-blue-800 border border-blue-400"
                                : u.role === "SUPERVISOR"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-400"
                                : u.role === "DESIGNER"
                                ? "bg-pink-100 text-pink-800 border border-pink-400"
                                : "bg-green-100 text-green-800 border border-green-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            {isAdmin ? (
                              <>
                                <button
                                  onClick={() => handleEditUser(u._id)}
                                  className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                  title="Edit user"
                                >
                                  <Edit className="h-6 w-6" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(u._id)}
                                  className={`${
                                    u.isActive !== false
                                      ? "text-green-600 hover:text-green-800"
                                      : "text-red-600 hover:text-red-800"
                                  } inline-flex items-center`}
                                  title="Toggle user status"
                                >
                                  {u.isActive !== false ? (
                                    <>
                                      <ToggleRight className="h-6 w-6" />
                                      <span className="sr-only">Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft className="h-6 w-6" />
                                      <span className="sr-only">Inactive</span>
                                    </>
                                  )}
                                </button>
                              </>
                            ) : (
                              <span
                                className="text-gray-400 cursor-not-allowed"
                                title="Admin access required"
                              >
                                <Edit className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &larr; Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-md border text-sm font-medium transition ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      <ModalLayout
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        icon={<UserIcon className="h-5 w-5 text-blue-600" />}
      >
        {selectedUser && (
          <UpdateUserForm
            user={selectedUser}
            roleOptions={roleOptions}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </ModalLayout>

      {/* Update User Status Modal */}
      <ModalLayout
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update User Status"
        icon={<UserIcon className="h-5 w-5 text-blue-600" />}
        maxWidth="max-w-lg"
      >
        {selectedUser && (
          <UpdateUserStatus
            user={selectedUser}
            onSuccess={handleStatusUpdateSuccess}
            onCancel={() => setIsStatusModalOpen(false)}
          />
        )}
      </ModalLayout>
    </div>
  );
}
