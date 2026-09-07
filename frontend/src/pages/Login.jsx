import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const fieldClass =
  "mt-4 w-full rounded-xl border border-pink-100 bg-cream p-3 outline-none focus:ring-2 focus:ring-pink-300";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.login(form);
      login(response.data);
      pushToast("Welcome back to KnitLens");
      navigate(location.state?.from || "/dashboard");
    } catch (error) {
      pushToast(error.response?.data?.detail || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl"
      >
        <Link to="/" className="mb-4 block text-center text-sm text-pink-500">
          Back to KnitLens
        </Link>
        <h1 className="text-center text-3xl font-bold text-brown">Welcome Back</h1>
        <input
          name="email"
          type="email"
          required
          onChange={handleChange}
          placeholder="Email"
          className={`${fieldClass} mt-8`}
        />
        <input
          name="password"
          type="password"
          required
          onChange={handleChange}
          placeholder="Password"
          className={fieldClass}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-pink-400 py-3 text-white hover:bg-pink-500 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="mt-5 text-center">
          No account?
          <Link to="/register" className="ml-2 font-semibold text-pink-500">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Login;
