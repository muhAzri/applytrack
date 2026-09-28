import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { GuestVsAccount } from "@/components/landing/guest-vs-account";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <GuestVsAccount />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
