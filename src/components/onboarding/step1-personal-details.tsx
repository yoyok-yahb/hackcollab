'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Github, Linkedin, Twitter, Image as ImageIcon } from 'lucide-react';
import type { User } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  data: Partial<User>;
  setData: (data: Partial<User>) => void;
}

export function OnboardingStep1({ onNext, data, setData }: OnboardingStepProps) {

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setData({ ...data, image: { ...data.image!, imageUrl, imageHint: 'person portrait' } });
      };
      reader.readAsDataURL(file);
    }
  };

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
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="28" value={data.age || ''} onChange={(e) => setData({ ...data, age: Number(e.target.value) })}/>
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="bio">Your Bio</Label>
            <Textarea id="bio" placeholder="Tell us a little bit about yourself..." value={data.bio || ''} onChange={(e) => setData({ ...data, bio: e.target.value })} />
        </div>
        <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent overflow-hidden">
                    {data.image?.imageUrl && !data.image.imageUrl.includes('picsum.photos') ? (
                       <>
                        <Image src={data.image.imageUrl} alt="Profile preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                           <ImageIcon className="h-6 w-6 mr-2" /> Change Photo
                        </div>
                       </>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                        </div>
                    )}
                    <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/*"/>
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
