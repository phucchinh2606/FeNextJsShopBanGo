"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  TreePine,
  CheckCircle2,
  Hammer,
  Sparkles,
  Truck,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Năm kinh nghiệm", value: "12+" },
    { label: "Dự án & Khách hàng", value: "8,500+" },
    { label: "Gỗ tự nhiên nguyên khối", value: "100%" },
    { label: "Nghệ nhân lành nghề", value: "35+" },
  ];

  const coreValues = [
    {
      icon: <TreePine className="w-6 h-6 text-amber-800" />,
      title: "Chất Liệu Tuyển Chọn",
      desc: "Cam kết 100% gỗ tự nhiên cao cấp (Gụ, Hương Đá, Gõ Đỏ, Cẩm Lai...) được xử lý tẩm sấy chống mối mọt, cong vênh đạt chuẩn xuất khẩu.",
    },
    {
      icon: <Hammer className="w-6 h-6 text-amber-800" />,
      title: "Chạm Khắc Tinh Xảo",
      desc: "Sự kết hợp giữa bàn tay nghệ nhân lâu năm và công nghệ đục CNC chính xác đến từng milimet, giữ trọn thần thái của sản phẩm.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-800" />,
      title: "Bảo Hành Dài Hạn",
      desc: "Chính sách bảo hành lên tới 10 năm cho phần gỗ, bảo trì trọn đời giúp khách hàng hoàn toàn yên tâm trong quá trình sử dụng.",
    },
    {
      icon: <Truck className="w-6 h-6 text-amber-800" />,
      title: "Vận Chuyển Toàn Quốc",
      desc: "Đội ngũ giao hàng tận nơi, lắp đặt chuyên nghiệp, bọc lót cẩn thận đảm bảo sản phẩm nguyên vẹn tuyệt đối khi tới tay gia chủ.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Chọn Gỗ & Khảo Sát",
      desc: "Lựa chọn những khối gỗ lâu năm, vân đẹp, không rác và đo đạc kích thước chuẩn thước Lỗ Ban.",
    },
    {
      step: "02",
      title: "Chế Tác & Chạm Khắc",
      desc: "Nghệ nhân tạo dáng, đục đẽo tỉ mỉ từng chi tiết hoa văn theo đúng mẫu thiết kế phong thủy.",
    },
    {
      step: "03",
      title: "Quật Giáp & Sơn PU",
      desc: "Chà nhám kỹ lưỡng 5-7 nước, sơn PU 6 lớp cao cấp giữ nguyên vẻ đẹp đường vân gỗ tự nhiên.",
    },
    {
      step: "04",
      title: "Nghiệm Thu & Bàn Giao",
      desc: "Kiểm tra chất lượng khắt khe trước khi vận chuyển, lắp đặt hoàn thiện tận nhà cho khách hàng.",
    },
  ];

  return (
    <div className="space-y-0">
      {/* SECTION 1: HERO BANNER */}
      <section className="relative bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#opacity-10_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-900/60 px-4 py-1.5 rounded-full border border-amber-700/50 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thương Hiệu Nội Thất Gỗ Đẳng Cấp</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight max-w-3xl mx-auto">
            Nâng Tầm Không Gian Sống Bằng Tinh Hoa Gỗ Việt
          </h1>
          <p className="text-amber-100/80 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            <strong>WOODSTORE</strong> tự hào mang đến những tác phẩm nội thất
            gỗ tự nhiên sang trọng, kết hợp hài hòa giữa nét đẹp nghệ thuật
            truyền thống và tiện nghi hiện đại.
          </p>
        </div>
      </section>

      {/* SECTION 2: CÂU CHUYỆN THƯƠNG HIỆU */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hình ảnh đại diện */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-50">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
                  alt="Xưởng chế tác gỗ WOODSTORE"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              {/* Badge kinh nghiệm floating */}
              <div className="absolute -bottom-6 -right-2 sm:right-6 bg-amber-900 text-white p-6 rounded-2xl shadow-xl border border-amber-700 max-w-xs">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xl font-bold font-serif">12+ Năm</p>
                    <p className="text-xs text-amber-200">
                      Gắn bó & phát triển làng nghề gỗ mỹ nghệ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung giới thiệu */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Câu chuyện của chúng tôi
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 mt-1 leading-tight">
                  Khởi Nguồn Từ Niềm Đam Mê Với Gỗ Tự Nhiên
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Xuất thân từ làng nghề đục chạm gỗ mỹ nghệ truyền thống,{" "}
                <strong>WOODSTORE</strong> được thành lập với mục tiêu gìn giữ
                và phát triển nét đẹp nguyên bản của gỗ tự nhiên trong từng ngôi
                nhà Việt.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Mỗi bộ bàn ghế, giường ngủ hay bàn thờ tại WOODSTORE không đơn
                thuần là một món đồ dùng, mà là một **tác phẩm nghệ thuật** được
                các nghệ nhân thổi hồn vào từng đường chạm, đường vân. Chúng tôi
                tin rằng không gian sống gỗ chuẩn phong thủy sẽ mang lại thịnh
                vượng và an yên trọn đời cho gia chủ.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "100% Gỗ thật, không pha tạp, không dùng gỗ rác.",
                  "Đội ngũ nghệ nhân có trên 15 năm kinh nghiệm đục chạm.",
                  "Thiết kế chuẩn kích thước Lỗ Ban phong thủy tài lộc.",
                ].map((text, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THỐNG KÊ ẤN TƯỢNG */}
      <section className="bg-amber-900 text-white py-12 border-y border-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-amber-100/80 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: GIÁ TRỊ CỐT LÕI */}
      <section className="py-16 sm:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Cam kết chất lượng
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Giá Trị Cốt Lõi Tạo Nên Uy Tín
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: QUY TRÌNH CHẾ TÁC */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Sự tỉ mỉ trong từng công đoạn
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Quy Trình Chế Tác Đồ Gỗ Chuẩn Mực
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3"
              >
                <span className="text-3xl font-serif font-bold text-amber-800/20">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold">
            Bạn Đang Tìm Kiếm Mẫu Nội Thất Gỗ Phù Hợp Với Gia Đình?
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl mx-auto leading-relaxed">
            Liên hệ ngay với chuyên gia của WOODSTORE để được tư vấn kích thước
            phong thủy, lựa chọn loại gỗ và nhận báo giá ưu đãi tại xưởng.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs px-6 py-3.5 rounded-xl transition shadow-lg"
            >
              <span>Khám phá sản phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:0972971555"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-6 py-3.5 rounded-xl border border-white/20 transition"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Tư vấn Hotline: 0987 654 321</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
