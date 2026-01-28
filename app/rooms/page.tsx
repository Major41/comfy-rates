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
  ChevronDown,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Room, Service } from "@/lib/db";

type FilterState = {
  roomType: string[];
  bedType: string[];
  mealPlan: string[];
  priceRange: [number, number];
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
    priceRange: [0, 10000], // Based on your data range
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

        // Set initial price range based on actual data
        const prices = roomsData.map((r: Room) =>
          parseFloat(r.price_per_night),
        );
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setFilters((prev) => ({
          ...prev,
          priceRange: [minPrice, maxPrice],
        }));
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
        const price = parseFloat(room.price_per_night);

        // Price filter
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }

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
      priceRange: [0, 10000],
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
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bed className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">Room Rates</h1>
                  <p className="text-xs text-muted-foreground">
                    ComfyInn Accommodations
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filter
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filter Rooms</h3>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Room Type Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Room Type</h4>
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
                  <h4 className="text-sm font-medium mb-2">Bed Type</h4>
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
                  <h4 className="text-sm font-medium mb-2">Meal Plan</h4>
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

                {/* Price Range Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Price Range: Ksh{filters.priceRange[0]} - Ksh
                    {filters.priceRange[1]}
                  </h4>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={filters.priceRange}
                      min={0}
                      max={10000}
                      step={500}
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: value as [number, number],
                        }))
                      }
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Ksh{filters.priceRange[0]}</span>
                      <span>Ksh{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(getActiveFilterCount() > 0 ||
            filters.priceRange[0] > 0 ||
            filters.priceRange[1] < 10000) && (
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {filters.roomType.map((type) => (
                  <Badge key={type} variant="secondary" className="gap-1">
                    {type}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter("roomType", type)}
                    />
                  </Badge>
                ))}
                {filters.bedType.map((type) => (
                  <Badge key={type} variant="secondary" className="gap-1">
                    {type}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter("bedType", type)}
                    />
                  </Badge>
                ))}
                {filters.mealPlan.map((plan) => (
                  <Badge key={plan} variant="secondary" className="gap-1">
                    {plan}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter("mealPlan", plan)}
                    />
                  </Badge>
                ))}
                {(filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < 10000) && (
                  <Badge variant="secondary" className="gap-1">
                    Price: Ksh{filters.priceRange[0]} - Ksh
                    {filters.priceRange[1]}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [0, 10000],
                        }))
                      }
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Rooms Summary */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Our Rooms</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </p>
          </div>
          {filteredRooms.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Prices:</span> Ksh
              {Math.min(
                ...filteredRooms.map((r) => parseFloat(r.price_per_night)),
              ).toFixed(0)}
              {" - "}
              Ksh
              {Math.max(
                ...filteredRooms.map((r) => parseFloat(r.price_per_night)),
              ).toFixed(0)}
            </div>
          )}
        </div>

        {/* Rooms Section */}
        <section>
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No rooms match your filters
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRooms
                .filter((room) => room.is_available)
                .map((room) => (
                  <Card
                    key={room.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
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
                        {/* Room Type Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge
                            variant="secondary"
                            className="backdrop-blur-sm bg-white/90"
                          >
                            {room.name.split(" ")[0]}{" "}
                            {/* Shows Standard/Deluxe/Twin */}
                          </Badge>
                        </div>
                      </div>

                      {/* Room Details */}
                      <CardContent className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {room.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Users className="h-4 w-4" />
                                <span>Up to {room.capacity} guests</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {room.name.includes("Single")
                                  ? "Single Bed"
                                  : room.name.includes("Double")
                                    ? "Double Bed"
                                    : "Twin Beds"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
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
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary">
                              Ksh{Number(room.price_per_night).toFixed(0)}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              per night
                            </p>
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
                              Ksh{Number(service.price).toFixed(0)}
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
