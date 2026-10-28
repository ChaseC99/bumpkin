import type { TournamentData } from '../data/tournament';
import { calculateStandings } from '../lib/tournament';
import Icon from './Icon';
import TeamBadge from './TeamBadge';

export default function Standings({ teams, matches }: TournamentData) {
  const standings = calculateStandings(teams, matches, 'A');
  return (
    <>
      <section className="leaderboard">
        <div className="leaderboard-heading">
          <div>
            <h2>Pool Play</h2>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Pool Play standings ranked by win percentage, then point difference.
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
                <th scope="col" className="stat-cell">
                  <abbr title="Win percentage">W%</abbr>
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
                    aria-label={`${row.team.name}, ${row.team.pool === 'A' ? 'Pool Play' : `Pool ${row.team.pool}`}`}
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
                      <span className="pool-label">
                        {row.team.pool === 'A' ? 'Pool Play' : row.team.pool}
                      </span>
                    </div>
                  </th>
                  <td className="played-cell">{row.played}</td>
                  <td className="wins-cell">{row.wins}</td>
                  <td>{row.losses}</td>
                  <td>{Math.round(row.winPercentage * 100)}%</td>
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
            Ranked by win percentage, then point difference. Official tiebreakers are to
            be confirmed.
          </p>
        </div>
      </section>
    </>
  );
}
