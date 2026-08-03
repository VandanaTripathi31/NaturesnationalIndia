import { cn } from "@/lib/utils";

export function DataTable({
  headers,
  children,
  className,
}: {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}
