import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectApi } from "../api/api";
import { useToast } from "../context/ToastContext";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

const fieldClass =
  "w-full rounded-xl border border-pink-100 bg-cream p-3 outline-none focus:ring-2 focus:ring-pink-300";

const emptyForm = {
  title: "",
  project_type: "Home Decor",
  difficulty: "Beginner",
  yarn_color: "",
  hook_size: "",
  pattern_description: "",
  notes: "",
  generate_ai_pattern: false,
};

function Projects() {
  const { pushToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await projectApi.list();
    setProjects(response.data);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => {
      pushToast("Could not load projects", "error");
      setLoading(false);
    });
  }, [pushToast]);

  const create = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await projectApi.create(form);
      setForm(emptyForm);
      pushToast("Project created");
      await load();
    } catch (error) {
      pushToast(error.response?.data?.detail || "Could not create project", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await projectApi.remove(id);
      pushToast("Project deleted");
      await load();
    } catch (error) {
      pushToast(error.response?.data?.detail || "Could not delete project", "error");
    }
  };

  return (
    <div className="min-h-screen bg-cream px-8 py-12 md:px-16">
      <h1 className="text-4xl font-bold text-brown">Projects</h1>
      <p className="mt-2 text-gray-600">Create a crochet project, then scan your progress.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <form onSubmit={create} className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-brown">New project</h2>
          <div className="mt-6 space-y-4">
            <input
              required
              minLength={2}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Sunflower coaster"
              className={fieldClass}
            />
            <select
              value={form.project_type}
              onChange={(event) => setForm({ ...form, project_type: event.target.value })}
              className={fieldClass}
            >
              <option>Home Decor</option>
              <option>Clothing</option>
              <option>Accessories</option>
              <option>Toys</option>
              <option>Blankets</option>
              <option>Other</option>
            </select>
            <select
              value={form.difficulty}
              onChange={(event) => setForm({ ...form, difficulty: event.target.value })}
              className={fieldClass}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <input
              value={form.yarn_color}
              onChange={(event) => setForm({ ...form, yarn_color: event.target.value })}
              placeholder="Yarn Color (e.g., Red, Blue)"
              className={fieldClass}
            />
            <input
              value={form.hook_size}
              onChange={(event) => setForm({ ...form, hook_size: event.target.value })}
              placeholder="Hook Size (e.g., 5mm, H-8)"
              className={fieldClass}
            />
            <textarea
              value={form.pattern_description}
              onChange={(event) => setForm({ ...form, pattern_description: event.target.value })}
              placeholder="Pattern Description"
              className={`${fieldClass} h-24`}
            />
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Notes (optional)"
              className={`${fieldClass} h-20`}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.generate_ai_pattern}
                onChange={(event) => setForm({ ...form, generate_ai_pattern: event.target.checked })}
                className="h-4 w-4 rounded border-pink-300 text-pink-500 focus:ring-pink-300"
              />
              <span className="text-sm text-gray-600">Generate AI Pattern</span>
            </label>
            <button
              disabled={saving}
              className="w-full rounded-full bg-pink-400 py-3 font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create project"}
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              text="Add a project on the left to begin tracking your crochet work."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <div key={project.id} className="rounded-3xl bg-white p-6 shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-brown">{project.title}</h3>
                      <p className="text-sm text-gray-500">
                        {project.project_type || project.category} · {project.difficulty}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      {project.status || "active"}
                    </span>
                  </div>
                  {(project.yarn_color || project.hook_size) && (
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                      {project.yarn_color && (
                        <span className="rounded-full bg-pink-50 px-2 py-1">
                          🧶 {project.yarn_color}
                        </span>
                      )}
                      {project.hook_size && (
                        <span className="rounded-full bg-purple-50 px-2 py-1">
                          🪝 {project.hook_size}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="mt-3 text-gray-600">{project.pattern_description || project.description || "No description yet."}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-gray-600">
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-pink-100">
                        <div
                          className="h-3 rounded-full bg-pink-400"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    {project.health_score !== undefined && project.health_score !== null && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{project.health_score}</div>
                        <div className="text-xs text-gray-500">Health</div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/scanner?project=${project.id}`}
                      className="rounded-full bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600"
                    >
                      Scan
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(project.id)}
                      className="rounded-full border border-pink-200 px-4 py-2 text-sm hover:bg-pink-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
