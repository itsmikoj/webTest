"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui";
import { changePassword, updateUser } from "@/lib/api/auth/auth.service";
import { UserIcon, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UpdateProfileFormProps {
  onSuccess?: (updatedData: unknown) => void;
}

export function UpdateProfileForm({ onSuccess }: UpdateProfileFormProps) {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    full_name: user?.name || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.full_name) {
      setError("All fields are required");
      return;
    }
    if (formData.full_name.length < 5 || formData.full_name.length > 50) {
      setError("Full name must be between 5 and 50 characters");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      const response = await updateUser({
        email: formData.email,
        full_name: formData.full_name,
        method: "email",
      });
      if (user) {
        setUser({
          ...user,
          email: response.data.email || user.email,
          name: response.data.full_name || user.name,
        });
      }
      onSuccess?.(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        label="Full Name"
        icon={UserIcon}
        value={formData.full_name}
        onChange={(e) =>
          setFormData((p) => ({ ...p, full_name: e.target.value }))
        }
        placeholder="Enter your full name"
        required
        minLength={5}
        maxLength={50}
        error={error && !formData.email ? error : undefined}
      />
      <Input
        label="Email Address"
        icon={Mail}
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((p) => ({ ...p, email: e.target.value.toLowerCase() }))
        }
        placeholder="Enter your email"
        required
      />
      {error && formData.email && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating Profile..." : "Update Profile"}
      </Button>
    </form>
  );
}

export function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match");
      return;
    }
    if (formData.new_password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      onSuccess?.();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <PasswordInput
        label="Current Password"
        icon={Lock}
        value={formData.current_password}
        onChange={(e) =>
          setFormData((p) => ({ ...p, current_password: e.target.value }))
        }
        placeholder="Enter current password"
        required
      />
      <PasswordInput
        label="New Password"
        icon={Lock}
        value={formData.new_password}
        onChange={(e) =>
          setFormData((p) => ({ ...p, new_password: e.target.value }))
        }
        placeholder="Enter new password"
        required
        minLength={6}
      />
      <PasswordInput
        label="Confirm New Password"
        icon={Lock}
        value={formData.confirm_password}
        onChange={(e) =>
          setFormData((p) => ({ ...p, confirm_password: e.target.value }))
        }
        placeholder="Confirm new password"
        required
        minLength={6}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
}
