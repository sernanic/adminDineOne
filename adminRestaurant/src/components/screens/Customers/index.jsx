import React from "react";
import CustomerTable from "./CustomerTable";

export default function CustomersScreen() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>
      <CustomerTable />
    </div>
  );
}
