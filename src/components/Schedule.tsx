import { useEffect, useState, type ReactNode } from 'react';
import type { Match, TournamentData } from '../data/tournament';
import { buildPlayoffSchedule, buildScoreboardUrl, filterMatches, formatTime } from '../lib/tournament';
import Icon from './Icon';
import TeamBadge from './TeamBadge';

function RefereeFooter({ assignment, children }: { assignment: string; children?: ReactNode }) {
  return (
    <footer className="match-referee">
      <span className="match-referee-label">
        <Icon name="whistle" size={16} />
        Referees
      </span>
      <p className="match-referee-names">{assignment}</p>
      {children}
    </footer>
  );
}

function ScoreboardLink({ href, matchup }: { href: string | null; matchup: string }) {
  if (!href) {
    return null;
  }
  return (
    <a
      className="button match-scoreboard"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open scoreboard: ${matchup} (opens in a new tab)`}
    >
      Open scoreboard <Icon name="arrow" size={16} style={{ transform: 'rotate(-45deg)' }} />
    </a>
  );
}

export default function Schedule({ teams, matches }: TournamentData) {
  const [query, setQuery] = useState('');
  const [teamId, setTeamId] = useState('');
  const [stage, setStage] = useState<'all' | 'pool' | 'playoff'>('all');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    const candidate = params.get('team') ?? '';
    setTeamId(teams.some((team) => team.id === candidate) ? candidate : '');
    const phase = params.get('stage');
    if (phase === 'pool' || phase === 'playoff') setStage(phase);
    setReady(true);
  }, [teams]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    for (const [key, value] of [
      ['q', query],
      ['team', teamId],
      ['stage', stage === 'all' ? '' : stage],
    ]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url);
  }, [query, teamId, stage, ready]);

  const filtered = filterMatches(matches, teams, query, teamId, stage);
  const playoffSchedule = buildPlayoffSchedule(teams, matches);
  const matchCount = stage === 'playoff' ? playoffSchedule.games.length : filtered.length;
  const rounds = [...new Set(filtered.map((match) => match.round))];
  const hasFilters = Boolean(query || teamId || stage !== 'all');
  const clear = () => {
    setQuery('');
    setTeamId('');
    setStage('all');
  };
  const selected = teams.find((team) => team.id === teamId);

  const renderPlayoffGame = (game: (typeof playoffSchedule.games)[number]) => (
    <article className="match-card" key={game.id}>
      <div className="match-topline">
        <span>
          <span className="court-dot" />
          Court {game.court}
        </span>
        <span className="match-status scheduled">Upcoming</span>
      </div>
      <p className="playoff-game-title">{game.title}</p>
      {[game.home, game.away].map((participant, index) => {
        const team = teams.find((candidate) => candidate.id === participant.teamId);
        return (
          <div className="match-team" key={`${game.id}-${index}`}>
            {team ? (
              <TeamBadge team={team} />
            ) : (
              <span className="team-badge playoff-placeholder">?</span>
            )}
            <div>
              <h3>{team?.name ?? participant.label}</h3>
              {team && <p>{team.players.map((name) => name.split(' ')[0]).join(' · ')}</p>}
            </div>
            <span className="match-score">
              <span className="score-dash">—</span>
            </span>
          </div>
        );
      })}
      <RefereeFooter assignment={game.referee.replaceAll(', ', ' · ')}>
        <ScoreboardLink
          href={buildScoreboardUrl(
            teams.find((team) => team.id === game.home.teamId),
            teams.find((team) => team.id === game.away.teamId),
          )}
          matchup={`${game.home.label} versus ${game.away.label}`}
        />
      </RefereeFooter>
    </article>
  );

  const renderMatch = (match: Match) => {
    const home = teams.find((team) => team.id === match.homeId)!;
    const away = teams.find((team) => team.id === match.awayId)!;
    return (
      <article
        className="match-card"
        key={match.id}
        aria-label={`${home.name} versus ${away.name}, ${formatTime(match.time)}, court ${match.court}`}
      >
        <div className="match-topline">
          <span>
            <span className="court-dot" />
            Court {match.court}
          </span>
          <span className={`match-status ${match.status}`}>
            {match.status === 'final' ? (
              <>
                <Icon name="check" size={12} /> Final
              </>
            ) : (
              'Upcoming'
            )}
          </span>
        </div>
        {[home, away].map((team, index) => (
          <div
            className={`match-team ${match.score && match.score[index] > match.score[1 - index] ? 'winner' : ''}`}
            key={team.id}
          >
            <TeamBadge team={team} />
            <div>
              <h3>{team.name}</h3>
              <p>
                {team.players.map((name) => name.split(' ')[0]).join(' · ')}
              </p>
            </div>
            <span className="match-score">
              {match.score ? (
                match.score[index]
              ) : (
                <span className="score-dash">—</span>
              )}
            </span>
          </div>
        ))}
        <RefereeFooter
          assignment={teams.find((team) => team.id === match.refereeId)?.players.join(' · ') ?? match.refereeId ?? 'TBD'}
        >
          {match.status !== 'final' && (
            <ScoreboardLink
              href={buildScoreboardUrl(home, away, match.score)}
              matchup={`${home.name} versus ${away.name}`}
            />
          )}
        </RefereeFooter>
      </article>
    );
  };

  return (
    <>
      <div className="schedule-toolbar">
        <div className="search-field">
          <Icon name="search" size={20} />
          <label className="sr-only" htmlFor="schedule-search">
            Search by team or player name
          </label>
          <input
            id="schedule-search"
            type="search"
            disabled={!ready}
            placeholder="Team or player name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <Icon name="close" size={17} />
            </button>
          )}
        </div>
        <div className="select-field">
          <label className="sr-only" htmlFor="team-filter">
            Filter by team
          </label>
          <select
            id="team-filter"
            disabled={!ready}
            value={teamId}
            onChange={(event) => setTeamId(event.target.value)}
          >
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <Icon name="chevron" size={17} />
        </div>
      </div>
      <div className="schedule-tabs-row">
        <div className="segmented" aria-label="Tournament stage">
          {(
            [
              ['all', 'All matches'],
              ['pool', 'Pool play'],
              ['playoff', 'Playoffs'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              disabled={!ready}
              aria-pressed={stage === value}
              className={stage === value ? 'selected' : ''}
              onClick={() => setStage(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="results-count" role="status">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
          {hasFilters && (
            <button onClick={clear}>
              Reset filters <Icon name="close" size={12} />
            </button>
          )}
        </p>
      </div>
      {selected && (
        <div className="selected-team">
          <TeamBadge team={selected} />
          <div>
            <strong>{selected.name}</strong>
            <p>{selected.players.join(' · ')}</p>
          </div>
          <span>POOL PLAY</span>
        </div>
      )}
      <aside className="players-meeting" aria-labelledby="players-meeting-heading">
        <Icon name="clock" size={22} />
        <div>
          <h2 id="players-meeting-heading">9:30 am · Players' meeting & check-in</h2>
          <p>
            <strong>All players must check in.</strong> Games begin at 10:00 am.
          </p>
        </div>
      </aside>
      <details className="scoreboard-guide">
        <summary>Refereeing a game?</summary>
        <p>
          Open your game’s scoreboard in a new tab with teams and players filled in.
          Play to 25, win by 2, with no cap. Tap a team’s score to add a point.
        </p>
        <p>
          When finished, open Settings → Configure with URL → Copy link and send
          it to the organizers with the round and court. The link includes the
          final scores; organizers will update the standings.
        </p>
        <p>
          Keep that scoreboard tab open during the game. Reopening an upcoming
          game from this schedule starts at 0–0.
        </p>
      </details>
      {stage === 'playoff' ? (
        <>
          {!playoffSchedule.ready && (
            <p className="section-note">Bracket seeding will be set after Pool Play is complete.</p>
          )}
          {[1, 2].map((round) => {
            const games = playoffSchedule.games.filter((game) => game.round === round);
            return (
              <section className="round" key={round}>
                <div className="round-heading">
                  <h2>{formatTime(games[0].time)}</h2>
                  <span>
                    {round === 1
                      ? 'Round 1 · 1:30–2:30'
                      : 'Round 2 · 2:30–3:30'}
                  </span>
                  <div />
                </div>
                <div className="match-grid">{games.map(renderPlayoffGame)}</div>
              </section>
            );
          })}
          <p className="section-note">Awards ceremony · 3:30–4:00 pm</p>
        </>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="ghost" size={36} />
          </span>
          <h2>No matches found</h2>
          <p>Try another team or player name, or clear your filters.</p>
          <button className="button secondary" onClick={clear}>
            Clear filters <Icon name="arrow" size={18} />
          </button>
        </div>
      ) : (
        <div className="rounds">
          {rounds.map((round) => {
            const games = filtered.filter((match) => match.round === round);
            return (
              <section className="round" key={round}>
                <div className="round-heading">
                  <h2>{formatTime(games[0].time)}</h2>
                  <span>Round {round}</span>
                  <div />
                </div>
                <div className="match-grid">{games.map(renderMatch)}</div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
