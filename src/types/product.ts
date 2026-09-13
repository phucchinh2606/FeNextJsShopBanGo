export enum ProductStatus {
  InStock = 0,
  OutOfStock = 1,
  Discontinued = 2,
}

export interface ProductDto {
  productId: string;
  categoryId: string;
  categoryName: string;
  productName: string;
  material: string;
  dimensions: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  subImageUrls?: string[]; // Bổ sung danh sách ảnh phụ
  status: ProductStatus;
  createdAt: string;
}

// Khớp với GetAllProductsQuery.cs
export interface GetAllProductsQuery {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateProductCommand {
  categoryId: string;
  productName: string;
  material: string;
  dimensions: string;
  description: string;
  price: number;
  stockQuantity: number;
  status?: ProductStatus;
  mainImage: File;
  subImages?: File[];
}

export interface UpdateProductCommand {
  categoryId: string;
  productName: string;
  material: string;
  dimensions: string;
  description: string;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
  image?: File;
}
