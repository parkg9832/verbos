import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import type { Project } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/Badge";

const days = Array.from({ length: 35 }, (_, index) => index + 1);

export function RightWidget({ selectedProject }: { selectedProject: Project }) {
  return (
    <aside className="hidden h-screen w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 px-4 py-5 xl:block">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">오늘</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            5/14 (목)
          </h2>
        </div>
        <Badge tone="amber">마스킹 모드</Badge>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100"
            aria-label="이전 달"
          >
            <ChevronLeft size={17} />
          </button>
          <div className="flex items-center gap-2">
            <CalendarDays size={17} className="text-teal-600" />
            <p className="text-sm font-semibold text-slate-950">2026년 5월</p>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100"
            aria-label="다음 달"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
            <p key={day} className="py-1 font-semibold text-slate-400">
              {day}
            </p>
          ))}
          {days.map((day) => (
            <button
              key={day}
              type="button"
              className={`h-8 rounded-md text-xs font-medium transition-colors duration-200 ${
                day === 14
                  ? "bg-teal-600 text-white"
                  : day === 27 || day === 30
                    ? "bg-amber-50 text-amber-700"
                    : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-950">내 할일</p>
          <p className="mt-1 text-xs text-slate-500">
            선택된 프로젝트 기준 요약
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {selectedProject.tasks.slice(0, 3).map((task) => (
            <label key={task} className="flex items-start gap-3 px-4 py-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600"
              />
              <span className="min-w-0 text-sm leading-5 text-slate-700">
                {task}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock3 size={17} className="text-teal-600" />
          <p className="text-sm font-semibold text-slate-950">다가오는 일정</p>
        </div>
        <div className="space-y-3">
          {selectedProject.schedule.map((item) => (
            <div key={item} className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="truncate text-sm font-medium text-slate-800">
                {item}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {selectedProject.client}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
