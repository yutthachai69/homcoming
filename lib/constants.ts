export const TableStatus = {
    AVAILABLE: 'AVAILABLE',
    LOCKED: 'LOCKED',
    BOOKED: 'BOOKED',
} as const;

export type TableStatusType = typeof TableStatus[keyof typeof TableStatus];

export const BookingStatus = {
    PENDING_PAYMENT: 'PENDING_PAYMENT',
    VERIFYING: 'VERIFYING',
    PAID: 'PAID',
    REJECTED: 'REJECTED',
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];
