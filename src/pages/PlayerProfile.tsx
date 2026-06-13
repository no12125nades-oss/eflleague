import { useParams, Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Target, Map, BarChart3, Upload } from "lucide-react";
import { useState } from "react";

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

const tierBadgeClass = (tier: string) => {
  switch (tier) {
    case "1": return "border-[var(--accent-green)] text-[var(--accent-green)]";
    case "2": return "border-[var(--accent-cyan)] text-[var(--accent-cyan)]";
    case "3": return "border-[var(--accent-magenta)] text-[var(--accent-magenta)]";
    default: return "border-[var(--grey)] text-[var(--grey)]";
  }
};

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const playerId = Number(id);

  const { data: player, isLoading, refetch } = trpc.player.getById.useQuery({ id: playerId });
  const updatePlayer = trpc.player.update.useMutation({ onSuccess: () => refetch() });

  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to a simple image hosting or use base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updatePlayer.mutate({ id: playerId, photo: base64 });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center">
        <div className="text-[var(--grey)]">Loading...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center">
        <div className="text-[var(--grey)]">Player not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--dark)] py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          to="/ratings"
          className="inline-flex items-center gap-2 text-sm text-[var(--grey)] hover:text-[var(--light)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </Link>

        {/* Player Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {/* Photo */}
            <div className="relative shrink-0">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.nickname}
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg object-cover border-2 border-[var(--grey)]"
                />
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg bg-[var(--black)] border-2 border-[var(--grey)] flex items-center justify-center">
                  <User className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--grey)]" />
                </div>
              )}
              {isAdmin && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--accent-magenta)] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                  <Upload className="w-4 h-4 text-[var(--dark)]" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-display text-5xl lg:text-6xl text-[var(--light)] uppercase">
                {player.nickname}
              </h1>
              <p className="text-sm text-[var(--grey)] mt-1">{player.name}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${roleBadgeClass(player.role)}`}>
                  {player.role}
                </span>
                <Badge variant="outline" className={`text-xs ${tierBadgeClass(player.tier)}`}>
                  Tier {player.tier}
                </Badge>
                {player.teamName && (
                  <Link
                    to={`/team/${player.teamId}`}
                    className="text-xs text-[var(--accent-cyan)] hover:underline font-bold uppercase"
                  >
                    {player.teamName}
                  </Link>
                )}
                {player.country && (
                  <span className="text-xs text-[var(--grey)]">{player.country}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--black)] border border-[var(--grey)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("kd")}</span>
            </div>
            <span className="font-display text-4xl text-[var(--accent-cyan)]">
              {player.statsKd?.toFixed(2) || "-"}
            </span>
          </div>
          <div className="bg-[var(--black)] border border-[var(--grey)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-[var(--accent-magenta)]" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("rating")}</span>
            </div>
            <span className="font-display text-4xl text-[var(--accent-magenta)]">
              {player.statsRating?.toFixed(2) || "-"}
            </span>
          </div>
          <div className="bg-[var(--black)] border border-[var(--grey)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-[var(--accent-green)]" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("maps")}</span>
            </div>
            <span className="font-display text-4xl text-[var(--accent-green)]">
              {player.statsMaps || "-"}
            </span>
          </div>
        </div>

        {/* Role Description */}
        <div className="bg-[var(--black)] border border-[var(--grey)] p-6">
          <h3 className="font-display text-xl text-[var(--light)] uppercase mb-3">
            {t("role")}: {player.role.toUpperCase()}
          </h3>
          <p className="text-sm text-[var(--grey)]">
            {player.role === "awper" && "Primary sniper responsible for long-range engagements and opening picks."}
            {player.role === "entry" && "First player into bombsites, creates space and finds opening kills."}
            {player.role === "igl" && "In-Game Leader who makes strategic calls and coordinates team movements."}
            {player.role === "lurk" && "Plays independently to catch rotating enemies and create map pressure."}
            {player.role === "support" && "Provides utility, flashes, and backup for teammates during executes."}
          </p>
        </div>
      </div>
    </div>
  );
}
