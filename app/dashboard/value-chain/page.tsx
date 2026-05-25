import { DescriptionText } from "@/components/ui/DescriptionText";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { moduleStats, valueChainStages } from "@/lib/mockData";

export default function ValueChainPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-gochujang">Module</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-soy-sauce">
        Value Chain
      </h1>
      <DescriptionText className="mt-3 text-base">
        원재료, 생산, 재고, 출고를 연결할 기본 페이지입니다.
      </DescriptionText>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {moduleStats.valueChain.map((stat) => (
          <Card key={stat.label} className="border-l-4 border-l-gochujang">
            <p className="truncate text-xs font-semibold text-soy-sauce/60">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-soy-sauce">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {valueChainStages.map((stage) => (
          <Card key={stage.stage}>
            <CardHeader
              title={stage.stage}
              eyebrow={stage.owner}
              action={
                <Badge tone={stage.status === "Watch" ? "yellow" : "red"}>
                  {stage.status}
                </Badge>
              }
            />
            <DescriptionText>{stage.description}</DescriptionText>
            <div className="mt-5 h-2 rounded-full bg-soy-sauce/10">
              <div
                className="h-2 rounded-full bg-gochujang"
                style={{ width: `${stage.progress}%` }}
              />
            </div>
            <p className="mt-2 truncate text-xs font-semibold text-soy-sauce/60">
              {stage.progress}% readiness
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          columns={["Stage", "Owner", "Status", "Readiness"]}
          rows={valueChainStages.map((stage) => [
            stage.stage,
            stage.owner,
            stage.status,
            `${stage.progress}%`,
          ])}
        />
      </div>
    </section>
  );
}
