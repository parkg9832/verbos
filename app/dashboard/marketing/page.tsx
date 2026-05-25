import { DescriptionText } from "@/components/ui/DescriptionText";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { marketingCampaigns, moduleStats } from "@/lib/mockData";

export default function MarketingPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-gochujang">Module</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-soy-sauce">
        Marketing
      </h1>
      <DescriptionText className="mt-3 text-base">
        콘텐츠, 광고, 인플루언서 캠페인을 연결할 기본 페이지입니다.
      </DescriptionText>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {moduleStats.marketing.map((stat) => (
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
        {marketingCampaigns.map((campaign) => (
          <Card key={campaign.name}>
            <CardHeader
              title={campaign.name}
              eyebrow={campaign.channel}
              action={
                <Badge tone={campaign.status === "Live" ? "red" : "yellow"}>
                  {campaign.status}
                </Badge>
              }
            />
            <DescriptionText>{campaign.description}</DescriptionText>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-soy-sauce/5 p-3">
                <p className="truncate text-xs text-soy-sauce/60">Reach</p>
                <p className="mt-1 truncate text-lg font-semibold text-soy-sauce">
                  {campaign.reach}
                </p>
              </div>
              <div className="rounded-lg bg-ssamjang/20 p-3">
                <p className="truncate text-xs text-soy-sauce/60">Conversion</p>
                <p className="mt-1 truncate text-lg font-semibold text-soy-sauce">
                  {campaign.conversion}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          columns={["Campaign", "Channel", "Reach", "Conversion"]}
          rows={marketingCampaigns.map((campaign) => [
            campaign.name,
            campaign.channel,
            campaign.reach,
            campaign.conversion,
          ])}
        />
      </div>
    </section>
  );
}
