import { useState } from "react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User, TrendingUp } from "lucide-react";

type ViewType = "teams" | "players";
type TierFilter = "all" | "1" | "2" | "3";

const tierBadgeClass = (tier: string) => {
  switch (tier) {
    case "1": return "border-[var(--accent-green)] text-[var(--accent-green)]";
    case "2": return "border-[var(--accent-cyan)] text-[var(--accent-cyan)]";
    case "3": return "border-[var(--accent-magenta)] text-[var(--accent-magenta)]";
    default: return "border-[var(--grey)] text-[var(--grey)]";
  }
};

const roleBadgeClass = (role: string) => {
  switch (role) {
    case "awper": return "bg-[#00e5ff] text-[#0c0d0e]";
    case "entry": return "bg-[#ff00aa] text-[#0c0d0e]";
    case "igl": return "bg-[#00ff88] text-[#0c0d0e]";
    case "lurk": return "bg-[#5f5f5f] text-[#f5f5f5]";
    case "support": return "bg-[#ffcc00] text-[#0c0d0e]";
    default: return "bg-[var(--grey)] text-[var(--light)]";
  }
};

export default function Ratings() {
  const { t } = useI18n();
  const [view, setView] = useState<ViewType>("teams");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const tierQuery = tierFilter === "all" ? undefined : tierFilter;
  const roleQuery = roleFilter === "all" ? undefined : (roleFilter as "awper" | "entry" | "igl" | "lurk" | "support");

  const { data: teams, isLoading: teamsLoading } = trpc.team.list.useQuery(
    tierQuery ? { tier: tierQuery as "1" | "2" | "3", sortBy: "points", sortOrder: "desc" } : { sortBy: "points", sortOrder: "desc" }
  );

  const { data: players, isLoading: playersLoading } = trpc.player.list.useQuery(
    { tier: tierQuery as "1" | "2" | "3" | undefined, role: roleQuery, sortBy: "statsRating", sortOrder: "desc" }
  );

  return (
    <div className="min-h-screen bg-[var(--dark)] py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-5xl lg:text-7xl text-[var(--light)] uppercase mb-4">
            {t("ratings")}
          </h1>

          {/* View Toggle */}
          <Tabs value={view} onValueChange={(v) => setView(v as ViewType)} className="w-fit">
            <TabsList className="bg-[var(--black)] border border-[var(--grey)]">
              <TabsTrigger
                value="teams"
                className="data-[state=active]:bg-[var(--accent-cyan)] data-[state=active]:text-[var(--dark)] text-[var(--grey)] font-bold uppercase text-xs px-4"
              >
                <Users className="w-3.5 h-3.5 mr-1.5" />
                {t("teams")}
              </TabsTrigger>
              <TabsTrigger
                value="players"
                className="data-[state=active]:bg-[var(--accent-cyan)] data-[state=active]:text-[var(--dark)] text-[var(--grey)] font-bold uppercase text-xs px-4"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                {t("players")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Tier Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("tier")}:</span>
            <div className="flex gap-1">
              {(["all", "1", "2", "3"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all duration-300 ${
                    tierFilter === tier
                      ? tier === "all"
                        ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan)] text-[var(--dark)]"
                        : tierBadgeClass(tier) + " bg-opacity-20 bg-[var(--light)]"
                      : "border-[var(--grey)] text-[var(--grey)] hover:border-[var(--light)] hover:text-[var(--light)]"
                  }`}
                >
                  {tier === "all" ? t("all") : `Tier ${tier}`}
                </button>
              ))}
            </div>
          </div>

          {/* Role Filter (players only) */}
          {view === "players" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("role")}:</span>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36 h-8 bg-[var(--black)] border-[var(--grey)] text-[var(--light)] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                  <SelectItem value="all" className="text-[var(--light)] text-xs">{t("all")}</SelectItem>
                  <SelectItem value="awper" className="text-[var(--light)] text-xs">Awper</SelectItem>
                  <SelectItem value="entry" className="text-[var(--light)] text-xs">Entry</SelectItem>
                  <SelectItem value="igl" className="text-[var(--light)] text-xs">IGL</SelectItem>
                  <SelectItem value="lurk" className="text-[var(--light)] text-xs">Lurk</SelectItem>
                  <SelectItem value="support" className="text-[var(--light)] text-xs">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Teams View */}
        {view === "teams" && (
          <div>
            {teamsLoading ? (
              <div className="text-center py-12 text-[var(--grey)]">Loading...</div>
            ) : !teams?.length ? (
              <div className="text-center py-12 text-[var(--grey)]">{t("noTeamsFound")}</div>
            ) : (
              <div className="space-y-1">
                {/* Header */}
                <div className="hidden md:grid grid-cols-[60px_1fr_120px_100px_100px] gap-4 px-4 py-2 border-b border-[var(--light)] text-xs text-[var(--grey)] uppercase font-bold">
                  <span>#</span>
                  <span>{t("team")}</span>
                  <span className="text-right">{t("points")}</span>
                  <span className="text-center">{t("tier")}</span>
                  <span className="text-center">{t("players")}</span>
                </div>

                {teams.map((team, idx) => (
                  <Link
                    key={team.id}
                    to={`/team/${team.id}`}
                    className="grid grid-cols-1 md:grid-cols-[60px_1fr_120px_100px_100px] gap-2 md:gap-4 px-4 py-3 border-b border-dashed border-[var(--grey)] hover:bg-[rgba(0,229,255,0.05)] hover:border-l-[3px] hover:border-l-[var(--accent-cyan)] hover:translate-x-1 transition-all duration-300 group items-center"
                  >
                    <span className="font-display text-xl text-[var(--light)]">{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      {team.logo ? (
                        <img src={team.logo} alt="" className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-[var(--black)] border border-[var(--grey)] flex items-center justify-center">
                          <Users className="w-4 h-4 text-[var(--grey)]" />
                        </div>
                      )}
                      <div>
                        <span className="font-body text-base font-medium text-[var(--light)] group-hover:text-[var(--accent-cyan)] transition-colors block">
                          {team.name}
                        </span>
                        {team.region && (
                          <span className="text-xs text-[var(--grey)]">{team.region}</span>
                        )}
                      </div>
                    </div>
                    <span className="font-display text-lg text-[var(--accent-cyan)] text-right hidden md:block">
                      {team.points} pts
                    </span>
                    <div className="flex justify-center">
                      <Badge variant="outline" className={`text-xs ${tierBadgeClass(team.tier)}`}>
                        Tier {team.tier}
                      </Badge>
                    </div>
                    <span className="text-center text-xs text-[var(--grey)] hidden md:block">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      #{team.worldRank || "-"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Players View */}
        {view === "players" && (
          <div>
            {playersLoading ? (
              <div className="text-center py-12 text-[var(--grey)]">Loading...</div>
            ) : !players?.length ? (
              <div className="text-center py-12 text-[var(--grey)]">{t("noPlayersFound")}</div>
            ) : (
              <div className="space-y-1">
                {/* Header */}
                <div className="hidden md:grid grid-cols-[60px_1fr_120px_100px_100px_80px_80px] gap-4 px-4 py-2 border-b border-[var(--light)] text-xs text-[var(--grey)] uppercase font-bold">
                  <span>#</span>
                  <span>{t("player")}</span>
                  <span>{t("team")}</span>
                  <span className="text-center">{t("role")}</span>
                  <span className="text-center">{t("tier")}</span>
                  <span className="text-right">{t("kd")}</span>
                  <span className="text-right">{t("rating")}</span>
                </div>

                {players.map((player, idx) => (
                  <Link
                    key={player.id}
                    to={`/player/${player.id}`}
                    className="grid grid-cols-1 md:grid-cols-[60px_1fr_120px_100px_100px_80px_80px] gap-2 md:gap-4 px-4 py-3 border-b border-dashed border-[var(--grey)] hover:bg-[rgba(0,229,255,0.05)] hover:border-l-[3px] hover:border-l-[var(--accent-cyan)] hover:translate-x-1 transition-all duration-300 group items-center"
                  >
                    <span className="font-display text-xl text-[var(--light)]">{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      {player.photo ? (
                        <img src={player.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--black)] border border-[var(--grey)] flex items-center justify-center">
                          <User className="w-4 h-4 text-[var(--grey)]" />
                        </div>
                      )}
                      <div>
                        <span className="font-body text-base font-medium text-[var(--light)] group-hover:text-[var(--accent-cyan)] transition-colors block">
                          {player.nickname}
                        </span>
                        <span className="text-xs text-[var(--grey)]">{player.name}</span>
                      </div>
                    </div>
                    <span className="text-sm text-[var(--grey)] hidden md:block">
                      {player.teamName || "-"}
                    </span>
                    <div className="flex justify-center">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${roleBadgeClass(player.role)}`}>
                        {player.role}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <Badge variant="outline" className={`text-xs ${tierBadgeClass(player.tier)}`}>
                        Tier {player.tier}
                      </Badge>
                    </div>
                    <span className="font-display text-base text-[var(--accent-cyan)] text-right hidden md:block">
                      {player.statsKd?.toFixed(2) || "-"}
                    </span>
                    <span className="font-display text-base text-[var(--accent-cyan)] text-right hidden md:block">
                      {player.statsRating?.toFixed(2) || "-"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
