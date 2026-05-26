"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TimePriority = "높음" | "보통" | "낮음";
export type SyncStatus = "idle" | "simulated" | "syncing" | "synced" | "error";

export interface TimeTask {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: TimePriority;
}

export interface ScheduleEvent {
  id: string;
  projectId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  googleEventId?: string;
  syncStatus: SyncStatus;
}

export type TimeEntryDraft =
  | {
      type: "task";
      projectId: string;
      title: string;
      dueDate: string;
      priority: TimePriority;
    }
  | {
      type: "schedule";
      projectId: string;
      title: string;
      date: string;
      startTime: string;
      endTime: string;
      location: string;
      description: string;
    };

interface TimeManagementContextValue {
  tasks: TimeTask[];
  schedules: ScheduleEvent[];
  addTask: (task: Omit<TimeTask, "id" | "completed">) => void;
  updateTask: (taskId: string, updates: Partial<TimeTask>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
  addSchedule: (event: Omit<ScheduleEvent, "id" | "syncStatus">) => void;
  updateSchedule: (eventId: string, updates: Partial<ScheduleEvent>) => void;
  deleteSchedule: (eventId: string) => void;
  markSchedulesSynced: (eventIds: string[], status: SyncStatus) => void;
}

const STORAGE_KEY = "verbos-time-management";

const initialTasks: TimeTask[] = [
  {
    id: "task-001",
    projectId: "project-001",
    title: "샘플 구성표 확정",
    dueDate: "2026-05-27",
    completed: false,
    priority: "높음",
  },
  {
    id: "task-002",
    projectId: "project-001",
    title: "영문 제품 소개서 전달",
    dueDate: "2026-05-28",
    completed: false,
    priority: "보통",
  },
  {
    id: "task-003",
    projectId: "project-003",
    title: "릴스 콘티 작성",
    dueDate: "2026-05-30",
    completed: false,
    priority: "높음",
  },
  {
    id: "task-004",
    projectId: "project-006",
    title: "성과 리포트 발송",
    dueDate: "2026-05-28",
    completed: true,
    priority: "보통",
  },
];

const initialSchedules: ScheduleEvent[] = [
  {
    id: "schedule-001",
    projectId: "project-001",
    title: "AOC Foods 바이어 화상 미팅",
    date: "2026-05-27",
    startTime: "10:00",
    endTime: "10:45",
    location: "Google Meet",
    description: "샘플 구성과 가격 조건 확인",
    syncStatus: "idle",
  },
  {
    id: "schedule-002",
    projectId: "project-003",
    title: "TongO Retail 콘텐츠 시안 제출",
    date: "2026-05-30",
    startTime: "14:00",
    endTime: "15:00",
    location: "내부 리뷰",
    description: "릴스 시안과 인플루언서 후보 검토",
    syncStatus: "idle",
  },
  {
    id: "schedule-003",
    projectId: "project-004",
    title: "PartnerO Kitchen 시식 테스트",
    date: "2026-06-05",
    startTime: "11:00",
    endTime: "12:00",
    location: "테스트 키친",
    description: "업소용 파우치 사용성 확인",
    syncStatus: "idle",
  },
];

const TimeManagementContext =
  createContext<TimeManagementContextValue | null>(null);

export function TimeManagementProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TimeTask[]>(initialTasks);
  const [schedules, setSchedules] = useState<ScheduleEvent[]>(initialSchedules);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        tasks?: TimeTask[];
        schedules?: ScheduleEvent[];
      };

      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.schedules)) setSchedules(parsed.schedules);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks, schedules }),
    );
  }, [tasks, schedules]);

  const value = useMemo<TimeManagementContextValue>(
    () => ({
      tasks,
      schedules,
      addTask(task) {
        setTasks((current) => [
          {
            ...task,
            id: `task-${Date.now()}`,
            completed: false,
          },
          ...current,
        ]);
      },
      updateTask(taskId, updates) {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task,
          ),
        );
      },
      deleteTask(taskId) {
        setTasks((current) => current.filter((task) => task.id !== taskId));
      },
      toggleTask(taskId) {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? { ...task, completed: !task.completed }
              : task,
          ),
        );
      },
      addSchedule(event) {
        setSchedules((current) => [
          {
            ...event,
            id: `schedule-${Date.now()}`,
            syncStatus: "idle",
          },
          ...current,
        ]);
      },
      updateSchedule(eventId, updates) {
        setSchedules((current) =>
          current.map((event) =>
            event.id === eventId ? { ...event, ...updates } : event,
          ),
        );
      },
      deleteSchedule(eventId) {
        setSchedules((current) =>
          current.filter((event) => event.id !== eventId),
        );
      },
      markSchedulesSynced(eventIds, status) {
        setSchedules((current) =>
          current.map((event) =>
            eventIds.includes(event.id) ? { ...event, syncStatus: status } : event,
          ),
        );
      },
    }),
    [tasks, schedules],
  );

  return (
    <TimeManagementContext.Provider value={value}>
      {children}
    </TimeManagementContext.Provider>
  );
}

export function useTimeManagement() {
  const context = useContext(TimeManagementContext);

  if (!context) {
    throw new Error(
      "useTimeManagement must be used inside TimeManagementProvider",
    );
  }

  return context;
}
