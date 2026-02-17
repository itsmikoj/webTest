"use client";

import { useState } from "react";
import { useThemeSafe } from "@/hooks/useThemeSafe";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ChangePasswordForm,
  UpdateProfileForm,
} from "@/components/forms/AuthForms";
import { Lock, Palette, User as UserIcon, Check } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, isMounted } = useThemeSafe();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "appearance"
  >("profile");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleProfileUpdate = (updatedData: any) => {
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    setActiveTab("security");
    setSuccessMessage("Password changed successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "security"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "appearance"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            Appearance
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Update your personal information
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <UpdateProfileForm onSuccess={handleProfileUpdate} />
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle>Security Settings</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Manage your password and security
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!showChangePassword ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Change your password to keep your account secure
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowChangePassword(true)}
                    variant="outline"
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <ChangePasswordForm onSuccess={handlePasswordChangeSuccess} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <Card padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Customize how the dashboard looks
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Theme
                  </label>
                  {isMounted && (
                    <div className="grid grid-cols-3 gap-3">
                      {(["light", "dark", "system"] as const).map(
                        (themeOption) => (
                          <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={`px-4 py-3 border rounded-lg text-sm font-medium capitalize transition-colors ${
                              theme === themeOption
                                ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}
                          >
                            {themeOption}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
