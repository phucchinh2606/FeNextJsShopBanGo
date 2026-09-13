import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProductCommand,
  GetAllProductsQuery,
  UpdateProductCommand,
} from "../types";
import { productService } from "../services/productService";

export const PRODUCT_QUERY_KEY = ["products"];

// Hook lấy danh sách sản phẩm (có hỗ trợ filter, search, paging)
export const useGetProducts = (params?: GetAllProductsQuery) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, params],
    queryFn: () => productService.getAllProducts(params),
  });
};

// Hook lấy chi tiết 1 sản phẩm theo ID
export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

// Hook tạo sản phẩm mới (Admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductCommand) =>
      productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
};

// Hook cập nhật sản phẩm (Admin)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductCommand }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
};

// Hook xóa sản phẩm (Admin)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
};
