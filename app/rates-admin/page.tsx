"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderOpen,
  UtensilsCrossed,
  BedDouble,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Stats {
  categoriesCount: number;
  itemsCount: number;
  roomsCount: number;
  servicesCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Menu Categories",
      value: stats?.categoriesCount ?? 0,
      icon: FolderOpen,
      href: "/rates-admin/categories",
      color: "bg-primary/10 text-primary",
    },
    {
      name: "Menu Items",
      value: stats?.itemsCount ?? 0,
      icon: UtensilsCrossed,
      href: "/rates-admin/items",
      color: "bg-accent/20 text-accent",
    },
    {
      name: "Rooms",
      value: stats?.roomsCount ?? 0,
      icon: BedDouble,
      href: "/rates-admin/rooms",
      color: "bg-primary/10 text-primary",
    },
    {
      name: "Services",
      value: stats?.servicesCount ?? 0,
      icon: Sparkles,
      href: "/rates-admin/services",
      color: "bg-accent/20 text-accent",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the ComfyInn admin panel. Manage your menu and room content
          here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  <span className="text-4xl font-bold text-foreground">
                    {stat.value}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-foreground mb-1">{stat.name}</h3>
              <Link
                href={stat.href}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Manage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/rates-admin/categories"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <FolderOpen className="w-5 h-5 text-primary" />
              <span className="font-medium">Add Category</span>
            </Link>
            <Link
              href="/rates-admin/items"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              <span className="font-medium">Add Menu Item</span>
            </Link>
            <Link
              href="/rates-admin/rooms"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <BedDouble className="w-5 h-5 text-primary" />
              <span className="font-medium">Add Room</span>
            </Link>
            <Link
              href="/rates-admin/services"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-medium">Add Service</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
