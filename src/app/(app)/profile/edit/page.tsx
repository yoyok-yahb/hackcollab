'use client';
import { useState } from 'react';
import { OnboardingStep1 } from '@/components/onboarding/step1-personal-details';
import { OnboardingStep2 } from '@/components/onboarding/step2-skills';
import { OnboardingStep3 } from '@/components/onboarding/step3-projects';
import { OnboardingStep4 } from '@/components/onboarding/step4-experience';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser, saveCurrentUser, User } from '@/lib/data';

const steps = [
    { component: OnboardingStep1, title: "Personal Details" },
    { component: OnboardingStep2, title: "Your Skills" },
    { component: OnboardingStep3, title: "Your Projects" },
    { component: OnboardingStep4, title: "Your Experience" },
];

export default function EditProfilePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<Partial<User>>(() => getCurrentUser());
  const router = useRouter();

  const updateProfileData = (data: Partial<User>) => {
    setProfileData(prev => ({...prev, ...data}));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish editing
      saveCurrentUser(profileData as User);
      router.push('/profile');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="container mx-auto p-4 md:p-6">
       <div className="mb-4">
            <Button asChild variant="ghost" className='pl-0'>
                <Link href="/profile">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Link>
            </Button>
        </div>
        <div className="w-full max-w-4xl mx-auto">
             <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Edit Your Profile</h1>
                <p className="text-muted-foreground">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
             </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-8 w-full" />
            <CurrentStepComponent onNext={handleNext} onBack={handleBack} data={profileData} setData={updateProfileData} />
        </div>
    </div>
  );
}
