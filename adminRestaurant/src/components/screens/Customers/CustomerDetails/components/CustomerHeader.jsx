import React from "react";
import { Card, CardHeader } from "@/components/ui/card";

export default function CustomerHeader({ customer }) {
  if (!customer) return null;

  // Create a formatted full name, handling null values
  const fullName = customer.firstName && customer.lastName 
    ? `${customer.firstName} ${customer.lastName}` 
    : 'Anonymous Customer';

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-2">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-xl font-bold">
            {customer.username || fullName}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-default-500">
            <div>
              <span className="font-semibold">Customer ID:</span> {customer.id}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {customer.email}
            </div>
            <div>
              <span className="font-semibold">Auth ID:</span> {customer.authUUID}
            </div>
            <div>
              <span className="font-semibold">Last Updated:</span>{' '}
              {new Date(customer.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
