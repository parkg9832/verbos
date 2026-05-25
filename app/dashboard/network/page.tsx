import { DescriptionText } from "@/components/ui/DescriptionText";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { moduleStats, networkPartners } from "@/lib/mockData";

export default function NetworkPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-gochujang">Module</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-soy-sauce">
        Network
      </h1>
      <DescriptionText className="mt-3 text-base">
        바이어, 유통사, 현지 파트너 관계를 정리할 기본 페이지입니다.
      </DescriptionText>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {moduleStats.network.map((stat) => (
          <Card key={stat.label} className="border-l-4 border-l-soy-sauce">
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
        {networkPartners.map((partner) => (
          <Card key={partner.name}>
            <CardHeader
              title={partner.name}
              eyebrow={partner.market}
              action={
                <Badge tone={partner.status === "Warm" ? "red" : "yellow"}>
                  {partner.status}
                </Badge>
              }
            />
            <DescriptionText>{partner.description}</DescriptionText>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-soy-sauce/10 pt-4">
              <span className="truncate text-sm font-semibold text-soy-sauce">
                Partner type
              </span>
              <Badge tone="neutral">{partner.type}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          columns={["Partner", "Type", "Market", "Status"]}
          rows={networkPartners.map((partner) => [
            partner.name,
            partner.type,
            partner.market,
            partner.status,
          ])}
        />
      </div>
    </section>
  );
}
