'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import type { User } from '@/lib/data';

const suggestedSkills = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Go',
  'GraphQL', 'REST APIs', 'Firebase', 'AWS', 'Docker', 'Figma', 'UI/UX Design',
  'Project Management', 'Agile', 'Data Analysis', 'Machine Learning'
];

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  data: Partial<User>;
  setData: (data: Partial<User>) => void;
}

export function OnboardingStep2({ onNext, onBack, data, setData }: OnboardingStepProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(data.skills || []);
  const [otherSkills, setOtherSkills] = useState('');

  useEffect(() => {
    const combinedSkills = [...new Set([...selectedSkills, ...otherSkills.split(',').map(s => s.trim()).filter(Boolean)])];
    setData({ skills: combinedSkills });
  }, [selectedSkills, otherSkills, setData]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Skills</CardTitle>
        <CardDescription>Showcase your expertise. Select from the suggestions or add your own.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="text-sm font-medium mb-2">Suggested Skills</h3>
            <div className="flex flex-wrap gap-2">
            {suggestedSkills.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)}>
                    <Badge variant={selectedSkills.includes(skill) ? 'default' : 'secondary'} className="cursor-pointer text-sm py-1 px-3">
                        {skill}
                    </Badge>
                </button>
            ))}
            </div>
        </div>
        <div>
            <h3 className="text-sm font-medium mb-2">Add Other Skills</h3>
            <Textarea 
                placeholder="Enter any other skills, separated by commas... (e.g., C++, Solidity, Prompt Engineering)" 
                value={otherSkills}
                onChange={(e) => setOtherSkills(e.target.value)}
            />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Continue</Button>
      </CardFooter>
    </Card>
  );
}
