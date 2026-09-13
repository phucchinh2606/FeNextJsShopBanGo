import {
  ApiResponse,
  CreateProductCommand,
  GetAllProductsQuery,
  PagedResult,
  ProductDto,
  UpdateProductCommand,
} from "../types";
import axiosClient from "./axiosClient";

export const productService = {
  // GET: /api/Products (có phân trang & filter)
  getAllProducts: async (
    params?: GetAllProductsQuery,
  ): Promise<ApiResponse<PagedResult<ProductDto>>> => {
    return await axiosClient.get("/Products", { params });
  },

  // GET: /api/Products/{id}
  getProductById: async (id: string): Promise<ApiResponse<ProductDto>> => {
    return await axiosClient.get(`/Products/${id}`);
  },

  // POST: /api/Products (multipart/form-data)
  createProduct: async (
    data: CreateProductCommand,
  ): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append("productName", data.productName);
    formData.append("material", data.material);
    formData.append("dimensions", data.dimensions);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    if (data.status !== undefined) {
      formData.append("status", data.status.toString());
    }

    if (data.mainImage) {
      formData.append("mainImage", data.mainImage);
    }

    if (data.subImages && data.subImages.length > 0) {
      data.subImages.forEach((file) => {
        formData.append("subImages", file);
      });
    }

    return await axiosClient.post("/Products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // PUT: /api/Products/{id} (multipart/form-data)
  updateProduct: async (
    id: string,
    data: UpdateProductCommand,
  ): Promise<ApiResponse<boolean>> => {
    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append("productName", data.productName);
    formData.append("material", data.material);
    formData.append("dimensions", data.dimensions);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    formData.append("status", data.status.toString());

    if (data.image) {
      formData.append("image", data.image);
    }

    return await axiosClient.put(`/Products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // DELETE: /api/Products/{id}
  deleteProduct: async (id: string): Promise<ApiResponse<boolean>> => {
    return await axiosClient.delete(`/Products/${id}`);
  },
};
