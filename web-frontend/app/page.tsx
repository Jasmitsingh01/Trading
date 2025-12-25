import Header from "@/components/ui/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ChartSection } from "@/components/landing/chart-section"
import { CTASection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <ChartSection />
        <CTASection />
      </main>
    </>
  )
}
