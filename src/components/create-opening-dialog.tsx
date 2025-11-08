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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addTeamOpening, getCurrentUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateOpeningDialogProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpeningCreated: () => void;
}

export function CreateOpeningDialog({ children, open, onOpenChange, onOpeningCreated }: CreateOpeningDialogProps) {
  const [title, setTitle] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [requiredRoles, setRequiredRoles] = useState('');
  const [techStack, setTechStack] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  const resetForm = () => {
    setTitle('');
    setProjectIdea('');
    setRequiredRoles('');
    setTechStack('');
    setLocation('');
    setDeadline(undefined);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectIdea || !location || !deadline) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields, including location and deadline.',
      });
      return;
    }
    setIsLoading(true);

    try {
        addTeamOpening({
            title,
            projectIdea,
            authorId: currentUser.id,
            requiredRoles: requiredRoles.split(',').map(s => s.trim()).filter(Boolean),
            techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
            location,
            deadline,
        });
        
        toast({
            title: 'Opening Posted!',
            description: 'Your new team opening is now live.',
        });
        onOpeningCreated();
        onOpenChange(false);
        resetForm();

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'There was a problem posting your opening.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Post a New Opening</DialogTitle>
            <DialogDescription>
              Describe your project and the roles you're looking to fill. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Opening Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Building the next big thing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-idea">Project Idea</Label>
              <Textarea
                id="project-idea"
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="Describe your vision for the project..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Remote or City, State"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="required-roles">Required Roles</Label>
              <Input
                id="required-roles"
                value={requiredRoles}
                onChange={(e) => setRequiredRoles(e.target.value)}
                placeholder="e.g., Frontend Dev, UI/UX Designer"
              />
               <p className="text-xs text-muted-foreground">Separate roles with commas.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="tech-stack">Tech Stack</Label>
              <Input
                id="tech-stack"
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
              Save Opening
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
