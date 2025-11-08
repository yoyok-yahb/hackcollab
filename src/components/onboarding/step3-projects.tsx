'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Link, PlusCircle, Trash2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingStep3({ onNext, onBack }: OnboardingStepProps) {
    const [projects, setProjects] = useState([{ title: '', description: '', link: ''}]);

    const handleAddProject = () => {
        setProjects([...projects, { title: '', description: '', link: ''}]);
    }
    const handleRemoveProject = (index: number) => {
        const newProjects = [...projects];
        newProjects.splice(index, 1);
        setProjects(newProjects);
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Projects</CardTitle>
        <CardDescription>Showcase your best work. Link to your projects or upload them.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project, index) => (
             <div key={index} className="space-y-3 rounded-lg border p-4 relative">
                {projects.length > 1 && (
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground" onClick={() => handleRemoveProject(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
                <div className="space-y-2">
                    <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                    <Input id={`project-title-${index}`} placeholder="e.g., My Awesome App" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`project-description-${index}`}>Description</Label>
                    <Textarea id={`project-description-${index}`} placeholder="A brief description of your project and your role." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`project-link-${index}`}>Project Link (Optional)</Label>
                    <div className="flex items-center gap-2">
                        <Link className="h-5 w-5 text-muted-foreground" />
                        <Input id={`project-link-${index}`} placeholder="https://github.com/your-username/your-repo" />
                    </div>
                </div>
            </div>
        ))}
       <Button variant="outline" className="w-full" onClick={handleAddProject}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add another project
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Continue</Button>
      </CardFooter>
    </Card>
  );
}
