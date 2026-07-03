import { Bracket } from 'bracketkit';
import type { BracketKitMatch } from '../_lib/knockoutBracket';
import {
  buildBracketKitRounds,
  resolveKnockoutBracket,
} from '../_lib/knockoutBracket';

function TeamLine({
  name,
  fifa,
  isWinner,
}: {
  name: string;
  fifa: number;
  isWinner: boolean;
}) {
  return (
    <div className={`bk-team${isWinner ? ' winner' : ''}`}>
      <span className="bk-team-name">{name}</span>
      <span className="bk-team-fifa">#{fifa}</span>
    </div>
  );
}

function BracketMatchCard({
  match,
  isFinal,
}: {
  match: BracketKitMatch;
  isFinal?: boolean;
}) {
  return (
    <div className={`bk-match${isFinal ? ' final' : ''}`}>
      <div className="bk-match-head">
        <span className="bk-match-no">M{match.matchNo}</span>
        <span className="bk-match-date">{match.date}</span>
      </div>
      <TeamLine
        name={match.home}
        fifa={match.homeFifa}
        isWinner={match.winner === match.home}
      />
      <TeamLine
        name={match.away}
        fifa={match.awayFifa}
        isWinner={match.winner === match.away}
      />
    </div>
  );
}

export default function KnockoutBracket() {
  const bracket = resolveKnockoutBracket();
  const rounds = buildBracketKitRounds(bracket);
  const finalMatch = bracket.matches.get(104)!;
  const championFifa =
    finalMatch.winner === finalMatch.home
      ? finalMatch.homeFifa
      : finalMatch.awayFifa;

  return (
    <section className="bracket-section" aria-labelledby="bracket-title">
      <div className="section-label" id="bracket-title">
        KNOCKOUT PATH · 晋级路线图
      </div>

      <div className="strategy-banner bracket-intro">
        <p>
          已结束场次按<strong>真实赛果</strong>标注晋级队；未赛及后续轮次仍按 FIFA
          排名默认推演。金色标记为预测/实际晋级队。
        </p>
      </div>

      <div className="bracket-summary">
        <div className="bracket-podium">
          <div className="podium-item champion">
            <span className="podium-label">预测冠军</span>
            <strong>{bracket.champion}</strong>
            <span className="podium-fifa">#{championFifa}</span>
          </div>
          <div className="podium-item runner-up">
            <span className="podium-label">亚军</span>
            <strong>{bracket.runnerUp}</strong>
          </div>
          <div className="podium-item third">
            <span className="podium-label">季军</span>
            <strong>{bracket.thirdPlace}</strong>
          </div>
          <div className="podium-item fourth">
            <span className="podium-label">第四名</span>
            <strong>{bracket.fourthPlace}</strong>
          </div>
        </div>
      </div>

      <div className="bracket-kit-wrap">
        <Bracket
          className="bracket-kit"
          rounds={rounds}
          matchWidth={152}
          connectorWidth={36}
          matchGap={8}
          renderRoundHeader={(round) => (
            <div className="bk-round-label">{round.name}</div>
          )}
          renderMatch={(match, ctx) => (
            <BracketMatchCard match={match} isFinal={ctx.isLastRound} />
          )}
        />
      </div>

      <p className="bracket-disclaimer">
        对阵路径来源 FIFA 2026 官方淘汰赛树；预测仅按赛后 FIFA 排名强弱默认推断，不代表实际赛果。
      </p>
    </section>
  );
}
