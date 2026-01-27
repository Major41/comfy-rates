import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  tags: string[];
  is_available: boolean;
  sort_order: number;
  created_at: string;
  category_name?: string;
}

export interface Room {
  id: number;
  name: string;
  description: string | null;
  price_per_night: number;
  image_url: string | null;
  capacity: number;
  amenities: string[];
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const result = await sql`SELECT * FROM categories ORDER BY sort_order, name`;
  return result as Category[];
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const result = await sql`SELECT * FROM categories WHERE id = ${id}`;
  return (result[0] as Category) || null;
}

export async function createCategory(data: {
  name: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
}): Promise<Category> {
  const result = await sql`
    INSERT INTO categories (name, description, image_url, sort_order)
    VALUES (${data.name}, ${data.description || null}, ${data.image_url || null}, ${data.sort_order || 0})
    RETURNING *
  `;
  return result[0] as Category;
}

export async function updateCategory(
  id: number,
  data: {
    name?: string;
    description?: string;
    image_url?: string;
    sort_order?: number;
  }
): Promise<Category | null> {
  const result = await sql`
    UPDATE categories
    SET 
      name = COALESCE(${data.name || null}, name),
      description = COALESCE(${data.description || null}, description),
      image_url = COALESCE(${data.image_url || null}, image_url),
      sort_order = COALESCE(${data.sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as Category) || null;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM categories WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
  const result = await sql`
    SELECT mi.*, c.name as category_name 
    FROM menu_items mi 
    LEFT JOIN categories c ON mi.category_id = c.id 
    ORDER BY mi.sort_order, mi.name
  `;
  return result as MenuItem[];
}

export async function getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
  const result = await sql`
    SELECT * FROM menu_items 
    WHERE category_id = ${categoryId} AND is_available = true
    ORDER BY sort_order, name
  `;
  return result as MenuItem[];
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const result = await sql`
    SELECT mi.*, c.name as category_name 
    FROM menu_items mi 
    LEFT JOIN categories c ON mi.category_id = c.id 
    WHERE mi.id = ${id}
  `;
  return (result[0] as MenuItem) || null;
}

export async function createMenuItem(data: {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  tags?: string[];
  is_available?: boolean;
  sort_order?: number;
}): Promise<MenuItem> {
  const result = await sql`
    INSERT INTO menu_items (category_id, name, description, price, image_url, tags, is_available, sort_order)
    VALUES (
      ${data.category_id}, 
      ${data.name}, 
      ${data.description || null}, 
      ${data.price}, 
      ${data.image_url || null}, 
      ${data.tags || []}, 
      ${data.is_available !== false}, 
      ${data.sort_order || 0}
    )
    RETURNING *
  `;
  return result[0] as MenuItem;
}

export async function updateMenuItem(
  id: number,
  data: {
    category_id?: number;
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    tags?: string[];
    is_available?: boolean;
    sort_order?: number;
  }
): Promise<MenuItem | null> {
  const result = await sql`
    UPDATE menu_items
    SET 
      category_id = COALESCE(${data.category_id ?? null}, category_id),
      name = COALESCE(${data.name || null}, name),
      description = COALESCE(${data.description || null}, description),
      price = COALESCE(${data.price ?? null}, price),
      image_url = COALESCE(${data.image_url || null}, image_url),
      tags = COALESCE(${data.tags || null}, tags),
      is_available = COALESCE(${data.is_available ?? null}, is_available),
      sort_order = COALESCE(${data.sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as MenuItem) || null;
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM menu_items WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

// Rooms
export async function getRooms(): Promise<Room[]> {
  const result = await sql`SELECT * FROM rooms ORDER BY sort_order, price_per_night`;
  return result as Room[];
}

export async function getRoomById(id: number): Promise<Room | null> {
  const result = await sql`SELECT * FROM rooms WHERE id = ${id}`;
  return (result[0] as Room) || null;
}

export async function createRoom(data: {
  name: string;
  description?: string;
  price_per_night: number;
  image_url?: string;
  capacity?: number;
  amenities?: string[];
  is_available?: boolean;
  sort_order?: number;
}): Promise<Room> {
  const result = await sql`
    INSERT INTO rooms (name, description, price_per_night, image_url, capacity, amenities, is_available, sort_order)
    VALUES (
      ${data.name}, 
      ${data.description || null}, 
      ${data.price_per_night}, 
      ${data.image_url || null}, 
      ${data.capacity || 2}, 
      ${data.amenities || []}, 
      ${data.is_available !== false}, 
      ${data.sort_order || 0}
    )
    RETURNING *
  `;
  return result[0] as Room;
}

export async function updateRoom(
  id: number,
  data: {
    name?: string;
    description?: string;
    price_per_night?: number;
    image_url?: string;
    capacity?: number;
    amenities?: string[];
    is_available?: boolean;
    sort_order?: number;
  }
): Promise<Room | null> {
  const result = await sql`
    UPDATE rooms
    SET 
      name = COALESCE(${data.name || null}, name),
      description = COALESCE(${data.description || null}, description),
      price_per_night = COALESCE(${data.price_per_night ?? null}, price_per_night),
      image_url = COALESCE(${data.image_url || null}, image_url),
      capacity = COALESCE(${data.capacity ?? null}, capacity),
      amenities = COALESCE(${data.amenities || null}, amenities),
      is_available = COALESCE(${data.is_available ?? null}, is_available),
      sort_order = COALESCE(${data.sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as Room) || null;
}

export async function deleteRoom(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM rooms WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

// Services
export async function getServices(): Promise<Service[]> {
  const result = await sql`SELECT * FROM services ORDER BY sort_order, name`;
  return result as Service[];
}

export async function getServiceById(id: number): Promise<Service | null> {
  const result = await sql`SELECT * FROM services WHERE id = ${id}`;
  return (result[0] as Service) || null;
}

export async function createService(data: {
  name: string;
  description?: string;
  price?: number;
  is_available?: boolean;
  sort_order?: number;
}): Promise<Service> {
  const result = await sql`
    INSERT INTO services (name, description, price, is_available, sort_order)
    VALUES (
      ${data.name}, 
      ${data.description || null}, 
      ${data.price ?? null}, 
      ${data.is_available !== false}, 
      ${data.sort_order || 0}
    )
    RETURNING *
  `;
  return result[0] as Service;
}

export async function updateService(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    is_available?: boolean;
    sort_order?: number;
  }
): Promise<Service | null> {
  const result = await sql`
    UPDATE services
    SET 
      name = COALESCE(${data.name || null}, name),
      description = COALESCE(${data.description || null}, description),
      price = COALESCE(${data.price ?? null}, price),
      is_available = COALESCE(${data.is_available ?? null}, is_available),
      sort_order = COALESCE(${data.sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as Service) || null;
}

export async function deleteService(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM services WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

// Stats for dashboard
export async function getDashboardStats() {
  const [categories, items, rooms, services] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM categories`,
    sql`SELECT COUNT(*) as count FROM menu_items`,
    sql`SELECT COUNT(*) as count FROM rooms`,
    sql`SELECT COUNT(*) as count FROM services`,
  ]);
  
  return {
    categoriesCount: Number(categories[0].count),
    itemsCount: Number(items[0].count),
    roomsCount: Number(rooms[0].count),
    servicesCount: Number(services[0].count),
  };
}

export { sql };
