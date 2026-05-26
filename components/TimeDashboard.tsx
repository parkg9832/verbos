"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CalendarDays, CheckCircle2, Trash2, X } from "lucide-react";
import type { Project } from "@/lib/dummy-data";
import { useTimeManagement } from "@/contexts/TimeManagementContext";
import { Badge } from "@/components/ui/Badge";
import { GoogleSyncControls } from "@/components/GoogleSyncControls";
import { UnifiedTimeEntryForm } from "@/components/UnifiedTimeEntryForm";

const calendarDays = Array.from({ length: 35 }, (_, index) => index + 1);
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(day: number) {
  return `2026-05-${String(day).padStart(2, "0")}`;
}

function priorityTone(priority: "높음" | "보통" | "낮음") {
  if (priority === "높음") return "red";
  if (priority === "보통") return "amber";
  return "slate";
}

function syncTone(status: string) {
  if (status === "synced") return "green";
  if (status === "simulated") return "amber";
  if (status === "error") return "red";
  return "neutral";
}

export function TimeDashboard({ projects }: { projects: Project[] }) {
  const { tasks, schedules, toggleTask, deleteTask, deleteSchedule } =
    useTimeManagement();
  const [selectedDate, setSelectedDate] = useState(formatDate(14));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedTasks = useMemo(
    () => tasks.filter((task) => task.dueDate === selectedDate),
    [tasks, selectedDate],
  );

  const selectedSchedules = useMemo(
    () => schedules.filter((event) => event.date === selectedDate),
    [schedules, selectedDate],
  );

  const openTasks = tasks.filter((task) => !task.completed);

  function projectName(projectId: string) {
    return (
      projects.find((project) => project.id === projectId)?.title ??
      "프로젝트 미지정"
    );
  }

  function openDate(date: string) {
    setSelectedDate(date);
    setIsModalOpen(true);
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-white px-4 py-4 lg:px-6 lg:py-5">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-teal-700">일정 및 할일</p>
          <h1 className="mt-1 truncate text-2xl font-semibold text-slate-950">
            캘린더 중심 업무 대시보드
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            날짜를 클릭하면 입력 창이 열리고, 시간 입력 여부에 따라 할일/일정으로 자동 분류됩니다.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:w-[420px]">
          <Metric label="미완료" value={`${openTasks.length}개`} />
          <Metric label="일정" value={`${schedules.length}개`} />
          <Metric label="선택일" value={selectedDate.slice(5)} />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
        <div className="flex min-h-[720px] min-w-0 flex-col rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur xl:min-h-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <CalendarDays size={18} className="text-teal-600" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">
                  2026년 5월
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  일정은 시간 블록, 할일은 점 표시로 보입니다.
                </p>
              </div>
            </div>
            <Badge tone="blue">Month</Badge>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {weekDays.map((day) => (
              <p
                key={day}
                className="py-2 text-center font-semibold text-slate-400"
              >
                {day}
              </p>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-5 gap-2 text-xs">
            {calendarDays.map((day) => {
              const date = formatDate(day);
              const daySchedules = schedules.filter((event) => event.date === date);
              const dayTasks = tasks.filter((task) => task.dueDate === date);
              const isSelected = selectedDate === date;

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => openDate(date)}
                  className={`relative min-h-32 overflow-hidden rounded-lg border p-2 text-left transition-colors duration-200 ${
                    isSelected
                      ? "border-teal-400 bg-teal-50 ring-2 ring-teal-100"
                      : "border-slate-200 bg-slate-50 hover:border-teal-200 hover:bg-white"
                  }`}
                >
                  <span className="absolute left-2 top-2 z-10 text-xs font-semibold text-slate-700">
                    {day}
                  </span>
                  {dayTasks.length > 0 ? (
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      할일 {dayTasks.length}
                    </span>
                  ) : null}

                  <div className="space-y-1 pt-8">
                    {daySchedules.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="truncate rounded-md bg-teal-600 px-2 py-1 text-[11px] font-semibold text-white"
                      >
                        {event.startTime} {event.title}
                      </div>
                    ))}
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-1 truncate text-[11px] text-slate-600"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span className={task.completed ? "line-through" : ""}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                    {daySchedules.length + dayTasks.length > 4 ? (
                      <p className="text-[11px] font-medium text-slate-400">
                        +{daySchedules.length + dayTasks.length - 4}개 더보기
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="min-w-0 space-y-5">
          <GoogleSyncControls />

          <div className="rounded-lg border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-950">
                {selectedDate} 상세
              </p>
              <p className="mt-1 text-xs text-slate-500">
                선택한 날짜의 일정과 할일입니다.
              </p>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              <PanelGroup title="일정">
                {selectedSchedules.length === 0 ? (
                  <EmptyText>등록된 일정이 없습니다.</EmptyText>
                ) : (
                  selectedSchedules.map((event) => (
                    <div key={event.id} className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {event.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {event.startTime}-{event.endTime} ·{" "}
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
                            className="text-slate-400 transition-colors duration-200 hover:text-red-600"
                            aria-label="일정 삭제"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </PanelGroup>

              <PanelGroup title="할일">
                {selectedTasks.length === 0 ? (
                  <EmptyText>등록된 할일이 없습니다.</EmptyText>
                ) : (
                  selectedTasks.map((task) => (
                    <label
                      key={task.id}
                      className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-semibold ${
                            task.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-950"
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {projectName(task.projectId)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge tone={priorityTone(task.priority)}>
                          {task.priority}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-400 transition-colors duration-200 hover:text-red-600"
                          aria-label="할일 삭제"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </label>
                  ))
                )}
              </PanelGroup>
            </div>
          </div>
        </aside>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-white/70 bg-white/95 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">
                  {selectedDate} 입력
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  시간 없이 저장하면 할일, 시간 범위를 넣으면 일정입니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <UnifiedTimeEntryForm
                projects={projects}
                preset={{ date: selectedDate }}
                onSubmitted={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function PanelGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2 border-b border-slate-100 px-4 py-4 last:border-b-0">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-teal-600" />
        <p className="text-sm font-semibold text-slate-950">{title}</p>
      </div>
      {children}
    </div>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}
