import {
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Users,
} from "lucide-react";

const menuGroups = [
  {
    label: "업무",
    items: [
      { name: "워크스페이스", icon: LayoutDashboard, active: true },
      { name: "리드관리", icon: Users },
      { name: "고객관리", icon: BriefcaseBusiness },
      { name: "프로젝트관리", icon: FolderKanban },
    ],
  },
  {
    label: "실행",
    items: [
      { name: "할일관리", icon: CheckSquare },
      { name: "일정관리", icon: CalendarDays },
      { name: "메시지", icon: MessageSquareText },
      { name: "환경설정", icon: Settings },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
            V
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">운비서</p>
            <p className="truncate text-xs text-slate-500">Verbos CRM</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
          aria-label="사이드바 접기"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-7">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-xs font-semibold text-slate-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      item.active
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
        <p className="text-xs font-semibold text-amber-800">마스킹 ON</p>
        <p className="mt-1 text-xs leading-5 text-amber-700">
          고객명과 연락처는 내부 권한 기준으로 노출됩니다.
        </p>
      </div>
    </aside>
  );
}
