import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import {
    PawPrint,
    CalendarCheck,
    CalendarDays,
    Clock,
    CheckCircle2,
    Scissors,
    Bath,
    Home,
    Eye,
    Star,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import BookingStats from "../../components/MyBookings/BookingStats";
import BookingFilterBar from "../../components/MyBookings/BookingFilterBar";
import BookingCard from "../../components/MyBookings/BookingCard";
// import BookingSidebar from "../../components/MyBookings/BookingSidebar";


// =========================
// MOCK DATA
// =========================

const STATS = [
    {
        id: 1,
        title: "Tổng lịch đặt",
        value: 12,
        icon: CalendarDays,
        color: "text-teal-600",
        bg: "bg-teal-50",
        hover: "hover:border-teal-300",
    },
    {
        id: 2,
        title: "Chờ xác nhận",
        value: 2,
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-50",
        hover: "hover:border-amber-300",
    },
    {
        id: 3,
        title: "Sắp tới",
        value: 4,
        icon: CalendarCheck,
        color: "text-blue-600",
        bg: "bg-blue-50",
        hover: "hover:border-blue-300",
    },
    {
        id: 4,
        title: "Hoàn thành",
        value: 6,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        hover: "hover:border-emerald-300",
    },
];

const TABS = [
    {
        id: "all",
        label: "Tất cả",
        count: null,
    },
    {
        id: "pending",
        label: "Chờ xác nhận",
        count: 2,
        badgeColor: "bg-amber-100 text-amber-700",
    },
    {
        id: "confirmed",
        label: "Đã xác nhận",
        count: 3,
        badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "in-progress",
        label: "Đang thực hiện",
        count: 1,
        badgeColor: "bg-blue-100 text-blue-700",
    },
    {
        id: "completed",
        label: "Hoàn thành",
        count: 6,
        badgeColor: "bg-teal-100 text-teal-700",
    },
    {
        id: "cancelled",
        label: "Đã hủy",
        count: 0,
        badgeColor: "bg-slate-100 text-slate-600",
    },
];

const BOOKINGS = [
    {
        id: "BK20260825001",
        petName: "Milo",
        gender: "♂",
        genderColor: "text-blue-500",
        breed: "Golden Retriever (2 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
        service: "Grooming & Cắt tỉa tạo kiểu",
        serviceDesc: "Cắt tỉa lông toàn thân, vệ sinh tai, cắt mài móng, xịt dưỡng lông hương lavender",
        serviceIcon: Scissors,
        location: "Happy Pet - Chi nhánh Cầu Giấy",
        date: "25/08/2026 (T3)",
        time: "14:00 - 16:00",
        timeIcon: Clock,
        price: "300.000đ",
        status: "Chờ xác nhận",
        statusType: "pending",
        timeCategory: "today",
        statusBadge: "bg-amber-50 text-amber-700 border-amber-200",
        borderColor: "hover:border-amber-300",
        secondaryAction: "Hủy lịch",
        primaryAction: "Xem chi tiết",
        primaryIcon: Eye,
    },
    {
        id: "BK20260824002",
        petName: "Mimi",
        gender: "♀",
        genderColor: "text-pink-500",
        breed: "British Shorthair (1 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME",
        service: "Tắm Spa thảo dược & sấy dưỡng",
        serviceDesc: "Ngâm bồn sục thảo dược, massage thư giãn, sấy phồng và dưỡng lông chuyên sâu",
        serviceIcon: Bath,
        location: "PetSpa Deluxe - Đống Đa",
        date: "24/08/2026 (T2)",
        time: "09:30 - 11:00",
        timeIcon: Clock,
        price: "250.000đ",
        status: "Chờ xác nhận",
        statusType: "pending",
        timeCategory: "week",
        statusBadge: "bg-amber-50 text-amber-700 border-amber-200",
        borderColor: "hover:border-amber-300",
        secondaryAction: "Hủy lịch",
        primaryAction: "Xem chi tiết",
        primaryIcon: Eye,
    },
    {
        id: "BK20260822003",
        petName: "Milo",
        gender: "♂",
        genderColor: "text-blue-500",
        breed: "Golden Retriever (2 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
        service: "Khách sạn lưu trú thú cưng (2 ngày)",
        serviceDesc: "Phòng VIP điều hòa riêng biệt, giám sát camera 24/7, thực đơn hạt cao cấp & pate tươi",
        serviceIcon: Home,
        location: "PetCare Hotel - Ba Đình",
        date: "22/08/2026 (T7)",
        time: "10:00 (Check-in)",
        timeIcon: Clock,
        price: "600.000đ",
        status: "Đã xác nhận",
        statusType: "confirmed",
        timeCategory: "week",
        statusBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        borderColor: "hover:border-emerald-300",
        secondaryAction: "Hủy lịch",
        primaryAction: "Xem chi tiết",
        primaryIcon: Eye,
    },
    {
        id: "BK20260820004",
        petName: "Bông",
        gender: "♀",
        genderColor: "text-pink-500",
        breed: "Poodle Tiny (8 tháng)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSAtqE-cQJYkq37esYUrle4pB-QwyDR07puul4nnHrfXqF03TuLD2qzxQUHtoNCHqwNLGepOlwBsQ8d6FNQ39VEo7GFPr9d_PU1Nz4uQDcrxUjsIryl2MMtZ78jS30bipK2CVIy0wa9DY9kvY-9w9qSx7j6r5c2H3zkCifXksiHXNNwqGaXbsVuBeb-01dHToFGj3R_elvmCwhu7fGHdhXIrOl-gmtmdLDpMf-vkg",
        service: "Combo Tắm dưỡng & Cắt tỉa style gấu",
        serviceDesc: "Tạo hình phong cách Teddy Bear, vệ sinh tai móng, xịt nước hoa cao cấp cho thú cưng",
        serviceIcon: Scissors,
        location: "Puppy Spa - Tây Hồ",
        date: "20/08/2026 (T5)",
        time: "15:00 - 17:00",
        timeIcon: Clock,
        price: "280.000đ",
        status: "Đã xác nhận",
        statusType: "confirmed",
        timeCategory: "week",
        statusBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        borderColor: "hover:border-emerald-300",
        secondaryAction: "Hủy lịch",
        primaryAction: "Xem chi tiết",
        primaryIcon: Eye,
    },
    {
        id: "BK20260818005",
        petName: "LuLu",
        gender: "♂",
        genderColor: "text-blue-500",
        breed: "Corgi Pembroke (1.5 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn16JMLSetG8eG36VDkWvVxkENnQj4LympLsfE0H6ZB0TO6MnxI0mgP7eklGbVag6qlN77_cGAPyzFFBtK4LREFPEOO4r5yf4FQp-3zfxjTgpE5KyF9Lcvzh8J53om9iTv6VutjgwTONOzTzmXpLtn10j1Vl77KXwmcvogBsQQDA8cyoFftFqh-7SWVaPYHctFQ9Gx14jRlC1Ut7nxyk_PvkshI-577AT9RxBUE-U",
        service: "Tiêm phòng vaccine & Khám tổng quát",
        serviceDesc: "Gói vaccine 7 bệnh, tẩy giun định kỳ, kiểm tra tai mắt tim phổi bởi bác sĩ thú y",
        serviceIcon: CheckCircle2,
        location: "Bệnh viện Thú Y PetCare",
        date: "18/08/2026 (T3)",
        time: "16:30 - 17:30",
        timeIcon: Clock,
        price: "450.000đ",
        status: "Đã xác nhận",
        statusType: "confirmed",
        timeCategory: "month",
        statusBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        borderColor: "hover:border-emerald-300",
        secondaryAction: "Hủy lịch",
        primaryAction: "Xem chi tiết",
        primaryIcon: Eye,
    },
    {
        id: "BK20260817006",
        petName: "Mimi",
        gender: "♀",
        genderColor: "text-pink-500",
        breed: "British Shorthair (1 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME",
        service: "Spa thư giãn & Vệ sinh tai móng",
        serviceDesc: "Đang được chuyên viên chăm sóc và sấy lông tại phòng chăm sóc chuyên biệt tầng 2",
        serviceIcon: Bath,
        location: "Happy Pet - Cầu Giấy",
        date: "17/08/2026 (T2)",
        time: "10:30 - 12:00",
        timeIcon: Clock,
        price: "220.000đ",
        status: "Đang thực hiện",
        statusType: "in-progress",
        timeCategory: "month",
        statusBadge: "bg-blue-50 text-blue-700 border-blue-200",
        borderColor: "hover:border-blue-300",
        primaryAction: "Xem chi tiết",
        primaryIcon: Eye,
    },
    {
        id: "BK20260810007",
        petName: "Milo",
        gender: "♂",
        genderColor: "text-blue-500",
        breed: "Golden Retriever (2 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
        service: "Combo Tắm trị liệu & Cắt lông bàn",
        serviceDesc: "Dầu tắm thảo dược trị ve rận, khử mùi hôi cơ thể, tỉa gọn lông bàn chân và mông",
        serviceIcon: Bath,
        location: "Happy Pet - Cầu Giấy",
        date: "10/08/2026 (T2)",
        time: "08:30 - 10:30",
        timeIcon: Clock,
        price: "350.000đ",
        status: "Hoàn thành",
        statusType: "completed",
        timeCategory: "month",
        statusBadge: "bg-teal-50 text-teal-700 border-teal-200",
        borderColor: "hover:border-teal-300",
        secondaryAction: "Hóa đơn",
        primaryAction: "Đánh giá",
        primaryIcon: Star,
    },
    {
        id: "BK20260805008",
        petName: "Mimi",
        gender: "♀",
        genderColor: "text-pink-500",
        breed: "British Shorthair (1 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME",
        service: "Chăm sóc móng & Vệ sinh tai mắt",
        serviceDesc: "Làm sạch tuyến lệ, nhỏ dưỡng mắt, cạo lông đệm chân và nhỏ giọt khử rận tai",
        serviceIcon: Scissors,
        location: "PetSpa Deluxe - Đống Đa",
        date: "05/08/2026 (T4)",
        time: "14:00 - 15:00",
        timeIcon: Clock,
        price: "150.000đ",
        status: "Hoàn thành",
        statusType: "completed",
        timeCategory: "month",
        statusBadge: "bg-teal-50 text-teal-700 border-teal-200",
        borderColor: "hover:border-teal-300",
        secondaryAction: "Hóa đơn",
        primaryAction: "Đặt lại",
        primaryIcon: RotateCcw,
    },
    {
        id: "BK20260728009",
        petName: "LuLu",
        gender: "♂",
        genderColor: "text-blue-500",
        breed: "Corgi Pembroke (1.5 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn16JMLSetG8eG36VDkWvVxkENnQj4LympLsfE0H6ZB0TO6MnxI0mgP7eklGbVag6qlN77_cGAPyzFFBtK4LREFPEOO4r5yf4FQp-3zfxjTgpE5KyF9Lcvzh8J53om9iTv6VutjgwTONOzTzmXpLtn10j1Vl77KXwmcvogBsQQDA8cyoFftFqh-7SWVaPYHctFQ9Gx14jRlC1Ut7nxyk_PvkshI-577AT9RxBUE-U",
        service: "Grooming cắt tỉa tạo hình mông tim",
        serviceDesc: "Cắt tỉa tạo hình mông trái tim đặc trưng Corgi, tỉa viền tai và sấy đánh phồng lông",
        serviceIcon: Scissors,
        location: "Puppy Spa - Tây Hồ",
        date: "28/07/2026 (T3)",
        time: "11:00 - 13:00",
        timeIcon: Clock,
        price: "320.000đ",
        status: "Hoàn thành",
        statusType: "completed",
        timeCategory: "older",
        statusBadge: "bg-teal-50 text-teal-700 border-teal-200",
        borderColor: "hover:border-teal-300",
        secondaryAction: "Hóa đơn",
        primaryAction: "Đặt lại",
        primaryIcon: RotateCcw,
    },
    {
        id: "BK20260720010",
        petName: "Milo",
        gender: "♂",
        genderColor: "text-blue-500",
        breed: "Golden Retriever (2 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
        service: "Khách sạn thú cưng lưu trú 3 ngày",
        serviceDesc: "Dịch vụ phòng đơn cao cấp, dạo chơi sân cỏ 2 lần/ngày, ăn uống theo chế độ riêng",
        serviceIcon: Home,
        location: "PetCare Hotel - Ba Đình",
        date: "20/07/2026 (T2)",
        time: "10:00 (Check-out)",
        timeIcon: Clock,
        price: "900.000đ",
        status: "Hoàn thành",
        statusType: "completed",
        timeCategory: "older",
        statusBadge: "bg-teal-50 text-teal-700 border-teal-200",
        borderColor: "hover:border-teal-300",
        secondaryAction: "Hóa đơn",
        primaryAction: "Đặt lại",
        primaryIcon: RotateCcw,
    },
    {
        id: "BK20260714011",
        petName: "Bông",
        gender: "♀",
        genderColor: "text-pink-500",
        breed: "Poodle Tiny (8 tháng)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSAtqE-cQJYkq37esYUrle4pB-QwyDR07puul4nnHrfXqF03TuLD2qzxQUHtoNCHqwNLGepOlwBsQ8d6FNQ39VEo7GFPr9d_PU1Nz4uQDcrxUjsIryl2MMtZ78jS30bipK2CVIy0wa9DY9kvY-9w9qSx7j6r5c2H3zkCifXksiHXNNwqGaXbsVuBeb-01dHToFGj3R_elvmCwhu7fGHdhXIrOl-gmtmdLDpMf-vkg",
        service: "Tắm sấy & Phun dưỡng bóng lông Silk",
        serviceDesc: "Liệu trình dưỡng mượt lông với tinh dầu tự nhiên, massage thư giãn 15 phút",
        serviceIcon: Bath,
        location: "Happy Pet - Cầu Giấy",
        date: "14/07/2026 (T3)",
        time: "09:00 - 10:30",
        timeIcon: Clock,
        price: "200.000đ",
        status: "Hoàn thành",
        statusType: "completed",
        timeCategory: "older",
        statusBadge: "bg-teal-50 text-teal-700 border-teal-200",
        borderColor: "hover:border-teal-300",
        secondaryAction: "Hóa đơn",
        primaryAction: "Đánh giá",
        primaryIcon: Star,
    },
    {
        id: "BK20260701012",
        petName: "Milo",
        gender: "♂",
        genderColor: "text-blue-500",
        breed: "Golden Retriever (2 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
        service: "Khám định kỳ & Lấy cao răng siêu âm",
        serviceDesc: "Làm sạch mảng bám vôi răng không gây mê, kiểm tra nướu và sức khỏe răng miệng",
        serviceIcon: CheckCircle2,
        location: "Bệnh viện Thú Y PetCare",
        date: "01/07/2026 (T4)",
        time: "15:00 - 16:30",
        timeIcon: Clock,
        price: "400.000đ",
        status: "Hoàn thành",
        statusType: "completed",
        timeCategory: "older",
        statusBadge: "bg-teal-50 text-teal-700 border-teal-200",
        borderColor: "hover:border-teal-300",
        secondaryAction: "Hóa đơn",
        primaryAction: "Đặt lại",
        primaryIcon: RotateCcw,
    },
    {
        id: "BK20260625013",
        petName: "Mimi",
        gender: "♀",
        genderColor: "text-pink-500",
        breed: "British Shorthair (1 tuổi)",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME",
        service: "Tắm Spa thảo dược & cắt móng",
        serviceDesc: "Khách hàng bận việc đột xuất nên đã yêu cầu hủy lịch hẹn",
        serviceIcon: Bath,
        location: "PetSpa Deluxe - Đống Đa",
        date: "25/06/2026 (T5)",
        time: "14:00 - 15:30",
        timeIcon: Clock,
        price: "250.000đ",
        status: "Đã hủy",
        statusType: "cancelled",
        timeCategory: "older",
        statusBadge: "bg-slate-100 text-slate-600 border-slate-200",
        borderColor: "hover:border-slate-300",
    },
];


// =========================
// HERO
// =========================

const HeroSection = ({ stats }) => {
    return (
        <section className="relative bg-gradient-to-b from-[#E7F8F2] via-[#EEF9F5] to-[#F6FAF8] pt-8 pb-10 overflow-hidden border-b border-teal-50/60">

            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="absolute top-12 left-10 text-teal-200/40 pointer-events-none select-none -rotate-12">
                <PawPrint size={100} />
            </div>

            <div className="absolute right-10 bottom-6 text-teal-200/30 pointer-events-none select-none rotate-45">
                <PawPrint size={80} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                    <div className="flex-1 space-y-3">

                        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Link to="/" className="hover:text-teal-600 transition-colors">
                                Trang chủ
                            </Link>

                            <span>/</span>

                            <Link to="/profile" className="hover:text-teal-600 transition-colors">
                                Tài khoản
                            </Link>

                            <span>/</span>

                            <span className="text-teal-700 font-semibold">
                                Lịch đặt của tôi
                            </span>
                        </nav>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Lịch đặt{" "}
                            <span className="text-teal-600">
                                của tôi
                            </span>
                        </h1>

                        <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
                            Theo dõi toàn bộ lịch đặt dịch vụ, trạng thái xử lý và thông tin thanh toán của bạn một cách dễ dàng và minh bạch.
                        </p>

                    </div>

                    <div className="relative flex items-center justify-center">

                        <div className="relative bg-white/60 p-2 rounded-3xl backdrop-blur-sm border border-white shadow-xl shadow-teal-900/5">

                            <img
                                alt="Pets"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSAtqE-cQJYkq37esYUrle4pB-QwyDR07puul4nnHrfXqF03TuLD2qzxQUHtoNCHqwNLGepOlwBsQ8d6FNQ39VEo7GFPr9d_PU1Nz4uQDcrxUjsIryl2MMtZ78jS30bipK2CVIy0wa9DY9kvY-9w9qSx7j6r5c2H3zkCifXksiHXNNwqGaXbsVuBeb-01dHToFGj3R_elvmCwhu7fGHdhXIrOl-gmtmdLDpMf-vkg"
                                className="w-64 sm:w-80 h-44 sm:h-48 rounded-2xl object-cover shadow-inner"
                            />

                            <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-teal-50 flex items-center justify-center text-teal-600 animate-bounce">
                                <CalendarCheck size={24} />
                            </div>

                        </div>
                    </div>

                </div>

                <BookingStats stats={stats} />

            </div>
        </section>
    );
};


// =========================
// PAGE
// =========================

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Filter bookings based on tab, status, time, and search
    const filteredBookings = useMemo(() => {
        return BOOKINGS.filter((booking) => {
            // Tab filter
            if (activeTab !== "all" && booking.statusType !== activeTab) {
                return false;
            }

            // Status dropdown filter
            if (statusFilter !== "all" && booking.statusType !== statusFilter) {
                return false;
            }

            // Time filter
            if (timeFilter === "today" && booking.timeCategory !== "today") {
                return false;
            }
            if (
                timeFilter === "week" &&
                booking.timeCategory !== "today" &&
                booking.timeCategory !== "week"
            ) {
                return false;
            }
            if (timeFilter === "month" && booking.timeCategory === "older") {
                return false;
            }

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchId = booking.id.toLowerCase().includes(q);
                const matchPet = booking.petName.toLowerCase().includes(q);
                const matchLocation = booking.location.toLowerCase().includes(q);
                const matchService = booking.service.toLowerCase().includes(q);
                const matchBreed = booking.breed.toLowerCase().includes(q);
                return matchId || matchPet || matchLocation || matchService || matchBreed;
            }

            return true;
        });
    }, [activeTab, statusFilter, timeFilter, searchQuery]);

    // Total pages
    const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));

    // Sliced bookings for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBookings = filteredBookings.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setStatusFilter(tabId);
        setCurrentPage(1);
    };

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleTimeChange = (val) => {
        setTimeFilter(val);
        setCurrentPage(1);
    };

    const handleStatusChange = (val) => {
        setStatusFilter(val);
        setActiveTab(val);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            const element = document.getElementById("booking-list-container");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3, 4, "...", totalPages];
        }
        if (currentPage >= totalPages - 2) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    // Compute tabs with dynamic counts
    const dynamicTabs = useMemo(() => {
        return TABS.map((tab) => {
            if (tab.id === "all") {
                return { ...tab, count: BOOKINGS.length };
            }
            return {
                ...tab,
                count: BOOKINGS.filter((b) => b.statusType === tab.id).length,
            };
        });
    }, []);

    // Compute stats with dynamic counts
    const dynamicStats = useMemo(() => {
        const pendingCount = BOOKINGS.filter((b) => b.statusType === "pending").length;
        const upcomingCount = BOOKINGS.filter(
            (b) => b.statusType === "confirmed" || b.statusType === "in-progress"
        ).length;
        const completedCount = BOOKINGS.filter((b) => b.statusType === "completed").length;

        return [
            { ...STATS[0], value: BOOKINGS.length },
            { ...STATS[1], value: pendingCount },
            { ...STATS[2], value: upcomingCount },
            { ...STATS[3], value: completedCount },
        ];
    }, []);

    return (
        <div>
            <HeroSection stats={dynamicStats} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full space-y-6">
                    <BookingFilterBar
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        tabs={dynamicTabs}
                        searchQuery={searchQuery}
                        setSearchQuery={handleSearchChange}
                        timeFilter={timeFilter}
                        setTimeFilter={handleTimeChange}
                        statusFilter={statusFilter}
                        setStatusFilter={handleStatusChange}
                    />

                    <div id="booking-list-container" className="space-y-4">
                        {paginatedBookings.length > 0 ? (
                            paginatedBookings.map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-10 border border-slate-200/80 shadow-sm text-center space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                                    <CalendarDays size={28} />
                                </div>
                                <h3 className="text-base font-bold text-slate-800">
                                    Không tìm thấy lịch đặt nào
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Không có lịch đặt nào phù hợp với bộ lọc hiện tại. Thử chọn danh mục khác hoặc đặt lại bộ lọc.
                                </p>
                                <button
                                    onClick={() => {
                                        handleTabChange("all");
                                        setSearchQuery("");
                                        setTimeFilter("all");
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    <RotateCcw size={14} />
                                    <span>Xem tất cả lịch đặt</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination & Summary */}
                    {filteredBookings.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                                <span>
                                    Hiển thị{" "}
                                    <strong className="text-slate-800 font-bold">
                                        {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
                                    </strong>{" "}
                                    trong tổng số{" "}
                                    <strong className="text-teal-700 font-bold">{filteredBookings.length}</strong> lịch đặt
                                </span>
                                <span>
                                    Trang <strong className="text-slate-800 font-bold">{currentPage}</strong> / {totalPages}
                                </span>
                            </div>

                            <nav className="flex items-center justify-center gap-2 pt-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === 1
                                            ? "text-slate-300 cursor-not-allowed opacity-50"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-300 cursor-pointer shadow-xs"
                                        }`}
                                    aria-label="Trang trước"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {getPageNumbers().map((page, index) =>
                                    page === "..." ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-1 text-slate-400 font-bold text-xs"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === page
                                                    ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/20"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-teal-300"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white transition-all ${currentPage === totalPages
                                            ? "text-slate-300 cursor-not-allowed opacity-50"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-300 cursor-pointer shadow-xs"
                                        }`}
                                    aria-label="Trang kế tiếp"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyBookings;