import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[var(--dark)]">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-[var(--accent-magenta)] mx-auto mb-4" />
        <h1 className="font-display text-6xl text-[var(--light)] mb-2">404</h1>
        <p className="text-sm text-[var(--grey)] mb-6 uppercase font-bold">Page Not Found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--accent-cyan)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:text-[var(--dark)] transition-colors text-sm font-bold uppercase"
        >
          <Home className="w-4 h-4" />
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
