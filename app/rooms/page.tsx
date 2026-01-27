"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bed, Users, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Room, Service } from "@/lib/db";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsRes, servicesRes] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/services"),
        ]);
        const roomsData = await roomsRes.json();
        const servicesData = await servicesRes.json();
        setRooms(roomsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Room Rates</h1>
                <p className="text-xs text-muted-foreground">ComfyInn Accommodations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Rooms Section */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Our Rooms</h2>
          {rooms.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No rooms available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms
                .filter((room) => room.is_available)
                .map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    <div className="md:flex">
                      {/* Room Image */}
                      <div className="relative h-56 md:h-auto md:w-80 shrink-0">
                        {room.image_url ? (
                          <Image
                            src={room.image_url || "/placeholder.svg"}
                            alt={room.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full min-h-56 bg-muted flex items-center justify-center">
                            <Bed className="h-16 w-16 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>

                      {/* Room Details */}
                      <CardContent className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {room.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                              <Users className="h-4 w-4" />
                              <span>Up to {room.capacity} guests</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary">
                              ${Number(room.price_per_night).toFixed(0)}
                            </span>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                        </div>

                        {room.description && (
                          <p className="text-muted-foreground text-sm mt-3">
                            {room.description}
                          </p>
                        )}

                        {room.amenities && room.amenities.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-medium text-foreground mb-2">
                              Amenities
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.map((amenity) => (
                                <Badge
                                  key={amenity}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </section>

        {/* Services Section */}
        {services.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Additional Services
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {services
                .filter((service) => service.is_available)
                .map((service) => (
                  <Card key={service.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-foreground">
                            {service.name}
                          </h3>
                          {service.price !== null && (
                            <span className="text-primary font-semibold whitespace-nowrap">
                              ${Number(service.price).toFixed(0)}
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-muted-foreground text-sm mt-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            ComfyInn - Comfort Meets Class
          </p>
        </div>
      </footer>
    </div>
  );
}
