import { DescriptionText } from "@/components/ui/DescriptionText";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { cashFlowItems, moduleStats } from "@/lib/mockData";

export default function CashFlowPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-gochujang">Module</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-soy-sauce">
        Cash Flow
      </h1>
      <DescriptionText className="mt-3 text-base">
        광고비, 제조비, 입금 예정액을 함께 볼 기본 페이지입니다.
      </DescriptionText>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {moduleStats.cashFlow.map((stat) => (
          <Card key={stat.label} className="border-l-4 border-l-ssamjang">
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
        {cashFlowItems.map((item) => (
          <Card key={item.label}>
            <CardHeader
              title={item.label}
              eyebrow={item.timing}
              action={
                <Badge tone={item.status === "Expected" ? "red" : "yellow"}>
                  {item.status}
                </Badge>
              }
            />
            <p className="text-3xl font-semibold text-soy-sauce">{item.amount}</p>
            <DescriptionText className="mt-3">{item.description}</DescriptionText>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          columns={["Item", "Amount", "Timing", "Status"]}
          rows={cashFlowItems.map((item) => [
            item.label,
            item.amount,
            item.timing,
            item.status,
          ])}
        />
      </div>
    </section>
  );
}
