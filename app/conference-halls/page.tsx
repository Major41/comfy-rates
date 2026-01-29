"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Users,
  Clock,
  Coffee,
  UtensilsCrossed,
  Sun,
  Moon,
  Building,
  CheckCircle,
  Maximize2,
  Video,
  Mic,
  Wifi,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ConferenceRatesPage() {
  const conferencePackages = [
    {
      id: 1,
      name: "Full Day Conference",
      description: "Complete conference package including hall hire, lunch, and refreshments",
      pricePerPerson: 3000,
      duration: "8 hours",
      includes: [
        "Hall hire for full day",
        "Basic AV equipment",
        "Free WiFi",
        "Conference materials",
      ],
      icon: <Sun className="h-6 w-6" />,
      color: "bg-blue-500",
      popular: true,
    },
    {
      id: 2,
      name: "Half Day Conference",
      description: "Morning or afternoon conference package",
      pricePerPerson: 2200,
      duration: "4 hours",
      includes: [
        "Hall hire for half day",
        "Basic AV equipment",
        "Free WiFi",
        "Conference materials",
      ],
      icon: <Clock className="h-6 w-6" />,
      color: "bg-green-500",
    },
  ];

  const hallHireRates = [
    {
      name: "Kerio Hall",
      capacity: "Up to 125 persons",
      price: 20000,
      features: [
        "Large projector screen",
        "Professional stage",
        "PA system",
        "WiFi & streaming capability",
      ],
      dimensions: "20m × 15m",
      icon: <Building className="h-5 w-5" />,
      imageUrl: "/conference.jpeg", // Replace with your actual image path
      imageAlt: "Kerio Hall - Large conference venue with stage and seating",
      featured: true,
    },
    {
      name: "Plateau Hall",
      capacity: "Up to 80 persons",
      price: 18000,
      features: [
        "HD Projector & screen",
        "Professional sound system",
        "Movable partitions for flexibility",
        "Natural lighting options",
        "High-speed WiFi",
        "Catering preparation area",
      ],
      dimensions: "18m × 12m",
      icon: <Building className="h-5 w-5" />,
      imageUrl: "/confre.jpeg", // Replace with your actual image path
      imageAlt: "Plateau Hall - Versatile conference space with movable partitions",
    },
    {
      name: "Sisibo Hall",
      capacity: "Up to 40 persons",
      price: 15000,
      features: [
        "Whiteboards & flip charts",
        "Comfortable theater seating",
        "Multiple power outlets",
        "Breakout area access",
      ],
      dimensions: "15m × 10m",
      icon: <Building className="h-5 w-5" />,
      imageUrl: "/confree.jpeg", // Replace with your actual image path
      imageAlt: "Sisibo Hall - Medium-sized conference room with modern amenities",
    },
    {
      name: "Board Room",
      capacity: "Up to 20 persons",
      price: 10000,
      features: [
        "Executive conference table",
        "Leather executive chairs",
        "Smart board display",
        "Soundproof walls",
      ],
      dimensions: "8m × 6m",
      icon: <Building className="h-5 w-5" />,
      imageUrl: "/boardroom.jpeg", // Replace with your actual image path
      imageAlt: "Board Room - Executive meeting room with video conferencing",
      premium: true,
    },
  ];

  const cateringRates = [
    {
      name: "Tea & Snacks Meeting",
      description: "Refreshments for meetings and conferences",
      pricePerPerson: 500,
      includes: ["Tea & coffee station", "Assorted snacks", "Bottled water", "Fresh juices"],
      icon: <Coffee className="h-5 w-5" />,
      timing: "Throughout the day",
    },
    {
      name: "Breakfast Meeting",
      description: "Complete breakfast buffet",
      pricePerPerson: 1200,
      includes: ["Full breakfast buffet", "Fresh juices", "Tea & coffee bar", "Pastries & fruits"],
      icon: <Sun className="h-5 w-5" />,
      timing: "7:00 AM - 10:00 AM",
    },
    {
      name: "Luncheon Meeting",
      description: "Three-course lunch buffet",
      pricePerPerson: 1500,
      includes: ["Starter, main, dessert", "Soft drinks", "Tea & coffee", "Salad & soup bar"],
      icon: <UtensilsCrossed className="h-5 w-5" />,
      timing: "12:00 PM - 2:00 PM",
    },
    {
      name: "Dinner Meeting",
      description: "Evening dining experience",
      pricePerPerson: 1500,
      includes: ["Three-course dinner", "Non-alcoholic drinks", "Dessert station", "Coffee/tea service"],
      icon: <Moon className="h-5 w-5" />,
      timing: "6:00 PM - 9:00 PM",
    },
  ];

  // Fallback image component for missing images
  const ImageWithFallback = ({ src, alt, hallName }: { src: string, alt: string, hallName: string }) => {
    return (
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        {src ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex flex-col items-center justify-center">
            <Building className="h-16 w-16 text-purple-500/50 mb-2" />
            <span className="text-purple-700/70 font-medium">{hallName}</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">
                    Conference Rates & Packages
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    ComfyInn Conference Center
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Introduction */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Conference & Meeting Solutions
          </h2>
          <p className="text-muted-foreground">
            Choose from our comprehensive conference packages or customize your own event.
            All packages can be tailored to your specific requirements.
          </p>
        </div>

        {/* Conference Packages */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Complete Conference Packages
            </h2>
            <Badge variant="outline" className="text-sm">
              Per Person Rates
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conferencePackages.map((pkg) => (
              <Card key={pkg.id} className={`relative overflow-hidden border-2 ${pkg.popular ? 'border-primary shadow-lg' : 'border-border'}`}>
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${pkg.color} text-white`}>
                      {pkg.icon}
                    </div>
                    <div>
                      <CardTitle>{pkg.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-foreground">
                      Ksh{pkg.pricePerPerson.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">per person per day</p>
                  </div>
                  
                  <p className="text-muted-foreground">{pkg.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Package Includes:</h4>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Hall Hire Rates with Images */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Hall Hire Rates (Full Day - 8 Hours)
            </h2>
            <Badge variant="outline" className="text-sm">
              Individual Hall Bookings
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hallHireRates.map((hall) => (
              <Card key={hall.name} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
                {/* Image Section */}
                <div className="relative">
                  <ImageWithFallback 
                    src={hall.imageUrl} 
                    alt={hall.imageAlt} 
                    hallName={hall.name}
                  />
                  
                  {/* Capacity Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/95 backdrop-blur-sm text-foreground border-0 shadow-sm">
                      <Users className="h-3 w-3 mr-1" />
                      {hall.capacity}
                    </Badge>
                  </div>
                  
                  {/* Premium/Featured Badge
                  {hall.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 border-0">
                        ⭐ Featured
                      </Badge>
                    </div>
                  )}
                  {hall.premium && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="bg-purple-600">
                        Premium
                      </Badge>
                    </div>
                  )} */}
                </div>
                
                <CardContent className="p-5">
                  {/* Hall Name and Dimensions */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-foreground">{hall.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Maximize2 className="h-3 w-3" />
                        <span>{hall.dimensions}</span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-purple-600">
                        Ksh{hall.price.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Full day hire (8 hours)
                      </p>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Key Features:</h4>
                    <ul className="space-y-2">
                      {hall.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Icons for quick visual cues */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    {hall.name === "Board Room" && (
                      <>
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4 text-purple-500" />
                          <span className="text-xs">Video Conf</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi className="h-4 w-4 text-purple-500" />
                          <span className="text-xs">WiFi</span>
                        </div>
                      </>
                    )}
                    {hall.name === "Kerio Hall" && (
                      <>
                        <div className="flex items-center gap-1">
                          <Mic className="h-4 w-4 text-purple-500" />
                          <span className="text-xs">PA System</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tv className="h-4 w-4 text-purple-500" />
                          <span className="text-xs">Projector</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Catering Rates */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">
            Catering Packages
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cateringRates.map((catering) => (
              <Card key={catering.name}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      {catering.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{catering.name}</h3>
                      <p className="text-xs text-muted-foreground">{catering.timing}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xl font-bold text-orange-600">
                      Ksh{catering.pricePerPerson.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {catering.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Includes:</h4>
                    <ul className="space-y-1">
                      {catering.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Need a Custom Package?
            </h3>
            <p className="text-muted-foreground mb-4">
              Contact our events team to customize a package tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="default" className="gap-2">
                Call: +254 703 696 692
              </Button>
              <Button variant="outline" className="gap-2">
                Email: info@comfyinneldoret.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}