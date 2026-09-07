import { Link } from "react-router-dom";

function Button({
  children,
  to,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const styles = {
    primary:
      "bg-pink-400 hover:bg-pink-500 text-white shadow-lg shadow-pink-200",
    secondary:
      "border border-purple-300 text-purple-600 hover:bg-purple-50 bg-white",
    ghost: "bg-blush/60 text-brown hover:bg-blush",
  }[variant];

  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export default Button;
