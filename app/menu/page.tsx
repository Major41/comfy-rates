"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UtensilsCrossed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category, MenuItem } from "@/lib/db";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/menu-items"),
        ]);
        const categoriesData = await categoriesRes.json();
        const itemsData = await itemsRes.json();
        setCategories(categoriesData);
        setMenuItems(itemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getItemsByCategory = (categoryId: number) => {
    return menuItems.filter(
      (item) => item.category_id === categoryId && item.is_available
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
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Restaurant Menu</h1>
                <p className="text-xs text-muted-foreground">ComfyInn Dining</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No menu items available</p>
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              const items = getItemsByCategory(category.id);
              if (items.length === 0) return null;

              return (
                <section key={category.id} className="space-y-4">
                  {/* Category Header with Image */}
                  <div className="relative rounded-xl overflow-hidden h-48 md:h-64">
                    {category.image_url ? (
                      <Image
                        src={category.image_url || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <UtensilsCrossed className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-white/80 text-sm md:text-base mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Food Items List */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-card rounded-xl border border-border p-4 flex gap-4 hover:shadow-md transition-shadow"
                      >
                        {/* Item Image */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0">
                          {item.image_url ? (
                            <Image
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <UtensilsCrossed className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground text-base md:text-lg">
                              {item.name}
                            </h3>
                            <span className="text-primary font-bold text-lg whitespace-nowrap">
                              Ksh{Number(item.price).toFixed(2)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
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
