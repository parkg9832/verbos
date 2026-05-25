import Link from "next/link";
import { DescriptionText } from "./DescriptionText";

const navigationItems = [
  {
    href: "/dashboard/value-chain",
    label: "밸류체인",
    description: "원료, 생산, 포장, 출고 준비 상태를 관리합니다.",
  },
  {
    href: "/dashboard/branding",
    label: "브랜딩",
    description: "브랜드 문구, 제품 스토리, 라벨 자료를 관리합니다.",
  },
  {
    href: "/dashboard/marketing",
    label: "마케팅",
    description: "캠페인, 콘텐츠, 인플루언서 업무를 관리합니다.",
  },
  {
    href: "/dashboard/cash-flow",
    label: "자금흐름",
    description: "예산, 지출, 입금 예정 금액을 확인합니다.",
  },
  {
    href: "/dashboard/export",
    label: "수출",
    description: "제품, 국가, 바이어 대응 상태를 관리합니다.",
  },
  {
    href: "/dashboard/network",
    label: "네트워크",
    description: "바이어, 유통사, 파트너 후보를 관리합니다.",
  },
];

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-soy-sauce/10 bg-white px-5 py-6 md:w-72">
      <Link href="/dashboard" className="mb-8 block">
        <span className="block text-xl font-semibold tracking-normal text-soy-sauce">
          VERBOS
        </span>
        <span className="mt-1 block text-sm text-soy-sauce/60">
          내부 업무앱
        </span>
      </Link>

      <nav className="flex flex-col gap-2" aria-label="대시보드 메뉴">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-lg border border-transparent px-3 py-3 transition hover:border-gochujang/20 hover:bg-gochujang/5 focus:outline-none focus:ring-2 focus:ring-gochujang/40"
          >
            <span className="block text-sm font-semibold text-soy-sauce group-hover:text-gochujang">
              {item.label}
            </span>
            <DescriptionText className="mt-1 text-xs leading-5">
              {item.description}
            </DescriptionText>
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-lg bg-ssamjang/20 p-3">
        <p className="text-sm font-semibold text-soy-sauce">오늘 기준</p>
        <DescriptionText className="mt-1 text-xs leading-5">
          복잡한 기능보다 확인, 진행, 보류 업무를 빠르게 보는 화면입니다.
        </DescriptionText>
      </div>
    </aside>
  );
}
