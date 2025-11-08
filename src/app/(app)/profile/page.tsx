import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser, User } from '@/lib/data';
import { Github, Linkedin, Pencil, Twitter, Briefcase, Award, Lightbulb } from 'lucide-react';
import { ProfileVerification } from '@/components/profile-verification';
import Link from 'next/link';

export default function ProfilePage() {
  const user = getCurrentUser();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={user.image.imageUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl">{user.name}, {user.age}</CardTitle>
                <CardDescription className="mt-2 text-base">{user.bio}</CardDescription>
              </div>
              <Button asChild variant="outline" size="icon" className="flex-shrink-0 ml-4">
                <Link href="/profile/edit">
                    <Pencil className="h-5 w-5" />
                    <span className="sr-only">Edit Profile</span>
                </Link>
              </Button>
            </div>
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
      </Card>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="h-6 w-6 text-primary" /> Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map(skill => (
                                <Badge key={skill} variant="secondary" className="text-base py-1 px-3">{skill}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award className="h-6 w-6 text-primary" /> Hackathon Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{user.experience || "No hackathon experience listed yet."}</p>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary" /> Past Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No projects listed yet. Add some from the edit profile page!</p>
                    </CardContent>
                </Card>

            </div>
            <div className="space-y-6">
                <Card>
                     <CardHeader>
                        <CardTitle>Interests & Hobbies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {user.preferences.map(pref => (
                                <Badge key={pref} variant="outline" className="text-base py-1 px-3">{pref}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>AI Profile Analysis</CardTitle>
                         <CardDescription>Analyze this profile for completeness and legitimacy.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileVerification user={user} />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
