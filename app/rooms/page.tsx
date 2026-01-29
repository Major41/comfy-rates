"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Bed,
  Users,
  Check,
  Loader2,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Room, Service } from "@/lib/db";

type FilterState = {
  roomType: string[];
  bedType: string[];
  mealPlan: string[];
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    roomType: [],
    bedType: [],
    mealPlan: [],
  });

  // Extract unique values from room names
  const filterOptions = useMemo(() => {
    const roomTypes = new Set<string>();
    const bedTypes = new Set<string>();
    const mealPlans = new Set<string>();

    rooms.forEach((room) => {
      // Extract room type (Standard, Deluxe, Twin)
      if (room.name.includes("Standard")) roomTypes.add("Standard");
      if (room.name.includes("Deluxe")) roomTypes.add("Deluxe");
      if (room.name.includes("Twin")) roomTypes.add("Twin");

      // Extract bed type (Single, Double, Twin)
      if (room.name.includes("Single")) bedTypes.add("Single");
      if (room.name.includes("Double")) bedTypes.add("Double");
      if (room.name.includes("Twin Room")) bedTypes.add("Twin");

      // Extract meal plan
      if (room.name.includes("Bed Only")) mealPlans.add("Bed Only");
      if (room.name.includes("Bed & Breakfast"))
        mealPlans.add("Bed & Breakfast");
      if (room.name.includes("Half Board")) mealPlans.add("Half Board");
      if (room.name.includes("Full Board")) mealPlans.add("Full Board");
    });

    return {
      roomTypes: Array.from(roomTypes).sort(),
      bedTypes: Array.from(bedTypes).sort(),
      mealPlans: Array.from(mealPlans).sort(),
    };
  }, [rooms]);

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

  // Apply filters to rooms
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        // Room type filter
        if (filters.roomType.length > 0) {
          const hasRoomType = filters.roomType.some((type) =>
            room.name.toLowerCase().includes(type.toLowerCase()),
          );
          if (!hasRoomType) return false;
        }

        // Bed type filter
        if (filters.bedType.length > 0) {
          const hasBedType = filters.bedType.some((type) =>
            room.name.toLowerCase().includes(type.toLowerCase()),
          );
          if (!hasBedType) return false;
        }

        // Meal plan filter
        if (filters.mealPlan.length > 0) {
          const hasMealPlan = filters.mealPlan.some((plan) =>
            room.name.toLowerCase().includes(plan.toLowerCase()),
          );
          if (!hasMealPlan) return false;
        }

        return true;
      })
      .sort(
        (a, b) => parseFloat(a.price_per_night) - parseFloat(b.price_per_night),
      );
  }, [rooms, filters]);

  // Toggle filter functions
  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentValues = [...prev[category]];
      const index = currentValues.indexOf(value);

      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(value);
      }

      return {
        ...prev,
        [category]: currentValues,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      roomType: [],
      bedType: [],
      mealPlan: [],
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters.roomType.length + filters.bedType.length + filters.mealPlan.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed for mobile */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground text-sm sm:text-base">
                    Room Rates
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    ComfyInn Accommodations
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8 sm:h-9"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Filter</span>
              {getActiveFilterCount() > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-5 px-1 text-xs"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters Display - Always visible on mobile */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-2 sm:mt-3">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Active:
                </span>
                {filters.roomType.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="gap-1 text-xs py-0.5"
                  >
                    {type}
                    <X
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer"
                      onClick={() => toggleFilter("roomType", type)}
                    />
                  </Badge>
                ))}
                {filters.bedType.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="gap-1 text-xs py-0.5"
                  >
                    {type}
                    <X
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer"
                      onClick={() => toggleFilter("bedType", type)}
                    />
                  </Badge>
                ))}
                {filters.mealPlan.map((plan) => (
                  <Badge
                    key={plan}
                    variant="secondary"
                    className="gap-1 text-xs py-0.5"
                  >
                    {plan}
                    <X
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer"
                      onClick={() => toggleFilter("mealPlan", plan)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-xs"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Drawer for Mobile */}
        {showFilters && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg p-4 max-h-[70vh] overflow-y-auto">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filter Rooms</h3>
                <div className="flex gap-2">
                  {getActiveFilterCount() > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Room Type Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Room Type</h4>
                  <div className="space-y-2">
                    {filterOptions.roomTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`room-${type}`}
                          checked={filters.roomType.includes(type)}
                          onChange={() => toggleFilter("roomType", type)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`room-${type}`}
                          className="ml-2 text-sm"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bed Type Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Bed Type</h4>
                  <div className="space-y-2">
                    {filterOptions.bedTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`bed-${type}`}
                          checked={filters.bedType.includes(type)}
                          onChange={() => toggleFilter("bedType", type)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`bed-${type}`} className="ml-2 text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meal Plan Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Meal Plan</h4>
                  <div className="space-y-2">
                    {filterOptions.mealPlans.map((plan) => (
                      <div key={plan} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`meal-${plan}`}
                          checked={filters.mealPlan.includes(plan)}
                          onChange={() => toggleFilter("mealPlan", plan)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`meal-${plan}`}
                          className="ml-2 text-sm"
                        >
                          {plan}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Rooms Summary - Improved mobile layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Our Rooms
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </p>
          </div>
          
        </div>

        {/* Rooms Section */}
        <section>
          {filteredRooms.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-card rounded-xl border border-border">
              <Bed className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-muted-foreground text-sm sm:text-base">
                No rooms match your filters
              </p>
              <Button
                variant="outline"
                className="mt-3 sm:mt-4"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredRooms
                .filter((room) => room.is_available)
                .map((room) => (
                  <Card
                    key={room.id}
                    className="overflow-hidden hover:shadow-md transition-shadow border-border"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Room Image - Responsive sizing */}
                      <div className="relative h-48 sm:h-auto sm:w-60 md:w-80 shrink-0">
                        {room.image_url ? (
                          <Image
                            src={room.image_url || "/placeholder.svg"}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 240px"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Bed className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                          </div>
                        )}
                        {/* Room Type Badge - Mobile responsive */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <Badge
                            variant="secondary"
                            className="backdrop-blur-sm bg-white/90 text-xs sm:text-sm py-0.5 sm:py-1"
                          >
                            {room.name.split(" ")[0]}
                          </Badge>
                        </div>
                      </div>

                      {/* Room Details - Improved mobile layout */}
                      <CardContent className="flex-1 p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-1">
                              {room.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>Up to {room.capacity}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs py-0.5"
                              >
                                {room.name.includes("Single")
                                  ? "Single Bed"
                                  : room.name.includes("Double")
                                    ? "Double Bed"
                                    : "Twin Beds"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs py-0.5"
                              >
                                {room.name.includes("Bed Only")
                                  ? "Room Only"
                                  : room.name.includes("Bed & Breakfast")
                                    ? "B&B"
                                    : room.name.includes("Half Board")
                                      ? "Half Board"
                                      : "Full Board"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-xl sm:text-2xl font-bold text-primary">
                                Ksh{Number(room.price_per_night).toFixed(0)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              per night
                            </p>
                          </div>
                        </div>

                        {room.description && (
                          <p className="text-muted-foreground text-xs sm:text-sm mt-3 line-clamp-2 sm:line-clamp-3">
                            {room.description}
                          </p>
                        )}

                        {room.amenities && room.amenities.length > 0 && (
                          <div className="mt-3 sm:mt-4">
                            <p className="text-xs font-medium text-foreground mb-2">
                              Amenities
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {room.amenities.slice(0, 4).map((amenity) => (
                                <Badge
                                  key={amenity}
                                  variant="secondary"
                                  className="text-xs py-0.5 px-2"
                                >
                                  <Check className="h-2.5 w-2.5 mr-1 inline" />
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities.length > 4 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs py-0.5 px-2"
                                >
                                  +{room.amenities.length - 4} more
                                </Badge>
                              )}
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

        {/* Services Section - Improved mobile layout */}
        {services.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
              Additional Services
            </h2>
            <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
              {services
                .filter((service) => service.is_available)
                .map((service) => (
                  <Card key={service.id} className="p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                          <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-1">
                            {service.name}
                          </h3>
                          {service.price !== null && (
                            <div className="flex items-center gap-1">
                              <span className="text-primary font-semibold text-sm sm:text-base whitespace-nowrap">
                                Ksh{Number(service.price).toFixed(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-muted-foreground text-xs sm:text-sm mt-1 line-clamp-2">
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
      <footer className="bg-card border-t border-border py-4 sm:py-6 mt-6">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            ComfyInn - Comfort Meets Class
          </p>
        </div>
      </footer>
    </div>
  );
}
