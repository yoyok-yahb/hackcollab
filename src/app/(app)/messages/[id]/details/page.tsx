'use client';

import { use } from 'react';
import Link from 'next/link';
import { getTeamOpenings, getUserById, User } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarClock, MapPin, Users as UsersIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function GroupChatDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const openingId = params.id.replace('conv-group-', '');
  const allOpenings = getTeamOpenings();
  const opening = allOpenings.find(o => o.id === openingId);

  if (!opening) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold">Opening not found</h1>
        <Button asChild variant="link">
          <Link href="/messages">Back to Messages</Link>
        </Button>
      </div>
    );
  }

  const author = getUserById(opening.authorId);
  const approvedMembers = opening.approvedMembers?.map(id => getUserById(id)).filter(Boolean) as User[];
  const allMembers = author ? [author, ...approvedMembers] : approvedMembers;

  return (
    <div className="container mx-auto p-4 md:p-6">
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
                <CardTitle>{opening.title}</CardTitle>
                <CardDescription>
                    {opening.projectIdea}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            <li key={member.id} className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={member.image.imageUrl} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.id === opening.authorId ? 'Team Lead' : 'Member'}</p>
                                </div>
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
