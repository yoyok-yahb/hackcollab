'use client';
import { useState, useEffect } from 'react';
import { OnboardingStep1 } from '@/components/onboarding/step1-personal-details';
import { OnboardingStep2 } from '@/components/onboarding/step2-skills';
import { OnboardingStep3 } from '@/components/onboarding/step3-projects';
import { OnboardingStep4 } from '@/components/onboarding/step4-experience';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { saveCurrentUser, getCurrentUser, User } from '@/lib/data';
import { Icons } from '@/components/icons';

const steps = [
    { component: OnboardingStep1, title: "Personal Details" },
    { component: OnboardingStep2, title: "Your Skills" },
    { component: OnboardingStep3, title: "Your Projects" },
    { component: OnboardingStep4, title: "Your Experience" },
];

const getInitialData = (): Partial<User> => {
    try {
        // This function runs on the client, so window is available
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            return JSON.parse(savedUser);
        }
    } catch (error) {
        // In case of any error (e.g. storage disabled), fall back to default
        console.error("Could not read from localStorage", error);
    }
    
    // Return a default structure if nothing is in storage
    return {
        id: `user${Date.now()}`,
        name: '',
        age: 18,
        bio: '',
        email: '',
        skills: [],
        experience: '',
        socialLinks: { github: '', linkedin: '', twitter: '' },
        image: { id: 'user1', imageUrl: 'https://picsum.photos/seed/1/200/200', imageHint: 'person portrait', description: '' },
        projects: []
    };
};


export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<User>>({});
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This effect runs only on the client
    setOnboardingData(getInitialData());
    setIsClient(true);
  }, []);

  const updateOnboardingData = (newData: Partial<User>) => {
    setOnboardingData(prev => ({...prev, ...newData}));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish onboarding
      saveCurrentUser(onboardingData as User);
      router.push('/discover');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  if (!isClient) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
            <Icons.logo className="h-12 w-12 text-primary animate-pulse" />
            <p className="mt-4 text-lg">Loading your experience...</p>
        </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
        <div className="w-full max-w-2xl">
             <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Create Your Profile</h1>
                <p className="text-muted-foreground">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
             </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-8 w-full" />
            <CurrentStepComponent onNext={handleNext} onBack={handleBack} data={onboardingData} setData={updateOnboardingData} />
        </div>
    </div>
  );
}
