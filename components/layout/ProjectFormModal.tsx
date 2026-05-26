import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { Project } from "@/lib/dummy-data";
import { projectPriorities, projectStatuses } from "@/lib/dummy-data";

export function ProjectFormModal({
  mode,
  form,
  onChange,
  onArrayChange,
  onClose,
  onSubmit,
}: {
  mode: "add" | "edit";
  form: Project;
  onChange: (field: keyof Project, value: string) => void;
  onArrayChange: (field: "tasks" | "schedule", value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-teal-700">
              {mode === "add" ? "새 프로젝트" : "프로젝트 수정"}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              {mode === "add" ? "프로젝트 추가" : form.title || "제목 없음"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
          <Field label="프로젝트명">
            <input
              value={form.title}
              onChange={(event) => onChange("title", event.target.value)}
              className="form-input"
              placeholder="예: 멕시코 바이어 제안"
            />
          </Field>
          <Field label="고객명">
            <input
              value={form.client}
              onChange={(event) => onChange("client", event.target.value)}
              className="form-input"
              placeholder="예: AOC Foods"
            />
          </Field>
          <Field label="상태">
            <select
              value={form.status}
              onChange={(event) => onChange("status", event.target.value)}
              className="form-input"
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="우선순위">
            <select
              value={form.priority}
              onChange={(event) => onChange("priority", event.target.value)}
              className="form-input"
            >
              {projectPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </Field>
          <Field label="담당자">
            <input
              value={form.assignee}
              onChange={(event) => onChange("assignee", event.target.value)}
              className="form-input"
              placeholder="예: 윤은송"
            />
          </Field>
          <Field label="기간">
            <input
              value={form.dateRange}
              onChange={(event) => onChange("dateRange", event.target.value)}
              className="form-input"
              placeholder="2026.06.01 - 2026.06.30"
            />
          </Field>
          <Field label="유형">
            <input
              value={form.category}
              onChange={(event) => onChange("category", event.target.value)}
              className="form-input"
              placeholder="예: 수출 영업"
            />
          </Field>
          <Field label="연락 담당">
            <input
              value={form.contact}
              onChange={(event) => onChange("contact", event.target.value)}
              className="form-input"
              placeholder="예: Mariana Lopez"
            />
          </Field>
          <Field label="예산">
            <input
              value={form.budget}
              onChange={(event) => onChange("budget", event.target.value)}
              className="form-input"
              placeholder="$10,000"
            />
          </Field>
          <Field label="다음 액션">
            <input
              value={form.nextAction}
              onChange={(event) => onChange("nextAction", event.target.value)}
              className="form-input"
              placeholder="다음에 해야 할 일을 입력"
            />
          </Field>
          <Field label="메모" wide>
            <textarea
              value={form.memo}
              onChange={(event) => onChange("memo", event.target.value)}
              className="form-input min-h-24 resize-none"
              placeholder="프로젝트 메모"
            />
          </Field>
          <Field label="할일 (한 줄에 하나)" wide>
            <textarea
              value={form.tasks.join("\n")}
              onChange={(event) => onArrayChange("tasks", event.target.value)}
              className="form-input min-h-24 resize-none"
              placeholder={"샘플 구성표 확정\n견적서 전달"}
            />
          </Field>
          <Field label="일정 (한 줄에 하나)" wide>
            <textarea
              value={form.schedule.join("\n")}
              onChange={(event) => onArrayChange("schedule", event.target.value)}
              className="form-input min-h-24 resize-none"
              placeholder={"6/03 바이어 미팅\n6/10 견적 회신"}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
