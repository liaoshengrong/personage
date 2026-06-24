import { getHopefulCandidates, tierLabel } from '../_lib/thirdPlace';

export default function ThirdPlaceTable() {
  const candidates = getHopefulCandidates();

  return (
    <section className="third-place-section" aria-labelledby="third-place-title">
      <div className="section-label" id="third-place-title">
        BEST 8 THIRD · +8 晋级预测
      </div>

      <div className="strategy-banner third-place-intro">
        <p>
          12 个小组前 2 名（24 队）直接晋级，12 个第三名中成绩最好的 8 队补充进 32 强。
          下表按当前积分、净胜球、进球数排序，<strong>前 8 行高亮</strong>为最有希望进入
          +8 的球队（数据截至 2026.06.24，含末轮形势说明）。
        </p>
      </div>

      <div className="third-place-table-wrap">
        <table className="third-place-table">
          <thead>
            <tr>
              <th scope="col">排名</th>
              <th scope="col">球队</th>
              <th scope="col">小组</th>
              <th scope="col">积分</th>
              <th scope="col">净胜球</th>
              <th scope="col">进球</th>
              <th scope="col">+8 希望</th>
              <th scope="col">形势说明</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((row) => (
              <tr
                key={`${row.group}-${row.team}`}
                className={row.inTop8 ? 'top8' : row.tier === 'low' ? 'dim' : ''}
              >
                <td className="rank-cell">{row.rank}</td>
                <td className="team-cell">{row.team}</td>
                <td>{row.group} 组</td>
                <td>{row.pts}</td>
                <td className={row.gd > 0 ? 'positive' : row.gd < 0 ? 'negative' : ''}>
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td>{row.gf}</td>
                <td>
                  <span className={`tier-badge tier-${row.tier}`}>
                    {row.inTop8 ? '预测晋级' : tierLabel(row.tier)}
                  </span>
                </td>
                <td className="note-cell">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="third-place-disclaimer">
        预测基于当前积分榜推演，末轮结束后以 FIFA 官方第三名排序为准。
      </p>
    </section>
  );
}
