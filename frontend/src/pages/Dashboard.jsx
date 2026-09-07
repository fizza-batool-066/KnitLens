import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, FolderHeart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardApi, assetUrl } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { DashboardSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

function ProgressRing({ value, label }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#F8C8DC" strokeWidth="12" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#8B5CF6"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8 }}
        />
        <text x="60" y="66" textAnchor="middle" className="fill-brown text-xl font-bold">
          {value}%
        </text>
      </svg>
      <p className="mt-2 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .summary()
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    projects: 0,
    completed: 0,
    health_score: 0,
    scans: 0,
    progress: 0,
  };

  return (
    <div className="min-h-screen bg-cream px-8 py-10 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-brown">Hello, {user?.name || "Crafter"}</h1>
          <p className="mt-2 text-gray-600">Your AI crochet studio dashboard</p>
        </div>
        <div className="rounded-full bg-pink-100 px-5 py-3 font-semibold text-pink-600">
          {user?.craft_level || "Beginner Crafter"}
        </div>
      </motion.div>

      {loading ? (
        <div className="mt-10">
          <DashboardSkeleton />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <Card icon={<FolderHeart />} title="Projects" value={String(stats.projects).padStart(2, "0")} />
            <Card icon={<TrendingUp />} title="Completed" value={String(stats.completed).padStart(2, "0")} />
            <Card icon={<Sparkles />} title="Health Score" value={`${stats.health_score}%`} />
            <Card icon={<Camera />} title="AI Scans" value={String(stats.scans).padStart(2, "0")} />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl bg-white p-8 shadow-lg md:col-span-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-brown">Studio snapshot</h2>
                  <p className="mt-2 text-gray-500">Progress and health across your projects</p>
                </div>
                <div className="flex gap-6">
                  <ProgressRing value={stats.progress || 0} label="Progress" />
                  <ProgressRing value={stats.health_score || 0} label="Health" />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {(data?.recent_projects || []).length === 0 ? (
                  <EmptyState
                    title="No projects yet"
                    text="Create your first crochet project to start tracking progress."
                    action={<Button to="/projects">Create Project</Button>}
                  />
                ) : (
                  data.recent_projects.map((project) => (
                    <div key={project.id}>
                      <div className="mb-2 flex justify-between text-sm">
                        <p className="font-semibold">{project.title}</p>
                        <p>{project.progress || 0}%</p>
                      </div>
                      <div className="h-3 rounded-full bg-pink-100">
                        <motion.div
                          className="h-3 rounded-full bg-pink-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/scanner" className="rounded-full bg-purple-500 px-6 py-3 text-white">
                  Analyze Project
                </Link>
                <Link
                  to="/pattern-generator"
                  className="rounded-full border border-pink-400 px-6 py-3 text-pink-500"
                >
                  Generate Pattern
                </Link>
              </div>
            </motion.div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-xl font-bold text-brown">Recent AI Scans</h3>
              <div className="mt-6 space-y-4">
                {(data?.recent_scans || []).length === 0 ? (
                  <p className="text-gray-500">No scans yet. Upload a photo to see AI results here.</p>
                ) : (
                  data.recent_scans.map((scan) => (
                    <div key={scan.id} className="flex items-center gap-3 rounded-xl bg-pink-50 p-3">
                      <img
                        src={assetUrl(scan.annotated_url || scan.original_url)}
                        alt={scan.project_name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold">{scan.project_name}</p>
                        <p className="text-sm text-gray-500">
                          Health {scan.feedback?.health_score ?? 0}%
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl bg-white p-6 shadow-md">
      <div className="text-purple-500">{icon}</div>
      <p className="mt-4 text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-brown">{value}</h2>
    </motion.div>
  );
}

export default Dashboard;
