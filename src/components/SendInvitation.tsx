import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { invitationPropType } from '../types/invitation';
import { invitationService } from '../services/InvitationService'; // add this
const roleOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "CO_ADMIN", label: "Co Admin" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "DESIGNER", label: "Designer" },
];
export const SendInvitation:React.FC<invitationPropType>  =  (
    {
     setShowModal
    }
) => {
    const [formState, setFormState] = useState({
        email: "",
        role: "USER",
        isSubmitting: false,
        submitSuccess: false,
        error: "",
        isSubmitted: false
      });
      const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          setFormState({ ...formState, [e.target.name]: e.target.value });
        };
      
        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const { email, role } = formState;
      
          if (!email) {
            setFormState(prev => ({ ...prev, error: "Please fill in all required fields" }));
            return;
          }
      
          setFormState(prev => ({ ...prev, isSubmitting: true, error: "" }));
      try {
          
              const res:any = await invitationService.sendInvitation({email,role})
              if(res.success){
                  setFormState(prev => ({ ...prev, isSubmitting: true,isSubmitted: true, submitSuccess: true,error: "" }));
              }else{
                  setFormState(prev => ({ ...prev, isSubmitting: true,isSubmitted: true, error: res.message}));
              }
              setTimeout(() => {
               setFormState({email:"",role:"USER",isSubmitting:false,submitSuccess:false,error:"",isSubmitted:false})
                setShowModal(false)
              }, 1000);
              } catch (error) {
          console.log(error)
      }
        };
  return (
    <div>
          
            <div className="bg-white  rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden relative animate-scale-in">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4 sticky top-0 z-20">
               
              </div>
              <div className="p-8 overflow-y-auto rounded-b-lg custom-scrollbar" style={{ maxHeight: "calc(80vh - 60px)" }}>
                {formState.submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 font-medium">Invitation sent successfully!</p>
                  </div>
                )}
      
                {formState.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 font-medium">{formState.error}</p>
                  </div>
                )}
      
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleFormChange}
                        disabled={formState.isSubmitting}
                        className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        id="role"
                        name="role"
                        value={formState.role}
                        onChange={handleFormChange}
                        disabled={formState.isSubmitting}
                        className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 bg-white"
                      >
                        {roleOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-6 border-t border-gray-200 mt-8 mb-4">
                    <button
                      type="submit"
                      disabled={formState.isSubmitting}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {formState.isSubmitting ? "Sending..." : "Send Invitation"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          
    </div>
  )
}
