import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, t, setLang } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("ratings"), href: "/ratings" },
    { label: t("matches"), href: "/matches" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-dashed border-[var(--grey)] bg-[var(--dark)]/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 lg:px-8 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-2xl font-bold text-[var(--light)] tracking-wider">
            EFL
          </span>
          <span className="hidden sm:inline text-xs text-[var(--grey)] font-body uppercase tracking-widest">
            Electronic Future League
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-[var(--accent-cyan)]"
                  : "text-[var(--grey)] hover:text-[var(--light)]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-[var(--accent-cyan)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--grey)] hover:text-[var(--light)] transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-bold">{lang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[var(--black)] border border-[var(--grey)] rounded shadow-lg z-50 min-w-[80px]">
                {(["en", "ru", "uk"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-xs uppercase font-bold transition-colors ${
                      lang === l
                        ? "text-[var(--accent-cyan)]"
                        : "text-[var(--grey)] hover:text-[var(--light)]"
                    }`}
                  >
                    {l === "en" ? "English" : l === "ru" ? "Русский" : "Українська"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-[var(--grey)] hover:text-[var(--accent-cyan)] transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[var(--accent-magenta)] hover:text-[var(--light)] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="font-bold uppercase">{t("admin")}</span>
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-[var(--light)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span className="font-bold max-w-[80px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 text-[var(--grey)] hover:text-[var(--accent-magenta)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold uppercase text-[var(--grey)] hover:text-[var(--light)]"
                >
                  {t("login")}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-[var(--grey)] hover:text-[var(--light)]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dashed border-[var(--grey)] bg-[var(--dark)] px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-bold uppercase tracking-wider ${
                isActive(link.href)
                  ? "text-[var(--accent-cyan)]"
                  : "text-[var(--grey)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-bold uppercase text-[var(--accent-magenta)]"
            >
              <Shield className="w-4 h-4" />
              {t("admin")}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
