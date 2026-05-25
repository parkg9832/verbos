import { DescriptionText } from "./DescriptionText";

type DataTableProps = {
  columns: string[];
  rows: Array<Array<string | number>>;
};

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-soy-sauce/10 bg-white">
      <div
        className="grid border-b border-soy-sauce/10 bg-soy-sauce px-4 py-3 text-sm font-semibold text-white"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => (
          <span key={column} className="truncate">
            {column}
          </span>
        ))}
      </div>
      {rows.map((row, rowIndex) => (
        <div
          key={`${row.join("-")}-${rowIndex}`}
          className="grid gap-3 border-b border-soy-sauce/10 px-4 py-3 text-sm last:border-b-0"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          {row.map((cell, cellIndex) => (
            <DescriptionText
              key={`${cell}-${cellIndex}`}
              className={
                cellIndex === 0
                  ? "font-semibold text-soy-sauce"
                  : "text-soy-sauce/70"
              }
            >
              {cell}
            </DescriptionText>
          ))}
        </div>
      ))}
    </div>
  );
}
