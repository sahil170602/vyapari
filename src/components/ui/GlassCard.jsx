export default function GlassCard({
  children,
  className = "",
  padding = "p-4",
  ...props
}) {
  return (
    <div
      {...props}
      className={`
        ${padding}
        rounded-2xl
        backdrop-blur-xl
        bg-white/70
        border border-white/20
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}
