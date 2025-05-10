import { Section } from "@/components/section";
import { BlurrySquares } from "@/components/BlurrySquares";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <Section
      variant="screenCentered"
      className="relative flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 -z-10">
        <BlurrySquares />
      </div>

      <div className="z-10 max-w-3xl px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Navigate the medical system with{" "}
          <span className="text-avi-purple dark:text-avi-green">ease.</span>
        </h1>
        <p className="text-muted-foreground dark:text-white mb-8 text-xl">
          Simplify your healthcare experience with our intuitive platform that helps you manage your
          medical records, insurance information, and more in one place with powerful automation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/patient">Onboarding</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
