
'use client';

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  showText?: boolean;
  count?: number;
}

export function RatingStars({ rating, totalStars = 5, size = 16, className, showText = true, count }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} size={size} className="text-amber-400 fill-amber-400" />
            ))}
            {halfStar && <StarHalf size={size} className="text-amber-400 fill-amber-400" />}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} size={size} className="text-amber-400/40 fill-amber-400/20" />
            ))}
        </div>
        {showText && (
            <span className="text-sm">
                {rating.toFixed(1)}
                {count !== undefined && <span className="ml-1">({count})</span>}
            </span>
        )}
    </div>
  );
}

    