import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  ScanSearch,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Download,
} from "lucide-react";
import { assetUrl, projectApi, scanApi } from "../api/api";
import { useToast } from "../context/ToastContext";
import Skeleton from "../components/Skeleton";

function Scanner() {
  const { pushToast } = useToast();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(searchParams.get("project") || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scan, setScan] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    projectApi
      .list()
      .then((response) => setProjects(response.data || []))
      .catch(() => setProjects([]));
  }, []);

  const setFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setScan(null);
  };

  const analyze = async () => {
    if (!image) {
      pushToast("Please upload a crochet image first", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    if (projectId) formData.append("project_id", projectId);

    setScanning(true);
    setUploadProgress(0);
    try {
      const response = await scanApi.analyze(formData, (event) => {
        if (!event.total) return;
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      });
      setScan(response.data.scan);
      pushToast("AI analysis completed");
    } catch (error) {
      pushToast(error.response?.data?.detail || "Scan failed", "error");
    } finally {
      setScanning(false);
    }
  };

  const feedback = scan?.feedback || {};
  const reportText = useMemo(() => {
    if (!scan) return "";
    return [
      `KnitLens AI Report`,
      `Project: ${scan.project_name}`,
      `Detected: ${(scan.detected_classes || []).join(", ") || "none"}`,
      `Confidence: ${scan.confidence}%`,
      `Progress: ${feedback.progress_percent}%`,
      `Health Score: ${feedback.health_score}%`,
      `Explanation: ${feedback.explanation}`,
      `Mistake analysis: ${feedback.mistake_analysis}`,
      `Suggested fix: ${feedback.suggested_fix}`,
      `Next step: ${feedback.next_step}`,
      `Motivation: ${feedback.motivational_message}`,
    ].join("\n");
  }, [scan, feedback]);

  const downloadReport = () => {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `knitlens-report-${scan?.id || "scan"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream px-8 py-12 md:px-16">
      <h1 className="text-4xl font-bold text-brown">AI Crochet Scanner</h1>
      <p className="mt-2 text-gray-600">YOLO Vision analyzes your crochet project.</p>

      <div className="mt-8 max-w-md">
        <label className="mb-2 block font-semibold">Link to a project</label>
        <select
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          className="w-full rounded-xl border border-pink-100 bg-white p-3"
        >
          <option value="">Independent scan</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              setFile(event.dataTransfer.files[0]);
            }}
            className={`relative flex h-96 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-pink-50 ${
              dragOver ? "border-purple-400" : "border-pink-300"
            }`}
          >
            {preview ? (
              <img src={preview} alt="Crochet preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center">
                <Upload size={50} className="mx-auto text-pink-400" />
                <p className="mt-3 font-semibold">Drag & drop or upload a crochet image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => setFile(event.target.files[0])}
            />
          </label>

          {uploadProgress > 0 && scanning ? (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Uploading</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-pink-100">
                <div className="h-2 rounded-full bg-purple-500" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={analyze}
            disabled={scanning}
            className="mt-6 w-full rounded-full bg-pink-400 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:opacity-60"
          >
            {scanning ? "Analyzing with YOLO + Qwen..." : "Analyze With YOLO AI"}
          </button>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
          {scanning ? (
            <motion.div
              animate={{ y: [0, 350, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-0 h-1 w-full bg-purple-500"
            />
          ) : null}

          <div className="flex items-center gap-3">
            <ScanSearch className="text-purple-500" size={35} />
            <h2 className="text-2xl font-bold text-brown">AI Report</h2>
          </div>

          {!scan && !scanning ? (
            <p className="mt-10 text-gray-500">Waiting for analysis...</p>
          ) : null}

          {scanning ? (
            <div className="mt-8 space-y-4">
              <p className="font-semibold text-purple-600">
                Scanning image... Detecting crochet structure... Running YOLO model...
              </p>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : null}

          {scan ? (
            <div className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <figure>
                  <img
                    src={assetUrl(scan.original_url)}
                    alt="Original crochet"
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                  <figcaption className="mt-2 text-sm text-gray-500">Original</figcaption>
                </figure>
                <figure>
                  <img
                    src={assetUrl(scan.annotated_url)}
                    alt="Annotated detections"
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                  <figcaption className="mt-2 text-sm text-gray-500">Annotated</figcaption>
                </figure>
              </div>

              <div className="rounded-2xl bg-green-50 p-5">
                <div className="flex gap-3">
                  <CheckCircle className="text-green-500" />
                  <h3 className="font-bold">Detected classes</h3>
                </div>
                <p className="mt-3">
                  {(scan.detected_classes || []).join(", ") || "No objects detected"}
                  <br />
                  Confidence: {scan.confidence}%
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-pink-50 p-5">
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="text-3xl font-bold text-brown">{feedback.progress_percent}%</p>
                </div>
                <div className="rounded-2xl bg-purple-50 p-5">
                  <p className="text-sm text-gray-500">Health Score</p>
                  <p className="text-3xl font-bold text-brown">{feedback.health_score}%</p>
                </div>
              </div>

              <div className="rounded-2xl bg-red-50 p-5">
                <div className="flex gap-3">
                  <AlertTriangle className="text-red-500" />
                  <h3 className="font-bold">Mistake analysis</h3>
                </div>
                <p className="mt-3">{feedback.mistake_analysis}</p>
                <p className="mt-2 text-sm">{feedback.suggested_fix}</p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-5">
                <div className="flex gap-3">
                  <Sparkles className="text-purple-500" />
                  <h3 className="font-bold">Qwen AI Guidance</h3>
                </div>
                <p className="mt-3">{feedback.explanation}</p>
                <p className="mt-2 font-semibold">Next step: {feedback.next_step}</p>
                <p className="mt-2 italic">{feedback.motivational_message}</p>
              </div>

              <button
                type="button"
                onClick={downloadReport}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-purple-300 py-3 font-semibold text-purple-600"
              >
                <Download size={18} />
                Download report
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Scanner;
