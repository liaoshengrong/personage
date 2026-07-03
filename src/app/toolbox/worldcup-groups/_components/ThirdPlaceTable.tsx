import { getThirdPlaceCandidates, tierLabel } from '../_lib/thirdPlace';

export default function ThirdPlaceTable() {
  const candidates = getThirdPlaceCandidates();

  return (
    <section className="third-place-section" aria-labelledby="third-place-title">
      <div className="section-label" id="third-place-title">
        BEST 8 THIRD · +8 晋级结果
      </div>

      <div className="strategy-banner third-place-intro">
        <p>
          12 个小组前 2 名（24 队）直接晋级，12 个第三名中成绩最好的 8 队补充进 32 强。
          小组赛已全部结束，下表为<strong>最终 +8 排名</strong>（数据截至 2026.06.27），前 8
          行高亮为确认晋级队。
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
              <th scope="col">结果</th>
              <th scope="col">说明</th>
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
                    {row.inTop8 ? '确认晋级' : tierLabel(row.tier)}
                  </span>
                </td>
                <td className="note-cell">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="third-place-disclaimer">
        第三名同分依次比较净胜球、进球、公平竞赛、FIFA 排名。韩国（3 分）与苏格兰（3 分）未进前 8。
      </p>
    </section>
  );
}
