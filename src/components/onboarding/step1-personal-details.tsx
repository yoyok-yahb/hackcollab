'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Github, Linkedin, Twitter } from 'lucide-react';
import type { User } from '@/lib/data';

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  data: Partial<User>;
  setData: (data: Partial<User>) => void;
}

export function OnboardingStep1({ onNext, data, setData }: OnboardingStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Let's start with the basics. This information will be visible on your profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Ada Lovelace" value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="ada@example.com" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })}/>
            </div>
        </div>
        <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div> 
        </div>
        <div className="space-y-2">
          <Label>Social Media Links (Optional)</Label>
          <div className="space-y-2">
             <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-muted-foreground" />
                <Input placeholder="https://github.com/your-username" value={data.socialLinks?.github || ''} onChange={(e) => setData({ ...data, socialLinks: {...data.socialLinks, github: e.target.value}})} />
             </div>
             <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <Input placeholder="https://linkedin.com/in/your-username" value={data.socialLinks?.linkedin || ''} onChange={(e) => setData({ ...data, socialLinks: {...data.socialLinks, linkedin: e.target.value}})} />
             </div>
              <div className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <Input placeholder="https://twitter.com/your-username" value={data.socialLinks?.twitter || ''} onChange={(e) => setData({ ...data, socialLinks: {...data.socialLinks, twitter: e.target.value}})} />
             </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext} className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  );
}
