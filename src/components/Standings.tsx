import { useState } from 'react';
import type { Pool, TournamentData } from '../data/tournament';
import { calculateStandings } from '../lib/tournament';
import Icon from './Icon';
import TeamBadge from './TeamBadge';

export default function Standings({ teams, matches }: TournamentData) {
  const [pool, setPool] = useState<Pool | undefined>();
  const standings = calculateStandings(teams, matches, pool);
  const completed = matches.filter(
    (match) =>
      match.stage === 'pool' &&
      match.status === 'final' &&
      (!pool || match.pool === pool),
  ).length;
  return (
    <>
      <div className="standings-toolbar">
        <div className="segmented" aria-label="Filter standings by pool">
          <button
            className={!pool ? 'selected' : ''}
            aria-pressed={!pool}
            onClick={() => setPool(undefined)}
          >
            All pools
          </button>
          {(['A', 'B', 'C'] as const).map((value) => (
            <button
              key={value}
              className={pool === value ? 'selected' : ''}
              aria-pressed={pool === value}
              onClick={() => setPool(value)}
            >
              Pool {value}
            </button>
          ))}
        </div>
        <span className="results-count" role="status">
          {completed} sample matches completed
        </span>
      </div>
      <section className="leaderboard">
        <div className="leaderboard-heading">
          <div>
            <h2>{pool ? `Pool ${pool}` : 'All teams'}</h2>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Sample pool standings ranked by wins, then point difference.
              Select a team name for its roster.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="rank-cell">
                  #
                </th>
                <th scope="col" className="team-cell">
                  Team
                </th>
                <th scope="col" className="played-cell">
                  Played
                </th>
                <th scope="col" className="stat-cell">
                  <abbr title="Wins">W</abbr>
                </th>
                <th scope="col" className="stat-cell">
                  <abbr title="Losses">L</abbr>
                </th>
                <th scope="col" className="difference-cell">
                  <abbr title="Points scored minus points conceded">+/−</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr key={row.team.id}>
                  <td className="rank-cell">
                    <span
                      className={`rank-number ${row.rank === 1 ? 'first' : ''}`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <th
                    scope="row"
                    className="team-cell"
                    aria-label={`${row.team.name}, pool ${row.team.pool}`}
                  >
                    <div className="table-team">
                      <TeamBadge team={row.team} />
                      <details>
                        <summary>
                          {row.team.name}
                          <Icon name="chevron" size={13} />
                        </summary>
                        <p className="table-roster">
                          {row.team.players.join(' · ')}
                        </p>
                      </details>
                      <span className="pool-label">{row.team.pool}</span>
                    </div>
                  </th>
                  <td className="played-cell">{row.played}</td>
                  <td className="wins-cell">{row.wins}</td>
                  <td>{row.losses}</td>
                  <td>
                    <span
                      className={`point-difference ${row.difference > 0 ? 'positive' : row.difference < 0 ? 'negative' : ''}`}
                    >
                      {row.difference > 0 ? '+' : ''}
                      {row.difference}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <Icon name="info" size={16} />
          <p>
            Ranked by wins, then point difference. Official tiebreakers are to
            be confirmed.
          </p>
        </div>
      </section>
    </>
  );
}
