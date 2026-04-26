export interface OrderAddress {
    firstName: string;
    lastName: string;
}

export interface Order {
    id: string;
    subTotal: number;
    tax: number;
    total: number;
    itemsInOrder: number;
    isPaid: boolean;
    paidAt: Date | string | null; // puede ser null si no está pagado
    createdAt: Date | string;
    updatedAt: Date | string;
    userId: string;
    transactionId: string | null;
    orderAddresses: OrderAddress | null;
}