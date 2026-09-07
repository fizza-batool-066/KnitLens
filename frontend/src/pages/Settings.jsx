import { useState } from "react";
import { authApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Settings() {
  const { user, setUser, logout } = useAuth();
  const { pushToast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [craftLevel, setCraftLevel] = useState(user?.craft_level || "Beginner Crafter");
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await authApi.updateMe({ name, craft_level: craftLevel });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      pushToast("Settings saved");
    } catch (error) {
      pushToast(error.response?.data?.detail || "Could not save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-8 py-12 md:px-16">
      <h1 className="text-4xl font-bold text-brown">Settings</h1>
      <p className="mt-2 text-gray-600">Update your profile and studio preferences.</p>

      <form onSubmit={save} className="mt-10 max-w-xl rounded-3xl bg-white p-8 shadow-lg">
        <label className="block font-semibold">Display name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-pink-100 bg-cream p-3"
        />
        <label className="mt-6 block font-semibold">Craft level</label>
        <select
          value={craftLevel}
          onChange={(event) => setCraftLevel(event.target.value)}
          className="mt-2 w-full rounded-xl border border-pink-100 bg-cream p-3"
        >
          <option>Beginner Crafter</option>
          <option>Intermediate Crafter</option>
          <option>Advanced Crafter</option>
        </select>
        <p className="mt-6 text-sm text-gray-500">
          API: {import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            disabled={saving}
            className="rounded-full bg-pink-400 px-6 py-3 text-white hover:bg-pink-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-pink-200 px-6 py-3"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
