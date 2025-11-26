// ======================================================
// DOMAIN SOURCE OF TRUTH (Shared Between Frontend/Backend)
// ======================================================

// ---------- ENUMS ----------
export enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  VIEWER = "viewer",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
}

export enum RoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance",
}

export enum MaintenanceStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export enum BookingStatus {
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum DeviceType {
  LIGHT = "light",
  AC = "ac",
  DOOR_LOCK = "door_lock",
  SENSOR = "sensor",
  PROJECTOR = "projector",
}

export enum DeviceStatus {
  ON = "on",
  OFF = "off",
  ERROR = "error",
}

export enum GadgetType {
  PHONE = "phone",
  LAPTOP = "laptop",
  TABLET = "tablet",
  HEADPHONES = "headphones",
  OTHER = "other",
}

export enum GadgetStatus {
  AVAILABLE = "available",
  IN_USE = "in_use",
  MAINTENANCE = "maintenance",
  RETIRED = "retired",
}

export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
}

export enum NotificationStatus {
  SENT = "sent",
  FAILED = "failed",
}

// ---------- BASE ENTITY ----------
export interface BaseEntity {
  createdAt: Date;
  updatedAt: Date;
}

// ---------- USER ----------
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface EmployeeProfile {
  userId: string;
  department: string;
  jobTitle: string;
  phone?: string;
  avatar?: string;
}

// ---------- ROOM ----------
export interface Room extends BaseEntity {
  name: string;
  capacity: number;
  floor: number;
  status: RoomStatus;
  amenities: string[];
}

// ---------- DEVICE ----------
export interface Device extends BaseEntity {
  roomId: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  lastUpdate: Date;
}

// ---------- GADGET ----------
export interface Gadget extends BaseEntity {
  name: string;
  type: GadgetType;
  status: GadgetStatus;
  assignedTo?: string; // userId
}

export interface SmartLight extends Device {
  brightness: number;
  color: string;
}

export interface AirConditioner extends Device {
  temperature: number;
  mode: "cool" | "heat" | "fan";
}

export interface DoorLock extends Device {
  locked: boolean;
}

export interface Sensor extends Device {
  readingType: "temperature" | "motion" | "co2";
  value: number;
}

// ---------- BOOKING ----------
export interface Booking extends BaseEntity {
  userId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  purpose?: string;
}

export interface BookingHistory {
  bookingId: string;
  timestamp: Date;
  changedBy: string;
  oldStatus: BookingStatus;
  newStatus: BookingStatus;
}

// ---------- MAINTENANCE ----------
export interface Maintenance extends BaseEntity {
  device?: string;
  room?: string;
  gadget?: string;
  description: string;
  date: Date;
  status: MaintenanceStatus;
}

// ---------- NOTIFICATIONS ----------
export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  message: string;
  status: NotificationStatus;
}

export interface NotificationTemplate {
  id: string;
  key: string;
  content: string;
}

export interface NotificationLog {
  notificationId: string;
  sentAt: Date;
  providerResponse: string;
}

// ---------- AUDIT ----------
export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  meta?: Record<string, any>;
}

// ---------- SETTINGS / PERMISSIONS ----------
export interface SystemSetting {
  key: string;
  value: string | number | boolean;
}

export interface Permission {
  role: UserRole;
  canBookRoom: boolean;
  canManageDevices: boolean;
  canEditRooms: boolean;
  canViewAnalytics: boolean;
}

// ---------- ANALYTICS ----------
export interface RoomUsage {
  roomId: string;
  date: string;
  hoursUsed: number;
  bookingCount: number;
}

export interface DeviceUsage {
  deviceId: string;
  hoursActive: number;
}

export interface UserActivity {
  userId: string;
  actionsCount: number;
  lastActive: string;
}

// ---------- API REQUEST / RESPONSE TYPES ----------
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export type CreateBookingRequest = Pick<
  Booking,
  "roomId" | "userId" | "startTime" | "endTime" | "purpose"
>;

export type BookingResponse = ApiResponse<Booking>;

export type RoomsResponse = ApiResponse<Room[]>;

export type DevicesResponse = ApiResponse<Device[]>;

export type GadgetsResponse = ApiResponse<Gadget[]>;
