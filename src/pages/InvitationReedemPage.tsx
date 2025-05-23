// AcceptInvitation.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { userService } from "../services/userService";

export default function InvitationReedemPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redeemInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !firstName || !lastName) {
      setError("Fill required credentials");
      return;
    }

    if (password.length < 6) {
      setError("Password length should be greater than 6");
      return;
    }

    if (!token) {
      setError("Invalid or missing token");
      return;
    }

    try {
      const res = await userService.redeemInvitation({
        firstName,
        lastName,
        password,
        token,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to redeem invitation.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-500 text-center p-4">
      <h1 className="text-white text-2xl font-semibold mb-4">Create New User</h1>

      {success && (
        <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
          User successfully created
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={redeemInvitation} className="flex flex-col gap-4 w-[min(300px,90vw)]">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none w-full placeholder-gray-400"
          placeholder="First Name"
          required
        />

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none w-full placeholder-gray-400"
          placeholder="Last Name"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 pr-10 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none w-full placeholder-gray-400"
            placeholder="Enter Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          className="p-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-300"
        >
          Create User
        </button>
      </form>

      {success && (
        <button
          onClick={() => navigate("/login")}
          className="mt-4 p-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition duration-300"
        >
          Go to Login
        </button>
      )}
    </div>
  );
}
