import { Medal } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.ranking().then(setRanking).catch((err) => setError(err.message));
  }, []);

  if (error) return <Panel>{error}</Panel>;

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-white p-5 shadow-soft ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-navy">积分排行榜页</h2>
      </div>
      <div className="overflow-hidden rounded-md bg-white shadow-soft ring-1 ring-slate-200">
        <table className="w-full min-w-[680px] text-left">
          <thead className="bg-slate-50 text-sm text-slate-500">
            <tr>
              <th className="px-5 py-4">排名</th>
              <th className="px-5 py-4">用户昵称</th>
              <th className="px-5 py-4">竞猜次数</th>
              <th className="px-5 py-4">猜中次数</th>
              <th className="px-5 py-4">总积分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ranking.map((row) => (
              <tr key={row.user_id} className={Number(row.rank_no) <= 3 ? "bg-amber-50/60" : ""}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 font-bold text-navy">
                    {Number(row.rank_no) <= 3 && <Medal className="h-5 w-5 text-gold" />}
                    #{row.rank_no}
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-navy">{row.nickname}</td>
                <td className="px-5 py-4">{row.guess_count}</td>
                <td className="px-5 py-4">{row.correct_count}</td>
                <td className="px-5 py-4 text-lg font-bold text-pitch">{row.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Panel({ children }) {
  return <div className="rounded-md bg-white p-8 text-center text-slate-600 shadow-soft ring-1 ring-slate-200">{children}</div>;
}
