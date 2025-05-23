import React, { useState } from 'react';
import { invitationService } from '../services/InvitationService';
import type { Invitation } from '../types/invitation';

interface ConfirmProps {
  invitations: Invitation[];
  confirmModal: {
    open: boolean;
    action: 'delete' | 'resend' | null;
    invitationId: string | null;
  };
  setConfirmModal: React.Dispatch<React.SetStateAction<{
    open: boolean;
    action: 'delete' | 'resend' | null;
    invitationId: string | null;
  }>>;
}

export const Confirm: React.FC<ConfirmProps> = ({
  invitations,
  confirmModal,
  setConfirmModal
}) => {
  const [message, setMessage] = useState<string | null>(null);

  const handleConfirmAction = async () => {
    if (!confirmModal.invitationId || !confirmModal.action) return;

    const invitation = invitations.find(field => field._id === confirmModal.invitationId);
    if (!invitation) {
      setMessage("Invitation not found");
      return;
    }

    try {
      let res;

      if (confirmModal.action === 'delete') {
        res = await invitationService.deleteInvitation(invitation.email);
      } else if (confirmModal.action === 'resend') {
        res = await invitationService.reSendInvitation(invitation.email);
      }

      if (res?.success) {
        setMessage(res.message || "Operation successful");

        // Option 1: Auto close after 2 seconds
        setTimeout(() => {
          setConfirmModal({ open: false, action: null, invitationId: null });
          setMessage(null);
        }, 2000);

      } else {
        setMessage(res?.message || "Operation failed");
        setTimeout(() => {
          setConfirmModal({ open: false, action: null, invitationId: null });
          setMessage(null);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong, please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg max-w-sm p-6 text-center">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        {confirmModal.action === 'delete' ? 'Delete Invitation' : 'Resend Invitation'}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to {confirmModal.action} this invitation?
      </p>

      {message && (
        <p className="mb-4 text-sm text-center text-blue-600">{message}</p>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setConfirmModal({ open: false, action: null, invitationId: null });
            setMessage(null);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          disabled={!!message} // optionally disable while showing message
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmAction}
          className={`px-4 py-2 rounded text-white ${
            confirmModal.action === 'delete'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
          disabled={!!message} // disable to prevent multiple clicks
        >
         {!message?"Confirm":"Processed"}
        </button>
      </div>
    </div>
  );
};
