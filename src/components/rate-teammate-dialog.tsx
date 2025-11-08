
'use client';

import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User, rateUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RateTeammateDialogProps {
  children: ReactNode;
  teammate: User;
  onRated: () => void;
}

export function RateTeammateDialog({ children, teammate, onRated }: RateTeammateDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'No rating selected',
        description: 'Please select a rating from 1 to 5 stars.',
      });
      return;
    }
    setIsLoading(true);

    try {
        rateUser(teammate.id, rating);
        
        toast({
            title: 'Teammate Rated!',
            description: `You gave ${teammate.name} a rating of ${rating} stars.`,
        });
        onRated();
        setOpen(false);
        setRating(0);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'There was a problem submitting the rating.';
        toast({
            variant: 'destructive',
            title: 'Error',
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rate {teammate.name}</DialogTitle>
            <DialogDescription>
              How was your experience working with this teammate?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center gap-2 py-8">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <Star
                  key={starValue}
                  size={32}
                  className={cn(
                    'cursor-pointer transition-colors',
                    starValue <= (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  )}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              );
            })}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || rating === 0}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Rating
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    