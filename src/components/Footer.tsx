import { useState } from "react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { MessageCircle, Music, Send, ChevronUp, X } from "lucide-react";

const SOCIAL_LINKS = {
  discord: "https://discord.gg/efl",
  tiktok: "https://tiktok.com/@efl",
  telegram: "https://t.me/efl",
};

export default function Footer() {
  const { t } = useI18n();
  const [socialOpen, setSocialOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[var(--grey)] bg-[var(--dark)] py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-[var(--light)]">EFL</span>
            <span className="text-xs text-[var(--grey)]">
              &copy; 2026 {t("electronicFutureLeague")}
            </span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-xs text-[var(--grey)] hover:text-[var(--light)] transition-colors uppercase font-bold">
              {t("home")}
            </Link>
            <Link to="/ratings" className="text-xs text-[var(--grey)] hover:text-[var(--light)] transition-colors uppercase font-bold">
              {t("ratings")}
            </Link>
            <Link to="/matches" className="text-xs text-[var(--grey)] hover:text-[var(--light)] transition-colors uppercase font-bold">
              {t("matches")}
            </Link>
          </nav>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-[var(--grey)] text-xs text-[var(--grey)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition-colors uppercase font-bold"
          >
            <ChevronUp className="w-3 h-3" />
            {t("backToTop")}
          </button>
        </div>
      </div>

      {/* Social Links Button (bottom right) */}
      <div className="fixed bottom-6 right-6 z-40">
        {socialOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-[var(--black)] border border-[var(--grey)] rounded-lg shadow-xl overflow-hidden min-w-[160px]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--grey)]">
              <span className="text-xs font-bold uppercase text-[var(--light)]">{t("socialLinks")}</span>
              <button onClick={() => setSocialOpen(false)} className="text-[var(--grey)] hover:text-[var(--light)]">
                <X className="w-3 h-3" />
              </button>
            </div>
            <a
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--grey)] hover:text-[var(--light)] hover:bg-[var(--dark)] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#5865F2]" />
              <span className="font-medium">Discord</span>
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--grey)] hover:text-[var(--light)] hover:bg-[var(--dark)] transition-colors"
            >
              <Music className="w-4 h-4" />
              <span className="font-medium">TikTok</span>
            </a>
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--grey)] hover:text-[var(--light)] hover:bg-[var(--dark)] transition-colors"
            >
              <Send className="w-4 h-4 text-[#229ED9]" />
              <span className="font-medium">Telegram</span>
            </a>
          </div>
        )}
        <button
          onClick={() => setSocialOpen(!socialOpen)}
          className="w-10 h-10 rounded-full bg-[var(--accent-magenta)] text-[var(--dark)] flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
        >
          {socialOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
        </button>
      </div>
    </footer>
  );
}
