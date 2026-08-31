/* Logo-ul Switch Digital.
   dark    = pe fundal închis (pătrat alb, „S" închis, text alb)
   compact = pe mobil se afișează doar pătratul cu „S", ca să rămână loc în bară */
export default function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`relative grid h-9 w-9 place-items-center rounded-[10px] transition-colors duration-300 ${dark ? "bg-white" : "bg-ink"}`}>
        <span className={`text-lg font-bold leading-none transition-colors duration-300 ${dark ? "text-ink" : "text-white"}`}>S</span>
        <span className="absolute bottom-1.5 right-1.5 h-1 w-2.5 rounded-full bg-cyan" />
      </span>
      <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${compact ? "hidden sm:inline" : ""} ${dark ? "text-white" : "text-ink"}`}>
        Switch <span className={`transition-colors duration-300 ${dark ? "text-cyan-light" : "text-cyan-dark"}`}>Digital</span>
      </span>
    </span>
  );
}
