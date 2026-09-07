import { motion } from "framer-motion";
import { Camera, Sparkles, ScanSearch, HeartPulse } from "lucide-react";
import Button from "../components/Button";
import FeatureCard from "./FeatureCard";
import ProcessCard from "./ProcessCard";
import TechCard from "./TechCard";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream">
      <section className="grid items-center gap-10 px-8 py-20 md:grid-cols-2 md:px-20">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <p className="mb-4 inline-flex rounded-full bg-blush px-4 py-2 text-sm font-semibold text-brown">
            Alibaba Cloud AI Hackathon
          </p>
          <h1 className="text-5xl font-bold leading-tight text-brown">
            Your AI Crochet
            <br />
            <span className="text-pink-400">Creative Assistant</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-gray-600">
            Scan your crochet projects, detect mistakes and get personalized AI
            guidance with KnitLens.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to={user ? "/dashboard" : "/register"}>Start Creating</Button>
            <Button to={user ? "/scanner" : "/login"} variant="secondary">
              Explore AI
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl bg-white p-10 shadow-xl"
        >
          <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-pink-50">
            <motion.div
              animate={{ y: [-40, 40, -40] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute h-1 w-full bg-purple-400"
            />
            <Camera size={90} className="text-pink-400" />
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Sparkles className="text-purple-500" />
            <p className="font-semibold text-brown">AI Crochet Scanner Ready</p>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 px-8 pb-16 md:grid-cols-3 md:px-20">
        <FeatureCard
          icon={<ScanSearch />}
          title="YOLO Vision"
          description="Detect swatches and holes in your crochet photos with YOLOv11."
        />
        <FeatureCard
          icon={<Sparkles />}
          title="Qwen Guidance"
          description="Alibaba Cloud Qwen explains progress, health, and the next stitch."
        />
        <FeatureCard
          icon={<HeartPulse />}
          title="Progress Tracking"
          description="Save every scan, watch health scores, and finish projects with confidence."
        />
      </section>

      <section className="px-8 pb-16 md:px-20">
        <div className="grid gap-6 md:grid-cols-4">
          <ProcessCard number="01" title="Create" text="Start a crochet project in your studio." />
          <ProcessCard number="02" title="Scan" text="Upload a photo of your current work." />
          <ProcessCard number="03" title="Detect" text="YOLO finds swatches and holes instantly." />
          <ProcessCard number="04" title="Improve" text="Qwen suggests the next confident step." />
        </div>
      </section>

      <section className="grid gap-6 px-8 pb-20 md:grid-cols-3 md:px-20">
        <TechCard title="YOLOv11" text="On-device style detection for stitches and gaps." />
        <TechCard title="Qwen" text="Alibaba Cloud LLM for structured crochet coaching." />
        <TechCard title="MongoDB Atlas" text="Secure project and scan history in the cloud." />
      </section>
    </div>
  );
}

export default Home;
