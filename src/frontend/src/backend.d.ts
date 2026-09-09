import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ValveName = string;
export type Time = bigint;
export interface ShopOrder {
    productName: string;
    quantity: bigint;
    price: bigint;
}
export interface HydrotechUserProfile {
    displayName: string;
    customWebId: string;
    email: string;
}
export interface AlertEntry {
    isAcknowledged: boolean;
    message: string;
    severity: AlertSeverity;
}
export interface ServiceBooking {
    technicianName: string;
    bookingDate: Time;
    notes: string;
}
export enum AlertSeverity {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acknowledgeAlert(alertId: bigint): Promise<void>;
    addPersistentServiceBooking(booking: ServiceBooking): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearPersistentState(): Promise<void>;
    createPersistentAlert(alert: AlertEntry): Promise<bigint>;
    getAlerts(): Promise<Array<[bigint, AlertEntry]>>;
    getCallerServiceBookings(): Promise<Array<ServiceBooking>>;
    getCallerShopOrders(): Promise<Array<ShopOrder>>;
    getCallerUserProfile(): Promise<HydrotechUserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPersistentValveState(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<HydrotechUserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    persistValveState(valveState: Array<[ValveName, boolean]>): Promise<void>;
    saveCallerUserProfile(profile: HydrotechUserProfile): Promise<void>;
    setPersistentValveState(valveState: bigint): Promise<void>;
    submitPersistentShopOrder(order: ShopOrder): Promise<void>;
}
