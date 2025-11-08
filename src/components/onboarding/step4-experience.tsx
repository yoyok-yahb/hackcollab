'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import type { User } from '@/lib/data';

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  data: Partial<User>;
  setData: (data: Partial<User>) => void;
}

export function OnboardingStep4({ onNext, onBack, data, setData }: OnboardingStepProps) {
  const [experiences, setExperiences] = useState(data.experience ? [{ name: '', description: data.experience }] : [{ name: '', description: '' }]);

  const handleAddExperience = () => {
    setExperiences([...experiences, { name: '', description: '' }]);
  }
  const handleRemoveExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperiences = [...experiences];
    (newExperiences[index] as any)[field] = value;
    setExperiences(newExperiences);
  };
  
  const handleNext = () => {
      // For now, let's just combine descriptions into one string.
      // A more robust solution might change the User model.
      const combinedExperience = experiences.map(e => e.description).filter(Boolean).join('\n\n');
      setData({ experience: combinedExperience });
      onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hackathon Experience</CardTitle>
        <CardDescription>Tell us about your past hackathon glories. No experience? No problem, just skip ahead.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences.map((exp, index) => (
             <div key={index} className="space-y-3 rounded-lg border p-4 relative">
                {experiences.length > 1 && (
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground" onClick={() => handleRemoveExperience(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
                <div className="space-y-2">
                    <Label htmlFor={`hackathon-name-${index}`}>Hackathon Name</Label>
                    <Input id={`hackathon-name-${index}`} placeholder="e.g., Hack The Planet 2023" value={exp.name} onChange={(e) => handleExperienceChange(index, 'name', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`hackathon-description-${index}`}>Your Project & Achievement</Label>
                    <Textarea id={`hackathon-description-${index}`} placeholder="Briefly describe the project you built and any awards you won." value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`certificate-${index}`}>Certificate (Optional)</Label>
                    <Input id={`certificate-${index}`} type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                </div>
            </div>
        ))}
         <Button variant="outline" className="w-full" onClick={handleAddExperience}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add another experience
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNext}>Continue</Button>
      </CardFooter>
    </Card>
  );
}
