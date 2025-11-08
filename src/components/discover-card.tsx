import type { User } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import Link from 'next/link';

export function DiscoverCard({ user, isTopCard }: { user: User; isTopCard: boolean }) {
  return (
    <Card className="h-full w-full overflow-hidden flex flex-col shadow-xl">
      <div className="relative h-3/5 w-full">
        <Image
          src={user.image.imageUrl}
          alt={user.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={isTopCard}
          data-ai-hint={user.image.imageHint}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
          <p className="text-sm opacity-90">{user.experience}</p>
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{user.bio}</p>
        <div className="flex flex-wrap gap-2">
            {user.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
            {user.skills.length > 5 && <Badge variant="outline">+{user.skills.length - 5} more</Badge>}
        </div>
      </CardContent>
       <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/profile/${user.id}`}>
            <Info className="mr-2 h-4 w-4"/>
            View Full Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
