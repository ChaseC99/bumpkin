import type { Team } from '../data/tournament';
import Icon from './Icon';

export default function TeamBadge({
  team,
  large = false,
}: {
  team: Team;
  large?: boolean;
}) {
  return (
    <span className={`team-badge ${team.color} ${large ? 'large' : ''}`}>
      <Icon name={team.icon} size={large ? 35 : 21} />
    </span>
  );
}
