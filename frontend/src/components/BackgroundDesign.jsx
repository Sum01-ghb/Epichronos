export default function BackgroundDesign() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-right soft glow */}
      <div className="absolute -right-40 -top-40 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-sky-400 opacity-40 blur-3xl" />

      {/* Left vertical ribbon */}
      <div className="absolute -left-24 top-10 h-96 w-56 -rotate-12 bg-gradient-to-b from-sky-300 via-teal-300 to-purple-300 opacity-40 blur-3xl" />

      {/* Bottom-center wave blob */}
      <div className="absolute bottom-[-8rem] left-1/2 h-72 w-[32rem] -translate-x-1/2 rounded-[999px] bg-gradient-to-r from-fuchsia-300 via-sky-300 to-emerald-300 opacity-40 blur-3xl" />

      {/* Subtle center glow */}
      <div className="absolute inset-1/3 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-200 via-sky-200 to-transparent opacity-60 blur-2xl" />
    </div>
  );
}

