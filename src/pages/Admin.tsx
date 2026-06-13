import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Users,
  UserPlus,
  Swords,
  Trash2,
  Edit,
  Plus,
  BarChart3,
} from "lucide-react";

type AdminTab = "dashboard" | "teams" | "players" | "matches";

export default function Admin() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form states
  const [teamForm, setTeamForm] = useState({ name: "", tier: "1" as "1" | "2" | "3", region: "", description: "", points: 0, worldRank: 0, coach: "", country: "" });
  const [playerForm, setPlayerForm] = useState({ name: "", nickname: "", role: "awper" as "awper" | "entry" | "igl" | "lurk" | "support", tier: "1" as "1" | "2" | "3", teamId: "", statsKd: 0, statsRating: 0, statsMaps: 0, country: "" });
  const [matchForm, setMatchForm] = useState({ team1Id: "", team2Id: "", team1Score: 0, team2Score: 0, status: "upcoming" as "upcoming" | "ongoing" | "finished", matchDate: "", matchTime: "" });

  const utils = trpc.useUtils();
  const { data: teams } = trpc.team.list.useQuery({});
  const { data: players } = trpc.player.list.useQuery({});
  const { data: matches } = trpc.match.list.useQuery({});

  const createTeam = trpc.team.create.useMutation({ onSuccess: () => { utils.team.list.invalidate(); setDialogOpen(false); resetForms(); } });
  const updateTeam = trpc.team.update.useMutation({ onSuccess: () => { utils.team.list.invalidate(); setDialogOpen(false); resetForms(); } });
  const deleteTeam = trpc.team.delete.useMutation({ onSuccess: () => utils.team.list.invalidate() });

  const createPlayer = trpc.player.create.useMutation({ onSuccess: () => { utils.player.list.invalidate(); setDialogOpen(false); resetForms(); } });
  const updatePlayer = trpc.player.update.useMutation({ onSuccess: () => { utils.player.list.invalidate(); setDialogOpen(false); resetForms(); } });
  const deletePlayer = trpc.player.delete.useMutation({ onSuccess: () => utils.player.list.invalidate() });

  const createMatch = trpc.match.create.useMutation({ onSuccess: () => { utils.match.list.invalidate(); setDialogOpen(false); resetForms(); } });
  const updateMatch = trpc.match.update.useMutation({ onSuccess: () => { utils.match.list.invalidate(); setDialogOpen(false); resetForms(); } });
  const deleteMatch = trpc.match.delete.useMutation({ onSuccess: () => utils.match.list.invalidate() });

  const resetForms = () => {
    setEditId(null);
    setTeamForm({ name: "", tier: "1", region: "", description: "", points: 0, worldRank: 0, coach: "", country: "" });
    setPlayerForm({ name: "", nickname: "", role: "awper", tier: "1", teamId: "", statsKd: 0, statsRating: 0, statsMaps: 0, country: "" });
    setMatchForm({ team1Id: "", team2Id: "", team1Score: 0, team2Score: 0, status: "upcoming", matchDate: "", matchTime: "" });
  };

  const openEditDialog = (id: number, type: AdminTab) => {
    setEditId(id);
    if (type === "teams") {
      const team = teams?.find((t) => t.id === id);
      if (team) {
        setTeamForm({
          name: team.name,
          tier: team.tier as "1" | "2" | "3",
          region: team.region || "",
          description: team.description || "",
          points: team.points,
          worldRank: team.worldRank || 0,
          coach: team.coach || "",
          country: team.country || "",
        });
      }
    } else if (type === "players") {
      const player = players?.find((p) => p.id === id);
      if (player) {
        setPlayerForm({
          name: player.name,
          nickname: player.nickname,
          role: player.role as "awper" | "entry" | "igl" | "lurk" | "support",
          tier: player.tier as "1" | "2" | "3",
          teamId: player.teamId?.toString() || "",
          statsKd: player.statsKd || 0,
          statsRating: player.statsRating || 0,
          statsMaps: player.statsMaps || 0,
          country: player.country || "",
        });
      }
    } else if (type === "matches") {
      const match = matches?.find((m) => m.id === id);
      if (match) {
        setMatchForm({
          team1Id: match.team1Id.toString(),
          team2Id: match.team2Id.toString(),
          team1Score: match.team1Score || 0,
          team2Score: match.team2Score || 0,
          status: match.status as "upcoming" | "ongoing" | "finished",
          matchDate: match.matchDate ? String(match.matchDate) : "",
          matchTime: match.matchTime ? String(match.matchTime) : "",
        });
      }
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (tab === "teams") {
      if (editId) {
        updateTeam.mutate({ id: editId, ...teamForm });
      } else {
        createTeam.mutate(teamForm);
      }
    } else if (tab === "players") {
      const data = { ...playerForm, teamId: playerForm.teamId ? Number(playerForm.teamId) : undefined };
      if (editId) {
        updatePlayer.mutate({ id: editId, ...data });
      } else {
        createPlayer.mutate(data);
      }
    } else if (tab === "matches") {
      const data = {
        ...matchForm,
        team1Id: Number(matchForm.team1Id),
        team2Id: Number(matchForm.team2Id),
      };
      if (editId) {
        updateMatch.mutate({ id: editId, ...data });
      } else {
        createMatch.mutate(data);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-[var(--accent-magenta)] mx-auto mb-4" />
          <h1 className="font-display text-3xl text-[var(--light)] mb-2">{t("admin")}</h1>
          <p className="text-sm text-[var(--grey)]">{t("enterAsAdmin")}</p>
          <p className="text-xs text-[var(--grey)] mt-2">{t("adminCredentials")}</p>
        </div>
      </div>
    );
  }

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: t("dashboard"), icon: <BarChart3 className="w-4 h-4" /> },
    { key: "teams", label: t("manageTeams"), icon: <Users className="w-4 h-4" /> },
    { key: "players", label: t("managePlayers"), icon: <UserPlus className="w-4 h-4" /> },
    { key: "matches", label: t("manageMatches"), icon: <Swords className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--dark)] py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-[var(--accent-magenta)]" />
          <h1 className="font-display text-4xl lg:text-5xl text-[var(--light)] uppercase">
            {t("admin")}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); resetForms(); }}
              className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold uppercase transition-all duration-300 ${
                tab === item.key
                  ? "border-[var(--accent-magenta)] bg-[var(--accent-magenta)] text-[var(--dark)]"
                  : "border-[var(--grey)] text-[var(--grey)] hover:border-[var(--light)] hover:text-[var(--light)]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--black)] border border-[var(--grey)] p-6">
              <Users className="w-8 h-8 text-[var(--accent-cyan)] mb-3" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold block mb-1">{t("totalTeams")}</span>
              <span className="font-display text-4xl text-[var(--accent-cyan)]">{teams?.length || 0}</span>
            </div>
            <div className="bg-[var(--black)] border border-[var(--grey)] p-6">
              <UserPlus className="w-8 h-8 text-[var(--accent-magenta)] mb-3" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold block mb-1">{t("totalPlayers")}</span>
              <span className="font-display text-4xl text-[var(--accent-magenta)]">{players?.length || 0}</span>
            </div>
            <div className="bg-[var(--black)] border border-[var(--grey)] p-6">
              <Swords className="w-8 h-8 text-[var(--accent-green)] mb-3" />
              <span className="text-xs text-[var(--grey)] uppercase font-bold block mb-1">{t("totalMatches")}</span>
              <span className="font-display text-4xl text-[var(--accent-green)]">{matches?.length || 0}</span>
            </div>
          </div>
        )}

        {/* Teams */}
        {tab === "teams" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-2xl text-[var(--light)]">{t("manageTeams")}</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForms} size="sm" className="bg-[var(--accent-cyan)] text-[var(--dark)] hover:bg-[var(--accent-cyan)]/80">
                    <Plus className="w-4 h-4 mr-1" />
                    {t("add")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--black)] border-[var(--grey)] text-[var(--light)] max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl uppercase">
                      {editId ? t("edit") : t("create")} {t("team")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("name")} *</Label>
                      <Input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("tier")} *</Label>
                      <Select value={teamForm.tier} onValueChange={(v) => setTeamForm({ ...teamForm, tier: v as "1" | "2" | "3" })}>
                        <SelectTrigger className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                          <SelectItem value="1">Tier 1</SelectItem>
                          <SelectItem value="2">Tier 2</SelectItem>
                          <SelectItem value="3">Tier 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("region")}</Label>
                      <Input value={teamForm.region} onChange={(e) => setTeamForm({ ...teamForm, region: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("points")}</Label>
                      <Input type="number" value={teamForm.points} onChange={(e) => setTeamForm({ ...teamForm, points: Number(e.target.value) })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("coach")}</Label>
                      <Input value={teamForm.coach} onChange={(e) => setTeamForm({ ...teamForm, coach: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("country")}</Label>
                      <Input value={teamForm.country} onChange={(e) => setTeamForm({ ...teamForm, country: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                    </div>
                    <Button onClick={handleSubmit} className="w-full bg-[var(--accent-cyan)] text-[var(--dark)] hover:bg-[var(--accent-cyan)]/80">
                      {editId ? t("save") : t("create")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {teams?.map((team) => (
                <div key={team.id} className="flex items-center gap-4 px-4 py-3 bg-[var(--black)] border border-[var(--grey)] hover:border-[var(--accent-cyan)] transition-colors">
                  <span className="font-display text-lg text-[var(--light)] w-8">{team.id}</span>
                  <span className="flex-1 font-body text-sm text-[var(--light)]">{team.name}</span>
                  <Badge variant="outline" className={`text-xs ${team.tier === "1" ? "border-[var(--accent-green)] text-[var(--accent-green)]" : team.tier === "2" ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)]" : "border-[var(--accent-magenta)] text-[var(--accent-magenta)]"}`}>
                    Tier {team.tier}
                  </Badge>
                  <span className="text-sm text-[var(--accent-cyan)] font-display w-20 text-right">{team.points} pts</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(team.id, "teams")} className="text-[var(--grey)] hover:text-[var(--accent-cyan)]">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteTeam.mutate({ id: team.id })} className="text-[var(--grey)] hover:text-[var(--accent-magenta)]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        {tab === "players" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-2xl text-[var(--light)]">{t("managePlayers")}</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForms} size="sm" className="bg-[var(--accent-magenta)] text-[var(--dark)] hover:bg-[var(--accent-magenta)]/80">
                    <Plus className="w-4 h-4 mr-1" />
                    {t("add")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--black)] border-[var(--grey)] text-[var(--light)] max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl uppercase">
                      {editId ? t("edit") : t("create")} {t("player")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("name")} *</Label>
                      <Input value={playerForm.name} onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("nickname")} *</Label>
                      <Input value={playerForm.nickname} onChange={(e) => setPlayerForm({ ...playerForm, nickname: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("role")} *</Label>
                      <Select value={playerForm.role} onValueChange={(v) => setPlayerForm({ ...playerForm, role: v as "awper" | "entry" | "igl" | "lurk" | "support" })}>
                        <SelectTrigger className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                          <SelectItem value="awper">Awper</SelectItem>
                          <SelectItem value="entry">Entry</SelectItem>
                          <SelectItem value="igl">IGL</SelectItem>
                          <SelectItem value="lurk">Lurk</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("tier")} *</Label>
                      <Select value={playerForm.tier} onValueChange={(v) => setPlayerForm({ ...playerForm, tier: v as "1" | "2" | "3" })}>
                        <SelectTrigger className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                          <SelectItem value="1">Tier 1</SelectItem>
                          <SelectItem value="2">Tier 2</SelectItem>
                          <SelectItem value="3">Tier 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("selectTeam")}</Label>
                      <Select value={playerForm.teamId} onValueChange={(v) => setPlayerForm({ ...playerForm, teamId: v })}>
                        <SelectTrigger className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                          <SelectItem value="">None</SelectItem>
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs uppercase text-[var(--grey)]">{t("kd")}</Label>
                        <Input type="number" step="0.01" value={playerForm.statsKd} onChange={(e) => setPlayerForm({ ...playerForm, statsKd: Number(e.target.value) })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                      </div>
                      <div>
                        <Label className="text-xs uppercase text-[var(--grey)]">{t("rating")}</Label>
                        <Input type="number" step="0.01" value={playerForm.statsRating} onChange={(e) => setPlayerForm({ ...playerForm, statsRating: Number(e.target.value) })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                      </div>
                      <div>
                        <Label className="text-xs uppercase text-[var(--grey)]">{t("maps")}</Label>
                        <Input type="number" value={playerForm.statsMaps} onChange={(e) => setPlayerForm({ ...playerForm, statsMaps: Number(e.target.value) })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                      </div>
                    </div>
                    <Button onClick={handleSubmit} className="w-full bg-[var(--accent-magenta)] text-[var(--dark)] hover:bg-[var(--accent-magenta)]/80">
                      {editId ? t("save") : t("create")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {players?.map((player) => (
                <div key={player.id} className="flex items-center gap-4 px-4 py-3 bg-[var(--black)] border border-[var(--grey)] hover:border-[var(--accent-magenta)] transition-colors">
                  <span className="font-display text-lg text-[var(--light)] w-8">{player.id}</span>
                  <div className="flex-1">
                    <span className="font-body text-sm text-[var(--light)] block">{player.nickname}</span>
                    <span className="text-xs text-[var(--grey)]">{player.name}</span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${player.role === "awper" ? "bg-[#00e5ff] text-[#0c0d0e] border-[#00e5ff]" : player.role === "entry" ? "bg-[#ff00aa] text-[#0c0d0e] border-[#ff00aa]" : player.role === "igl" ? "bg-[#00ff88] text-[#0c0d0e] border-[#00ff88]" : player.role === "lurk" ? "bg-[#5f5f5f] text-[#f5f5f5] border-[#5f5f5f]" : "bg-[#ffcc00] text-[#0c0d0e] border-[#ffcc00]"}`}>
                    {player.role}
                  </Badge>
                  <span className="text-xs text-[var(--grey)] w-24 truncate">{player.teamName || "No team"}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(player.id, "players")} className="text-[var(--grey)] hover:text-[var(--accent-cyan)]">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deletePlayer.mutate({ id: player.id })} className="text-[var(--grey)] hover:text-[var(--accent-magenta)]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matches */}
        {tab === "matches" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-2xl text-[var(--light)]">{t("manageMatches")}</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForms} size="sm" className="bg-[var(--accent-green)] text-[var(--dark)] hover:bg-[var(--accent-green)]/80">
                    <Plus className="w-4 h-4 mr-1" />
                    {t("add")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--black)] border-[var(--grey)] text-[var(--light)] max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl uppercase">
                      {editId ? t("edit") : t("create")} {t("matches")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("team1")} *</Label>
                      <Select value={matchForm.team1Id} onValueChange={(v) => setMatchForm({ ...matchForm, team1Id: v })}>
                        <SelectTrigger className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("team2")} *</Label>
                      <Select value={matchForm.team2Id} onValueChange={(v) => setMatchForm({ ...matchForm, team2Id: v })}>
                        <SelectTrigger className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs uppercase text-[var(--grey)]">{t("team1")} {t("score")}</Label>
                        <Input type="number" value={matchForm.team1Score} onChange={(e) => setMatchForm({ ...matchForm, team1Score: Number(e.target.value) })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                      </div>
                      <div>
                        <Label className="text-xs uppercase text-[var(--grey)]">{t("team2")} {t("score")}</Label>
                        <Input type="number" value={matchForm.team2Score} onChange={(e) => setMatchForm({ ...matchForm, team2Score: Number(e.target.value) })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-[var(--grey)]">{t("status")} *</Label>
                      <Select value={matchForm.status} onValueChange={(v) => setMatchForm({ ...matchForm, status: v as "upcoming" | "ongoing" | "finished" })}>
                        <SelectTrigger className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[var(--black)] border-[var(--grey)]">
                          <SelectItem value="upcoming">{t("upcoming")}</SelectItem>
                          <SelectItem value="ongoing">{t("ongoing")}</SelectItem>
                          <SelectItem value="finished">{t("finished")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs uppercase text-[var(--grey)]">{t("matchDate")}</Label>
                        <Input type="date" value={matchForm.matchDate} onChange={(e) => setMatchForm({ ...matchForm, matchDate: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                      </div>
                      <div>
                        <Label className="text-xs uppercase text-[var(--grey)]">{t("matchTime")}</Label>
                        <Input type="time" value={matchForm.matchTime} onChange={(e) => setMatchForm({ ...matchForm, matchTime: e.target.value })} className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)]" />
                      </div>
                    </div>
                    <Button onClick={handleSubmit} className="w-full bg-[var(--accent-green)] text-[var(--dark)] hover:bg-[var(--accent-green)]/80">
                      {editId ? t("save") : t("create")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {matches?.map((match) => (
                <div key={match.id} className="flex items-center gap-4 px-4 py-3 bg-[var(--black)] border border-[var(--grey)] hover:border-[var(--accent-green)] transition-colors">
                  <span className="font-display text-lg text-[var(--light)] w-8">{match.id}</span>
                  <div className="flex-1">
                    <span className="font-body text-sm text-[var(--light)] block">
                      {match.team1Name} vs {match.team2Name}
                    </span>
                    <span className="text-xs text-[var(--grey)]">
                      {String(match.matchDate)} {match.matchTime ? String(match.matchTime).slice(0, 5) : ""} | {match.team1Score ?? 0}-{match.team2Score ?? 0}
                    </span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${match.status === "upcoming" ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)]" : match.status === "ongoing" ? "bg-[var(--accent-magenta)] text-[var(--dark)]" : "border-[var(--accent-green)] text-[var(--accent-green)]"}`}>
                    {match.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(match.id, "matches")} className="text-[var(--grey)] hover:text-[var(--accent-cyan)]">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteMatch.mutate({ id: match.id })} className="text-[var(--grey)] hover:text-[var(--accent-magenta)]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
