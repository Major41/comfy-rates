"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, BedDouble, Check, Loader2, X, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ImageUpload } from "@/components/image-upload";
import type { Room } from "@/lib/db";

const PRESET_AMENITIES = [
  "High-Speed Wifi",
  "Breakfast",
  "TV",
  "Lunch",
  "Room Service",
  "Dinner",
  "Luxury Bedding",
];

export default function RoomsPage() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price_per_night: "",
    description: "",
    image_url: null as string | null,
    capacity: "2",
    amenities: [] as string[],
    is_available: true,
  });

  async function fetchRooms() {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({ title: "Error", description: "Failed to load rooms", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      price_per_night: "",
      description: "",
      image_url: null,
      capacity: "2",
      amenities: [],
      is_available: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      price_per_night: room.price_per_night.toString(),
      description: room.description || "",
      image_url: room.image_url,
      capacity: room.capacity.toString(),
      amenities: room.amenities || [],
      is_available: room.is_available,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (room: Room) => {
    setDeletingRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price_per_night) return;

    setSaving(true);
    const roomData = {
      name: formData.name,
      price_per_night: parseFloat(formData.price_per_night),
      description: formData.description,
      image_url: formData.image_url,
      capacity: parseInt(formData.capacity),
      amenities: formData.amenities,
      is_available: formData.is_available,
    };

    try {
      if (editingRoom) {
        const res = await fetch(`/api/rooms/${editingRoom.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast({ title: "Room updated", description: `"${formData.name}" has been updated.` });
      } else {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast({ title: "Room added", description: `"${formData.name}" has been added.` });
      }
      setIsDialogOpen(false);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      toast({ title: "Error", description: "Failed to save room", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRoom) return;

    try {
      const res = await fetch(`/api/rooms/${deletingRoom.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Room deleted", description: `"${deletingRoom.name}" has been deleted.` });
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({ title: "Error", description: "Failed to delete room", variant: "destructive" });
    }
    setIsDeleteDialogOpen(false);
    setDeletingRoom(null);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <Toaster />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Rooms</h1>
          <p className="text-muted-foreground">Manage your hotel room offerings</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Room
        </Button>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No rooms yet</h3>
            <p className="text-muted-foreground mb-4">Add your first room to get started</p>
            <Button onClick={handleOpenAdd}>Add Room</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow ${!room.is_available ? "opacity-60" : ""}`}
            >
              <CardContent className="p-0">
                <div className="relative h-48 bg-muted">
                  {room.image_url ? (
                    <Image src={room.image_url || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BedDouble className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  {!room.is_available && (
                    <Badge className="absolute top-2 left-2 bg-muted-foreground text-background">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{room.name}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                        <Users className="w-4 h-4" />
                        <span>Up to {room.capacity} guests</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-primary">Ksh{Number(room.price_per_night).toFixed(0)}</span>
                      <p className="text-muted-foreground text-xs">per night</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{room.description}</p>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                        >
                          <Check className="w-3 h-3" />
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(room)}>
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleOpenDelete(room)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add Room"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Room Image</Label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="comfyinn/rooms"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Deluxe Room, Executive Suite"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price per Night (Ksh)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Max Guests</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the room..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMENITIES.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleToggleAmenity(amenity)}
                    >
                      {formData.amenities.includes(amenity) && <Check className="w-3 h-3 mr-1" />}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available</Label>
                <Switch
                  id="available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.name.trim() || !formData.price_per_night || saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingRoom ? "Save Changes" : "Add Room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingRoom?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
