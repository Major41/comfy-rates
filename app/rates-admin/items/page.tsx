"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, UtensilsCrossed, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ImageUpload } from "@/components/image-upload";
import type { Category, MenuItem } from "@/lib/db";

const PRESET_TAGS = ["Popular", "Chef's Choice", "New", "Spicy", "Vegetarian", "Vegan", "Gluten Free"];

export default function ItemsPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: null as string | null,
    category_id: "",
    tags: [] as string[],
    is_available: true,
  });

  async function fetchData() {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/menu-items"),
      ]);
      setCategories(await categoriesRes.json());
      setMenuItems(await itemsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: null,
      category_id: categories[0]?.id?.toString() || "",
      tags: [],
      is_available: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      image_url: item.image_url,
      category_id: item.category_id.toString(),
      tags: item.tags || [],
      is_available: item.is_available,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (item: MenuItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category_id || !formData.price) return;

    setSaving(true);
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      category_id: parseInt(formData.category_id),
      tags: formData.tags,
      is_available: formData.is_available,
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/menu-items/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast({ title: "Item updated", description: `"${formData.name}" has been updated.` });
      } else {
        const res = await fetch("/api/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast({ title: "Item added", description: `"${formData.name}" has been added.` });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving item:", error);
      toast({ title: "Error", description: "Failed to save item", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      const res = await fetch(`/api/menu-items/${deletingItem.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Item deleted", description: `"${deletingItem.name}" has been deleted.` });
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Menu Items</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2" disabled={categories.length === 0}>
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Create categories first</h3>
            <p className="text-muted-foreground">You need to create at least one category before adding menu items</p>
          </CardContent>
        </Card>
      ) : menuItems.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No menu items yet</h3>
            <p className="text-muted-foreground mb-4">Add your first menu item to get started</p>
            <Button onClick={handleOpenAdd}>Add Item</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow ${!item.is_available ? "opacity-60" : ""}`}
            >
              <CardContent className="p-0">
                <div className="relative h-40 bg-muted">
                  {item.image_url ? (
                    <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {item.tags[0]}
                    </Badge>
                  )}
                  {!item.is_available && (
                    <Badge className="absolute top-2 left-2 bg-muted-foreground text-background">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <span className="text-primary font-bold">Ksh{Number(item.price).toFixed(2)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(item.category_id)}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleOpenDelete(item)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Item Image</Label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="comfyinn/menu"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Classic Eggs Benedict"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the dish..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (Ksh)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={handleAddTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_TAGS.filter((t) => !formData.tags.includes(t)).map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button type="submit" disabled={!formData.name.trim() || !formData.category_id || !formData.price || saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingItem ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
