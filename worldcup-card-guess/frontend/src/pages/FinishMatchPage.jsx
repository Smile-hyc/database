import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Message from "../components/Message.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function FinishMatchPage() {
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [records, setRecords] = useState([]);

  const load = () => api.matches().then(setMatches).catch((err) => setMessage({ type: "error", text: err.message }));

  useEffect(() => {
    load();
  }, []);

  const updateScore = (matchId, patch) => {
    setScores((prev) => ({ ...prev, [matchId]: { home_score: 2, away_score: 1, ...(prev[matchId] || {}), ...patch } }));
  };

  const finish = async (match) => {
    const score = scores[match.match_id] || { home_score: 2, away_score: 1 };
    try {
      const data = await api.finishMatch(match.match_id, {
        home_score: Number(score.home_score),
        away_score: Number(score.away_score)
      });
      setRecords(data.point_records || []);
      setMessage({ type: "success", text: `${match.home_team} vs ${match.away_team} 已调用存储过程完成结算` });
      load();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-navy">管理员赛果录入与结算页</h2>
        <p className="mt-1 text-sm text-slate-500">点击后端接口调用 sp_finish_match_and_settle_points 存储过程。</p>
      </div>
      <Message type={message.type}>{message.text}</Message>
      {records.length > 0 && (
        <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
          <h3 className="mb-3 font-bold text-navy">本次积分记录</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {records.map((record) => (
              <div key={record.record_id} className="rounded-md border border-slate-200 p-3 text-sm">
                <span className="font-semibold">{record.nickname}</span>
                <span className="ml-2 text-pitch">+{record.points_change}</span>
                <p className="mt-1 text-slate-500">{record.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => {
          const score = scores[match.match_id] || { home_score: match.home_score ?? 2, away_score: match.away_score ?? 1 };
          return (
            <div key={match.match_id} className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-navy">{match.home_team} vs {match.away_team}</p>
                  <p className="mt-1 text-sm text-slate-500">{match.stage} · {match.match_time}</p>
                </div>
                <StatusBadge value={match.status} />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-[150px_1fr]">
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={score.home_score} onChange={(e) => updateScore(match.match_id, { home_score: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2" />
                  <span className="text-slate-400">:</span>
                  <input type="number" min="0" value={score.away_score} onChange={(e) => updateScore(match.match_id, { away_score: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2" />
                </div>
                <button onClick={() => finish(match)} className="flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-2 font-semibold text-white hover:bg-slate-800">
                  <CheckCircle2 className="h-4 w-4" /> 录入赛果并结算积分
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
