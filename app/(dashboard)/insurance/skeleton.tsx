import { Card, CardContent } from "@/components/ui/card"

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-3">
        <div className="flex items-start justify-between">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        </div>
        <div>
          <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

function MobileStatSkeleton() {
  return (
    <div className="flex shrink-0 flex-1 items-center gap-2 rounded-xl border bg-card px-3 py-2">
      <div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-8 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function InsurancePageSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex gap-2 overflow-x-auto pb-0.5 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <MobileStatSkeleton key={i} />
        ))}
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
          <div className="flex flex-1 gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
          <div className="h-8 w-full animate-pulse rounded-md bg-muted sm:w-52" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}
