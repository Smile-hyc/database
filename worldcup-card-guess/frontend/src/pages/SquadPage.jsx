import { Activity, BadgeEuro, CreditCard, ShieldCheck, Star, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";
import StatusBadge from "../components/StatusBadge.jsx";

const positionNames = {
  GK: "门将",
  DF: "后卫",
  MF: "中场",
  FW: "前锋"
};

export default function SquadPage() {
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.hotSquads()
      .then((rows) => {
        setTeams(rows);
        setActiveTeamId(rows[0]?.team_id || null);
        const first = rows[0]?.positions?.FW?.[0] || rows[0]?.positions?.MF?.[0] || rows[0]?.positions?.DF?.[0] || rows[0]?.positions?.GK?.[0];
        if (first) loadPlayer(first.player_id);
      })
      .catch((err) => setError(err.message));
  }, []);

  const activeTeam = useMemo(() => teams.find((team) => team.team_id === activeTeamId), [teams, activeTeamId]);

  const loadPlayer = async (playerId) => {
    setLoadingPlayer(true);
    try {
      const detail = await api.playerDetail(playerId);
      setSelectedPlayer(detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPlayer(false);
    }
  };

  const selectTeam = (team) => {
    setActiveTeamId(team.team_id);
    const first = team.positions.FW[0] || team.positions.MF[0] || team.positions.DF[0] || team.positions.GK[0];
    if (first) loadPlayer(first.player_id);
  };

  if (error) return <Panel>{error}</Panel>;
  if (!activeTeam) return <Panel>正在加载国家队大名单...</Panel>;

  return (
    <div className="space-y-5">
      <section className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy">国家队大名单</h2>
            <p className="mt-1 text-sm text-slate-500">
              展示热门球队的公开资料整理名单，点击球员查看基础信息与关联球员卡。
            </p>
          </div>
          <div className="rounded-md bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-amber-200">
            热门 8 队 · 每队 18 人
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {teams.map((team) => (
            <button
              key={team.team_id}
              onClick={() => selectTeam(team)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold ring-1 transition ${
                team.team_id === activeTeamId
                  ? "bg-navy text-white ring-navy"
                  : "bg-white text-navy ring-slate-200 hover:bg-slate-50"
              }`}
            >
              <img src={team.flag_url} alt={team.team_name} className="h-5 w-7 rounded-sm object-cover" />
              {team.team_name}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeTeam.flag_url} alt={activeTeam.team_name} className="h-9 w-12 rounded-sm object-cover ring-1 ring-slate-200" />
              <div>
                <h3 className="text-lg font-bold text-navy">{activeTeam.team_name}</h3>
                <p className="text-sm text-slate-500">FIFA Rank #{activeTeam.fifa_rank}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-pitch">
              {Object.values(activeTeam.positions).flat().length} players
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {["GK", "DF", "MF", "FW"].map((position) => (
              <div key={position} className="rounded-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="font-bold text-navy">{positionNames[position]}</p>
                  <span className="text-xs font-semibold text-slate-500">{activeTeam.positions[position].length} 人</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {activeTeam.positions[position].map((player) => (
                    <button
                      key={player.player_id}
                      onClick={() => loadPlayer(player.player_id)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                        selectedPlayer?.player_id === player.player_id ? "bg-emerald-50" : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-navy">{player.player_name}</p>
                        <p className="text-sm text-slate-500">{player.club}</p>
                      </div>
                      <div className="rounded-md bg-navy px-2.5 py-1 text-sm font-black text-white">
                        {player.current_rating || "--"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <PlayerPanel player={selectedPlayer} loading={loadingPlayer} />
      </section>
    </div>
  );
}

function PlayerPanel({ player, loading }) {
  if (loading) return <Panel>正在加载球员详情...</Panel>;
  if (!player) return <Panel>选择一名球员查看详情</Panel>;

  return (
    <aside className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
      <div className="card-shine rounded-md p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white/70">{player.team_name} · {player.position}</p>
            <h3 className="mt-1 text-2xl font-black">{player.player_name}</h3>
          </div>
          <div className="rounded-md bg-white/16 px-3 py-2 text-3xl font-black">{player.current_rating}</div>
        </div>
        <div className="mt-10 flex items-center justify-between text-sm">
          <span>{player.card_type}</span>
          <span className="text-gold">{player.rarity}</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <InfoRow icon={UserRound} label="年龄" value={`${player.age} 岁`} />
        <InfoRow icon={ShieldCheck} label="俱乐部" value={player.club} />
        <InfoRow icon={BadgeEuro} label="估算身价" value={`${Number(player.market_value).toLocaleString()} 万欧`} />
        <InfoRow icon={CreditCard} label="卡片名称" value={player.card_name} />
        <InfoRow icon={Star} label="初始评分" value={player.base_rating} />
        <InfoRow icon={Activity} label="当前价值" value={`${Number(player.current_value).toLocaleString()} GP`} />
        <div className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-500">行情状态</span>
          <StatusBadge value={player.card_status} />
        </div>
      </div>
    </aside>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-right text-sm font-semibold text-navy">{value}</div>
    </div>
  );
}

function Panel({ children }) {
  return <div className="rounded-md bg-white p-8 text-center text-slate-600 shadow-soft ring-1 ring-slate-200">{children}</div>;
}
