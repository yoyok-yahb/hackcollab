

'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { getTeamOpenings, getUserById, User, removeMemberFromOpening, getCurrentUser } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarClock, MapPin, Users as UsersIcon, X, ExternalLink, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { RateTeammateDialog } from '@/components/rate-teammate-dialog';

export default function GroupChatDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const openingId = params.id.replace('conv-group-', '');
  const { toast } = useToast();
  const [tick, setTick] = useState(0);
  const forceRerender = () => setTick(t => t+1);
  const currentUser = getCurrentUser();
  
  const allOpenings = getTeamOpenings();
  const opening = allOpenings.find(o => o.id === openingId);

  if (!opening) {
    return (
      <div className="container mx-auto p-4 md:p:6 text-center">
        <h1 className="text-2xl font-bold">Opening not found</h1>
        <Button asChild variant="link">
          <Link href="/messages">Back to Messages</Link>
        </Button>
      </div>
    );
  }
  
  const handleRemoveMember = (openingId: string, userId: string, userName: string) => {
    removeMemberFromOpening(openingId, userId);
    toast({
        title: "Member Removed",
        description: `${userName} has been removed from the team.`
    });
    forceRerender();
  }

  const author = getUserById(opening.authorId);
  const approvedMembers = opening.approvedMembers?.map(id => getUserById(id)).filter(Boolean) as User[];
  const allMembers = author ? [author, ...approvedMembers] : approvedMembers;
  const isMyOpening = opening.authorId === currentUser.id;

  return (
    <div className="container mx-auto p-4 md:p:6">
      <div className="mb-4">
        <Button asChild variant="ghost" className="pl-0">
          <Link href={`/messages/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>{opening.hackathonName}</CardTitle>
                <CardDescription>
                    {opening.problemStatement}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {opening.hackathonLink && (
                         <div className="flex items-center text-sm">
                           <a href={opening.hackathonLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                             <ExternalLink className="mr-2 h-4 w-4" />
                             Hackathon Website
                           </a>
                         </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{opening.location}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarClock className="mr-2 h-4 w-4" />
                        <span>Apply by {format(new Date(opening.deadline), 'PPP')}</span>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Required Roles:</h4>
                        <div className="flex flex-wrap gap-2">
                            {opening.requiredRoles.map(role => (
                                <Badge key={role} variant="secondary">{role}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Tech Stack:</h4>
                        <div className="flex flex-wrap gap-2">
                            {opening.techStack.map(tech => (
                                <Badge key={tech} variant="outline">{tech}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <UsersIcon className="mr-2 h-5 w-5" />
                        Team Members ({allMembers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {allMembers.map(member => (
                            <li key={member.id} className="flex items-center gap-3 group">
                                <Avatar>
                                    <AvatarImage src={member.image.imageUrl} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.id === opening.authorId ? 'Team Lead' : 'Member'}</p>
                                </div>
                                {member.id !== currentUser.id && (
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <RateTeammateDialog teammate={member} onRated={forceRerender}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                                <Star className="h-4 w-4" />
                                            </Button>
                                        </RateTeammateDialog>
                                        {isMyOpening && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-7 w-7 text-muted-foreground"
                                                onClick={() => handleRemoveMember(opening.id, member.id, member.name)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    