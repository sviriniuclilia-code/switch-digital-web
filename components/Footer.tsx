import Logo from "./Logo";

export default function Footer({ t }: { t: any }) {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <Logo dark />
        <p className="text-sm text-muted2">{t.footer.tagline}</p>
        <p className="text-xs text-muted2">© 2026 Switch Digital. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
