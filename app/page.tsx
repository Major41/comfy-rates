"use client";

import Link from "next/link";
import { UtensilsCrossed, BedDouble, Users, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

function LandingContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="ComfyInn Logo" width={60} height={60} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Welcome to ComfyInn Eldoret
          </h2>
          <p className="text-xl text-muted-foreground">Comfort Meets Class</p>
        </div>

        {/* Navigation Cards - Now 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/menu" className="group">
            <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary/90 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UtensilsCrossed className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Restaurant Menu
                      </h3>
                      <p className="text-muted-foreground">
                        Explore our delicious offerings
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rooms" className="group">
            <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-accent/10 to-purple-500/10 flex items-center justify-center">
                  <div className="w-20 h-20 bg-accent/90 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BedDouble className="w-10 h-10 text-accent-foreground" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Room Rates & Services
                      </h3>
                      <p className="text-muted-foreground">
                        Find your perfect stay
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/conference-halls" className="group">
            <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                  <div className="w-20 h-20 bg-purple-500/90 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Conference Halls
                      </h3>
                      <p className="text-muted-foreground">
                        Perfect venues for your events
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-muted-foreground">
          <p className="text-sm">Enjoy your stay at ComfyInn Eldoret</p>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return <LandingContent />;
}
