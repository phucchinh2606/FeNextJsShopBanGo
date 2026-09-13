export interface CartItemDto {
  cartItemId: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartDto {
  cartId: string;
  userId: string;
  items: CartItemDto[];
  grandTotal: number;
  totalItems: number;
}

// Client gửi lên API (UserId sẽ do Backend tự lấy từ Token)
export interface AddToCartCommand {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemQuantityCommand {
  productId: string;
  quantity: number;
}
