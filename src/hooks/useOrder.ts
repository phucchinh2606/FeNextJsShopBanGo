import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "./useCart";
import { orderService } from "../services/orderService";
import {
  CancelOrderCommand,
  CreateOrderCommand,
  GetAdminOrdersQuery,
  PaymentStatus,
  UpdateOrderStatusCommand,
} from "../types";

export const ORDER_QUERY_KEY = ["orders"];
export const ADMIN_ORDER_QUERY_KEY = ["admin-orders"];

// --- CLIENT HOOKS ---

export const useGetMyOrders = () => {
  return useQuery({
    queryKey: ORDER_QUERY_KEY,
    queryFn: () => orderService.getMyOrders(),
  });
};

export const useGetOrderById = (id: string, shouldPoll = false) => {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEY, id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    refetchInterval: shouldPoll
      ? (query) =>
          query.state.data?.data?.paymentStatus === PaymentStatus.Paid
            ? false
            : 1500
      : false,
  });
};

export const useConfirmPayOSPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.confirmPayOSPayment(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderCommand) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: CancelOrderCommand }) =>
      orderService.cancelOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    },
  });
};

// --- ADMIN HOOKS ---

export const useGetAdminOrders = (params?: GetAdminOrdersQuery) => {
  return useQuery({
    queryKey: [...ADMIN_ORDER_QUERY_KEY, params],
    queryFn: () => orderService.getAdminOrders(params),
  });
};

export const useGetAdminOrderById = (id: string) => {
  return useQuery({
    queryKey: [...ADMIN_ORDER_QUERY_KEY, id],
    queryFn: () => orderService.getAdminOrderById(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderStatusCommand;
    }) => orderService.updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    },
  });
};
