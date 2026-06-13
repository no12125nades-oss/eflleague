import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogIn, UserPlus, Shield } from "lucide-react";

export default function Auth() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => setError(err.message),
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => setError(err.message),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    registerMutation.mutate({ username, password, displayName: displayName || username });
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-[var(--light)] tracking-wider">EFL</h1>
          <p className="text-xs text-[var(--grey)] uppercase tracking-widest mt-1">{t("electronicFutureLeague")}</p>
        </div>

        <Card className="bg-[var(--black)] border-[var(--grey)]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl text-[var(--light)] uppercase">
              {t("welcome")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => { setTab(v as "login" | "register"); setError(""); }}>
              <TabsList className="w-full bg-[var(--dark)] border border-[var(--grey)] mb-6">
                <TabsTrigger
                  value="login"
                  className="flex-1 data-[state=active]:bg-[var(--accent-cyan)] data-[state=active]:text-[var(--dark)] text-[var(--grey)] font-bold uppercase text-xs"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {t("login")}
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex-1 data-[state=active]:bg-[var(--accent-magenta)] data-[state=active]:text-[var(--dark)] text-[var(--grey)] font-bold uppercase text-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  {t("register")}
                </TabsTrigger>
              </TabsList>

              {/* Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase text-[var(--grey)] font-bold">{t("username")}</Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)] mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-[var(--grey)] font-bold">{t("password")}</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="adminknjazx"
                      className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)] mt-1"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--accent-cyan)] text-[var(--dark)] hover:bg-[var(--accent-cyan)]/80 font-bold uppercase"
                  >
                    {isLoading ? "..." : t("signIn")}
                  </Button>
                </form>

                <div className="mt-4 p-3 border border-dashed border-[var(--grey)] rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-[var(--accent-magenta)]" />
                    <span className="text-xs font-bold text-[var(--accent-magenta)] uppercase">{t("admin")}</span>
                  </div>
                  <p className="text-xs text-[var(--grey)]">{t("adminCredentials")}</p>
                </div>
              </TabsContent>

              {/* Register */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase text-[var(--grey)] font-bold">{t("username")} *</Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)] mt-1"
                      required
                      minLength={3}
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-[var(--grey)] font-bold">{t("displayName")}</Label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                      className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)] mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-[var(--grey)] font-bold">{t("password")} *</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      className="bg-[var(--dark)] border-[var(--grey)] text-[var(--light)] mt-1"
                      required
                      minLength={4}
                    />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--accent-magenta)] text-[var(--dark)] hover:bg-[var(--accent-magenta)]/80 font-bold uppercase"
                  >
                    {isLoading ? "..." : t("createAccount")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
