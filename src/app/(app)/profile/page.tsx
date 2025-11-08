import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser, User } from '@/lib/data';
import { Github, Linkedin, Pencil, Twitter } from 'lucide-react';
import { ProfileVerification } from '@/components/profile-verification';
import Link from 'next/link';

export default function ProfilePage() {
  const user = getCurrentUser();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={user.image.imageUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{user.name}, {user.age}</CardTitle>
              <Button asChild variant="outline" size="icon">
                <Link href="/profile/edit">
                    <Pencil className="h-5 w-5" />
                    <span className="sr-only">Edit Profile</span>
                </Link>
              </Button>
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
             <div>
                <h3 className="font-semibold text-lg mb-2">Hackathon Preferences</h3>
                <div className="flex flex-wrap gap-2">
                    {user.preferences.map(pref => (
                        <Badge key={pref} variant="outline" className="text-base py-1 px-3">{pref}</Badge>
                    ))}
                </div>
            </div>
             <div className="md:col-span-2">
                <h3 className="font-semibold text-lg mb-2">Experience</h3>
                <p className="text-muted-foreground">{user.experience}</p>
            </div>
        </CardContent>
         <Separator />
        <CardContent className="pt-6">
            <ProfileVerification user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
