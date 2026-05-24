import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Message from "../components/Message.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function MatchManagePage() {
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = () => api.matches().then(setMatches).catch((err) => setMessage({ type: "error", text: err.message }));

  useEffect(() => {
    load();
  }, []);

  const remove = async (match) => {
    const confirmed = window.confirm(`确认删除 ${match.home_team} vs ${match.away_team} 吗？会同时删除竞猜、积分和行情记录。`);
    if (!confirmed) return;
    try {
      const result = await api.deleteMatch(match.match_id);
      setMessage({
        type: "success",
        text: `事务删除成功：比赛 ${result.deleted_match} 条，竞猜 ${result.deleted_guesses} 条，积分 ${result.deleted_point_records} 条，行情 ${result.deleted_card_value_records} 条`
      });
      load();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-navy">比赛管理页</h2>
      </div>
      <Message type={message.type}>{message.text}</Message>
      <div className="overflow-hidden rounded-md bg-white shadow-soft ring-1 ring-slate-200">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-sm text-slate-500">
            <tr>
              <th className="px-5 py-4">比赛</th>
              <th className="px-5 py-4">时间</th>
              <th className="px-5 py-4">阶段</th>
              <th className="px-5 py-4">状态</th>
              <th className="px-5 py-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matches.map((match) => (
              <tr key={match.match_id}>
                <td className="px-5 py-4 font-semibold text-navy">{match.home_team} vs {match.away_team}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{match.match_time}</td>
                <td className="px-5 py-4">{match.stage}</td>
                <td className="px-5 py-4"><StatusBadge value={match.status} /></td>
                <td className="px-5 py-4">
                  <button onClick={() => remove(match)} className="flex items-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                    <Trash2 className="h-4 w-4" /> 删除比赛
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
