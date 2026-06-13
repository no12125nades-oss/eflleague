import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

type UnifiedUser = {
  id: number;
  name: string;
  email: string | null;
  avatar: string | null;
  role: string;
  teamId?: number | null;
  statsKd?: number | null;
  statsRating?: number | null;
  statsMaps?: number | null;
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  const user: UnifiedUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        email: oauthUser.email || null,
        avatar: oauthUser.avatar || null,
        role: oauthUser.role,
      };
    }
    if (localUser) {
      return {
        id: localUser.id,
        name: localUser.displayName || localUser.username,
        email: localUser.email || null,
        avatar: localUser.avatar || null,
        role: localUser.role,
        teamId: localUser.teamId,
        statsKd: localUser.statsKd,
        statsRating: localUser.statsRating,
        statsMaps: localUser.statsMaps,
      };
    }
    return null;
  }, [oauthUser, localUser]);

  const isLoading = oauthLoading || localLoading;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isAdmin,
      logout,
    }),
    [user, isAuthenticated, isLoading, isAdmin, logout],
  );
}
