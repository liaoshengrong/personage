import { getConfirmedRoundOf32Matches } from '../_lib/roundOf32';

function formatScore(row: ReturnType<typeof getConfirmedRoundOf32Matches>[number]) {
  if (!row.played || !row.score) return '—';
  if (row.scoreNote) return `${row.score}（${row.scoreNote}）`;
  return row.score;
}

export default function RoundOf32Table() {
  const matches = getConfirmedRoundOf32Matches();
  const playedCount = matches.filter((m) => m.played).length;

  return (
    <section className="round32-section" aria-labelledby="round32-title">
      <div className="section-label" id="round32-title">
        ROUND OF 32 · 32 强赛程
      </div>

      <div className="strategy-banner round32-intro">
        <p>
          32 强已于 6 月 28 日开打，共 16 场单败淘汰。截至 <strong>2026.07.02</strong> 已结束{' '}
          <strong>{playedCount}</strong> 场；未赛场次按赛程表显示。
        </p>
      </div>

      <div className="round32-table-wrap">
        <table className="round32-table">
          <thead>
            <tr>
              <th scope="col">场次</th>
              <th scope="col">日期</th>
              <th scope="col">当地时间</th>
              <th scope="col">对阵</th>
              <th scope="col">比分</th>
              <th scope="col">场馆</th>
              <th scope="col">晋级路径</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((row) => (
              <tr
                key={row.matchNo}
                className={row.played ? 'played' : 'upcoming'}
              >
                <td className="match-no">M{row.matchNo}</td>
                <td>{row.date}</td>
                <td>{row.time}</td>
                <td className="matchup-cell">
                  <span
                    className={`matchup-team locked${row.winner === row.home ? ' winner' : row.played ? ' loser' : ''}`}
                  >
                    {row.home}
                  </span>
                  <span className="matchup-vs">vs</span>
                  <span
                    className={`matchup-team locked${row.winner === row.away ? ' winner' : row.played ? ' loser' : ''}`}
                  >
                    {row.away}
                  </span>
                </td>
                <td className="score-cell">{formatScore(row)}</td>
                <td className="venue-cell">
                  {row.venue}
                  <span className="venue-city">{row.city}</span>
                </td>
                <td className="qual-cell">{row.qualLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="round32-disclaimer">
        赛果来源 FIFA / 官方报道；点球大战比分标注在备注中。第三名落位按 Annex C 规则匹配。
      </p>
    </section>
  );
}
