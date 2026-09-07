import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, WandSparkles } from "lucide-react";
import { patternApi } from "../api/api";
import { useToast } from "../context/ToastContext";
import Skeleton from "../components/Skeleton";

function PatternGenerator() {
  const { pushToast } = useToast();
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [pattern, setPattern] = useState(null);

  const generatePattern = async () => {
    if (description.trim().length < 8) {
      pushToast("Describe your project in a little more detail", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await patternApi.generate({ description, difficulty });
      setPattern(response.data.pattern);
      pushToast("Pattern generated");
    } catch (error) {
      pushToast(error.response?.data?.detail || "Could not generate pattern", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-8 py-12 md:px-20">
      <h1 className="text-4xl font-bold text-brown">AI Pattern Generator</h1>
      <p className="mt-2 text-gray-600">
        Describe your dream crochet project and let AI create a pattern.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl bg-white p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-brown">Create New Pattern</h2>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: I want to crochet a sunflower coaster"
            className="mt-6 h-40 w-full rounded-2xl border p-4 outline-none focus:ring-2 focus:ring-pink-300"
          />
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="mt-4 w-full rounded-xl border p-3"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <button
            onClick={generatePattern}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pink-400 py-3 font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
          >
            <WandSparkles size={20} />
            {loading ? "Generating..." : "Generate Pattern"}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl bg-white p-8 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-purple-500" />
            <h2 className="text-2xl font-bold text-brown">AI Generated Pattern</h2>
          </div>

          {loading ? (
            <div className="mt-8 space-y-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-32" />
            </div>
          ) : null}

          {!pattern && !loading ? (
            <p className="mt-8 text-gray-500">Your AI pattern will appear here.</p>
          ) : null}

          {pattern ? (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-pink-50 p-5">
                <h3 className="font-bold text-brown">{pattern.title}</h3>
                <p className="mt-2">Difficulty: {pattern.difficulty}</p>
                {pattern.estimated_time ? <p>Time: {pattern.estimated_time}</p> : null}
              </div>
              <div className="rounded-2xl bg-[#FFF7ED] p-5">
                <h3 className="font-bold">Materials</h3>
                <ul className="mt-2 list-disc pl-5">
                  {(pattern.materials || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-purple-50 p-5">
                <h3 className="font-bold">Steps</h3>
                <ol className="mt-2 list-decimal pl-5">
                  {(pattern.steps || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

export default PatternGenerator;
