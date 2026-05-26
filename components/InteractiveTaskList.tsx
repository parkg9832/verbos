"use client";

import { CheckCircle2, Trash2 } from "lucide-react";
import type { Project } from "@/lib/dummy-data";
import { useTimeManagement } from "@/contexts/TimeManagementContext";
import { Badge } from "@/components/ui/Badge";

function priorityTone(priority: "높음" | "보통" | "낮음") {
  if (priority === "높음") return "red";
  if (priority === "보통") return "amber";
  return "slate";
}

export function InteractiveTaskList({ projects }: { projects: Project[] }) {
  const { tasks, toggleTask, deleteTask } = useTimeManagement();
  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  function projectName(projectId: string) {
    return (
      projects.find((project) => project.id === projectId)?.title ??
      "프로젝트 미지정"
    );
  }

  return (
    <section className="min-w-0 flex-1 overflow-y-auto bg-white px-6 py-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-teal-700">할일관리</p>
          <h1 className="mt-1 truncate text-2xl font-semibold text-slate-950">
            오늘 처리할 일
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            체크 상태, 마감일, 프로젝트 연결이 모두 로컬 상태로 관리됩니다.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs font-semibold text-slate-500">미완료</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">
            {openTasks.length}개
          </p>
        </div>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-950">진행 중</p>
            <p className="mt-1 text-xs text-slate-500">
              체크하면 즉시 완료 목록으로 이동합니다.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {openTasks.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                미완료 할일이 없습니다.
              </p>
            ) : (
              openTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 px-4 py-4 transition-colors duration-200 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {task.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {projectName(task.projectId)} · 마감 {task.dueDate}
                        </p>
                      </div>
                      <Badge tone={priorityTone(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                    aria-label="할일 삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <p className="text-sm font-semibold text-slate-950">완료됨</p>
          </div>
          <div className="space-y-2">
            {completedTasks.length === 0 ? (
              <p className="text-sm text-slate-500">완료된 할일이 없습니다.</p>
            ) : (
              completedTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg bg-white px-3 py-3"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600"
                  />
                  <span className="min-w-0 text-sm leading-5 text-slate-500 line-through">
                    {task.title}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
