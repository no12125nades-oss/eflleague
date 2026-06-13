import { useState } from "react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Swords, Calendar, Clock } from "lucide-react";

type StatusFilter = "all" | "upcoming" | "ongoing" | "finished";

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "upcoming": return "border-[var(--accent-cyan)] text-[var(--accent-cyan)]";
    case "ongoing": return "bg-[var(--accent-magenta)] text-[var(--dark)] animate-pulse-glow";
    case "finished": return "border-[var(--accent-green)] text-[var(--accent-green)]";
    default: return "border-[var(--grey)] text-[var(--grey)]";
  }
};

export default function Matches() {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const statusQuery = statusFilter === "all" ? undefined : statusFilter;
  const { data: matches, isLoading } = trpc.match.list.useQuery(
    statusQuery ? { status: statusQuery as "upcoming" | "ongoing" | "finished" } : {}
  );

  const statusCounts = {
    all: matches?.length || 0,
    upcoming: matches?.filter((m) => m.status === "upcoming").length || 0,
    ongoing: matches?.filter((m) => m.status === "ongoing").length || 0,
    finished: matches?.filter((m) => m.status === "finished").length || 0,
  };

  return (
    <div className="min-h-screen bg-[var(--dark)] py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-5xl lg:text-7xl text-[var(--light)] uppercase mb-4">
            {t("matches")}
          </h1>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {(["all", "upcoming", "ongoing", "finished"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold uppercase transition-all duration-300 ${
                statusFilter === status
                  ? status === "all"
                    ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan)] text-[var(--dark)]"
                    : statusBadgeClass(status) + " bg-opacity-20"
                  : "border-[var(--grey)] text-[var(--grey)] hover:border-[var(--light)] hover:text-[var(--light)]"
              }`}
            >
              {status === "all" ? t("all") : t(status)}
              <span className="ml-1 opacity-60">({statusCounts[status]})</span>
            </button>
          ))}
        </div>

        {/* Matches List */}
        {isLoading ? (
          <div className="text-center py-12 text-[var(--grey)]">Loading...</div>
        ) : !matches?.length ? (
          <div className="text-center py-12 text-[var(--grey)]">{t("noMatchesFound")}</div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-[var(--black)] border border-[var(--grey)] p-4 lg:p-6 hover:border-[var(--accent-cyan)] hover:shadow-[var(--glow-cyan)] transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Date/Time */}
                  <div className="flex items-center gap-4 text-xs text-[var(--grey)] lg:w-40 shrink-0">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{String(match.matchDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{match.matchTime ? String(match.matchTime).slice(0, 5) : ""}</span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex-1 flex items-center justify-between lg:justify-center gap-4">
                    <Link
                      to={`/team/${match.team1Id}`}
                      className="flex items-center gap-2 group/team"
                    >
                      <Swords className="w-4 h-4 text-[var(--grey)] group-hover/team:text-[var(--accent-cyan)] transition-colors" />
                      <span className="font-display text-lg lg:text-2xl text-[var(--light)] group-hover/team:text-[var(--accent-cyan)] transition-colors">
                        {match.team1Name}
                      </span>
                    </Link>

                    <span className="text-xs text-[var(--grey)] uppercase font-bold px-3">
                      {t("vs")}
                    </span>

                    <Link
                      to={`/team/${match.team2Id}`}
                      className="flex items-center gap-2 group/team"
                    >
                      <span className="font-display text-lg lg:text-2xl text-[var(--light)] group-hover/team:text-[var(--accent-cyan)] transition-colors">
                        {match.team2Name}
                      </span>
                      <Swords className="w-4 h-4 text-[var(--grey)] group-hover/team:text-[var(--accent-cyan)] transition-colors" />
                    </Link>
                  </div>

                  {/* Score + Status */}
                  <div className="flex items-center gap-4 lg:justify-end lg:w-48 shrink-0">
                    {(match.status === "ongoing" || match.status === "finished") && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-display text-2xl lg:text-3xl ${
                            (match.team1Score ?? 0) > (match.team2Score ?? 0)
                              ? "text-[var(--accent-green)]"
                              : "text-[var(--grey)]"
                          }`}
                        >
                          {match.team1Score ?? 0}
                        </span>
                        <span className="text-[var(--grey)]">-</span>
                        <span
                          className={`font-display text-2xl lg:text-3xl ${
                            (match.team2Score ?? 0) > (match.team1Score ?? 0)
                              ? "text-[var(--accent-green)]"
                              : "text-[var(--grey)]"
                          }`}
                        >
                          {match.team2Score ?? 0}
                        </span>
                      </div>
                    )}
                    <Badge variant="outline" className={`text-xs ${statusBadgeClass(match.status)}`}>
                      {match.status === "upcoming" ? t("upcoming") : match.status === "ongoing" ? t("live") : t("finished")}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
