export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    unit: string;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductRequest {
    sku: string;
    name: string;
    description?: string;
    unit: string;
    unitPrice: number;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WarehouseRequest {
    name: string;
    location: string;
    active: boolean;
}

export const StockMovementType = {
    IN: 'IN',
    OUT: 'OUT',
    TRANSFER_IN: 'TRANSFER_IN',
    TRANSFER_OUT: 'TRANSFER_OUT'
} as const;

export type StockMovementType = typeof StockMovementType[keyof typeof StockMovementType];

export interface StockMovementRequest {
    productId: string;
    warehouseId: string;
    type: StockMovementType;
    quantity: number;
    note?: string;
}

export interface StockTransferRequest {
    productId: string;
    sourceWarehouseId: string;
    targetWarehouseId: string;
    quantity: number;
    note?: string;
}

export interface StockMovementResponse {
    id: string;
    productName: string;
    warehouseName: string;
    type: StockMovementType;
    quantity: number;
    note?: string;
    createdAt: string;
}

export interface StockSummary {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
}

export const CustomerType = {
    CUSTOMER: 'CUSTOMER',
    SUPPLIER: 'SUPPLIER',
    BOTH: 'BOTH'
} as const;

export type CustomerType = typeof CustomerType[keyof typeof CustomerType];

export interface CustomerRequest {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    type: CustomerType;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    taxId: string;
    type: CustomerType;
    createdAt: string;
    updatedAt: string;
}

// --- Demand & Offer Types ---

export const DemandStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    PROCESSED: 'PROCESSED',
    CANCELLED: 'CANCELLED'
} as const;
export type DemandStatus = typeof DemandStatus[keyof typeof DemandStatus];

export const Priority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
} as const;
export type Priority = typeof Priority[keyof typeof Priority];

export interface DemandItemRequest {
    productId: string;
    quantity: number;
    note?: string;
}

export interface DemandRequest {
    title: string;
    description?: string;
    requesterName?: string;
    priority: Priority;
    dueDate?: string; // ISO Date
    items: DemandItemRequest[];
}

export interface DemandItem {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    note?: string;
}

export interface Demand {
    id: string;
    title: string;
    description: string;
    requesterName: string;
    status: DemandStatus;
    priority: Priority;
    dueDate: string;
    items: DemandItem[];
    createdAt: string;
}

export const OfferStatus = {
    DRAFT: 'DRAFT',
    SENT: 'SENT',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
} as const;
export type OfferStatus = typeof OfferStatus[keyof typeof OfferStatus];

export interface OfferItemRequest {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
}

export interface OfferRequest {
    demandId?: string;
    customerId: string;
    validUntil?: string; // ISO Date
    currency?: string;
    items: OfferItemRequest[];
}

export interface OfferItem {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
}

export interface Offer {
    id: string;
    demandId?: string;
    demandTitle?: string;
    customerId: string;
    customerName: string;
    status: OfferStatus;
    totalAmount: number;
    currency: string;
    validUntil: string;
    items: OfferItem[];
    createdAt: string;
}

// --- Dashboard Types ---

export interface LowStockItem {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
}

export interface RecentActivity {
    description: string;
    timestamp: string;
}

export interface DashboardData {
    totalProducts: number;
    totalCustomers: number;
    pendingDemands: number;
    totalAcceptedOfferValue: number;
    lowStockItems: LowStockItem[];
    recentActivities: RecentActivity[];
}

export interface UserDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    firstName: string;
    lastName: string;
    role: string;
}
