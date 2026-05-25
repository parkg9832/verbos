"use client";

import { useState } from "react";
import { DetailView } from "@/components/layout/DetailView";
import { ListView } from "@/components/layout/ListView";
import { RightWidget } from "@/components/layout/RightWidget";
import { Sidebar } from "@/components/layout/Sidebar";
import { projects, type Project } from "@/lib/dummy-data";

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  return (
    <main className="flex min-h-screen min-w-[1180px] overflow-hidden bg-white text-slate-950">
      <Sidebar />
      <ListView
        projects={projects}
        selectedProjectId={selectedProject.id}
        onSelectProject={setSelectedProject}
      />
      <DetailView project={selectedProject} />
      <RightWidget selectedProject={selectedProject} />
    </main>
  );
}
