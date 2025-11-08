'use client';
import { useState } from 'react';
import { OnboardingStep1 } from '@/components/onboarding/step1-personal-details';
import { OnboardingStep2 } from '@/components/onboarding/step2-skills';
import { OnboardingStep3 } from '@/components/onboarding/step3-projects';
import { OnboardingStep4 } from '@/components/onboarding/step4-experience';
import { OnboardingStep5 } from '@/components/onboarding/step5-interests';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { saveCurrentUser, getCurrentUser, User } from '@/lib/data';

const steps = [
    { component: OnboardingStep1, title: "Personal Details" },
    { component: OnboardingStep2, title: "Your Skills" },
    { component: OnboardingStep3, title: "Your Projects" },
    { component: OnboardingStep4, title: "Your Experience" },
    { component: OnboardingStep5, title: "Interests & Hobbies" },
];

const getInitialData = (): Partial<User> => {
    const user = getCurrentUser();
    return {
        ...user,
        name: user.name || '',
        email: user.email || '',
        skills: user.skills || [],
        experience: user.experience || '',
        preferences: user.preferences || [],
        socialLinks: user.socialLinks || { github: '', linkedin: '', twitter: '' },
    };
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<User>>(getInitialData);
  const router = useRouter();

  const updateOnboardingData = (data: Partial<User>) => {
    setOnboardingData(prev => ({...prev, ...data}));
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
