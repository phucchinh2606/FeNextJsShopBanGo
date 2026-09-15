export enum PaymentMethod {
  COD = 0,
  PayOS = 1,
}

export enum PaymentStatus {
  Unpaid = 0,
  Paid = 1,
}

export enum OrderStatus {
  Pending = 0,
  Shipping = 1,
  Delivered = 2,
  Cancelled = 3,
}

export interface OrderDetailDto {
  orderDetailId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  orderId: string;
  orderCode: number;
  userId: string;
  orderDate: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentUrl?: string | null;
  orderDetails: OrderDetailDto[];
}

export interface CreateOrderCommand {
  shippingAddress: string;
  phoneNumber: string;
  note?: string;
  paymentMethod: PaymentMethod;
  selectedCartItemIds: string[];
}

export interface CancelOrderCommand {
  cancelReason?: string;
}

// DTOs & Queries cho Admin
export interface GetAdminOrdersQuery {
  pageNumber?: number;
  pageSize?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  searchTerm?: string;
}

export interface UpdateOrderStatusCommand {
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}
