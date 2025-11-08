
'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getTeamOpenings, getUserById, User, Task, getTasksForOpening, updateTask } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Calendar as CalendarIcon, User as UserIcon, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CreateTaskDialog } from '@/components/create-task-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditTaskDialog } from '@/components/edit-task-dialog';

export default function GroupTasksPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const openingId = params.id.replace('conv-group-', '');
  
  const [tick, setTick] = useState(0);
  const forceRerender = () => setTick(t => t+1);
  
  const allOpenings = getTeamOpenings();
  const opening = allOpenings.find(o => o.id === openingId);

  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    setTasks(getTasksForOpening(openingId));
  }, [openingId, tick])

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

  const handleTaskStatusChange = (task: Task, isChecked: boolean) => {
    const newStatus = isChecked ? 'Completed' : 'Ongoing';
    const updatedTask = updateTask({ ...task, status: newStatus });
    setTasks(currentTasks => currentTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const getAssignee = (userId?: string) => {
    if (!userId) return null;
    return allMembers.find(m => m.id === userId);
  }

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Tasks for: {opening.title}</CardTitle>
                <CardDescription>
                    Manage the to-do list for your project.
                </CardDescription>
            </div>
            <CreateTaskDialog openingId={openingId} teamMembers={allMembers} onTaskCreated={forceRerender}>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </CreateTaskDialog>
        </CardHeader>
        <CardContent>
            {tasks.length > 0 ? (
                <div className="space-y-4">
                    {tasks.map(task => {
                        const assignee = getAssignee(task.assignedTo);
                        return (
                            <div key={task.id} className="flex items-start sm:items-center gap-4 rounded-lg border p-4 flex-col sm:flex-row">
                                <Checkbox 
                                    id={`task-${task.id}`} 
                                    checked={task.status === 'Completed'}
                                    onCheckedChange={(checked) => handleTaskStatusChange(task, !!checked)}
                                    className="h-6 w-6 mt-1 sm:mt-0"
                                />
                                <div className="flex-1 grid gap-1">
                                    <label 
                                        htmlFor={`task-${task.id}`} 
                                        className={cn("font-medium", task.status === 'Completed' && 'line-through text-muted-foreground')}
                                    >
                                        {task.description}
                                    </label>
                                    <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                                        <Badge 
                                            variant={task.status === 'Completed' ? 'default' : task.status === 'Ongoing' ? 'secondary' : 'outline'}
                                            className={cn(task.status === 'Completed' && 'bg-green-600 hover:bg-green-700')}
                                        >
                                            {task.status}
                                        </Badge>
                                        {task.deadline && (
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>{format(new Date(task.deadline), 'MMM d')}</span>
                                            </div>
                                        )}
                                        {assignee && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={assignee.image.imageUrl} alt={assignee.name} />
                                                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Assigned to {assignee.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </div>
                                <EditTaskDialog task={task} teamMembers={allMembers} onTaskUpdated={forceRerender}>
                                    <Button variant="outline" size="sm">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </EditTaskDialog>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
                    <h3 className="text-xl font-semibold">No tasks yet!</h3>
                    <p className="mt-2 text-muted-foreground">
                        Click "Add Task" to get started.
                    </p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
