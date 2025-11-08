'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const suggestedInterests = [
  'Artificial Intelligence', 'Blockchain', 'Sustainability', 'Health & Wellness',
  'Education', 'Fintech', 'Gaming', 'Music & Arts', 'Social Good', 'AR/VR'
];

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingStep5({ onNext, onBack }: OnboardingStepProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interests & Hobbies</CardTitle>
        <CardDescription>What are you passionate about outside of coding? This helps find better matches.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="text-sm font-medium mb-2">Select Your Interests</h3>
            <div className="flex flex-wrap gap-2">
            {suggestedInterests.map(interest => (
                <button key={interest} onClick={() => toggleInterest(interest)}>
                    <Badge variant={selectedInterests.includes(interest) ? 'default' : 'secondary'} className="cursor-pointer text-sm py-1 px-3">
                        {interest}
                    </Badge>
                </button>
            ))}
            </div>
        </div>
        <div>
            <h3 className="text-sm font-medium mb-2">Other Hobbies (Optional)</h3>
            <Textarea placeholder="List any other hobbies you have, separated by commas..." />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Finish Onboarding</Button>
      </CardFooter>
    </Card>
  );
}
