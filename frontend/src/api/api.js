import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 20000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = API.defaults.baseURL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const authApi = {
  register: (payload) => API.post("/auth/register", payload),
  login: (payload) => API.post("/auth/login", payload),
  me: () => API.get("/auth/me"),
  updateMe: (payload) => API.put("/auth/me", payload),
};

export const projectApi = {
  list: () => API.get("/projects/"),
  get: (id) => API.get(`/projects/${id}`),
  create: (payload) => API.post("/projects/create", payload),
  update: (id, payload) => API.put(`/projects/${id}`, payload),
  updateProgress: (id, progress) => API.put(`/projects/${id}/progress`, { progress }),
  remove: (id) => API.delete(`/projects/${id}`),
};

export const scanApi = {
  analyze: (formData, onUploadProgress) =>
    API.post("/scans/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  list: (params) => API.get("/scans/", { params }),
  get: (id) => API.get(`/scans/${id}`),
  remove: (id) => API.delete(`/scans/${id}`),
};

export const dashboardApi = {
  summary: () => API.get("/dashboard/summary"),
};

export const patternApi = {
  generate: (payload) => API.post("/patterns/generate", payload),
};

export default API;
