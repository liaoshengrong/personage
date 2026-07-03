import { formatGd, gdClass } from '../_lib/matches';
import { getEliminatedTeams } from '../_lib/eliminated';

export default function EliminatedTeamsSection() {
  const teams = getEliminatedTeams();
  const fourthCount = teams.filter((t) => t.reason === 'fourth' || t.reason === 'early').length;
  const thirdMissedCount = teams.filter((t) => t.reason === 'third-missed').length;
  const r32Count = teams.filter((t) => t.reason === 'r32').length;

  return (
    <section className="eliminated-section" aria-labelledby="eliminated-title">
      <div className="section-label" id="eliminated-title">
        ELIMINATED · 已淘汰队伍
      </div>

      <div className="strategy-banner eliminated-intro">
        <p>
          目前已淘汰 <strong>{teams.length}</strong> 支：小组第四{' '}
          <strong>{fourthCount}</strong> 支、第三名未进 +8{' '}
          <strong>{thirdMissedCount}</strong> 支、32 强出局{' '}
          <strong>{r32Count}</strong> 支。
        </p>
      </div>

      <div className="eliminated-table-wrap">
        <table className="eliminated-table">
          <thead>
            <tr>
              <th scope="col">球队</th>
              <th scope="col">小组</th>
              <th scope="col">组内排名</th>
              <th scope="col">积分</th>
              <th scope="col">净胜球</th>
              <th scope="col">世界排名</th>
              <th scope="col">出局原因</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((row) => (
              <tr key={`${row.group}-${row.team}`} className={`reason-${row.reason}`}>
                <td className="team-cell">{row.team}</td>
                <td>{row.group} 组</td>
                <td className="rank-cell">第 {row.rank}</td>
                <td>{row.pts}</td>
                <td className={gdClass(row.gd)}>{formatGd(row.gd)}</td>
                <td className="fifa-cell">
                  <em>#</em>
                  {row.fifa}
                </td>
                <td>
                  <span className={`out-badge out-${row.reason}`}>{row.reasonLabel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="eliminated-disclaimer">
        含小组赛出局队及 32 强已淘汰队；7 月 3 日 M86–M88 待赛后继续更新。
      </p>
    </section>
  );
}
