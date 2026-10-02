import { Info } from "lucide-react";

export const BackendNotice = () => {
  return (
    <aside
      role="note"
      aria-label="Thông tin về thời gian tải dữ liệu"
      className="border-b border-amber-200 bg-amber-50 text-amber-950"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Info
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed sm:text-sm">
          <span className="font-semibold">Lưu ý về thời gian tải: </span>
          Đây là website demo/portfolio. Backend và dữ liệu sản phẩm đang chạy
          trên gói miễn phí của Render, nên dịch vụ có thể tạm ngừng khi không
          hoạt động và cần thời gian khởi động lại. Lần tải đầu có thể chậm hơn
          bình thường; vui lòng đợi một chút hoặc tải lại trang nếu dữ liệu chưa
          hiển thị.
        </p>
      </div>
    </aside>
  );
};
