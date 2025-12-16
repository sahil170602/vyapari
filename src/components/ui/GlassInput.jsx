export default function GlassInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        glass w-full rounded-xl px-4 py-3
        outline-none text-gray-800
        placeholder:text-gray-400
        ${className}
      `}
    />
  )
}
