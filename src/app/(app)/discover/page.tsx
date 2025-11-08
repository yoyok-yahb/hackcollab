'use client';

import { DiscoverCardStack } from '@/components/discover-card-stack';
import { getCurrentUser, getMatches, users } from '@/lib/data';
import { useIsClient } from '@/hooks/use-is-client';

export default function DiscoverPage() {
  const isClient = useIsClient();
  if (!isClient) {
    return null; // or a loading skeleton
  }

  const currentUser = getCurrentUser();
  const currentMatches = getMatches();
  const matchedUserIds = new Set(
    currentMatches.flatMap(m => [m.userId1, m.userId2])
  );

  // Exclude the current user and any users they have already matched with
  const potentialTeammates = users.filter(
    (user) => user.id !== currentUser.id && !matchedUserIds.has(user.id)
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-6">
      <DiscoverCardStack users={potentialTeammates} />
    </div>
  );
}
