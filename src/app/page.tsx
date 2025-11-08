import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Icons } from '@/components/icons';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-landing');

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

      <div className="flex flex-col items-center text-center max-w-4xl w-full">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Hackathon TeamUp</span>
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
          Find Your Dream Hackathon Team
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
          Connect with developers, designers, and innovators. Swipe, match, and build something amazing together.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/discover">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-12 w-full max-w-6xl">
        <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
