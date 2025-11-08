
'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, getTeamOpenings, users, addMatch, TeamOpening, getUserById } from '@/lib/data';
import { format, formatDistanceToNow } from 'date-fns';
import { PlusCircle, Search, MapPin, CalendarClock, Users as UsersIcon } from 'lucide-react';
import { CreateOpeningDialog } from '@/components/create-opening-dialog';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function OpeningsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openings, setOpenings] = useState<TeamOpening[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    setOpenings(getTeamOpenings());
  }, []);

  const handleOpeningCreated = () => {
    setOpenings(getTeamOpenings());
  };
  
  const handleExpressInterest = (openingAuthorId: string, openingId: string, openingTitle: string) => {
    if (currentUser.id === openingAuthorId) {
        toast({
            variant: "destructive",
            title: "Can't express interest in your own opening.",
        });
        return;
    }
      
    const newMatch = addMatch({
      userId1: currentUser.id,
      userId2: openingAuthorId,
      teamOpeningId: openingId,
    });
    
    toast({
      title: "Interest Expressed!",
      description: `You've matched for "${openingTitle}". Start the conversation!`,
      action: (
        <ToastAction asChild altText="Message">
          <Link href={`/messages/conv-${newMatch.id}`}>Message</Link>
        </ToastAction>
      ),
    });
  }

  const filteredOpenings = openings.filter(opening => {
    const searchLower = searchTerm.toLowerCase();
    const author = users.find(u => u.id === opening.authorId);

    return (
        opening.title.toLowerCase().includes(searchLower) ||
        opening.projectIdea.toLowerCase().includes(searchLower) ||
        opening.location.toLowerCase().includes(searchLower) ||
        (author && author.name.toLowerCase().includes(searchLower)) ||
        opening.requiredRoles.some(role => role.toLowerCase().includes(searchLower)) ||
        opening.techStack.some(tech => tech.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Team Openings</h1>
        <div className="flex w-full md:w-auto items-center gap-2">
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input 
                type="search"
                placeholder="Search openings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <CreateOpeningDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen}
            onOpeningCreated={handleOpeningCreated}
          >
            <Button onClick={() => setIsDialogOpen(true)} className="flex-shrink-0">
              <PlusCircle className="mr-2 h-5 w-5" />
              Post Opening
            </Button>
          </CreateOpeningDialog>
        </div>
      </div>

      {filteredOpenings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredOpenings.map((opening) => {
                const author = users.find(u => u.id === opening.authorId);
                const deadlineDate = new Date(opening.deadline);
                const createdAtDate = new Date(opening.createdAt);
                const approvedMembers = opening.approvedMembers?.map(id => getUserById(id)).filter(Boolean) as any[];

                return (
            <Card key={opening.id} className="flex flex-col">
                <CardHeader>
                <CardTitle>{opening.title}</CardTitle>
                <CardDescription>
                    Posted by {author?.name} • {formatDistanceToNow(createdAtDate, { addSuffix: true })}
                </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p className="text-sm text-muted-foreground">{opening.projectIdea}</p>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{opening.location}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarClock className="mr-2 h-4 w-4" />
                        <span>Apply by {format(deadlineDate, 'PPP')}</span>
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

                    {approvedMembers && approvedMembers.length > 0 && (
                       <div className="space-y-2">
                            <h4 className="font-semibold text-sm flex items-center"><UsersIcon className="mr-2 h-4 w-4"/> Team Members:</h4>
                            <div className="flex flex-wrap gap-2">
                                {approvedMembers.map(member => (
                                    <Badge key={member.id} variant="default">{member.name}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                </CardContent>
                <CardFooter>
                <Button 
                    className="w-full"
                    onClick={() => handleExpressInterest(opening.authorId, opening.id, opening.title)}
                    disabled={new Date() > deadlineDate}
                >
                    {new Date() > deadlineDate ? 'Deadline Passed' : 'Express Interest'}
                </Button>
                </CardFooter>
            </Card>
            )})}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
            <h3 className="text-xl font-semibold">No openings found</h3>
            <p className="mt-2 text-muted-foreground">
                Try adjusting your search terms or post a new opening!
            </p>
        </div>
      )}
    </div>
  );
}
