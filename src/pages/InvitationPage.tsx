import { useEffect, useState } from "react";
import type { ChangeEvent} from "react";
import { Mail, Trash2 } from "lucide-react";
import { invitationService } from "../services/InvitationService";
import { SendInvitation } from "../components/SendInvitation";
import { ModalLayout } from "../modal/ModalLayout";
import { Confirm } from "../components/Confirm";

// Types
interface Invitation {
  _id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
}

interface Role {
  value: string;
  label: string;
}


// Role options


export default function InvitationPage() {
  const [filters, setFilters] = useState({ email: "", status: "", role: "" });
  const [showModal, setShowModal] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [now,setNow] = useState<Date>(new Date());
    const [roleOptions, setRoleOptions] = useState<Role[]>([]);
  

    useEffect(()=>{
        const getInvitations = async()=>{
            const res:any = await invitationService.fetchInvitation();
            setInvitations(res.data)

        }
        const fetchRoles = async () => {
      try {
        
        const rolesFromApi:string[]= await invitationService.getRoles();
        const formattedRoles = rolesFromApi.map(role => ({
          value: role,
          label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
        }));

        setRoleOptions(formattedRoles);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };

         fetchRoles();
        getInvitations()
        setNow(new Date())
        
    },[invitations])


 

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: "delete" | "resend" | null;
    invitationId: string | null;
  }>({ open: false, action: null, invitationId: null });

  const filteredInvitations = invitations.filter(invitation =>
    (!filters.email || invitation.email.toLowerCase().includes(filters.email.toLowerCase())) &&
    (!filters.role || invitation.role === filters.role) &&
    (!filters.status || invitation.status === filters.status)
  );

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  const promptAction = (action: "delete" | "resend", id: string) => {
    setConfirmModal({ open: true, action, invitationId: id });
  };

 

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Invitation Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
        >
          Send Invite
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-wrap gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={filters.email}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 bg-white"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 bg-white"
          >
            <option value="">All Roles</option>
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvitations.length > 0 ? (
              filteredInvitations.map((invitation) => (
                <tr key={invitation._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{invitation.email}</td>
                  <td className="px-6 py-4">{invitation.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invitation.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-400"
                        : invitation.status === "APPROVED"
                        ? "bg-green-100 text-green-800 border border-green-400"
                        : "bg-red-100 text-red-800 border border-red-400"
                    }`}>
                        {invitation.status}

                      
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => promptAction("delete", invitation._id)}
                        className="p-1 hover:bg-red-100 rounded-full text-red-600"
                        title="Delete Invitation"
                      >
                        <Trash2 size={20} />
                      </button>

                      {invitation.status==="EXPIRED" && (
                        <button
                          onClick={() => promptAction("resend", invitation._id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-400 hover:bg-yellow-200 transition"
                          title="Resend Invitation"
                        >
                          <Mail size={16} />
                          Resend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No invitations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* {showModal && renderInviteModal()} */}
      {showModal && <ModalLayout
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Send Invitation"
  icon={<Mail className="w-6 h-6 text-blue-600" />}
>{<SendInvitation setShowModal={setShowModal} />}
</ModalLayout>}
      {/* {confirmModal.open && renderConfirmModal()} */}
       <ModalLayout
  isOpen={confirmModal.open}
  onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
  title={confirmModal.action === "delete" ? "Delete Invitation" : "Resend Invitation"}
  icon={confirmModal.action === "delete" ? <Trash2 className="w-6 h-6 text-blue-600" /> : <Mail className="w-6 h-6 text-blue-600" />}
  maxWidth="max-w-sm"
>
  <Confirm
    invitations={invitations}
    confirmModal={confirmModal}
    setConfirmModal={setConfirmModal}
  />
</ModalLayout>

    </div>
  );
}
