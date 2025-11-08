'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { removeMatch, getConversations, getTeamOpenings, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Sparkles, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useIsClient } from '@/hooks/use-is-client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMatchSummary } from '@/ai/flows/ai-powered-matchmaking-summaries';
import { cn } from '@/lib/utils';


export default function MatchesPage() {
  const isClient = useIsClient();
  const { toast } = useToast();
  // Force re-render when a match is removed
  const [tick, setTick] = useState(0); 
  const [topMatches, setTopMatches] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  if (!isClient) return null;

  const conversations = getConversations();
  const teamOpenings = getTeamOpenings();
  const matchedUsers = conversations.map(c => ({...c.otherUser, teamOpeningTitle: c.teamOpeningTitle, teamOpeningId: c.teamOpeningId, matchId: c.matchId}));

  const groupedMatches = matchedUsers.reduce((acc, user) => {
    const title = user.teamOpeningTitle;
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(user);
    return acc;
  }, {} as Record<string, (User & {teamOpeningTitle: string, teamOpeningId: string, matchId: string})[]>);

  const handleRemoveMatch = (e: React.MouseEvent, matchId: string, userName: string) => {
    e.stopPropagation();
    e.preventDefault();
    removeMatch(matchId);
    toast({
        title: "Match Removed",
        description: `You have removed your match with ${userName}.`,
    });
    setTick(tick => tick + 1); // Trigger re-render
  };

  const findBestMatch = async (openingTitle: string, users: (User & {teamOpeningId: string})[]) => {
    setIsLoading(prev => ({...prev, [openingTitle]: true}));
    try {
        const opening = teamOpenings.find(o => o.title === openingTitle);
        if (!opening) {
            toast({ variant: "destructive", title: "Error", description: "Could not find opening details." });
            return;
        }

        let bestMatch = { userId: '', rank: -1 };
        
        for (const user of users) {
            const result = await generateMatchSummary({
                userProfile: JSON.stringify(user),
                teamOpeningRequirements: JSON.stringify(opening),
            });
            if (result.rank > bestMatch.rank) {
                bestMatch = { userId: user.id, rank: result.rank };
            }
        }
        
        if (bestMatch.userId) {
            setTopMatches(prev => ({...prev, [openingTitle]: bestMatch.userId}));
             toast({
                title: "Top Match Found!",
                description: `AI has identified the best match for "${openingTitle}".`,
            });
        } else {
            toast({ title: "Analysis Complete", description: "No clear top match found." });
        }

    } catch (e) {
        toast({ variant: "destructive", title: "AI Analysis Failed", description: "Could not determine the best match." });
    } finally {
        setIsLoading(prev => ({...prev, [openingTitle]: false}));
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {matchedUsers.length > 0 ? (
            <Tabs defaultValue={Object.keys(groupedMatches)[0] || ''} className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-auto md:grid-cols-2 lg:grid-cols-3">
                {Object.keys(groupedMatches).map((title) => (
                  <TabsTrigger key={title} value={title}>{title}</TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(groupedMatches).map(([title, users]) => (
                <TabsContent key={title} value={title} className="mt-4">
                  <div className="flex justify-end mb-4">
                     <Button 
                        onClick={() => findBestMatch(title, users)} 
                        disabled={isLoading[title]}
                        variant="outline"
                    >
                         {isLoading[title] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                        Find Best Match
                     </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {users.map((user) => (
                      <Card key={user.id} className={cn("overflow-hidden flex flex-col group relative hover:shadow-lg transition-shadow", { "border-primary border-2 shadow-lg": topMatches[title] === user.id })}>
                        {topMatches[title] === user.id && (
                           <Badge className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground">Top Match</Badge>
                        )}
                        <Link href={`/profile/${user.id}`} className="flex flex-col flex-grow">
                          <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleRemoveMatch(e, user.matchId, user.name)}
                          >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove Match</span>
                          </Button>
                          <div className="relative h-48 w-full">
                            <Image
                              src={user.image.imageUrl}
                              alt={user.name}
                              fill
                              className="object-cover"
                              data-ai-hint={user.image.imageHint}
                            />
                          </div>
                          <CardContent className="p-4 flex flex-col flex-grow">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={user.image.imageUrl} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-lg">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.skills.length > 0 ? user.skills[0] : 'No skills listed'}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground line-clamp-2 h-10 flex-grow">
                              {user.bio}
                            </p>
                          </CardContent>
                        </Link>
                         <div className="p-4 pt-0">
                           <Button asChild className="w-full" onClick={(e) => e.stopPropagation()}>
                              <Link href={`/messages`}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Send Message
                              </Link>
                            </Button>
                         </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
                <h3 className="text-xl font-semibold">No matches yet</h3>
                <p className="mt-2 text-muted-foreground">
                    Head over to the Discover page to find your perfect teammate!
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
