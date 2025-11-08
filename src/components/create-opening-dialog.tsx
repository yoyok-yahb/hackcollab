
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
import { addTeamOpening, getCurrentUser, TeamOpening } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2, ArrowRight, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

interface CreateOpeningDialogProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpeningCreated: () => void;
}

const initialData: Partial<Omit<TeamOpening, 'id' | 'createdAt' | 'authorId'>> = {
    hackathonName: '',
    location: '',
    hackathonLink: '',
    deadline: undefined,
    hackathonEndDate: undefined,
    problemStatement: '',
    requiredRoles: [],
    techStack: [],
};

export function CreateOpeningDialog({ children, open, onOpenChange, onOpeningCreated }: CreateOpeningDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  const handleDataChange = (field: keyof typeof data, value: any) => {
    setData(prev => ({...prev, [field]: value}));
  }

  const resetForm = () => {
    setData(initialData);
    setCurrentStep(1);
  }

  const handleNext = () => {
    if (currentStep === 1) {
        if (!data.hackathonName || !data.location || !data.deadline || !data.hackathonEndDate) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all required event details.',
            });
            return;
        }
    }
    setCurrentStep(currentStep + 1);
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.requiredRoles?.length || !data.techStack?.length) {
       toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please specify the required roles and tech stack.',
      });
      return;
    }

    setIsLoading(true);

    try {
        addTeamOpening({
            authorId: currentUser.id,
            hackathonName: data.hackathonName!,
            location: data.location!,
            deadline: data.deadline!,
            hackathonEndDate: data.hackathonEndDate!,
            hackathonLink: data.hackathonLink,
            problemStatement: data.problemStatement,
            requiredRoles: Array.isArray(data.requiredRoles) ? data.requiredRoles : data.requiredRoles.split(',').map(s => s.trim()).filter(Boolean),
            techStack: Array.isArray(data.techStack) ? data.techStack : data.techStack.split(',').map(s => s.trim()).filter(Boolean),
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
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Post a New Opening</DialogTitle>
            <DialogDescription>
              {currentStep === 1 ? "First, tell us about the event." : "Now, describe your project and the team you need."}
            </DialogDescription>
          </DialogHeader>

          <Progress value={currentStep * 50} className="my-4" />

          {currentStep === 1 && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hackathonName">Hackathon Name</Label>
                <Input id="hackathonName" value={data.hackathonName} onChange={(e) => handleDataChange('hackathonName', e.target.value)} placeholder="e.g., Hack The Planet 2024" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Venue / Location</Label>
                    <Input id="location" value={data.location} onChange={(e) => handleDataChange('location', e.target.value)} placeholder="e.g., Remote or City, State"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hackathonLink">Hackathon Website (Optional)</Label>
                    <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        <Input id="hackathonLink" value={data.hackathonLink} onChange={(e) => handleDataChange('hackathonLink', e.target.value)} placeholder="https://example.com"/>
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
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
                    <Label htmlFor="hackathon-end-date">Hackathon End Date</Label>
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
            </div>
          )}

           {currentStep === 2 && (
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="problem-statement">Problem Statement (Optional)</Label>
                    <Textarea
                        id="problem-statement"
                        value={data.problemStatement}
                        onChange={(e) => handleDataChange('problemStatement', e.target.value)}
                        placeholder="Describe your vision for the project, the problem you're solving, etc."
                    />
                </div>
                <div className="space-y-2">
                <Label htmlFor="required-roles">Required Roles</Label>
                <Input
                    id="required-roles"
                    value={data.requiredRoles}
                    onChange={(e) => handleDataChange('requiredRoles', e.target.value)}
                    placeholder="e.g., Frontend Dev, UI/UX Designer"
                />
                <p className="text-xs text-muted-foreground">Separate roles with commas.</p>
                </div>
                <div className="space-y-2">
                <Label htmlFor="tech-stack">Tech Stack Required</Label>
                <Input
                    id="tech-stack"
                    value={data.techStack}
                    onChange={(e) => handleDataChange('techStack', e.target.value)}
                    placeholder="e.g., React, Next.js, Firebase"
                />
                <p className="text-xs text-muted-foreground">Separate technologies with commas.</p>
                </div>
            </div>
          )}

          <DialogFooter>
             {currentStep === 1 && (
                <Button type="button" onClick={handleNext}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             )}
             {currentStep === 2 && (
                <div className="w-full flex justify-between">
                    <Button type="button" variant="outline" onClick={handleBack}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post Opening
                    </Button>
                </div>
             )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
