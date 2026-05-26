"use client";

import { useState } from "react";
import type { Project } from "@/lib/dummy-data";
import {
  useTimeManagement,
  type TimeEntryDraft,
  type TimePriority,
} from "@/contexts/TimeManagementContext";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function UnifiedTimeEntryForm({ projects }: { projects: Project[] }) {
  const { addTask, addSchedule } = useTimeManagement();
  const firstProjectId = projects[0]?.id ?? "";
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<TimeEntryDraft>({
    type: "task",
    projectId: firstProjectId,
    title: "",
    dueDate: today(),
    priority: "보통",
  });

  function update(field: string, value: string) {
    setDraft((current) => ({ ...current, [field]: value }) as TimeEntryDraft);
  }

  function switchType(type: "task" | "schedule") {
    setError(null);
    setDraft(
      type === "task"
        ? {
            type,
            projectId: draft.projectId || firstProjectId,
            title: draft.title,
            dueDate: today(),
            priority: "보통",
          }
        : {
            type,
            projectId: draft.projectId || firstProjectId,
            title: draft.title,
            date: today(),
            startTime: "10:00",
            endTime: "11:00",
            location: "",
            description: "",
          },
    );
  }

  function submit() {
    setError(null);

    if (!draft.projectId) {
      setError("프로젝트를 먼저 선택해야 합니다.");
      return;
    }

    if (!draft.title.trim()) {
      setError("제목은 필수입니다.");
      return;
    }

    if (draft.type === "task") {
      if (!draft.dueDate) {
        setError("마감일은 필수입니다.");
        return;
      }

      addTask({
        projectId: draft.projectId,
        title: draft.title.trim(),
        dueDate: draft.dueDate,
        priority: draft.priority,
      });
      setDraft({
        type: "task",
        projectId: draft.projectId,
        title: "",
        dueDate: today(),
        priority: "보통",
      });
      return;
    }

    if (!draft.date || !draft.startTime || !draft.endTime) {
      setError("일정 날짜와 시작/종료 시간은 필수입니다.");
      return;
    }

    if (draft.startTime >= draft.endTime) {
      setError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    addSchedule({
      projectId: draft.projectId,
      title: draft.title.trim(),
      date: draft.date,
      startTime: draft.startTime,
      endTime: draft.endTime,
      location: draft.location,
      description: draft.description,
    });
    setDraft({
      type: "schedule",
      projectId: draft.projectId,
      title: "",
      date: today(),
      startTime: "10:00",
      endTime: "11:00",
      location: "",
      description: "",
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">통합 입력</p>
          <p className="mt-1 text-xs text-slate-500">
            할일과 일정을 한 폼에서 생성합니다.
          </p>
        </div>
        <div className="flex rounded-lg bg-slate-100 p-1">
          {(["task", "schedule"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => switchType(type)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                draft.type === type
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {type === "task" ? "할일" : "일정"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">
            프로젝트
          </span>
          <select
            value={draft.projectId}
            onChange={(event) => update("projectId", event.target.value)}
            className="form-input"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">
            제목
          </span>
          <input
            value={draft.title}
            onChange={(event) => update("title", event.target.value)}
            className="form-input"
            placeholder="입력할 항목 제목"
          />
        </label>

        {draft.type === "task" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                마감일
              </span>
              <input
                type="date"
                value={draft.dueDate}
                onChange={(event) => update("dueDate", event.target.value)}
                className="form-input"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                우선순위
              </span>
              <select
                value={draft.priority}
                onChange={(event) =>
                  update("priority", event.target.value as TimePriority)
                }
                className="form-input"
              >
                {["높음", "보통", "낮음"].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-3">
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                  날짜
                </span>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => update("date", event.target.value)}
                  className="form-input"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                  시작
                </span>
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(event) => update("startTime", event.target.value)}
                  className="form-input"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-500">
                  종료
                </span>
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(event) => update("endTime", event.target.value)}
                  className="form-input"
                />
              </label>
            </div>
            <input
              value={draft.location}
              onChange={(event) => update("location", event.target.value)}
              className="form-input"
              placeholder="장소"
            />
            <input
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              className="form-input"
              placeholder="설명"
            />
          </div>
        )}

        {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
        <button
          type="button"
          onClick={submit}
          className="h-10 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
        >
          {draft.type === "task" ? "할일 추가" : "일정 추가"}
        </button>
      </div>
    </div>
  );
}
