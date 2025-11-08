
'use client';

import { useState } from 'react';
import type { User } from '@/lib/data';
import { addMatch, getCurrentUser, getTeamOpenings } from '@/lib/data';
import { DiscoverCard } from './discover-card';
import { Button } from './ui/button';
import { Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from './ui/toast';
import Link from 'next/link';

export function DiscoverCardStack({ users }: { users: User[] }) {
  const [stack, setStack] = useState(users);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  const handleSwipe = (liked: boolean, likedUser: User) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (liked) {
      const teamOpenings = getTeamOpenings();
      const teamOpening = teamOpenings[0];
      const newMatch = addMatch({
        userId1: currentUser.id,
        userId2: likedUser.id,
        teamOpeningId: teamOpening.id,
      });

      toast({
        title: "It's a match!",
        description: `You and ${likedUser.name} are matched for "${teamOpening.hackathonName}".`,
        action: (
          <ToastAction asChild altText="Message">
            <Link href={`/messages/conv-match-${newMatch.id}`}>Message</Link>
          </ToastAction>
        ),
      });
    }

    setTimeout(() => {
      setStack((prev) => prev.slice(1));
      setIsAnimating(false);
    }, 300);
  };

  const handlePass = () => {
    if (stack.length > 0) {
      handleSwipe(false, stack[0]);
    }
  };

  const handleLike = () => {
    if (stack.length > 0) {
      handleSwipe(true, stack[0]);
    }
  };

  if (stack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-card text-card-foreground shadow-xl h-full w-full max-w-sm">
        <h3 className="text-2xl font-bold">That's everyone for now!</h3>
        <p className="text-muted-foreground mt-2">
          Check back later for new potential teammates.
        </p>
        <Button className="mt-6" onClick={() => setStack(users)}>
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-sm">
      <div className="relative h-[500px] w-full">
        <AnimatePresence>
          {stack.map((user, index) => (
            <motion.div
              key={user.id}
              className="absolute h-full w-full"
              style={{
                zIndex: stack.length - index,
                transform: `scale(${1 - index * 0.05}) translateY(-${index * 10}px)`,
                opacity: index > 2 ? 0 : 1,
              }}
              initial={ index === 0 ? { y: 0, opacity: 1 } : { scale: 1, y: 0, opacity: 1 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DiscoverCard user={user} isTopCard={index === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-600"
          onClick={handlePass}
          disabled={isAnimating}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-20 w-20 rounded-full border-2 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-600"
          onClick={handleLike}
          disabled={isAnimating}
        >
          <Check className="h-10 w-10" />
        </Button>
      </div>
    </div>
  );
}
