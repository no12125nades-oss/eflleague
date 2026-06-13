import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Trophy, Radio, MessageSquare, ChevronRight, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const heroWords = [
  ["RUSH", "DEFUSE", "FLASH", "ECO"],
  ["FLANK", "TRADE", "AWP", "FORCE"],
  ["HOLD", "PEEK", "CLUTCH", "ROTATE"],
  ["PLANT", "SMOKE", "ACE", "WIN"],
];

const tierBadgeClass = (tier: string) => {
  switch (tier) {
    case "1": return "border-[var(--accent-green)] text-[var(--accent-green)]";
    case "2": return "border-[var(--accent-cyan)] text-[var(--accent-cyan)]";
    case "3": return "border-[var(--accent-magenta)] text-[var(--accent-magenta)]";
    default: return "border-[var(--grey)] text-[var(--grey)]";
  }
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "upcoming": return "border-[var(--accent-cyan)] text-[var(--accent-cyan)]";
    case "ongoing": return "bg-[var(--accent-magenta)] text-[var(--dark)] animate-pulse-glow";
    case "finished": return "border-[var(--accent-green)] text-[var(--accent-green)]";
    default: return "border-[var(--grey)] text-[var(--grey)]";
  }
};

export default function Home() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const rankingsRef = useRef<HTMLDivElement>(null);
  const matchesRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  const { data: teams } = trpc.team.list.useQuery({ sortBy: "points", sortOrder: "desc" });
  const { data: matches } = trpc.match.list.useQuery({});
  const topTeams = teams?.slice(0, 5) || [];
  const recentMatches = matches?.slice(0, 6) || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero column animations
      const columns = gsap.utils.toArray<HTMLElement>(".hero-column");
      columns.forEach((col, i) => {
        const items = col.querySelectorAll(".hero-word");
        gsap.fromTo(
          items,
          { y: 50 + i * 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: i * 0.15,
          }
        );
      });

      // Section animations
      const sections = [
        { ref: featuredRef, selector: ".featured-item" },
        { ref: rankingsRef, selector: ".ranking-item" },
        { ref: matchesRef, selector: ".match-item" },
        { ref: communityRef, selector: ".community-item" },
      ];

      sections.forEach(({ ref, selector }) => {
        if (!ref.current) return;
        const items = ref.current.querySelectorAll(selector);
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden bg-[var(--dark)]"
      >
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(var(--accent-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--accent-cyan) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 px-4 lg:px-12 w-full max-w-7xl">
          {heroWords.map((col, colIdx) => (
            <div key={colIdx} className="hero-column flex flex-col gap-2 lg:gap-4">
              {col.map((word, wordIdx) => (
                <div
                  key={wordIdx}
                  className="hero-word font-display text-5xl sm:text-6xl lg:text-8xl xl:text-9xl text-[var(--light)] uppercase leading-none tracking-tight opacity-90 hover:text-[var(--accent-cyan)] hover:opacity-100 transition-all duration-300 cursor-default"
                  style={{ textShadow: "0 0 40px rgba(0,229,255,0.1)" }}
                >
                  {word}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--dark)] to-transparent pointer-events-none" />
      </section>

      {/* Featured Tournament */}
      <section ref={featuredRef} className="py-20 px-4 lg:px-8 bg-[var(--light)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="featured-item space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--grey)] font-body">
                EFL NETWORK
              </span>
              <h2 className="font-display text-5xl lg:text-7xl xl:text-8xl text-[var(--black)] uppercase leading-none">
                SEASON 5
              </h2>
              <h3 className="font-display text-3xl lg:text-5xl text-[var(--black)] uppercase">
                {t("featuredTournament")}
              </h3>
              <div className="pt-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-[var(--grey)] text-[var(--black)] font-display text-lg uppercase">
                  <Zap className="w-4 h-4" />
                  {t("comingSoon")}
                </span>
              </div>
            </div>
            <div className="featured-item hidden lg:block">
              <div className="w-48 h-48 border border-dashed border-[var(--grey)] rotate-12 flex items-center justify-center">
                <span className="font-display text-lg text-[var(--grey)] text-center uppercase">
                  SEASON 5<br />2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rankings Preview */}
      <section ref={rankingsRef} className="py-20 px-4 lg:px-8 bg-[var(--dark)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="ranking-item">
              <h2 className="font-display text-4xl lg:text-6xl text-[var(--light)] uppercase">
                {t("globalTeamRankings")}
              </h2>
            </div>
            <Link
              to="/ratings"
              className="ranking-item flex items-center gap-1 text-xs font-bold uppercase text-[var(--grey)] hover:text-[var(--accent-cyan)] transition-colors"
            >
              {t("viewAllRankings")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {topTeams.map((team, idx) => (
              <Link
                key={team.id}
                to={`/team/${team.id}`}
                className="ranking-item flex items-center gap-4 px-4 py-3 border-b border-dashed border-[var(--grey)] hover:bg-[rgba(0,229,255,0.05)] hover:border-l-[3px] hover:border-l-[var(--accent-cyan)] hover:translate-x-1 transition-all duration-300 group"
              >
                <span className="font-display text-2xl text-[var(--light)] w-8">{idx + 1}</span>
                <div className="flex-1">
                  <span className="font-body text-base font-medium text-[var(--light)] group-hover:text-[var(--accent-cyan)] transition-colors">
                    {team.name}
                  </span>
                </div>
                <Badge variant="outline" className={`text-xs ${tierBadgeClass(team.tier)}`}>
                  Tier {team.tier}
                </Badge>
                <span className="font-display text-xl text-[var(--accent-cyan)]">
                  {team.points} pts
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Matches */}
      <section ref={matchesRef} className="py-20 px-4 lg:px-8 bg-[var(--light)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="match-item">
              <h2 className="font-display text-4xl lg:text-6xl text-[var(--black)] uppercase">
                {t("latestResults")}
              </h2>
            </div>
            <Link
              to="/matches"
              className="match-item flex items-center gap-1 text-xs font-bold uppercase text-[var(--grey)] hover:text-[var(--black)] transition-colors"
            >
              {t("fullSchedule")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMatches.map((match) => (
              <Link
                key={match.id}
                to={`/matches`}
                className="match-item block bg-[var(--black)] border border-[var(--grey)] p-4 hover:border-[var(--accent-magenta)] hover:shadow-[var(--glow-magenta)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[var(--grey)] font-mono">
                    {String(match.matchDate)} — {match.matchTime ? String(match.matchTime).slice(0, 5) : ""}
                  </span>
                  <Badge variant="outline" className={`text-xs ${statusBadgeClass(match.status)}`}>
                    {match.status === "upcoming" ? t("upcoming") : match.status === "ongoing" ? t("live") : t("finished")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xl text-[var(--light)]">{match.team1Name}</span>
                  <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("vs")}</span>
                  <span className="font-display text-xl text-[var(--light)]">{match.team2Name}</span>
                </div>
                {(match.status === "ongoing" || match.status === "finished") && (
                  <div className="flex items-center justify-center gap-4 pt-2 border-t border-dashed border-[var(--grey)]">
                    <span className={`font-display text-2xl ${(match.team1Score ?? 0) > (match.team2Score ?? 0) ? "text-[var(--accent-green)]" : "text-[var(--grey)]"}`}>
                      {match.team1Score ?? 0}
                    </span>
                    <span className="text-[var(--grey)]">-</span>
                    <span className={`font-display text-2xl ${(match.team2Score ?? 0) > (match.team1Score ?? 0) ? "text-[var(--accent-green)]" : "text-[var(--grey)]"}`}>
                      {match.team2Score ?? 0}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Hub */}
      <section ref={communityRef} className="py-20 px-4 lg:px-8 bg-[var(--dark)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="community-item font-display text-4xl lg:text-6xl text-[var(--light)] uppercase mb-8 pb-4 border-b border-dashed border-[var(--grey)]">
            {t("communityHub")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Streams */}
            <div className="community-item bg-[var(--black)] border border-[var(--grey)] p-6 hover:border-[var(--accent-cyan)] hover:shadow-[var(--glow-cyan)] hover:-translate-y-1 transition-all duration-300 group">
              <Radio className="w-8 h-8 text-[var(--accent-cyan)] mb-4" />
              <h3 className="font-display text-2xl text-[var(--light)] mb-2">{t("liveStreams")}</h3>
              <p className="text-sm text-[var(--grey)] mb-4">{t("watchNow")}</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                <span className="text-xs text-[var(--accent-green)] font-bold uppercase">{t("onAir")}</span>
              </div>
            </div>

            {/* Tournaments */}
            <div className="community-item bg-[var(--black)] border border-[var(--grey)] p-6 hover:border-[var(--accent-magenta)] hover:shadow-[var(--glow-magenta)] hover:-translate-y-1 transition-all duration-300 group">
              <Trophy className="w-8 h-8 text-[var(--accent-magenta)] mb-4" />
              <h3 className="font-display text-2xl text-[var(--light)] mb-2">{t("tournaments")}</h3>
              <p className="text-sm text-[var(--grey)] mb-4">{t("registerTeam")}</p>
              <Badge variant="outline" className="text-xs border-[var(--accent-cyan)] text-[var(--accent-cyan)]">
                {t("registrationOpen")}
              </Badge>
            </div>

            {/* Forum */}
            <div className="community-item bg-[var(--black)] border border-[var(--grey)] p-6 hover:border-[var(--accent-green)] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:-translate-y-1 transition-all duration-300 group">
              <MessageSquare className="w-8 h-8 text-[var(--accent-green)] mb-4" />
              <h3 className="font-display text-2xl text-[var(--light)] mb-2">{t("forum")}</h3>
              <p className="text-sm text-[var(--grey)] mb-4">{t("joinDiscussion")}</p>
              <span className="font-display text-sm text-[var(--accent-green)]">2.4K {t("online")}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
