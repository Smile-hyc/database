import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function MarketPage() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.cardMarket().then(setCards).catch((err) => setError(err.message));
  }, []);

  if (error) return <Panel>{error}</Panel>;

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-navy">球员卡行情页</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.card_id} className="overflow-hidden rounded-md bg-white shadow-soft ring-1 ring-slate-200">
            <div className="card-shine p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/70">{card.team_name} · {card.position}</p>
                  <h3 className="mt-1 text-xl font-bold">{card.player_name}</h3>
                </div>
                <div className="rounded-md bg-white/16 px-3 py-2 text-3xl font-black">{card.current_rating}</div>
              </div>
              <div className="mt-10 flex items-center justify-between text-sm">
                <span>{card.card_type}</span>
                <span className="text-gold">{card.rarity}</span>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">俱乐部</span>
                <span className="font-semibold text-navy">{card.club}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">当前价值</span>
                <span className="font-bold text-navy">{Number(card.current_value).toLocaleString()} GP</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">身价</span>
                <span>{Number(card.market_value).toLocaleString()} 万欧</span>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge value={card.status} />
                {card.status === "rising" ? <TrendingUp className="h-5 w-5 text-emerald-600" /> : card.status === "falling" ? <TrendingDown className="h-5 w-5 text-rose-600" /> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Panel({ children }) {
  return <div className="rounded-md bg-white p-8 text-center text-slate-600 shadow-soft ring-1 ring-slate-200">{children}</div>;
}
