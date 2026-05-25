import { Plus, Search, SlidersHorizontal, UserPlus } from "lucide-react";
import type { Project } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/Badge";

const filters = ["전체", "진행예정", "진행중", "완료", "보류"];

function statusTone(status: Project["status"]) {
  if (status === "진행중") return "blue";
  if (status === "진행예정") return "amber";
  if (status === "완료") return "green";
  if (status === "보류") return "slate";
  return "neutral";
}

export function ListView({
  projects,
  selectedProjectId,
  onSelectProject,
}: {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (project: Project) => void;
}) {
  return (
    <section className="flex h-screen w-[380px] shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Search size={17} className="shrink-0 text-slate-400" />
            <span className="truncate text-sm text-slate-500">
              프로젝트, 고객 검색
            </span>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white transition-colors duration-200 hover:bg-teal-700"
            aria-label="프로젝트 추가"
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors duration-200 hover:bg-slate-100"
            aria-label="담당자 초대"
          >
            <UserPlus size={18} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${
                  filter === "전체"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-slate-100"
            aria-label="필터 설정"
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500">취소</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {projects.length}개
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-2">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelectProject(project)}
                className={`w-full rounded-lg border p-3 text-left transition-colors duration-200 ${
                  isSelected
                    ? "border-teal-200 bg-teal-50"
                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-950">
                      {project.title}
                    </h2>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {project.dateRange}
                    </p>
                  </div>
                  <Badge tone={statusTone(project.status)}>{project.status}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-slate-500">
                    {project.client}
                  </p>
                  <p className="shrink-0 text-xs font-medium text-slate-600">
                    {project.assignee}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
