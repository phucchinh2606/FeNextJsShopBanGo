"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useGetAllUsers, useDeleteUser } from "@/src/hooks/useUser";
import { UserDto, UserRole } from "@/src/types/user";
import { UserModal } from "@/src/components/admin/UserModal";
import { UserDetailModal } from "@/src/components/admin/UserDetailModal";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [viewingUser, setViewingUser] = useState<UserDto | null>(null); // State xem chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal xác nhận xóa
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: response, isLoading } = useGetAllUsers();
  const deleteMutation = useDeleteUser();

  const usersList = response?.data || [];

  // Lọc danh sách theo tên, email, sđt
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return usersList;

    const term = searchTerm.toLowerCase();
    return usersList.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phoneNumber?.includes(term),
    );
  }, [usersList, searchTerm]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Đã xóa người dùng "${deleteTarget.name}" thành công!`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra, không thể xóa người dùng này.");
      },
    });
  };

  const renderRoleBadge = (role: UserRole) => {
    return role === UserRole.Admin ? (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <ShieldCheck className="w-3 h-3" />
        <span>Admin</span>
      </span>
    ) : (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <UserIcon className="w-3 h-3" />
        <span>Customer</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-800 shrink-0" />
            <span>Quản Lý Người Dùng</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Quản lý danh sách tài khoản khách hàng và quản trị viên trong hệ
            thống
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-amber-800 text-white rounded-xl hover:bg-amber-900 active:scale-95 transition text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Người Dùng</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-400">
            Không tìm thấy người dùng nào
          </div>
        ) : (
          <>
            {/* 1. Mobile Card View (Dành cho màn hình điện thoại) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <div key={u.userId} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        onClick={() => setViewingUser(u)}
                        className="font-bold text-slate-800 text-sm cursor-pointer hover:text-amber-800 transition"
                      >
                        {u.fullName || "—"}
                      </p>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </div>
                    <div>{renderRoleBadge(u.role)}</div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{u.phoneNumber || "Chưa cập nhật SĐT"}</span>
                    </div>
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {u.address || "Chưa cập nhật địa chỉ"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-1.5 pt-1">
                    <button
                      onClick={() => setViewingUser(u)}
                      className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200"
                      title="Xem Chi Tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-600 hover:text-amber-800 bg-slate-50 hover:bg-amber-50 rounded-lg border border-slate-200"
                      title="Sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({
                          id: u.userId,
                          name: u.fullName || u.email,
                        })
                      }
                      className="p-2 text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-200"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (Dành cho màn hình máy tính) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Họ và Tên</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Số Điện Thoại</th>
                    <th className="p-4">Địa Chỉ</th>
                    <th className="p-4">Vai Trò</th>
                    <th className="p-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.userId}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      <td
                        onClick={() => setViewingUser(u)}
                        className="p-4 font-bold text-slate-800 cursor-pointer group-hover:text-amber-800 transition"
                      >
                        {u.fullName || "—"}
                      </td>
                      <td className="p-4 text-slate-600">{u.email}</td>
                      <td className="p-4 text-slate-600">
                        {u.phoneNumber || "—"}
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">
                        {u.address || "—"}
                      </td>
                      <td className="p-4">{renderRoleBadge(u.role)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => setViewingUser(u)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Xem Chi Tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                id: u.userId,
                                name: u.fullName || u.email,
                              })
                            }
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal Xem Chi Tiết Người Dùng */}
      <UserDetailModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
      />

      {/* Modal CRUD User (Thêm/Sửa) */}
      {isModalOpen && (
        <UserModal user={selectedUser} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa người dùng"
        description={`Bạn có chắc chắn muốn xóa người dùng "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
