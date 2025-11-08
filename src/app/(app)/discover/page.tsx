'use client';

import { DiscoverCardStack } from '@/components/discover-card-stack';
import { getCurrentUser, getMatches, users as allUsers, getTeamOpenings, User } from '@/lib/data';
import { useIsClient } from '@/hooks/use-is-client';
import { useEffect, useState } from 'react';
import { findPotentialTeammates } from '@/ai/flows/swipe-based-teammate-discovery';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function DiscoverPage() {
  const isClient = useIsClient();
  const [rankedUsers, setRankedUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const rankUsers = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        const currentMatches = getMatches();
        const matchedUserIds = new Set(
          currentMatches.flatMap(m => [m.userId1, m.userId2])
        );

        const potentialTeammates = allUsers.filter(
          (user) => user.id !== currentUser.id && !matchedUserIds.has(user.id)
        );
        
        const userOpenings = getTeamOpenings().filter(o => o.authorId === currentUser.id);
        const latestOpening = userOpenings.length > 0 ? userOpenings[0] : undefined;


        const rankedResult = await findPotentialTeammates({
          userProfile: JSON.stringify(currentUser),
          potentialTeammates: JSON.stringify(potentialTeammates),
          teamOpening: latestOpening ? JSON.stringify(latestOpening) : undefined,
        });

        const userMap = new Map(allUsers.map(u => [u.id, u]));
        const sortedUsers = rankedResult.map(r => userMap.get(r.userId)).filter((u): u is User => !!u);
        
        setRankedUsers(sortedUsers);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "AI Ranking Failed",
          description: "Could not rank potential teammates. Displaying default order.",
        });
        // Fallback to default order
        const currentUser = getCurrentUser();
        const currentMatches = getMatches();
        const matchedUserIds = new Set(
          currentMatches.flatMap(m => [m.userId1, m.userId2])
        );
         const potentialTeammates = allUsers.filter(
          (user) => user.id !== currentUser.id && !matchedUserIds.has(user.id)
        );
        setRankedUsers(potentialTeammates);
      } finally {
        setIsLoading(false);
      }
    };

    rankUsers();
  }, [isClient, toast]);

  if (!isClient || isLoading || !rankedUsers) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-6 text-center">
             <Icons.logo className="h-12 w-12 text-primary animate-pulse" />
            <p className="mt-4 text-lg font-semibold">Finding Teammates For You...</p>
            <p className="text-sm text-muted-foreground">The AI is analyzing profiles to find your best matches.</p>
        </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-6">
      <DiscoverCardStack users={rankedUsers} />
    </div>
  );
}
