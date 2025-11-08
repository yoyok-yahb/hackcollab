'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '../ui/textarea';
import type { User } from '@/lib/data';

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  data: Partial<User>;
  setData: (data: Partial<User>) => void;
}

export function OnboardingStep4({ onNext, onBack, data, setData }: OnboardingStepProps) {

  const handleNext = () => {
      // The `data` object is passed by reference, so `setData` updates the parent state.
      // We just need to call onNext.
      onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hackathon Experience</CardTitle>
        <CardDescription>Tell us about your past hackathon glories. No experience? No problem, just skip ahead.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <Textarea 
            placeholder="Describe your hackathon experience, projects you've built, or awards you've won..." 
            value={data.experience || ''} 
            onChange={(e) => setData({ ...data, experience: e.target.value })} 
            rows={6}
          />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNext}>Continue</Button>
      </CardFooter>
    </Card>
  );
}
