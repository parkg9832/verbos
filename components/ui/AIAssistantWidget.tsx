import { assistantActions, assistantMessages } from "@/lib/mockData";
import { Badge } from "./Badge";
import { DescriptionText } from "./DescriptionText";

export function AIAssistantWidget() {
  return (
    <aside className="rounded-lg border border-soy-sauce/10 bg-white shadow-sm">
      <div className="border-b border-soy-sauce/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gochujang">AI 비서</p>
            <h2 className="mt-1 truncate text-lg font-semibold text-soy-sauce">
              오늘의 업무 정리
            </h2>
          </div>
          <Badge tone="yellow">목업</Badge>
        </div>
        <DescriptionText className="mt-2 text-xs leading-5">
          수출, 자금, 파트너 업무 중 오늘 확인할 일만 짧게 보여줍니다.
        </DescriptionText>
      </div>

      <div className="space-y-3 p-4">
        {assistantMessages.slice(0, 2).map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className="rounded-lg bg-soy-sauce/5 p-3"
          >
            <p className="truncate text-xs font-semibold text-gochujang">
              {item.role}
            </p>
            <DescriptionText className="mt-1 text-xs leading-5">
              {item.message}
            </DescriptionText>
          </div>
        ))}
      </div>

      <div className="grid gap-2 border-t border-soy-sauce/10 p-4">
        {assistantActions.map((action) => (
          <button
            key={action}
            className="truncate rounded-lg border border-soy-sauce/10 bg-[#f8f6f2] px-3 py-2 text-left text-xs font-semibold text-soy-sauce transition hover:border-gochujang/30 hover:text-gochujang"
            type="button"
          >
            {action}
          </button>
        ))}
      </div>
    </aside>
  );
}
