
// import { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import type { User } from "../types/user";


// interface EditUserModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     user: User | null;
//     onSave: (updatedUser: User) => void;
//   }

// const EditUserModal: React.FC<EditUserModalProps> = ({ user,onSave}) => {
//     const [formData, setFormData] = useState({
//       firstName: '',
//       lastName: '',
//       role: '',
//     });
  
//     useEffect(() => {
//       if (user) {
//         setFormData({
//           firstName: user.firstName,
//           lastName: user.lastName,
//           role: user.role,
//         });
//       }
//     }, [user]);
  
//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       if (user) {
//         onSave({
//           ...user,
//           ...formData,
//         });
//       }
//     };
  
//     if (!isOpen || !user) return null;
  
//     return (
//       <div 
//         className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 overflow-y-auto mt-16"
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//       >
//         <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden relative animate-scale-in my-auto">
//           {/* Header with gradient background */}
//           <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4 sticky top-0 z-20">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <Edit className="w-6 h-6 text-blue-600" />
//                 <h1 className="text-xl font-semibold text-gray-800">Edit User</h1>
//               </div>
//               <button 
//                 onClick={onClose}
//                 className="text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-200 fixed right-4 top-4 z-30"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>
  
//           <div className="p-8 overflow-y-auto rounded-b-lg custom-scrollbar" style={{ maxHeight: "calc(80vh - 60px)" }}>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.firstName}
//                     onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                     className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
//                     required
//                   />
//                 </div>
  
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.lastName}
//                     onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                     className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
//                     required
//                   />
//                 </div>
  
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Role
//                   </label>
//                   <select
//                     value={formData.role}
//                     onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                     className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors appearance-none bg-white"
//                     style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
//                     required
//                   >
//                     {roleOptions.filter(option => option.value !== "").map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
  
//               <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (window.confirm('Are you sure you want to delete this user?')) {
//                       // Handle delete
//                       onClose();
//                     }
//                   }}
//                   className="px-4 py-2 text-red-600 hover:text-red-800 font-medium transition-colors"
//                 >
//                   Delete User
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (window.confirm('Are you sure you want to deactivate this user?')) {
//                       // Handle deactivate
//                       onClose();
//                     }
//                   }}
//                   className="px-4 py-2 text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
//                 >
//                   Deactivate User
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-3 text-base border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   };
  