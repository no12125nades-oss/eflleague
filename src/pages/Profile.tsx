import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Badge } from "@/components/ui/badge";
import { User, Target, BarChart3, Map, Shield, Users } from "lucide-react";
import { Link } from "react-router";

export default function Profile() {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();

  const { data: allTeams } = trpc.team.list.useQuery({});
  const userTeam = allTeams?.find((t) => t.id === user?.teamId);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-[var(--grey)] mx-auto mb-4" />
          <p className="text-[var(--grey)]">{t("login")} to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--dark)] py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-6 h-6 text-[var(--accent-cyan)]" />
            <h1 className="font-display text-4xl lg:text-5xl text-[var(--light)] uppercase">
              {t("profile")}
            </h1>
          </div>

          <div className="flex items-start gap-6">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-lg object-cover border-2 border-[var(--grey)]" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-[var(--black)] border-2 border-[var(--grey)] flex items-center justify-center">
                <User className="w-10 h-10 text-[var(--grey)]" />
              </div>
            )}
            <div>
              <h2 className="font-display text-3xl text-[var(--light)]">{user.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    user.role === "admin"
                      ? "border-[var(--accent-magenta)] text-[var(--accent-magenta)]"
                      : "border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                  }`}
                >
                  {user.role === "admin" ? (
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {t("admin")}</span>
                  ) : (
                    "User"
                  )}
                </Badge>
                {userTeam && (
                  <Link to={`/team/${userTeam.id}`}>
                    <Badge variant="outline" className="text-xs border-[var(--accent-green)] text-[var(--accent-green)]">
                      <Users className="w-3 h-3 mr-1" />
                      {userTeam.name}
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[var(--black)] border border-[var(--grey)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-[var(--accent-cyan)]" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("kd")}</span>
            </div>
            <span className="font-display text-3xl text-[var(--accent-cyan)]">
              {user.statsKd?.toFixed(2) || "-"}
            </span>
          </div>
          <div className="bg-[var(--black)] border border-[var(--grey)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-[var(--accent-magenta)]" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("rating")}</span>
            </div>
            <span className="font-display text-3xl text-[var(--accent-magenta)]">
              {user.statsRating?.toFixed(2) || "-"}
            </span>
          </div>
          <div className="bg-[var(--black)] border border-[var(--grey)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-5 h-5 text-[var(--accent-green)]" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold">{t("maps")}</span>
            </div>
            <span className="font-display text-3xl text-[var(--accent-green)]">
              {user.statsMaps || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
