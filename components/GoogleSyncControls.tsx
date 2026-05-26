"use client";

import { Cloud, Link2, RefreshCw, Unlink } from "lucide-react";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useTimeManagement } from "@/contexts/TimeManagementContext";
import { Badge } from "@/components/ui/Badge";

export function GoogleSyncControls() {
  const { schedules, markSchedulesSynced } = useTimeManagement();
  const {
    authStatus,
    syncState,
    lastSyncAt,
    errorMessage,
    connect,
    disconnect,
    syncSchedules,
  } = useGoogleCalendar();

  async function handleSync() {
    const result = await syncSchedules(schedules);
    markSchedulesSynced(
      result.syncedIds,
      result.simulated ? "simulated" : "synced",
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Cloud size={18} className="text-teal-600" />
            <p className="text-sm font-semibold text-slate-950">
              Google Calendar
            </p>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            OAuth 정보가 없으면 로컬 시뮬레이션으로 동기화 상태만 저장합니다.
          </p>
        </div>
        <Badge tone={authStatus === "signed-in" ? "green" : "amber"}>
          {authStatus === "signed-in"
            ? "연결됨"
            : authStatus === "simulated"
              ? "시뮬레이션"
              : "미연결"}
        </Badge>
      </div>

      <div className="grid gap-2">
        {authStatus === "signed-out" ? (
          <button
            type="button"
            onClick={connect}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
          >
            <Link2 size={16} />
            Google 연결
          </button>
        ) : (
          <button
            type="button"
            onClick={disconnect}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
          >
            <Unlink size={16} />
            연결 해제
          </button>
        )}
        <button
          type="button"
          onClick={handleSync}
          disabled={syncState === "syncing" || schedules.length === 0}
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 text-sm font-semibold text-teal-700 transition-colors duration-200 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} />
          {syncState === "syncing" ? "동기화 중" : "일정 동기화"}
        </button>
      </div>

      <div className="mt-4 space-y-1 text-xs text-slate-500">
        <p>동기화 대상: {schedules.length}개</p>
        <p>
          마지막 동기화:{" "}
          {lastSyncAt ? new Date(lastSyncAt).toLocaleString("ko-KR") : "없음"}
        </p>
        {errorMessage ? <p className="text-red-600">{errorMessage}</p> : null}
      </div>
    </div>
  );
}
