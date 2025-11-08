import { DiscoverCardStack } from '@/components/discover-card-stack';
import { users } from '@/lib/data';

export default function DiscoverPage() {
  // Exclude the current user from the stack
  const potentialTeammates = users.slice(1);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-6">
      <DiscoverCardStack users={potentialTeammates} />
    </div>
  );
}
