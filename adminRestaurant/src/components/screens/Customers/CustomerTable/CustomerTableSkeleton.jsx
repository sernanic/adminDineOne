import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";

export default function CustomerTableSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            <Skeleton className="h-8 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <thead>
                <tr>
                  {Array(5).fill(null).map((_, i) => (
                    <th key={i}>
                      <Skeleton className="h-6 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(null).map((_, i) => (
                  <tr key={i}>
                    {Array(5).fill(null).map((_, j) => (
                      <td key={j}>
                        <Skeleton className="h-6 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
