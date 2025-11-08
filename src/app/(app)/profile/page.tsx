'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/data';
import { Github, Linkedin, Pencil, Twitter, Briefcase, Award, Lightbulb, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useIsClient } from '@/hooks/use-is-client';
import { Icons } from '@/components/icons';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const isClient = useIsClient();
  // Force re-render when user data changes
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also update when the component mounts, in case data changed while the component was unmounted
    setUser(getCurrentUser()); 

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, []);


  if (!isClient) {
     return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
            <Icons.logo className="h-12 w-12 text-primary animate-pulse" />
            <p className="mt-4 text-lg">Loading your experience...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={user.image.imageUrl} alt={user.name} />
            <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl">{user.name || "Your Name"}, {user.age || 'Age'}</CardTitle>
                <CardDescription className="mt-2 text-base">{user.bio || 'Your bio will appear here. Add one by editing your profile!'}</CardDescription>
              </div>
              <Button asChild variant="outline" size="icon" className="flex-shrink-0 ml-4">
                <Link href="/profile/edit">
                    <Pencil className="h-5 w-5" />
                    <span className="sr-only">Edit Profile</span>
                </Link>
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-4">
                {user.socialLinks?.github && (
                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Github className="h-6 w-6" />
                    </a>
                )}
                {user.socialLinks?.linkedin && (
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-6 w-6" />
                    </a>
                )}
                {user.socialLinks?.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-6 w-6" />
                    </a>
                )}
            </div>
          </div>
        </CardHeader>
      </Card>

        <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="h-6 w-6 text-primary" /> Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.skills && user.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-base py-1 px-3">{skill}</Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No skills listed yet. Add some from the edit profile page!</p>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award className="h-6 w-6 text-primary" /> Hackathon Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{user.experience || "No hackathon experience listed yet."}</p>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary" /> Past Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.projects && user.projects.length > 0 ? (
                            <div className="space-y-4">
                                {user.projects.map((project, index) => (
                                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                                        <h4 className="font-semibold">{project.title}</h4>
                                        <p className="text-sm text-muted-foreground mt-1 mb-2">{project.description}</p>
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                                <LinkIcon className="h-4 w-4" />
                                                View Project
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No projects listed yet. Add some from the edit profile page!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );

    