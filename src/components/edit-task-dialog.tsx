
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateTask, User, Task, TaskStatus } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface EditTaskDialogProps {
  children: ReactNode;
  task: Task;
  teamMembers: User[];
  onTaskUpdated: () => void;
}

export function EditTaskDialog({ children, task, teamMembers, onTaskUpdated }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(task.assignedTo);
  const [deadline, setDeadline] = useState<Date | undefined>(task.deadline ? new Date(task.deadline) : undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setDescription(task.description);
      setStatus(task.status);
      setAssignedTo(task.assignedTo);
      setDeadline(task.deadline ? new Date(task.deadline) : undefined);
    }
  }, [open, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      toast({
        variant: 'destructive',
        title: 'Missing Description',
        description: 'Please provide a description for the task.',
      });
      return;
    }
    setIsLoading(true);

    try {
        updateTask({
            ...task,
            description,
            status,
            assignedTo: assignedTo === 'unassigned' ? undefined : assignedTo,
            deadline,
        });
        
        toast({
            title: 'Task Updated!',
            description: 'The task has been successfully updated.',
        });
        onTaskUpdated();
        setOpen(false);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'There was a problem updating the task.';
        toast({
            variant: 'destructive',
            title: 'Error',
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details for the task. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Task Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                        <SelectTrigger id="edit-status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Not Started Yet">Not Started Yet</SelectItem>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-assignedTo">Assign To</Label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger id="edit-assignedTo">
                            <SelectValue placeholder="Select a team member" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="edit-deadline">Deadline (Optional)</Label>
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
