'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, getTeamOpenings, users, addMatch, TeamOpening, getUserById, deleteTeamOpening, removeMemberFromOpening } from '@/lib/data';
import { format, formatDistanceToNow } from 'date-fns';
import { PlusCircle, Search, MapPin, CalendarClock, Users as UsersIcon, Trash2, X, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { CreateOpeningDialog } from '@/components/create-opening-dialog';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { findBestOpening } from '@/ai/flows/find-best-opening';
import { cn } from '@/lib/utils';


export default function OpeningsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [openings, setOpenings] = useState<TeamOpening[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tick, setTick] = useState(0);
  const [recommendedOpeningId, setRecommendedOpeningId] = useState<string | null>(null);
  const [isFinding, setIsFinding] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const allOpenings = getTeamOpenings();
    const parsedOpenings = allOpenings.map(o => ({
      ...o,
      deadline: new Date(o.deadline),
      createdAt: new Date(o.createdAt),
      hackathonEndDate: new Date(o.hackathonEndDate)
    }));
    setOpenings(parsedOpenings);
  }, [tick]);


  const forceRerender = () => setTick(t => t + 1);

  const handleOpeningCreated = () => {
    forceRerender();
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
          <Link href={`/messages/conv-match-${newMatch.id}`}>Message</Link>
        </ToastAction>
      ),
    });
  }

  const handleCloseOpening = (openingId: string) => {
    deleteTeamOpening(openingId);
    toast({
        title: "Opening Closed",
        description: "The team opening has been successfully closed."
    });
    forceRerender();
  }

  const handleRemoveMember = (openingId: string, userId: string, userName: string) => {
    removeMemberFromOpening(openingId, userId);
    toast({
        title: "Member Removed",
        description: `${userName} has been removed from the team.`
    });
    forceRerender();
  }

  const filteredOpenings = openings.filter(opening => {
    const searchLower = searchTerm.toLowerCase();
    const author = users.find(u => u.id === opening.authorId);

    return (
        (opening.hackathonName && opening.hackathonName.toLowerCase().includes(searchLower)) ||
        (opening.problemStatement && opening.problemStatement.toLowerCase().includes(searchLower)) ||
        (opening.location && opening.location.toLowerCase().includes(searchLower)) ||
        (author && author.name.toLowerCase().includes(searchLower)) ||
        opening.requiredRoles.some(role => role.toLowerCase().includes(searchLower)) ||
        opening.techStack.some(tech => tech.toLowerCase().includes(searchLower))
    );
  });

  const yourOpenings = filteredOpenings.filter(o => o.authorId === currentUser.id);
  const otherOpenings = filteredOpenings.filter(o => o.authorId !== currentUser.id);
  
  const handleFindBestOpening = async () => {
    setIsFinding(true);
    setRecommendedOpeningId(null);
    try {
      const result = await findBestOpening({
        userProfile: JSON.stringify(currentUser),
        openings: JSON.stringify(otherOpenings),
      });
      setRecommendedOpeningId(result.bestOpeningId);
      toast({
        title: "AI Recommendation",
        description: result.reasoning,
      });
    } catch (error) {
      console.error("AI failed to find best opening", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "Could not determine the best opening at this time.",
      });
    } finally {
      setIsFinding(false);
    }
  };

  const renderOpeningCard = (opening: TeamOpening, isMyOpening: boolean) => {
    const author = users.find(u => u.id === opening.authorId);
    const deadlineDate = new Date(opening.deadline);
    const createdAtDate = new Date(opening.createdAt);
    const approvedMembers = opening.approvedMembers?.map(id => getUserById(id)).filter(Boolean) as any[];

    return (
        <Card key={opening.id} className={cn("flex flex-col relative transition-shadow duration-300", recommendedOpeningId === opening.id && "shadow-lg ring-2 ring-primary")}>
            {recommendedOpeningId === opening.id && (
                <Badge className="absolute top-2 left-2 z-10" variant="default">Recommended</Badge>
            )}
            <CardHeader>
            <CardTitle>{opening.hackathonName}</CardTitle>
            <CardDescription className="flex items-center justify-between">
                <span>
                    Posted by {author?.name} • {formatDistanceToNow(createdAtDate, { addSuffix: true })}
                </span>
                {opening.hackathonLink && (
                    <a href={opening.hackathonLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">
                        <ExternalLink className="mr-1 h-4 w-4" />
                        Event
                    </a>
                )}
            </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {opening.problemStatement && <p className="text-sm text-muted-foreground">{opening.problemStatement}</p>}
                
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
                                <Badge key={member.id} variant="default" className="relative pr-6 group">
                                    {member.name}
                                    {isMyOpening && (
                                        <button onClick={() => handleRemoveMember(opening.id, member.id, member.name)} className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-foreground text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

            </CardContent>
            <CardFooter>
            {isMyOpening ? (
                <div className="w-full flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full" variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Close
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your opening and remove all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleCloseOpening(opening.id)}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ) : (
                <Button 
                    className="w-full"
                    onClick={() => handleExpressInterest(opening.authorId, opening.id, opening.hackathonName)}
                    disabled={new Date() > deadlineDate}
                >
                    {new Date() > deadlineDate ? 'Deadline Passed' : 'Express Interest'}
                </Button>
            )}
            </CardFooter>
        </Card>
    )
  }

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
            open={isCreateDialogOpen} 
            onOpenChange={setIsCreateDialogOpen}
            onOpeningCreated={handleOpeningCreated}
          >
            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex-shrink-0">
              <PlusCircle className="mr-2 h-5 w-5" />
              Post Opening
            </Button>
          </CreateOpeningDialog>
        </div>
      </div>
      
      <Accordion type="multiple" defaultValue={['other-openings']} className="w-full space-y-6">
        <AccordionItem value="your-openings">
            <AccordionTrigger className="text-xl font-semibold">Your Openings</AccordionTrigger>
            <AccordionContent>
                {yourOpenings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {yourOpenings.map(opening => renderOpeningCard(opening, true))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-10 text-center">
                        <h3 className="text-lg font-semibold">You haven't posted any openings.</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Click "Post Opening" to find your team.
                        </p>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="other-openings">
            <AccordionTrigger className="text-xl font-semibold">Openings For You</AccordionTrigger>
            <AccordionContent>
                <div className="flex justify-end mb-4">
                    <Button onClick={handleFindBestOpening} disabled={isFinding}>
                        {isFinding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary-foreground" />}
                        Find Best Opening
                    </Button>
                </div>
                 {otherOpenings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {otherOpenings.map(opening => renderOpeningCard(opening, false))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-10 text-center">
                        <h3 className="text-lg font-semibold">No other openings found.</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Check back later or try adjusting your search terms.
                        </p>
                    </div>
                  )}
            </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}
