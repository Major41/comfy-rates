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

export interface ConferenceHall {
  id: number;
  name: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  capacity: number;
  price_per_hour: number;
  price_half_day: number | null;
  price_full_day: number | null;
  price_weekend_surcharge: number;
  amenities: string[];
  features: string[];
  included_services: string[];
  square_meters: number | null;
  length_meters: number | null;
  width_meters: number | null;
  ceiling_height: number | null;
  has_natural_light: boolean;
  floor_type: string | null;
  technical_equipment: string[];
  seating_styles: string[];
  max_presenters: number;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
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

// ========== CONFERENCE HALLS ==========
export async function getConferenceHalls(): Promise<ConferenceHall[]> {
  const result = await sql`
    SELECT * FROM conference_halls 
    ORDER BY display_order, name
  `;
  return result as ConferenceHall[];
}

export async function getAvailableConferenceHalls(): Promise<ConferenceHall[]> {
  const result = await sql`
    SELECT * FROM conference_halls 
    WHERE is_available = true 
    ORDER BY display_order, name
  `;
  return result as ConferenceHall[];
}

export async function getFeaturedConferenceHalls(): Promise<ConferenceHall[]> {
  const result = await sql`
    SELECT * FROM conference_halls 
    WHERE is_featured = true AND is_available = true 
    ORDER BY display_order, name
    LIMIT 6
  `;
  return result as ConferenceHall[];
}

export async function getConferenceHallById(id: number): Promise<ConferenceHall | null> {
  const result = await sql`
    SELECT * FROM conference_halls WHERE id = ${id}
  `;
  return (result[0] as ConferenceHall) || null;
}

export async function createConferenceHall(data: {
  name: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  capacity: number;
  price_per_hour: number;
  price_half_day?: number;
  price_full_day?: number;
  price_weekend_surcharge?: number;
  amenities?: string[];
  features?: string[];
  included_services?: string[];
  square_meters?: number;
  length_meters?: number;
  width_meters?: number;
  ceiling_height?: number;
  has_natural_light?: boolean;
  floor_type?: string;
  technical_equipment?: string[];
  seating_styles?: string[];
  max_presenters?: number;
  is_available?: boolean;
  is_featured?: boolean;
  display_order?: number;
}): Promise<ConferenceHall> {
  const result = await sql`
    INSERT INTO conference_halls (
      name, description, short_description, image_url, capacity, 
      price_per_hour, price_half_day, price_full_day, price_weekend_surcharge,
      amenities, features, included_services, square_meters, length_meters, 
      width_meters, ceiling_height, has_natural_light, floor_type, 
      technical_equipment, seating_styles, max_presenters, is_available, 
      is_featured, display_order
    )
    VALUES (
      ${data.name}, 
      ${data.description || null}, 
      ${data.short_description || null}, 
      ${data.image_url || null}, 
      ${data.capacity}, 
      ${data.price_per_hour}, 
      ${data.price_half_day || null}, 
      ${data.price_full_day || null}, 
      ${data.price_weekend_surcharge || 0}, 
      ${data.amenities || []}, 
      ${data.features || []}, 
      ${data.included_services || []}, 
      ${data.square_meters || null}, 
      ${data.length_meters || null}, 
      ${data.width_meters || null}, 
      ${data.ceiling_height || null}, 
      ${data.has_natural_light !== false}, 
      ${data.floor_type || null}, 
      ${data.technical_equipment || []}, 
      ${data.seating_styles || []}, 
      ${data.max_presenters || 1}, 
      ${data.is_available !== false}, 
      ${data.is_featured || false}, 
      ${data.display_order || 0}
    )
    RETURNING *
  `;
  return result[0] as ConferenceHall;
}

export async function updateConferenceHall(
  id: number,
  data: {
    name?: string;
    description?: string;
    short_description?: string;
    image_url?: string;
    capacity?: number;
    price_per_hour?: number;
    price_half_day?: number;
    price_full_day?: number;
    price_weekend_surcharge?: number;
    amenities?: string[];
    features?: string[];
    included_services?: string[];
    square_meters?: number;
    length_meters?: number;
    width_meters?: number;
    ceiling_height?: number;
    has_natural_light?: boolean;
    floor_type?: string;
    technical_equipment?: string[];
    seating_styles?: string[];
    max_presenters?: number;
    is_available?: boolean;
    is_featured?: boolean;
    display_order?: number;
  }
): Promise<ConferenceHall | null> {
  const result = await sql`
    UPDATE conference_halls
    SET 
      name = COALESCE(${data.name || null}, name),
      description = COALESCE(${data.description || null}, description),
      short_description = COALESCE(${data.short_description || null}, short_description),
      image_url = COALESCE(${data.image_url || null}, image_url),
      capacity = COALESCE(${data.capacity ?? null}, capacity),
      price_per_hour = COALESCE(${data.price_per_hour ?? null}, price_per_hour),
      price_half_day = COALESCE(${data.price_half_day ?? null}, price_half_day),
      price_full_day = COALESCE(${data.price_full_day ?? null}, price_full_day),
      price_weekend_surcharge = COALESCE(${data.price_weekend_surcharge ?? null}, price_weekend_surcharge),
      amenities = COALESCE(${data.amenities || null}, amenities),
      features = COALESCE(${data.features || null}, features),
      included_services = COALESCE(${data.included_services || null}, included_services),
      square_meters = COALESCE(${data.square_meters ?? null}, square_meters),
      length_meters = COALESCE(${data.length_meters ?? null}, length_meters),
      width_meters = COALESCE(${data.width_meters ?? null}, width_meters),
      ceiling_height = COALESCE(${data.ceiling_height ?? null}, ceiling_height),
      has_natural_light = COALESCE(${data.has_natural_light ?? null}, has_natural_light),
      floor_type = COALESCE(${data.floor_type || null}, floor_type),
      technical_equipment = COALESCE(${data.technical_equipment || null}, technical_equipment),
      seating_styles = COALESCE(${data.seating_styles || null}, seating_styles),
      max_presenters = COALESCE(${data.max_presenters ?? null}, max_presenters),
      is_available = COALESCE(${data.is_available ?? null}, is_available),
      is_featured = COALESCE(${data.is_featured ?? null}, is_featured),
      display_order = COALESCE(${data.display_order ?? null}, display_order)
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] as ConferenceHall) || null;
}

export async function deleteConferenceHall(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM conference_halls WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function getConferenceHallsByCapacity(minCapacity: number): Promise<ConferenceHall[]> {
  const result = await sql`
    SELECT * FROM conference_halls 
    WHERE capacity >= ${minCapacity} AND is_available = true 
    ORDER BY display_order, name
  `;
  return result as ConferenceHall[];
}

// Update the getDashboardStats function to include conference halls
export async function getDashboardStats() {
  const [categories, items, rooms, services, conferenceHalls] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM categories`,
    sql`SELECT COUNT(*) as count FROM menu_items`,
    sql`SELECT COUNT(*) as count FROM rooms`,
    sql`SELECT COUNT(*) as count FROM services`,
    sql`SELECT COUNT(*) as count FROM conference_halls`,
  ]);
  
  return {
    categoriesCount: Number(categories[0].count),
    itemsCount: Number(items[0].count),
    roomsCount: Number(rooms[0].count),
    servicesCount: Number(services[0].count),
    conferenceHallsCount: Number(conferenceHalls[0].count),
  };
}

export { sql };
