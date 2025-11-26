import type {
  User,
  EmployeeProfile,
  Room,
  Booking,
  BookingHistory,
  Maintenance,
  Notification,
  AuditLog,
  Device,
} from "./index"

// These types are directly compatible with Supabase database rows
export type UserRow = User & { id: string }
export type EmployeeProfileRow = EmployeeProfile & { user_id: string }
export type RoomRow = Room & { id: string }
export type BookingRow = Booking & { id: string }
export type BookingHistoryRow = BookingHistory & { id: string }
export type MaintenanceRow = Maintenance & { id: string }
export type NotificationRow = Notification & { id: string }
export type AuditLogRow = AuditLog & { id: string }
export type DeviceRow = Device & { id: string }
