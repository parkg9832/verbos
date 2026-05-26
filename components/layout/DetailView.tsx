import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import type { Project } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/Badge";

const tabs = ["개요", "메모", "할일", "일정"];

function statusTone(status: Project["status"]) {
  if (status === "진행중") return "blue";
  if (status === "진행예정") return "amber";
  if (status === "완료") return "green";
  if (status === "보류") return "slate";
  return "neutral";
}

function priorityTone(priority: Project["priority"]) {
  if (priority === "높음") return "red";
  if (priority === "보통") return "amber";
  return "slate";
}

export function DetailView({
  project,
  onEditProject,
  onDeleteProject,
  onAddTask,
  onAddSchedule,
}: {
  project: Project | null;
  onEditProject: () => void;
  onDeleteProject: () => void;
  onAddTask: () => void;
  onAddSchedule: () => void;
}) {
  if (!project) {
    return (
      <section className="flex min-w-0 flex-1 items-center justify-center bg-white">
        <div className="max-w-sm text-center">
          <p className="text-lg font-semibold text-slate-950">
            선택된 프로젝트가 없습니다.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            중앙 리스트에서 프로젝트를 선택하거나 새 프로젝트를 추가하세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 flex-1 bg-white">
      <header className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-semibold text-slate-950">
                {project.title || "제목 없음"}
              </h1>
              <Badge tone={statusTone(project.status)}>{project.status}</Badge>
            </div>
            <p className="mt-2 truncate text-sm text-slate-500">
              {project.client || "고객 미지정"} · {project.dateRange || "기간 미정"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onEditProject}
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
            >
              <Pencil size={16} />
              수정
            </button>
            <button
              type="button"
              onClick={onDeleteProject}
              className="flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
            >
              <Trash2 size={16} />
              삭제
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-5 border-b border-transparent">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`pb-2 text-sm font-semibold transition-colors duration-200 ${
                tab === "개요"
                  ? "border-b-2 border-teal-600 text-teal-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="h-[calc(100vh-129px)] overflow-y-auto px-6 py-5">
        <div className="grid gap-3 lg:grid-cols-2">
          <InfoCard icon={UserRound} label="고객" value={project.client} />
          <InfoCard icon={ClipboardList} label="유형" value={project.category} />
          <InfoCard icon={UserRound} label="담당자" value={project.assignee} />
          <InfoCard icon={CalendarDays} label="기간" value={project.dateRange} />
          <InfoCard icon={FileText} label="연락 담당" value={project.contact} />
          <InfoCard icon={CheckCircle2} label="예산" value={project.budget} />
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500">우선순위</p>
              <div className="mt-2">
                <Badge tone={priorityTone(project.priority)}>
                  {project.priority}
                </Badge>
              </div>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-xs font-semibold text-slate-500">다음 액션</p>
              <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                {project.nextAction || "다음 액션 미지정"}
              </p>
            </div>
          </div>
        </div>

        <DetailSection
          title="메모"
          actionLabel="메모 수정"
          onAction={onEditProject}
        >
          <div className="px-4 py-8 text-center">
            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">
              {project.memo || "등록된 메모가 없습니다."}
            </p>
          </div>
        </DetailSection>

        <DetailSection title="할일" actionLabel="할일 추가" onAction={onAddTask}>
          <div className="divide-y divide-slate-100">
            {project.tasks.length === 0 ? (
              <p className="px-4 py-5 text-sm text-slate-500">
                등록된 할일이 없습니다.
              </p>
            ) : (
              project.tasks.map((task) => (
                <div key={task} className="flex items-center gap-3 px-4 py-3">
                  <span className="h-4 w-4 shrink-0 rounded border border-slate-300 bg-white" />
                  <p className="min-w-0 truncate text-sm text-slate-700">
                    {task}
                  </p>
                </div>
              ))
            )}
          </div>
        </DetailSection>

        <DetailSection
          title="일정"
          actionLabel="일정 추가"
          onAction={onAddSchedule}
        >
          <div className="divide-y divide-slate-100">
            {project.schedule.length === 0 ? (
              <p className="px-4 py-5 text-sm text-slate-500">
                등록된 일정이 없습니다.
              </p>
            ) : (
              project.schedule.map((item) => (
                <div key={item} className="flex items-center gap-3 px-4 py-3">
                  <CalendarDays size={16} className="shrink-0 text-teal-600" />
                  <p className="min-w-0 truncate text-sm text-slate-700">
                    {item}
                  </p>
                </div>
              ))
            )}
          </div>
        </DetailSection>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Icon size={15} />
        {label}
      </div>
      <p className="mt-3 truncate text-sm font-semibold text-slate-950">
        {value || "미지정"}
      </p>
    </div>
  );
}

function DetailSection({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mt-5 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-xs text-slate-500">선택 프로젝트 기준</p>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-teal-600 px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      </div>
      {children}
    </div>
  );
}
