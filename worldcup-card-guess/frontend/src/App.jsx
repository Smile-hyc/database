import { CalendarCheck, CreditCard, Home, Medal, Shield, Trash2, Trophy, UsersRound } from "lucide-react";
import { useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import GuessPage from "./pages/GuessPage.jsx";
import MarketPage from "./pages/MarketPage.jsx";
import SquadPage from "./pages/SquadPage.jsx";
import RankingPage from "./pages/RankingPage.jsx";
import FinishMatchPage from "./pages/FinishMatchPage.jsx";
import MatchManagePage from "./pages/MatchManagePage.jsx";

const tabs = [
  { id: "dashboard", label: "首页", icon: Home },
  { id: "guess", label: "世界杯竞猜", icon: Trophy },
  { id: "market", label: "球员卡行情", icon: CreditCard },
  { id: "squads", label: "国家队大名单", icon: UsersRound },
  { id: "ranking", label: "积分排行榜", icon: Medal },
  { id: "finish", label: "赛果录入", icon: CalendarCheck },
  { id: "manage", label: "比赛管理", icon: Trash2 }
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const ActivePage = {
    dashboard: Dashboard,
    guess: GuessPage,
    market: MarketPage,
    squads: SquadPage,
    ranking: RankingPage,
    finish: FinishMatchPage,
    manage: MatchManagePage
  }[active];

  return (
    <div className="min-h-screen bg-mist">
      <header className="hero-pattern text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/12 ring-1 ring-white/20">
                <Shield className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-white/70">Database Coursework</p>
                <h1 className="text-2xl font-bold tracking-normal md:text-3xl">世界杯竞猜与实况足球球员卡数据管理系统</h1>
              </div>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                    selected ? "bg-white text-navy shadow-soft" : "bg-white/10 text-white/80 hover:bg-white/18"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <ActivePage navigate={setActive} />
      </main>
    </div>
  );
}
