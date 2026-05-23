import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Message from "../components/Message.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function GuessPage() {
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [forms, setForms] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    Promise.all([api.matches(), api.users()])
      .then(([matchRows, userRows]) => {
        setMatches(matchRows);
        setUsers(userRows);
        setSelectedUser(String(userRows[0]?.user_id || ""));
      })
      .catch((err) => setMessage({ type: "error", text: err.message }));
  }, []);

  const updateForm = (matchId, patch) => {
    setForms((prev) => ({ ...prev, [matchId]: { guess_result: "home", guess_home_score: 1, guess_away_score: 0, ...(prev[matchId] || {}), ...patch } }));
  };

  const submit = async (match) => {
    const form = forms[match.match_id] || { guess_result: "home", guess_home_score: 1, guess_away_score: 0 };
    try {
      await api.submitGuess({
        user_id: Number(selectedUser),
        match_id: match.match_id,
        guess_result: form.guess_result,
        guess_home_score: Number(form.guess_home_score),
        guess_away_score: Number(form.guess_away_score)
      });
      setMessage({ type: "success", text: `${match.home_team} vs ${match.away_team} 竞猜提交成功` });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">世界杯竞猜页</h2>
          <p className="mt-1 text-sm text-slate-500">选择测试用户提交竞猜，触发器会拦截已结束比赛、重复竞猜和非法比分。</p>
        </div>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2">
          {users.map((user) => <option key={user.user_id} value={user.user_id}>{user.nickname}</option>)}
        </select>
      </div>

      <Message type={message.type}>{message.text}</Message>

      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => {
          const form = forms[match.match_id] || { guess_result: "home", guess_home_score: 1, guess_away_score: 0 };
          return (
            <div key={match.match_id} className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 text-lg font-bold text-navy">
                    <TeamFlag src={match.home_flag} name={match.home_team} />
                    <span>{match.home_team}</span>
                    <span className="text-slate-400">vs</span>
                    <TeamFlag src={match.away_flag} name={match.away_team} />
                    <span>{match.away_team}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{match.stage} · {match.match_time}</p>
                </div>
                <StatusBadge value={match.status} />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-[1fr_140px_120px]">
                <select
                  value={form.guess_result}
                  onChange={(e) => updateForm(match.match_id, { guess_result: e.target.value })}
                  className="rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="home">主胜</option>
                  <option value="draw">平局</option>
                  <option value="away">客胜</option>
                </select>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" value={form.guess_home_score} onChange={(e) => updateForm(match.match_id, { guess_home_score: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2" />
                  <span className="text-slate-400">:</span>
                  <input type="number" min="0" value={form.guess_away_score} onChange={(e) => updateForm(match.match_id, { guess_away_score: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2" />
                </div>
                <button onClick={() => submit(match)} className="flex items-center justify-center gap-2 rounded-md bg-pitch px-4 py-2 font-semibold text-white hover:bg-emerald-800">
                  <Send className="h-4 w-4" /> 提交
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamFlag({ src, name }) {
  return <img src={src} alt={name} className="h-6 w-8 rounded-sm object-cover ring-1 ring-slate-200" />;
}
