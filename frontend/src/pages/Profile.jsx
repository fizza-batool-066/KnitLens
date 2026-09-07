import { useEffect, useState } from "react";
import { dashboardApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { DashboardSkeleton } from "../components/Skeleton";

function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi.summary().then((response) => setStats(response.data.stats));
  }, []);

  return (
    <div className="min-h-screen bg-cream px-8 py-12 md:px-16">
      <h1 className="text-4xl font-bold text-brown">Profile</h1>
      <p className="mt-2 text-gray-600">Your KnitLens studio identity and progress.</p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-lg md:col-span-1">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-2xl font-bold text-brown">
            {user?.name?.[0] || "K"}
          </div>
          <h2 className="mt-6 text-2xl font-bold text-brown">{user?.name}</h2>
          <p className="mt-2 text-gray-600">{user?.email}</p>
          <p className="mt-4 inline-flex rounded-full bg-pink-100 px-4 py-2 text-pink-600">
            {user?.craft_level || "Beginner Crafter"}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg md:col-span-2">
          <h3 className="text-xl font-bold text-brown">Statistics</h3>
          {!stats ? (
            <div className="mt-6">
              <DashboardSkeleton />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Stat label="Projects" value={stats.projects} />
              <Stat label="Completed" value={stats.completed} />
              <Stat label="AI scans" value={stats.scans} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brown">{value}</p>
    </div>
  );
}

export default Profile;
