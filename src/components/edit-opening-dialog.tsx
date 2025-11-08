
'use client';

import { useState, ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateTeamOpening, TeamOpening } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditOpeningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpeningUpdated: () => void;
  opening: TeamOpening;
}

export function EditOpeningDialog({ open, onOpenChange, onOpeningUpdated, opening }: EditOpeningDialogProps) {
  const [title, setTitle] = useState(opening.title);
  const [projectIdea, setProjectIdea] = useState(opening.projectIdea);
  const [requiredRoles, setRequiredRoles] = useState(opening.requiredRoles.join(', '));
  const [techStack, setTechStack] = useState(opening.techStack.join(', '));
  const [location, setLocation] = useState(opening.location);
  const [deadline, setDeadline] = useState<Date | undefined>(opening.deadline ? new Date(opening.deadline) : undefined);
  const [hackathonEndDate, setHackathonEndDate] = useState<Date | undefined>(opening.hackathonEndDate ? new Date(opening.hackathonEndDate) : undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setTitle(opening.title);
      setProjectIdea(opening.projectIdea);
      setRequiredRoles(opening.requiredRoles.join(', '));
      setTechStack(opening.techStack.join(', '));
      setLocation(opening.location);
      setDeadline(opening.deadline ? new Date(opening.deadline) : undefined);
      setHackathonEndDate(opening.hackathonEndDate ? new Date(opening.hackathonEndDate) : undefined);
    }
  }, [open, opening]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectIdea || !location || !deadline || !hackathonEndDate) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields, including deadline and hackathon end date.',
      });
      return;
    }
    setIsLoading(true);

    try {
        const updatedOpening: TeamOpening = {
            ...opening,
            title,
            projectIdea,
            requiredRoles: requiredRoles.split(',').map(s => s.trim()).filter(Boolean),
            techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
            location,
            deadline,
            hackathonEndDate,
        };

        updateTeamOpening(updatedOpening);
        
        toast({
            title: 'Opening Updated!',
            description: 'Your team opening has been successfully updated.',
        });
        onOpeningUpdated();
        onOpenChange(false);

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'There was a problem updating your opening.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Opening</DialogTitle>
            <DialogDescription>
              Make changes to your opening. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Opening Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Building the next big thing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-idea">Project Idea</Label>
              <Textarea
                id="edit-project-idea"
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="Describe your vision for the project..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Remote or City, State"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="edit-deadline">Application Deadline</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !deadline && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={deadline}
                            onSelect={setDeadline}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="edit-hackathon-end-date">Hackathon End Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !hackathonEndDate && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {hackathonEndDate ? format(hackathonEndDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={hackathonEndDate}
                            onSelect={setHackathonEndDate}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-required-roles">Required Roles</Label>
              <Input
                id="edit-required-roles"
                value={requiredRoles}
                onChange={(e) => setRequiredRoles(e.target.value)}
                placeholder="e.g., Frontend Dev, UI/UX Designer"
              />
               <p className="text-xs text-muted-foreground">Separate roles with commas.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="edit-tech-stack">Tech Stack</Label>
              <Input
                id="edit-tech-stack"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React, Next.js, Firebase"
              />
              <p className="text-xs text-muted-foreground">Separate technologies with commas.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
