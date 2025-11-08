'use client';

import { use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getUserById, User } from '@/lib/data';
import { ArrowLeft, Github, Linkedin, Pencil, Twitter } from 'lucide-react';
import Link from 'next/link';

function UserProfile({ user }: { user: User }) {
    return (
        <Card>
        <CardHeader className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={user.image.imageUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{user.name}, {user.age}</CardTitle>
            </div>
            <CardDescription className="mt-2 text-base">{user.bio}</CardDescription>
            <div className="mt-4 flex items-center gap-4">
                {user.socialLinks.github && (
                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Github className="h-6 w-6" />
                    </a>
                )}
                {user.socialLinks.linkedin && (
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-6 w-6" />
                    </a>
                )}
                {user.socialLinks.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-6 w-6" />
                    </a>
                )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
            <div>
                <h3 className="font-semibold text-lg mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {user.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-base py-1 px-3">{skill}</Badge>
                    ))}
                </div>
            </div>
             <div className="md:col-span-2">
                <h3 className="font-semibold text-lg mb-2">Experience</h3>
                <p className="text-muted-foreground">{user.experience}</p>
            </div>
        </CardContent>
      </Card>
    )
}


export default function ProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const user = getUserById(params.id);

  if (!user) {
    return (
        <div className="container mx-auto p-4 md:p-6 text-center">
            <h1 className='text-2xl font-bold'>User not found</h1>
            <Button asChild variant="link">
                <Link href="/discover">Back to Discover</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
        <div className="mb-4">
            <Button asChild variant="ghost" className='pl-0'>
                <Link href="/discover">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Discover
                </Link>
            </Button>
        </div>
        <UserProfile user={user} />
    </div>
  );
}
