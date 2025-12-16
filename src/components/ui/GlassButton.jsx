import { useEffect } from "react";

export default function GlassButton({
  children,
  variant = "primary",      // primary | secondary | success | danger
  size = "md",              // sm | md | lg
  fullWidth = true,         // true = full width, false = auto
  loading = false,          // shows "Saving..."
  icon = null,              // JSX icon
  iconPosition = "left",    // left | right
  disabled = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  // 🔔 Android-like haptic feedback (mobile only)
  useEffect(() => {
    if (loading && navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [loading]);

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold
        transition active:scale-95
        shadow-lg
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : "w-auto"}
        ${disabled || loading ? "opacity-60 pointer-events-none" : ""}
        ${className}
      `}
    >
      {/* Ripple Effect */}
      <span className="absolute inset-0 pointer-events-none">
        <span className="absolute inset-0 bg-white/20 opacity-0 active:opacity-100 transition" />
      </span>

      {/* Content */}
      {loading ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-white/60 border-t-white rounded-full" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <span>{children}</span>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
}
