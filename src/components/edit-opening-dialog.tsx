
'use client';

import { useState, useEffect } from 'react';
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
import { CalendarIcon, Loader2, Link as LinkIcon } from 'lucide-react';
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
  const [data, setData] = useState<Partial<TeamOpening>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setData({
        ...opening,
        deadline: opening.deadline ? new Date(opening.deadline) : undefined,
        hackathonEndDate: opening.hackathonEndDate ? new Date(opening.hackathonEndDate) : undefined,
        requiredRoles: opening.requiredRoles.join(', '),
        techStack: opening.techStack.join(', '),
      });
    }
  }, [open, opening]);

  const handleDataChange = (field: keyof typeof data, value: any) => {
    setData(prev => ({...prev, [field]: value}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.hackathonName || !data.location || !data.deadline || !data.hackathonEndDate) {
       toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all required event details.',
      });
      return;
    }
    if (!data.requiredRoles || !data.techStack) {
       toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please specify the required roles and tech stack.',
      });
      return;
    }

    setIsLoading(true);

    try {
        const updatedOpening: TeamOpening = {
            ...opening,
            ...data,
            requiredRoles: Array.isArray(data.requiredRoles) ? data.requiredRoles : data.requiredRoles.split(',').map(s => s.trim()).filter(Boolean),
            techStack: Array.isArray(data.techStack) ? data.techStack : data.techStack.split(',').map(s => s.trim()).filter(Boolean),
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
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
             <div className="space-y-2">
                <Label htmlFor="edit-hackathonName">Hackathon Name</Label>
                <Input id="edit-hackathonName" value={data.hackathonName || ''} onChange={(e) => handleDataChange('hackathonName', e.target.value)} placeholder="e.g., Hack The Planet 2024" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-location">Venue / Location</Label>
                    <Input id="edit-location" value={data.location || ''} onChange={(e) => handleDataChange('location', e.target.value)} placeholder="e.g., Remote or City, State"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-hackathonLink">Hackathon Website (Optional)</Label>
                    <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        <Input id="edit-hackathonLink" value={data.hackathonLink || ''} onChange={(e) => handleDataChange('hackathonLink', e.target.value)} placeholder="https://example.com"/>
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="edit-deadline">Application Deadline</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn( "w-full justify-start text-left font-normal", !data.deadline && "text-muted-foreground" )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {data.deadline ? format(data.deadline, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={data.deadline} onSelect={(d) => handleDataChange('deadline', d)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="edit-hackathon-end-date">Hackathon End Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn( "w-full justify-start text-left font-normal", !data.hackathonEndDate && "text-muted-foreground" )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {data.hackathonEndDate ? format(data.hackathonEndDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={data.hackathonEndDate} onSelect={(d) => handleDataChange('hackathonEndDate', d)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
             <div className="space-y-2">
                    <Label htmlFor="edit-problem-statement">Problem Statement (Optional)</Label>
                    <Textarea
                        id="edit-problem-statement"
                        value={data.problemStatement || ''}
                        onChange={(e) => handleDataChange('problemStatement', e.target.value)}
                        placeholder="Describe your vision for the project, the problem you're solving, etc."
                    />
                </div>
                <div className="space-y-2">
                <Label htmlFor="edit-required-roles">Required Roles</Label>
                <Input
                    id="edit-required-roles"
                    value={data.requiredRoles as string || ''}
                    onChange={(e) => handleDataChange('requiredRoles', e.target.value)}
                    placeholder="e.g., Frontend Dev, UI/UX Designer"
                />
                <p className="text-xs text-muted-foreground">Separate roles with commas.</p>
                </div>
                <div className="space-y-2">
                <Label htmlFor="edit-tech-stack">Tech Stack Required</Label>
                <Input
                    id="edit-tech-stack"
                    value={data.techStack as string || ''}
                    onChange={(e) => handleDataChange('techStack', e.target.value)}
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
