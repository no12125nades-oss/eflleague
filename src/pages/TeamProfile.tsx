import { useParams, Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, MapPin, Star, User } from "lucide-react";

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

export default function TeamProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const teamId = Number(id);

  const { data: team, isLoading } = trpc.team.getById.useQuery({ id: teamId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center">
        <div className="text-[var(--grey)]">Loading...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center">
        <div className="text-[var(--grey)]">Team not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--dark)] py-8 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          to="/ratings"
          className="inline-flex items-center gap-2 text-sm text-[var(--grey)] hover:text-[var(--light)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </Link>

        {/* Team Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-[var(--black)] border-2 border-[var(--grey)] flex items-center justify-center">
                <Users className="w-8 h-8 text-[var(--grey)]" />
              </div>
            )}
            <div>
              <h1 className="font-display text-5xl lg:text-7xl text-[var(--light)] uppercase">
                {team.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={`text-xs ${tierBadgeClass(team.tier)}`}>
                  Tier {team.tier}
                </Badge>
                {team.region && (
                  <span className="flex items-center gap-1 text-xs text-[var(--grey)]">
                    <MapPin className="w-3 h-3" />
                    {team.region}
                  </span>
                )}
                {team.country && (
                  <span className="text-xs text-[var(--grey)]">{team.country}</span>
                )}
              </div>
            </div>
          </div>

          {team.description && (
            <p className="text-sm text-[var(--grey)] max-w-2xl">{team.description}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[var(--black)] border border-[var(--grey)] p-4">
            <span className="text-xs text-[var(--grey)] uppercase font-bold block mb-1">{t("points")}</span>
            <span className="font-display text-3xl text-[var(--accent-cyan)]">{team.points}</span>
          </div>
          <div className="bg-[var(--black)] border border-[var(--grey)] p-4">
            <span className="text-xs text-[var(--grey)] uppercase font-bold block mb-1">{t("rank")}</span>
            <span className="font-display text-3xl text-[var(--accent-cyan)]">#{team.worldRank || "-"}</span>
          </div>
          <div className="bg-[var(--black)] border border-[var(--grey)] p-4">
            <span className="text-xs text-[var(--grey)] uppercase font-bold block mb-1">{t("coach")}</span>
            <span className="font-display text-xl text-[var(--light)]">{team.coach || "-"}</span>
          </div>
          <div className="bg-[var(--black)] border border-[var(--grey)] p-4">
            <span className="text-xs text-[var(--grey)] uppercase font-bold block mb-1">{t("roster")}</span>
            <span className="font-display text-3xl text-[var(--accent-cyan)]">{team.players?.length || 0}</span>
          </div>
        </div>

        {/* Roster */}
        <div>
          <h2 className="font-display text-3xl text-[var(--light)] uppercase mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-[var(--accent-cyan)]" />
            {t("roster")}
          </h2>

          {!team.players?.length ? (
            <div className="text-[var(--grey)] py-8">No players in roster</div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[60px_1fr_100px_80px_80px] gap-4 px-4 py-2 border-b border-[var(--light)] text-xs text-[var(--grey)] uppercase font-bold">
                <span>#</span>
                <span>{t("player")}</span>
                <span className="text-center">{t("role")}</span>
                <span className="text-right">{t("kd")}</span>
                <span className="text-right">{t("rating")}</span>
              </div>

              {team.players.map((player, idx) => (
                <Link
                  key={player.id}
                  to={`/player/${player.id}`}
                  className="grid grid-cols-1 md:grid-cols-[60px_1fr_100px_80px_80px] gap-2 md:gap-4 px-4 py-3 border-b border-dashed border-[var(--grey)] hover:bg-[rgba(0,229,255,0.05)] hover:border-l-[3px] hover:border-l-[var(--accent-cyan)] transition-all duration-300 group items-center"
                >
                  <span className="font-display text-lg text-[var(--light)]">{idx + 1}</span>
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
                  <div className="flex justify-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${roleBadgeClass(player.role)}`}>
                      {player.role}
                    </span>
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
      </div>
    </div>
  );
}
