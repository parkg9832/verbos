"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/dummy-data";
import {
  useTimeManagement,
  type TimePriority,
} from "@/contexts/TimeManagementContext";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export interface SmartTimeFormPreset {
  date?: string;
}

export function UnifiedTimeEntryForm({
  projects,
  preset,
  onSubmitted,
}: {
  projects: Project[];
  preset?: SmartTimeFormPreset;
  onSubmitted?: () => void;
}) {
  const { addTask, addSchedule } = useTimeManagement();
  const firstProjectId = projects[0]?.id ?? "";
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(firstProjectId);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(preset?.date ?? today());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState<TimePriority>("보통");

  useEffect(() => {
    if (preset?.date) setDate(preset.date);
  }, [preset?.date]);

  useEffect(() => {
    if (!projectId && firstProjectId) setProjectId(firstProjectId);
  }, [firstProjectId, projectId]);

  const entryType = startTime || endTime ? "일정" : "할일";

  function resetForm() {
    setTitle("");
    setStartTime("");
    setEndTime("");
    setPriority("보통");
  }

  function submit() {
    setError(null);

    if (!projectId) {
      setError("프로젝트를 먼저 선택해야 합니다.");
      return;
    }

    if (!title.trim()) {
      setError("제목은 필수입니다.");
      return;
    }

    if (!date) {
      setError("날짜는 필수입니다.");
      return;
    }

    if (!startTime && !endTime) {
      addTask({
        projectId,
        title: title.trim(),
        dueDate: date,
        priority,
      });
      resetForm();
      onSubmitted?.();
      return;
    }

    if (!startTime || !endTime) {
      setError("일정으로 저장하려면 시작 시간과 종료 시간을 모두 입력해야 합니다.");
      return;
    }

    if (startTime >= endTime) {
      setError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    addSchedule({
      projectId,
      title: title.trim(),
      date,
      startTime,
      endTime,
      location: "",
      description: "",
    });
    resetForm();
    onSubmitted?.();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">빠른 입력</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            시간을 비우면 할일, 시간을 넣으면 일정으로 자동 저장됩니다.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
          {entryType}
        </span>
      </div>

      <div className="grid gap-3">
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-slate-500">
            프로젝트
          </span>
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
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
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="form-input"
            placeholder="예: 바이어 후속 연락"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">
              날짜
            </span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="form-input"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">
              시작 시간
            </span>
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="form-input"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">
              종료 시간
            </span>
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="form-input"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">
              우선순위
            </span>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TimePriority)}
              className="form-input"
            >
              {(["높음", "보통", "낮음"] as TimePriority[]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={submit}
          className="h-10 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
        >
          {entryType} 추가
        </button>
      </div>
    </div>
  );
}
