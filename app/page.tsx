"use client";

import { useEffect, useMemo, useState } from "react";
import { DetailView } from "@/components/layout/DetailView";
import { ListView } from "@/components/layout/ListView";
import { ProjectFormModal } from "@/components/layout/ProjectFormModal";
import { RightWidget } from "@/components/layout/RightWidget";
import { Sidebar, type SidebarSection } from "@/components/layout/Sidebar";
import {
  createEmptyProject,
  initialProjects,
  type Project,
  type ProjectStatus,
} from "@/lib/dummy-data";

const STORAGE_KEY = "verbos-crm-projects";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    initialProjects[0]?.id ?? null,
  );
  const [activeSection, setActiveSection] =
    useState<SidebarSection>("워크스페이스");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"전체" | ProjectStatus>(
    "전체",
  );
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [draftProject, setDraftProject] = useState<Project | null>(null);

  useEffect(() => {
    const savedProjects = window.localStorage.getItem(STORAGE_KEY);

    if (!savedProjects) return;

    try {
      const parsedProjects = JSON.parse(savedProjects) as Project[];

      if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
        setProjects(parsedProjects);
        setSelectedProjectId(parsedProjects[0].id);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === "전체" || project.status === statusFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          project.title,
          project.client,
          project.assignee,
          project.category,
          project.contact,
          project.nextAction,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [projects, searchQuery, statusFilter]);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  useEffect(() => {
    if (filteredProjects.length === 0) {
      setSelectedProjectId(null);
      return;
    }

    const selectedIsVisible = filteredProjects.some(
      (project) => project.id === selectedProjectId,
    );

    if (!selectedIsVisible) {
      setSelectedProjectId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedProjectId]);

  function openAddModal() {
    setDraftProject(createEmptyProject());
    setModalMode("add");
  }

  function openEditModal() {
    if (!selectedProject) return;
    setDraftProject({ ...selectedProject });
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setDraftProject(null);
  }

  function updateDraftField(field: keyof Project, value: string) {
    setDraftProject((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function updateDraftArray(field: "tasks" | "schedule", value: string) {
    setDraftProject((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };
    });
  }

  function saveDraftProject() {
    if (!draftProject) return;

    const normalizedProject = {
      ...draftProject,
      title: draftProject.title.trim() || "제목 없음",
      client: draftProject.client.trim() || "고객 미지정",
    };

    if (modalMode === "add") {
      setProjects((current) => [normalizedProject, ...current]);
      setSelectedProjectId(normalizedProject.id);
    }

    if (modalMode === "edit") {
      setProjects((current) =>
        current.map((project) =>
          project.id === normalizedProject.id ? normalizedProject : project,
        ),
      );
      setSelectedProjectId(normalizedProject.id);
    }

    closeModal();
  }

  function deleteSelectedProject() {
    if (!selectedProject) return;

    const shouldDelete = window.confirm(
      `${selectedProject.title} 프로젝트를 삭제할까요?`,
    );

    if (!shouldDelete) return;

    setProjects((current) => {
      const nextProjects = current.filter(
        (project) => project.id !== selectedProject.id,
      );
      setSelectedProjectId(nextProjects[0]?.id ?? null);
      return nextProjects;
    });
  }

  function addTaskToSelectedProject() {
    if (!selectedProject) return;

    const task = window.prompt("추가할 할일을 입력하세요.");
    if (!task?.trim()) return;

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? { ...project, tasks: [...project.tasks, task.trim()] }
          : project,
      ),
    );
  }

  function addScheduleToSelectedProject() {
    if (!selectedProject) return;

    const schedule = window.prompt("추가할 일정을 입력하세요.");
    if (!schedule?.trim()) return;

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? { ...project, schedule: [...project.schedule, schedule.trim()] }
          : project,
      ),
    );
  }

  return (
    <main className="flex min-h-screen min-w-[1180px] overflow-hidden bg-white text-slate-950">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />
      <ListView
        projects={filteredProjects}
        selectedProjectId={selectedProjectId}
        activeSection={activeSection}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onSelectProject={setSelectedProjectId}
        onCreateProject={openAddModal}
      />
      <DetailView
        project={selectedProject}
        onEditProject={openEditModal}
        onDeleteProject={deleteSelectedProject}
        onAddTask={addTaskToSelectedProject}
        onAddSchedule={addScheduleToSelectedProject}
      />
      <RightWidget selectedProject={selectedProject} />

      {modalMode && draftProject ? (
        <ProjectFormModal
          mode={modalMode}
          form={draftProject}
          onChange={updateDraftField}
          onArrayChange={updateDraftArray}
          onClose={closeModal}
          onSubmit={saveDraftProject}
        />
      ) : null}
    </main>
  );
}
