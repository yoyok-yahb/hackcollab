'use client';

import { useState } from 'react';
import { aiDrivenProfileVerification, AiDrivenProfileVerificationOutput } from '@/ai/flows/ai-driven-profile-verification';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ShieldCheck, ShieldAlert, Loader2, Info } from 'lucide-react';
import type { User } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function ProfileVerification({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiDrivenProfileVerificationOutput | null>(null);
  const { toast } = useToast();

  const handleVerification = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const socialLinks = Object.values(user.socialLinks).filter(Boolean) as string[];
      const verificationResult = await aiDrivenProfileVerification({
        profileText: `${user.name} - ${user.bio} - ${user.experience}`,
        socialLinks: socialLinks,
      });
      setResult(verificationResult);
      toast({
        title: "Verification Complete",
        description: `Profile analysis finished.`,
      })
    } catch (error) {
      console.error('Profile verification failed:', error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Could not analyze the profile at this time.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
            <CardTitle>AI Profile Analysis</CardTitle>
            <CardDescription>Use AI to check for completeness and potential red flags.</CardDescription>
        </CardHeader>
        <CardContent>
             <Button onClick={handleVerification} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <ShieldCheck className="mr-2 h-5 w-5" />
                )}
                Analyze Profile with AI
            </Button>
            {result && (
                <Alert className="mt-4" variant={result.isLegitimate ? "default" : "destructive"}>
                    {result.isLegitimate ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                <AlertTitle className="flex items-center justify-between">
                    {result.isLegitimate ? 'Profile Appears Legitimate' : 'Potential Issues Found'}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Info className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">AI Reasoning</h4>
                                    <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </AlertTitle>
                {result.flags.length > 0 && (
                    <AlertDescription>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {result.flags.map((flag, index) => (
                                <li key={index}>{flag}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                )}
                </Alert>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
