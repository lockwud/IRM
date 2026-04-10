"use client";
import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  department: string;
  role: string;
  notifyEmail: boolean;
  notifySMS: boolean;
  theme: "light" | "dark";
  language: string;
  timezone: string;
  twoFAEnabled: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    firstName: "Kwame",
    lastName: "Asante",
    email: "kwame@usted.edu.gh",
    phone: "+233 24 123 4567",
    school: "USTED",
    department: "Information Technology",
    role: "Student Intern",
    notifyEmail: true,
    notifySMS: false,
    theme: "light",
    language: "English",
    timezone: "GMT",
    twoFAEnabled: false,
  });

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "notifications" | "app" | "privacy">("profile");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile Settings" },
    { id: "account", label: "Account Settings" },
    { id: "notifications", label: "Notifications" },
    { id: "app", label: "App Settings" },
    { id: "privacy", label: "Data & Privacy" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-irm-text">Settings</h1>
        <p className="text-irm-text-secondary mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <Card className="p-0 border-b border-irm-border">
        <div className="flex flex-wrap overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-aamusted-gold text-irm-primary"
                  : "border-transparent text-irm-text-secondary hover:text-irm-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-irm-text mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={settings.firstName}
                  onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={settings.lastName}
                  onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                />
              </div>
              <Input
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="School"
                  value={settings.school}
                  onChange={(e) => setSettings({ ...settings, school: e.target.value })}
                />
                <Input
                  label="Department"
                  value={settings.department}
                  onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                />
              </div>
              <div className="pt-4">
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          {saved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✓ Settings saved successfully</p>
            </div>
          )}
        </div>
      )}

      {/* Account Settings */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-irm-text mb-6">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 p-4 border border-irm-border rounded-lg hover:bg-irm-bg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFAEnabled}
                    onChange={(e) => setSettings({ ...settings, twoFAEnabled: e.target.checked })}
                    className="rounded border-irm-input-border text-irm-primary focus:ring-aamusted-gold"
                  />
                  <div>
                    <p className="font-medium text-irm-text">Two-Factor Authentication</p>
                    <p className="text-sm text-irm-text-secondary">Add an extra layer of security to your account</p>
                  </div>
                </label>
              </div>
              <div className="pt-4">
                <Button variant="outline">
                  Change Password
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h2>
            <p className="text-sm text-red-700 mb-4">
              These actions cannot be undone. Please proceed with caution.
            </p>
            <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-irm-text mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border border-irm-border rounded-lg hover:bg-irm-bg cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyEmail}
                onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.checked })}
                className="rounded border-irm-input-border text-irm-primary focus:ring-aamusted-gold"
              />
              <div>
                <p className="font-medium text-irm-text">Email Notifications</p>
                <p className="text-sm text-irm-text-secondary">Receive updates about lessons and submissions</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-irm-border rounded-lg hover:bg-irm-bg cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifySMS}
                onChange={(e) => setSettings({ ...settings, notifySMS: e.target.checked })}
                className="rounded border-irm-input-border text-irm-primary focus:ring-aamusted-gold"
              />
              <div>
                <p className="font-medium text-irm-text">SMS Notifications</p>
                <p className="text-sm text-irm-text-secondary">Get critical alerts via SMS</p>
              </div>
            </label>
            <div className="pt-4">
              <Button variant="primary" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* App Settings */}
      {activeTab === "app" && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-irm-text mb-6">Application Settings</h2>
          <div className="space-y-4">
            <Select
              label="Theme"
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              value={settings.theme}
              onChange={(value) => setSettings({ ...settings, theme: value as "light" | "dark" })}
            />
            <Select
              label="Language"
              options={[
                { value: "English", label: "English" },
                { value: "French", label: "Français" },
                { value: "Spanish", label: "Español" },
              ]}
              value={settings.language}
              onChange={(value) => setSettings({ ...settings, language: value as string })}
            />
            <Select
              label="Timezone"
              options={[
                { value: "GMT", label: "GMT (UTC+0)" },
                { value: "WAT", label: "WAT (UTC+1)" },
                { value: "EAT", label: "EAT (UTC+3)" },
              ]}
              value={settings.timezone}
              onChange={(value) => setSettings({ ...settings, timezone: value as string })}
            />
            <div className="pt-4">
              <Button variant="primary" onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Privacy */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-irm-text mb-4">Data & Privacy</h2>
            <p className="text-irm-text-secondary mb-4">
              Learn how your data is collected, used, and protected. See our{" "}
              <a href="#" className="text-irm-primary hover:underline">
                Privacy Policy
              </a>
              {" "}and{" "}
              <a href="#" className="text-irm-primary hover:underline">
                Terms of Service
              </a>
            </p>
            <Button variant="outline">
              Download Your Data
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-irm-text mb-4">Data Request</h2>
            <p className="text-sm text-irm-text-secondary mb-4">
              You have the right to know what personal data we hold about you and how it's used.
            </p>
            <Button variant="outline">
              Request Your Data
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
