"use client";

import { CalendarDays, Trash2 } from "lucide-react";
import type { Project } from "@/lib/dummy-data";
import { useTimeManagement } from "@/contexts/TimeManagementContext";
import { Badge } from "@/components/ui/Badge";

const calendarDays = Array.from({ length: 35 }, (_, index) => index + 1);

function syncTone(status: string) {
  if (status === "synced") return "green";
  if (status === "simulated") return "amber";
  if (status === "error") return "red";
  return "neutral";
}

export function UnifiedCalendar({ projects }: { projects: Project[] }) {
  const { schedules, deleteSchedule } = useTimeManagement();

  function projectName(projectId: string) {
    return (
      projects.find((project) => project.id === projectId)?.title ??
      "프로젝트 미지정"
    );
  }

  function eventsForDay(day: number) {
    const dayToken = `2026-05-${String(day).padStart(2, "0")}`;
    return schedules.filter((event) => event.date === dayToken);
  }

  return (
    <section className="min-w-0 flex-1 overflow-y-auto bg-white px-6 py-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-teal-700">일정관리</p>
          <h1 className="mt-1 truncate text-2xl font-semibold text-slate-950">
            통합 캘린더
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            일정은 Google Calendar 동기화 대상으로 관리됩니다.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs font-semibold text-slate-500">등록 일정</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">
            {schedules.length}개
          </p>
        </div>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-teal-600" />
            <p className="text-sm font-semibold text-slate-950">2026년 5월</p>
          </div>
          <div className="grid grid-cols-7 gap-2 text-xs">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <p key={day} className="py-2 text-center font-semibold text-slate-400">
                {day}
              </p>
            ))}
            {calendarDays.map((day) => {
              const dayEvents = eventsForDay(day);

              return (
                <div
                  key={day}
                  className={`min-h-24 rounded-lg border p-2 ${
                    day === 14
                      ? "border-teal-300 bg-teal-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-700">{day}</p>
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <p
                        key={event.id}
                        className="truncate rounded bg-white px-2 py-1 text-[11px] font-medium text-slate-700"
                      >
                        {event.startTime} {event.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 ? (
                      <p className="text-[11px] text-slate-500">
                        +{dayEvents.length - 2}개
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-950">일정 목록</p>
            <p className="mt-1 text-xs text-slate-500">
              시간, 프로젝트, 동기화 상태를 함께 봅니다.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {schedules.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                등록된 일정이 없습니다.
              </p>
            ) : (
              schedules.map((event) => (
                <div key={event.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {event.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {event.date} · {event.startTime}-{event.endTime}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {projectName(event.projectId)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={syncTone(event.syncStatus)}>
                        {event.syncStatus}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => deleteSchedule(event.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                        aria-label="일정 삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
