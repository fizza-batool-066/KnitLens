import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/scanner", label: "AI Scanner" },
    { to: "/pattern-generator", label: "Patterns" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  const appLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/projects", label: "Projects" },
    { to: "/scanner", label: "Scanner" },
    { to: "/history", label: "History" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
  ];

  const links = user ? appLinks : publicLinks;

  const linkClass = ({ isActive }) =>
    `transition hover:text-pink-500 ${isActive ? "text-pink-500" : "text-brown"}`;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/60 bg-[#FFF8F3]/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-8 py-5 md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-full bg-blush p-2">
            <Sparkles className="text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-brown">KnitLens</h1>
        </Link>

        <div className="hidden items-center gap-8 font-medium md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-full bg-pink-400 px-6 py-2 text-white transition hover:bg-pink-500"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-pink-400 px-6 py-2 text-white transition hover:bg-pink-500"
            >
              Login
            </Link>
          )}
        </div>

        <button
          className="rounded-full border border-pink-200 p-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="flex flex-col gap-4 px-8 pb-6 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
                navigate("/");
              }}
              className="rounded-full bg-pink-400 px-6 py-2 text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-full bg-pink-400 px-6 py-2 text-center text-white"
            >
              Login
            </Link>
          )}
        </div>
      ) : null}
    </motion.nav>
  );
}

export default Navbar;
