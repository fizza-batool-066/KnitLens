import { useEffect, useState } from "react";
import { assetUrl, projectApi, scanApi } from "../api/api";
import { useToast } from "../context/ToastContext";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Skeleton from "../components/Skeleton";

function History() {
  const { pushToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [projectId, setProjectId] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    projectApi.list().then((response) => setProjects(response.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    scanApi
      .list({ q: query, project_id: projectId || undefined, page, limit: 8 })
      .then((response) => setData(response.data))
      .catch(() => pushToast("Could not load scan history", "error"))
      .finally(() => setLoading(false));
  }, [query, projectId, page]);

  return (
    <div className="min-h-screen bg-cream px-8 py-12 md:px-16">
      <h1 className="text-4xl font-bold text-brown">Scan History</h1>
      <p className="mt-2 text-gray-600">Search, filter, and reopen previous AI scans.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <input
          value={query}
          onChange={(event) => {
            setPage(1);
            setQuery(event.target.value);
          }}
          placeholder="Search by project or class"
          className="rounded-xl border border-pink-100 bg-white p-3"
        />
        <select
          value={projectId}
          onChange={(event) => {
            setPage(1);
            setProjectId(event.target.value);
          }}
          className="rounded-xl border border-pink-100 bg-white p-3"
        >
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : data.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No scans yet"
            text="Analyze a crochet photo and it will appear in your history."
            action={<Button to="/scanner">Open Scanner</Button>}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {data.items.map((scan) => (
            <button
              key={scan.id}
              onClick={() => setSelected(scan)}
              className="rounded-3xl bg-white p-5 text-left shadow-lg"
            >
              <div className="flex gap-4">
                <img
                  src={assetUrl(scan.annotated_url || scan.original_url)}
                  alt=""
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-brown">{scan.project_name}</h3>
                  <p className="text-sm text-gray-500">
                    {(scan.detected_classes || []).join(", ") || "No detections"}
                  </p>
                  <p className="mt-2 text-sm">
                    Health {scan.feedback?.health_score ?? 0}% · Progress{" "}
                    {scan.feedback?.progress_percent ?? 0}%
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((value) => value - 1)}
          className="rounded-full border px-4 py-2 disabled:opacity-40"
        >
          Previous
        </button>
        <span>
          Page {data.page || page} of {data.pages}
        </span>
        <button
          disabled={page >= data.pages}
          onClick={() => setPage((value) => value + 1)}
          className="rounded-full border px-4 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-brown">{selected.project_name}</h2>
              <button onClick={() => setSelected(null)} className="rounded-full bg-cream px-4 py-2">
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <img src={assetUrl(selected.original_url)} alt="" className="rounded-2xl object-cover" />
              <img src={assetUrl(selected.annotated_url)} alt="" className="rounded-2xl object-cover" />
            </div>
            <p className="mt-4">{selected.feedback?.explanation}</p>
            <p className="mt-2 font-semibold">Next step: {selected.feedback?.next_step}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default History;
