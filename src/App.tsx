import { Routes, Route } from "react-router";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Ratings from "@/pages/Ratings";
import Matches from "@/pages/Matches";
import TeamProfile from "@/pages/TeamProfile";
import PlayerProfile from "@/pages/PlayerProfile";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ratings" element={<Ratings />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/team/:id" element={<TeamProfile />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </I18nProvider>
  );
}
