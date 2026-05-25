import { DescriptionText } from "@/components/ui/DescriptionText";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { exportProducts, moduleStats } from "@/lib/mockData";

export default function ExportPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold text-gochujang">Module</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-soy-sauce">
        Export
      </h1>
      <DescriptionText className="mt-3 text-base">
        수출 SKU, 국가, 바이어 대응 상태를 확인할 기본 페이지입니다.
      </DescriptionText>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {moduleStats.export.map((stat) => (
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
        {exportProducts.map((product) => (
          <Card key={`${product.name}-${product.market}`}>
            <CardHeader
              title={product.name}
              eyebrow={product.market}
              action={
                <Badge
                  tone={
                    product.status === "Buyer Sampling" ? "red" : "yellow"
                  }
                >
                  {product.status}
                </Badge>
              }
            />
            <DescriptionText>{product.description}</DescriptionText>
            <div className="mt-5 rounded-lg bg-soy-sauce/5 p-3">
              <p className="truncate text-xs text-soy-sauce/60">Category</p>
              <p className="mt-1 truncate text-sm font-semibold text-soy-sauce">
                {product.category}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          columns={["Product", "Category", "Market", "Status"]}
          rows={exportProducts.map((product) => [
            product.name,
            product.category,
            product.market,
            product.status,
          ])}
        />
      </div>
    </section>
  );
}
