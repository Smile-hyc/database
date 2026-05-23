import { ArrowRight, CreditCard, Flag, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Dashboard({ navigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <EmptyState message={error} />;
  if (!data) return <EmptyState message="正在加载首页数据..." />;

  const stats = [
    { label: "参赛球队", value: data.stats.team_count, icon: Flag },
    { label: "球员卡数量", value: data.stats.card_count, icon: CreditCard },
    { label: "开放竞猜", value: data.stats.open_guess_count, icon: Trophy },
    { label: "最高用户积分", value: data.stats.top_user_points, icon: Star }
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <Icon className="h-5 w-5 text-pitch" />
              </div>
              <p className="mt-4 text-3xl font-bold text-navy">{item.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md bg-white p-6 shadow-soft ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">热门球员卡</h2>
            <button onClick={() => navigate("market")} className="flex items-center gap-2 text-sm font-semibold text-pitch">
              查看行情 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.top_cards.map((card) => (
              <div key={card.card_id} className="card-shine rounded-md p-4 text-white shadow-soft">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/70">{card.team_name}</p>
                    <h3 className="mt-1 text-lg font-bold">{card.player_name}</h3>
                  </div>
                  <div className="rounded-md bg-white/16 px-3 py-2 text-2xl font-black">{card.current_rating}</div>
                </div>
                <div className="mt-8 flex items-center justify-between text-sm">
                  <span>{card.card_type}</span>
                  <span className="font-semibold text-gold">{Number(card.current_value).toLocaleString()} GP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-white p-6 shadow-soft ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">即将开始</h2>
            <button onClick={() => navigate("guess")} className="flex items-center gap-2 text-sm font-semibold text-pitch">
              去竞猜 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {data.upcoming_matches.map((match) => (
              <div key={match.match_id} className="rounded-md border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-navy">{match.home_team} vs {match.away_team}</p>
                  <StatusBadge value={match.status} />
                </div>
                <p className="mt-2 text-sm text-slate-500">{match.stage} · {match.match_time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="rounded-md bg-white p-8 text-center text-slate-600 shadow-soft ring-1 ring-slate-200">{message}</div>;
}
