"use client";

import { useEffect, useState } from "react";
import type { ScheduleEvent } from "@/contexts/TimeManagementContext";

type GoogleAuthStatus = "signed-out" | "simulated" | "signed-in";
type GoogleSyncState = "idle" | "syncing" | "success" | "error";

const STATUS_KEY = "verbos-google-calendar-status";
const LAST_SYNC_KEY = "verbos-google-calendar-last-sync";

function hasGoogleCredentials() {
  return Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  );
}

export function useGoogleCalendar() {
  const [authStatus, setAuthStatus] = useState<GoogleAuthStatus>("signed-out");
  const [syncState, setSyncState] = useState<GoogleSyncState>("idle");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedStatus = window.localStorage.getItem(STATUS_KEY);
    const savedSyncAt = window.localStorage.getItem(LAST_SYNC_KEY);

    if (
      savedStatus === "signed-in" ||
      savedStatus === "simulated" ||
      savedStatus === "signed-out"
    ) {
      setAuthStatus(savedStatus);
    }

    if (savedSyncAt) setLastSyncAt(savedSyncAt);
  }, []);

  function persistAuthStatus(status: GoogleAuthStatus) {
    setAuthStatus(status);
    window.localStorage.setItem(STATUS_KEY, status);
  }

  async function connect() {
    setErrorMessage(null);

    if (!hasGoogleCredentials()) {
      persistAuthStatus("simulated");
      return {
        simulated: true,
        message:
          "Google OAuth client ID가 없어 로컬 시뮬레이션 모드로 연결했습니다.",
      };
    }

    persistAuthStatus("signed-in");
    return {
      simulated: false,
      message:
        "OAuth 골격이 준비되었습니다. 운영 배포 전 Google Identity Services 토큰 발급 단계를 연결하세요.",
    };
  }

  function disconnect() {
    persistAuthStatus("signed-out");
    setSyncState("idle");
    setErrorMessage(null);
  }

  async function syncSchedules(schedules: ScheduleEvent[]) {
    setSyncState("syncing");
    setErrorMessage(null);

    try {
      if (authStatus !== "signed-in" || !hasGoogleCredentials()) {
        await new Promise((resolve) => window.setTimeout(resolve, 600));
        const timestamp = new Date().toISOString();
        window.localStorage.setItem(LAST_SYNC_KEY, timestamp);
        setLastSyncAt(timestamp);
        setSyncState("success");
        persistAuthStatus("simulated");

        return {
          simulated: true,
          syncedIds: schedules.map((schedule) => schedule.id),
        };
      }

      // OAuth access token acquisition is intentionally left as a production
      // integration boundary. Once a token exists, insert/update events with:
      // POST https://www.googleapis.com/calendar/v3/calendars/primary/events
      // Authorization: Bearer <access_token>
      await Promise.all(
        schedules.map((schedule) =>
          fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer TODO_ACCESS_TOKEN",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                summary: schedule.title,
                location: schedule.location,
                description: schedule.description,
                start: {
                  dateTime: `${schedule.date}T${schedule.startTime}:00`,
                  timeZone: "Asia/Seoul",
                },
                end: {
                  dateTime: `${schedule.date}T${schedule.endTime}:00`,
                  timeZone: "Asia/Seoul",
                },
              }),
            },
          ),
        ),
      );

      const timestamp = new Date().toISOString();
      window.localStorage.setItem(LAST_SYNC_KEY, timestamp);
      setLastSyncAt(timestamp);
      setSyncState("success");

      return {
        simulated: false,
        syncedIds: schedules.map((schedule) => schedule.id),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google Calendar sync failed";
      setErrorMessage(message);
      setSyncState("error");
      return { simulated: false, syncedIds: [] };
    }
  }

  return {
    authStatus,
    syncState,
    lastSyncAt,
    errorMessage,
    connect,
    disconnect,
    syncSchedules,
  };
}
