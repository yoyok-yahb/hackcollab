import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { teamOpenings, users } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { PlusCircle } from 'lucide-react';

export default function OpeningsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Openings</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Post an Opening
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {teamOpenings.map((opening) => {
            const author = users.find(u => u.id === opening.authorId);
            return (
          <Card key={opening.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{opening.title}</CardTitle>
              <CardDescription>
                Posted by {author?.name} • {formatDistanceToNow(opening.createdAt, { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{opening.projectIdea}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Required Roles:</h4>
                <div className="flex flex-wrap gap-2">
                    {opening.requiredRoles.map(role => (
                        <Badge key={role} variant="secondary">{role}</Badge>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2">
                    {opening.techStack.map(tech => (
                        <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <Button className="w-full">Express Interest</Button>
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
