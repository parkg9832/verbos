import Link from "next/link";
import { AIAssistantWidget } from "@/components/ui/AIAssistantWidget";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DescriptionText } from "@/components/ui/DescriptionText";
import { dashboardModules, exportProducts, kanbanTasks } from "@/lib/mockData";

const columns = ["검토", "진행"];

function badgeTone(value: string) {
  if (value === "높음" || value === "검토") return "red";
  if (value === "중간" || value === "진행") return "yellow";
  return "neutral";
}

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gochujang">
            VERBOS 내부 업무앱
          </p>
          <h1 className="mt-2 truncate text-3xl font-semibold tracking-normal text-soy-sauce">
            오늘의 업무 현황
          </h1>
          <DescriptionText className="mt-3 text-base">
            수출 준비, 마케팅, 자금흐름에서 오늘 확인할 항목만 정리합니다.
          </DescriptionText>
        </div>
        <Badge tone="brown">정적 UI 목업</Badge>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-gochujang">
          <p className="truncate text-xs font-semibold text-soy-sauce/60">
            우선 제품
          </p>
          <p className="mt-2 truncate text-2xl font-semibold text-soy-sauce">
            Gochu Paste
          </p>
          <DescriptionText className="mt-2 text-xs leading-5">
            라벨 검토와 샘플 발송 일정을 먼저 확인합니다.
          </DescriptionText>
        </Card>
        <Card className="border-l-4 border-l-ssamjang">
          <p className="truncate text-xs font-semibold text-soy-sauce/60">
            오늘 할 일
          </p>
          <p className="mt-2 truncate text-2xl font-semibold text-soy-sauce">
            {kanbanTasks.length}건
          </p>
          <DescriptionText className="mt-2 text-xs leading-5">
            검토와 진행 중인 업무만 메인 화면에 표시합니다.
          </DescriptionText>
        </Card>
        <Card className="border-l-4 border-l-soy-sauce">
          <p className="truncate text-xs font-semibold text-soy-sauce/60">
            수출 시장
          </p>
          <p className="mt-2 truncate text-2xl font-semibold text-soy-sauce">
            멕시코 · 페루 · 칠레
          </p>
          <DescriptionText className="mt-2 text-xs leading-5">
            현재 목업에서는 3개 시장만 간단히 관리합니다.
          </DescriptionText>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="업무 메뉴"
              eyebrow="6개 모듈"
              action={<Badge tone="yellow">간단 보기</Badge>}
            />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {dashboardModules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="rounded-lg border border-soy-sauce/10 bg-[#f8f6f2] p-4 transition hover:border-gochujang/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-gochujang">
                        {module.label}
                      </p>
                      <h2 className="mt-1 truncate text-base font-semibold text-soy-sauce">
                        {module.title}
                      </h2>
                    </div>
                    <Badge tone={module.tone}>{module.health}</Badge>
                  </div>
                  <DescriptionText className="mt-2 text-xs leading-5">
                    {module.description}
                  </DescriptionText>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="오늘 할 일"
              eyebrow="업무 보드"
              action={<Badge tone="red">우선순위</Badge>}
            />
            <div className="grid gap-3 lg:grid-cols-2">
              {columns.map((column) => (
                <div key={column} className="rounded-lg bg-[#f8f6f2] p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-soy-sauce">
                      {column}
                    </p>
                    <Badge tone={badgeTone(column)}>
                      {kanbanTasks.filter((task) => task.status === column).length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {kanbanTasks
                      .filter((task) => task.status === column)
                      .map((task) => (
                        <div
                          key={task.title}
                          className="rounded-lg border border-soy-sauce/10 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-soy-sauce">
                              {task.title}
                            </h3>
                            <Badge tone={badgeTone(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <DescriptionText className="mt-2 text-xs leading-5">
                            {task.description}
                          </DescriptionText>
                          <p className="mt-3 truncate text-xs font-semibold text-gochujang">
                            {task.owner}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="수출 제품" eyebrow="핵심 SKU" />
            <div className="grid gap-3 md:grid-cols-3">
              {exportProducts.map((product) => (
                <div
                  key={product.name}
                  className="rounded-lg border border-soy-sauce/10 bg-[#f8f6f2] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-soy-sauce">
                        {product.name}
                      </h3>
                      <p className="mt-1 truncate text-xs text-soy-sauce/55">
                        {product.market}
                      </p>
                    </div>
                    <Badge tone="neutral">{product.status}</Badge>
                  </div>
                  <DescriptionText className="mt-3 text-xs leading-5">
                    {product.description}
                  </DescriptionText>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <AIAssistantWidget />
      </div>
    </section>
  );
}
