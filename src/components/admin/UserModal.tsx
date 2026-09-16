"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { UserDto, UserRole } from "@/src/types/user";
import { useCreateUser, useUpdateUser } from "@/src/hooks/useUser";
import { X, Loader2 } from "lucide-react";

const userSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải từ 10-11 chữ số"),
  address: z.string().min(3, "Địa chỉ phải có ít nhất 3 ký tự"),
  role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  user: UserDto | null;
  onClose: () => void;
}

export function UserModal({ user, onClose }: UserModalProps) {
  const isEdit = !!user;
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      role: UserRole.Customer,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        role: user.role ?? UserRole.Customer,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserFormData) => {
    if (isEdit) {
      updateUserMutation.mutate(
        {
          id: user.userId,
          data: {
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            address: data.address,
            role: data.role,
          },
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật thông tin người dùng thành công!");
            onClose();
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật!");
          },
        },
      );
    } else {
      if (!data.password || data.password.length < 6) {
        toast.error("Mật khẩu tạo mới phải từ 6 ký tự trở lên!");
        return;
      }

      createUserMutation.mutate(
        {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          address: data.address,
          role: data.role,
        },
        {
          onSuccess: () => {
            toast.success("Tạo người dùng mới thành công!");
            onClose();
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi tạo mới!");
          },
        },
      );
    }
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 shrink-0">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">
            {isEdit ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng Mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto flex-1 text-xs"
        >
          {/* Họ và tên */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition"
              placeholder="Nhập họ và tên"
            />
            {errors.fullName && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              disabled={isEdit}
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-xl outline-none transition ${
                isEdit
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              }`}
              placeholder="example@domain.com"
            />
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password (chỉ hiển thị khi tạo mới) */}
          {!isEdit && (
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
          )}

          {/* Số điện thoại */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("phoneNumber")}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition"
              placeholder="0912345678"
            />
            {errors.phoneNumber && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
              Địa chỉ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("address")}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition"
              placeholder="Địa chỉ chi tiết"
            />
            {errors.address && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Phân quyền */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
              Vai trò <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("role", { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800 transition"
            >
              <option value={UserRole.Customer}>Khách Hàng (Customer)</option>
              <option value={UserRole.Admin}>Quản Trị Viên (Admin)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3.5 sm:px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? "Cập Nhật" : "Tạo Mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
