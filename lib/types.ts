export type UserRole = "admin" | "employee" | "viewer"
export type UserStatus = "active" | "suspended"
export type RoomStatus = "available" | "occupied" | "maintenance"
export type DeviceType = "light" | "ac" | "door_lock" | "sensor" | "projector"
export type DeviceStatus = "on" | "off" | "error"
export type GadgetType = "phone" | "laptop" | "tablet" | "headphones" | "other"
export type GadgetStatus = "available" | "in_use" | "maintenance" | "retired"
export type BookingStatus = "confirmed" | "cancelled" | "completed"
export type MaintenanceStatus = "pending" | "in_progress" | "completed"
export type NotificationType = "email" | "sms" | "push"
export type NotificationStatus = "sent" | "failed"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  department?: string
  job_title?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  floor: number
  status: RoomStatus
  amenities: string[]
  created_at: string
  updated_at: string
}

export interface Device {
  id: string
  room_id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  last_update: string
  created_at: string
  updated_at: string
}

export interface Gadget {
  id: string
  name: string
  type: GadgetType
  status: GadgetStatus
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  room_id: string
  start_time: string
  end_time: string
  status: BookingStatus
  purpose?: string
  created_at: string
  updated_at: string
}

export interface Maintenance {
  id: string
  device_id?: string
  room_id?: string
  gadget_id?: string
  description: string
  scheduled_date: string
  status: MaintenanceStatus
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  message: string
  status: NotificationStatus
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity: string
  entity_id?: string
  meta?: Record<string, any>
  created_at: string
}
