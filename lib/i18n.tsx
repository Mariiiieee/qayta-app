"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Lang = "uz" | "ru" | "en";

const dict = {
  uz: {
    subtitle: "Plastik qadoqni hisobga olish tizimi",
    phoneLabel: "TELEFON RAQAM",
    phonePlaceholder: "90 123 45 67",
    or: "yoki",
    google: "Google bilan davom etish",
    continue: "Davom etish",
    otpTitle: "Kodni kiriting",
    otpSubtitle: (phone: string) => `+998 ${phone} raqamiga yuborildi`,
    otpWrong: "Kod noto'g'ri. Qaytadan urinib ko'ring.",
    otpExpired: "Kod eskirdi. Yangi kod so'rang.",
    resend: "Qayta yuborish",
    resendWithTimer: (s: number) => `Qayta yuborish (0:${String(s).padStart(2, "0")})`,
    back: "Orqaga",
    roleTitle: "Rol tanlash",
    roleStep: (step: number, total: number) => `${step} / ${total} qadam`,
    roleContinue: "Davom etish",
    roleProducer: "Mahsulot ishlab chiqaruvchi",
    roleProducerSub: "Biz plastik qadoqda mahsulot sotamiz",
    roleRecycler: "Qayta ishlash korxonasi",
    roleRecyclerSub: "Biz plastikni qayta ishlaymiz",
    roleWeigher: "Tarozida ishlayman",
    roleWeigherSub: "Men korxona darvozasida yuklarni tortaman",
    roleCarrier: "Yuk tashuvchi",
    roleCarrierSub: "Men plastikni tashiyman va topshiraman",
    navDashboard: "Bosh sahifa",
    navEvidence: "Dalillar",
    navApprove: "Tasdiqlash",
    navDirectory: "Katalog",
    navProfile: "Profil",
    greeting: (name: string) => `Salom, ${name}`,
    complianceLabel: "2026-YIL MAJBURIYATI",
    gapValue: (t: number) => `${t} t kerak`,
    verifiedRow: (t: number) => `${t} t tasdiqlangan`,
    remainingRow: (t: number) => `${t} t qoldi`,
    forecastWarning: (t: number) =>
      `⚠ Shu sur'atda — dekabrda ${t} t yetishmaydi`,
    buyTons: "Tonna sotib olish",
    recentActivity: "SO'NGGI HARAKATLAR",
    viewAll: "Hammasini ko'rish →",
    statusPending: "Kutilmoqda",
    statusVerified: "Tasdiqlandi",
    statusRejected: "Rad etildi",
    colWeight: "Og'irlik",
    colMaterial: "Material",
    colRecycler: "Qayta ishlovchi",
    colStatus: "Holat",
    colDate: "Sana",
    reportTitle: "Hisobot",
    reportPreview: (loads: number, tons: number, companies: number) =>
      `${loads} ta yuk · ${tons} t · ${companies} ta korxona`,
    reportGenerate: "Hisobotni yaratish",
    reportGenerating: "Yaratilmoqda...",
    reportDownload: "Yuklab olish",
    reportShare: "Ulashish",
    emptyGap: "— t",
    emptyState: "Ma'lumot yo'q. Boshlash uchun mahsulotlaringizni qo'shing.",
    emptyCta: "Mahsulot qo'shish",
    darkModeToggle: "Tungi rejim",
    forecastModalTitle: "Prognoz",
    forecastModalBody: (t: number) =>
      `Joriy tempda dekabr oxirigacha ${t} t yetishmaydi. Muvofiqlikni ta'minlash uchun qo'shimcha tonna sotib oling.`,
    forecastModalCta: "Tonna sotib olish",
    close: "Yopish",
    reportsTitle: "Hisobotlar",
    reportsNew: "Yangi hisobot",
    reportsFormatPdf: "PDF",
    reportsFormatExcel: "Excel",
    reportsFullYear: "To'liq yil 2026",
    reportsPreviewAll: (loads: number, tons: number, companies: number) =>
      `${loads} ta yuk · ${tons.toFixed(1)} t · ${companies} ta korxona · hammasi tasdiqlangan`,
    reportsPreviewPartial: (
      loads: number,
      tons: number,
      companies: number,
      verified: number
    ) =>
      `${loads} ta yuk · ${tons.toFixed(1)} t · ${companies} ta korxona · ${verified} ta tasdiqlangan`,
    reportsUnverifiedWarning: (n: number) =>
      `${n} ta yuk tasdiqlanmagan. Ular hisobotga kirmaydi.`,
    reportsUnverifiedLink: "Ko'rish",
    reportsCreate: "Yaratish",
    reportsCreating: "Yaratilmoqda...",
    reportsOpen: "Ochish",
    reportsSend: "Yuborish",
    reportsCopyLink: "Havolani nusxalash",
    reportsLinkCopied: "Nusxalandi",
    reportsHistoryTitle: "Hisobotlar tarixi",
    reportsColPeriod: "Davr",
    reportsColFormat: "Format",
    reportsColDate: "Sana",
    reportsColLoads: "Yuklar",
    reportsColTons: "Jami t",
    reportsColActions: "Amallar",
    reportsCreatedBy: (name: string, date: string) => `${name} yaratgan · ${date}`,
    reportsDataVersion: (v: string) => `Ma'lumot versiyasi: ${v}`,
    reportsRestoreCaption:
      "Agar hisobot shubhali bo'lsa, biz uni qayta tiklay olamiz.",
    reportsEmptyTitle: "Hali hisobotlar yo'q. Birinchi hisobotingizni yarating.",
    reportsDownloadPdf: "PDF yuklab olish",
    reportsDownloadExcel: "Excel yuklab olish",
    reportsShareLink: "Havolani ulashish",
    profileTitle: "Profil",
    profileSectionCompany: "KOMPANIYA",
    profileSectionAccount: "HISOB",
    profileSectionPayment: "TO'LOV",
    profileSectionInfo: "MA'LUMOT",
    profileCompanyName: "Kompaniya nomi",
    profileTaxId: "STIR",
    profileProducts: "Mahsulotlar va og'irliklar",
    profileTeam: "Jamoa a'zolari",
    profileVerifiedBadge: "Tasdiqlangan korxona",
    profileLockedHint: "O'zgartirish uchun admin'ga so'rov yuboring",
    profileName: "Ism",
    profilePhone: "Telefon",
    profilePhoneChange: "O'zgartirish",
    profileLanguage: "Til",
    profileNotifications: "Bildirishnomalar",
    profileNotifEvidence: "Yangi dalillar",
    profileNotifApproval: "Tasdiqlash so'rovlari",
    profileNotifReports: "Hisobotlar tayyor bo'lganda",
    profilePlan: "Reja",
    profilePlanValue: "Standard · $800/oy",
    profileInvoices: "Hisob-fakturalar",
    profilePaymentMethod: "To'lov usuli",
    profileComplianceHow: "Moslik qanday hisoblanadi",
    profileComplianceHowBody:
      "Moslik = tasdiqlangan tonnalar / talab qilingan tonnalar. " +
      "Talab qilingan tonna sizning yillik ishlab chiqarilgan " +
      "qadoqlash og'irligingizga qarab hisoblanadi. Faqat " +
      "qayta ishlovchi tasdiqlagan yuklar hisobga kiradi. " +
      "Masalan: 340 t talab qilinsa va 96 t tasdiqlangan " +
      "bo'lsa, moslik 28% ni tashkil qiladi va 244 t qoldi.",
    profileTerms: "Foydalanish shartlari",
    profilePrivacy: "Maxfiylik siyosati",
    profileExportAll: "Barcha ma'lumotlarni yuklab olish",
    profileContactSupport: "Yordam markazi bilan bog'lanish",
    profileDeleteAccount: "Hisobni o'chirish",
    profileDeleteWarning:
      "Compliance yozuvlari yuridik hujjatlar hisoblanadi va o'chirilmaydi.",
    profileDeleteConfirm: "Hisobni o'chirishni tasdiqlayman",
    profileCancel: "Bekor qilish",
    profileLogout: "Chiqish",
    profilePhoneModalTitle: "Telefon raqamni o'zgartirish",
    profilePhoneModalBody:
      "Yangi raqam qayta tasdiqlashni talab qiladi. SMS orqali kod yuboriladi.",
    profilePhoneModalSend: "Kod yuborish",
    profileNameSaved: "Saqlandi",
  },
  ru: {
    subtitle: "Система учёта пластиковой упаковки",
    phoneLabel: "НОМЕР ТЕЛЕФОНА",
    phonePlaceholder: "90 123 45 67",
    or: "или",
    google: "Продолжить с Google",
    continue: "Продолжить",
    otpTitle: "Введите код",
    otpSubtitle: (phone: string) => `Отправлен на +998 ${phone}`,
    otpWrong: "Неверный код. Попробуйте снова.",
    otpExpired: "Код истёк. Запросите новый.",
    resend: "Отправить снова",
    resendWithTimer: (s: number) => `Отправить снова (0:${String(s).padStart(2, "0")})`,
    back: "Назад",
    roleTitle: "Rol tanlash",
    roleStep: (step: number, total: number) => `Шаг ${step} из ${total}`,
    roleContinue: "Davom etish",
    roleProducer: "Mahsulot ishlab chiqaruvchi",
    roleProducerSub: "Biz plastik qadoqda mahsulot sotamiz",
    roleRecycler: "Qayta ishlash korxonasi",
    roleRecyclerSub: "Biz plastikni qayta ishlaymiz",
    roleWeigher: "Tarozida ishlayman",
    roleWeigherSub: "Men korxona darvozasida yuklarni tortaman",
    roleCarrier: "Yuk tashuvchi",
    roleCarrierSub: "Men plastikni tashiyman va topshiraman",
    navDashboard: "Bosh sahifa",
    navEvidence: "Dalillar",
    navApprove: "Tasdiqlash",
    navDirectory: "Katalog",
    navProfile: "Profil",
    greeting: (name: string) => `Salom, ${name}`,
    complianceLabel: "2026-YIL MAJBURIYATI",
    gapValue: (t: number) => `${t} t kerak`,
    verifiedRow: (t: number) => `${t} t tasdiqlangan`,
    remainingRow: (t: number) => `${t} t qoldi`,
    forecastWarning: (t: number) =>
      `⚠ Shu sur'atda — dekabrda ${t} t yetishmaydi`,
    buyTons: "Tonna sotib olish",
    recentActivity: "SO'NGGI HARAKATLAR",
    viewAll: "Hammasini ko'rish →",
    statusPending: "Kutilmoqda",
    statusVerified: "Tasdiqlandi",
    statusRejected: "Rad etildi",
    colWeight: "Og'irlik",
    colMaterial: "Material",
    colRecycler: "Qayta ishlovchi",
    colStatus: "Holat",
    colDate: "Sana",
    reportTitle: "Hisobot",
    reportPreview: (loads: number, tons: number, companies: number) =>
      `${loads} ta yuk · ${tons} t · ${companies} ta korxona`,
    reportGenerate: "Hisobotni yaratish",
    reportGenerating: "Yaratilmoqda...",
    reportDownload: "Yuklab olish",
    reportShare: "Ulashish",
    emptyGap: "— t",
    emptyState: "Ma'lumot yo'q. Boshlash uchun mahsulotlaringizni qo'shing.",
    emptyCta: "Mahsulot qo'shish",
    darkModeToggle: "Tungi rejim",
    forecastModalTitle: "Prognoz",
    forecastModalBody: (t: number) =>
      `Joriy tempda dekabr oxirigacha ${t} t yetishmaydi. Muvofiqlikni ta'minlash uchun qo'shimcha tonna sotib oling.`,
    forecastModalCta: "Tonna sotib olish",
    close: "Yopish",
    reportsTitle: "Отчёты",
    reportsNew: "Новый отчёт",
    reportsFormatPdf: "PDF",
    reportsFormatExcel: "Excel",
    reportsFullYear: "Весь год 2026",
    reportsPreviewAll: (loads: number, tons: number, companies: number) =>
      `${loads} грузов · ${tons.toFixed(1)} т · ${companies} предприятий · все подтверждены`,
    reportsPreviewPartial: (
      loads: number,
      tons: number,
      companies: number,
      verified: number
    ) =>
      `${loads} грузов · ${tons.toFixed(1)} т · ${companies} предприятий · ${verified} подтверждено`,
    reportsUnverifiedWarning: (n: number) =>
      `${n} грузов не подтверждены. Они не войдут в отчёт.`,
    reportsUnverifiedLink: "Посмотреть",
    reportsCreate: "Создать",
    reportsCreating: "Создаётся...",
    reportsOpen: "Открыть",
    reportsSend: "Отправить",
    reportsCopyLink: "Скопировать ссылку",
    reportsLinkCopied: "Скопировано",
    reportsHistoryTitle: "История отчётов",
    reportsColPeriod: "Период",
    reportsColFormat: "Формат",
    reportsColDate: "Дата",
    reportsColLoads: "Грузы",
    reportsColTons: "Всего т",
    reportsColActions: "Действия",
    reportsCreatedBy: (name: string, date: string) => `Создал ${name} · ${date}`,
    reportsDataVersion: (v: string) => `Версия данных: ${v}`,
    reportsRestoreCaption:
      "Если отчёт вызывает сомнения, мы можем восстановить его.",
    reportsEmptyTitle: "Пока нет отчётов. Создайте первый отчёт.",
    reportsDownloadPdf: "Скачать PDF",
    reportsDownloadExcel: "Скачать Excel",
    reportsShareLink: "Поделиться ссылкой",
    profileTitle: "Профиль",
    profileSectionCompany: "КОМПАНИЯ",
    profileSectionAccount: "АККАУНТ",
    profileSectionPayment: "ОПЛАТА",
    profileSectionInfo: "ИНФОРМАЦИЯ",
    profileCompanyName: "Название компании",
    profileTaxId: "ИНН",
    profileProducts: "Продукция и вес",
    profileTeam: "Участники команды",
    profileVerifiedBadge: "Подтверждённое предприятие",
    profileLockedHint: "Для изменения отправьте заявку админу",
    profileName: "Имя",
    profilePhone: "Телефон",
    profilePhoneChange: "Изменить",
    profileLanguage: "Язык",
    profileNotifications: "Уведомления",
    profileNotifEvidence: "Новые подтверждения",
    profileNotifApproval: "Запросы на подтверждение",
    profileNotifReports: "Готовность отчётов",
    profilePlan: "Тариф",
    profilePlanValue: "Standard · $800/мес",
    profileInvoices: "Счета",
    profilePaymentMethod: "Способ оплаты",
    profileComplianceHow: "Как рассчитывается соответствие",
    profileComplianceHowBody:
      "Соответствие = подтверждённые тонны / необходимые тонны. " +
      "Необходимые тонны рассчитываются исходя из годового веса " +
      "выпущенной упаковки. Учитываются только грузы, " +
      "подтверждённые переработчиком. Например: если требуется " +
      "340 т, а подтверждено 96 т, соответствие составляет 28%, " +
      "осталось 244 т.",
    profileTerms: "Условия использования",
    profilePrivacy: "Политика конфиденциальности",
    profileExportAll: "Скачать все данные",
    profileContactSupport: "Связаться со службой поддержки",
    profileDeleteAccount: "Удалить аккаунт",
    profileDeleteWarning:
      "Записи о соответствии являются юридическими документами и не удаляются.",
    profileDeleteConfirm: "Подтверждаю удаление аккаунта",
    profileCancel: "Отмена",
    profileLogout: "Выйти",
    profilePhoneModalTitle: "Изменить номер телефона",
    profilePhoneModalBody:
      "Новый номер потребует повторного подтверждения. Код будет отправлен по SMS.",
    profilePhoneModalSend: "Отправить код",
    profileNameSaved: "Сохранено",
  },
  en: {
    subtitle: "Plastic packaging accounting system",
    phoneLabel: "PHONE NUMBER",
    phonePlaceholder: "90 123 45 67",
    or: "or",
    google: "Continue with Google",
    continue: "Continue",
    otpTitle: "Enter code",
    otpSubtitle: (phone: string) => `Sent to +998 ${phone}`,
    otpWrong: "Wrong code. Try again.",
    otpExpired: "Code expired. Request a new one.",
    resend: "Resend",
    resendWithTimer: (s: number) => `Resend (0:${String(s).padStart(2, "0")})`,
    back: "Back",
    roleTitle: "Rol tanlash",
    roleStep: (step: number, total: number) => `Step ${step} of ${total}`,
    roleContinue: "Davom etish",
    roleProducer: "Mahsulot ishlab chiqaruvchi",
    roleProducerSub: "Biz plastik qadoqda mahsulot sotamiz",
    roleRecycler: "Qayta ishlash korxonasi",
    roleRecyclerSub: "Biz plastikni qayta ishlaymiz",
    roleWeigher: "Tarozida ishlayman",
    roleWeigherSub: "Men korxona darvozasida yuklarni tortaman",
    roleCarrier: "Yuk tashuvchi",
    roleCarrierSub: "Men plastikni tashiyman va topshiraman",
    navDashboard: "Bosh sahifa",
    navEvidence: "Dalillar",
    navApprove: "Tasdiqlash",
    navDirectory: "Katalog",
    navProfile: "Profil",
    greeting: (name: string) => `Salom, ${name}`,
    complianceLabel: "2026-YIL MAJBURIYATI",
    gapValue: (t: number) => `${t} t kerak`,
    verifiedRow: (t: number) => `${t} t tasdiqlangan`,
    remainingRow: (t: number) => `${t} t qoldi`,
    forecastWarning: (t: number) =>
      `⚠ Shu sur'atda — dekabrda ${t} t yetishmaydi`,
    buyTons: "Tonna sotib olish",
    recentActivity: "SO'NGGI HARAKATLAR",
    viewAll: "Hammasini ko'rish →",
    statusPending: "Kutilmoqda",
    statusVerified: "Tasdiqlandi",
    statusRejected: "Rad etildi",
    colWeight: "Og'irlik",
    colMaterial: "Material",
    colRecycler: "Qayta ishlovchi",
    colStatus: "Holat",
    colDate: "Sana",
    reportTitle: "Hisobot",
    reportPreview: (loads: number, tons: number, companies: number) =>
      `${loads} ta yuk · ${tons} t · ${companies} ta korxona`,
    reportGenerate: "Hisobotni yaratish",
    reportGenerating: "Yaratilmoqda...",
    reportDownload: "Yuklab olish",
    reportShare: "Ulashish",
    emptyGap: "— t",
    emptyState: "Ma'lumot yo'q. Boshlash uchun mahsulotlaringizni qo'shing.",
    emptyCta: "Mahsulot qo'shish",
    darkModeToggle: "Tungi rejim",
    forecastModalTitle: "Prognoz",
    forecastModalBody: (t: number) =>
      `Joriy tempda dekabr oxirigacha ${t} t yetishmaydi. Muvofiqlikni ta'minlash uchun qo'shimcha tonna sotib oling.`,
    forecastModalCta: "Tonna sotib olish",
    close: "Yopish",
    reportsTitle: "Reports",
    reportsNew: "New report",
    reportsFormatPdf: "PDF",
    reportsFormatExcel: "Excel",
    reportsFullYear: "Full year 2026",
    reportsPreviewAll: (loads: number, tons: number, companies: number) =>
      `${loads} loads · ${tons.toFixed(1)} t · ${companies} companies · all verified`,
    reportsPreviewPartial: (
      loads: number,
      tons: number,
      companies: number,
      verified: number
    ) =>
      `${loads} loads · ${tons.toFixed(1)} t · ${companies} companies · ${verified} verified`,
    reportsUnverifiedWarning: (n: number) =>
      `${n} loads are not verified. They will not be included in the report.`,
    reportsUnverifiedLink: "View",
    reportsCreate: "Generate",
    reportsCreating: "Generating...",
    reportsOpen: "Open",
    reportsSend: "Send",
    reportsCopyLink: "Copy link",
    reportsLinkCopied: "Copied",
    reportsHistoryTitle: "Report history",
    reportsColPeriod: "Period",
    reportsColFormat: "Format",
    reportsColDate: "Date",
    reportsColLoads: "Loads",
    reportsColTons: "Total t",
    reportsColActions: "Actions",
    reportsCreatedBy: (name: string, date: string) => `Created by ${name} · ${date}`,
    reportsDataVersion: (v: string) => `Data version: ${v}`,
    reportsRestoreCaption:
      "If a report looks off, we can restore it.",
    reportsEmptyTitle: "No reports yet. Generate your first report.",
    reportsDownloadPdf: "Download PDF",
    reportsDownloadExcel: "Download Excel",
    reportsShareLink: "Share link",
    profileTitle: "Profile",
    profileSectionCompany: "COMPANY",
    profileSectionAccount: "ACCOUNT",
    profileSectionPayment: "PAYMENT",
    profileSectionInfo: "INFORMATION",
    profileCompanyName: "Company name",
    profileTaxId: "Tax ID",
    profileProducts: "Products & weights",
    profileTeam: "Team members",
    profileVerifiedBadge: "Verified enterprise",
    profileLockedHint: "Submit a request to admin to change this",
    profileName: "Name",
    profilePhone: "Phone",
    profilePhoneChange: "Change",
    profileLanguage: "Language",
    profileNotifications: "Notifications",
    profileNotifEvidence: "New evidence",
    profileNotifApproval: "Approval requests",
    profileNotifReports: "Reports ready",
    profilePlan: "Plan",
    profilePlanValue: "Standard · $800/mo",
    profileInvoices: "Invoices",
    profilePaymentMethod: "Payment method",
    profileComplianceHow: "How compliance is calculated",
    profileComplianceHowBody:
      "Compliance = verified tons / required tons. Required " +
      "tons are based on your annual packaging weight put on " +
      "the market. Only loads verified by a recycler count. " +
      "Example: if 340 t are required and 96 t are verified, " +
      "compliance is 28% and 244 t remain.",
    profileTerms: "Terms of Service",
    profilePrivacy: "Privacy Policy",
    profileExportAll: "Download all data",
    profileContactSupport: "Contact support",
    profileDeleteAccount: "Delete account",
    profileDeleteWarning:
      "Compliance records are legal documents and cannot be deleted.",
    profileDeleteConfirm: "Confirm account deletion",
    profileCancel: "Cancel",
    profileLogout: "Log out",
    profilePhoneModalTitle: "Change phone number",
    profilePhoneModalBody:
      "The new number requires re-verification. A code will be sent by SMS.",
    profilePhoneModalSend: "Send code",
    profileNameSaved: "Saved",
  },
} as const;

type Dict = {
  [K in keyof (typeof dict)["uz"]]: (typeof dict)["uz"][K] extends (
    ...args: infer A
  ) => infer R
    ? (...args: A) => R
    : string;
};

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
} | null>(null);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "uz";
  const stored = window.localStorage.getItem("qayta-lang") as Lang | null;
  return stored && stored in dict ? stored : "uz";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("qayta-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
