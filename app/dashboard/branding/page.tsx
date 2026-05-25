import { DescriptionText } from "@/components/ui/DescriptionText";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { brandingAssets, moduleStats } from "@/lib/mockData";

export default function BrandingPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-gochujang">Module</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-soy-sauce">
        Branding
      </h1>
      <DescriptionText className="mt-3 text-base">
        브랜드 메시지, 제품 스토리, 국가별 표현 자산을 모을 기본 페이지입니다.
      </DescriptionText>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {moduleStats.branding.map((stat) => (
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
        {brandingAssets.map((asset) => (
          <Card key={asset.title}>
            <CardHeader
              title={asset.title}
              eyebrow={asset.market}
              action={
                <Badge tone={asset.status === "Approved" ? "brown" : "yellow"}>
                  {asset.status}
                </Badge>
              }
            />
            <DescriptionText>{asset.description}</DescriptionText>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-soy-sauce/10 pt-4">
              <span className="truncate text-sm font-semibold text-soy-sauce">
                Tone
              </span>
              <Badge tone="neutral">{asset.tone}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          columns={["Asset", "Market", "Tone", "Status"]}
          rows={brandingAssets.map((asset) => [
            asset.title,
            asset.market,
            asset.tone,
            asset.status,
          ])}
        />
      </div>
    </section>
  );
}
