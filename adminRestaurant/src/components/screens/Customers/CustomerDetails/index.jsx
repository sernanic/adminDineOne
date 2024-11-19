import React from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import CustomerHeader from "./components/CustomerHeader";
import CustomerDetails from "./components/CustomerDetails";
import { useCustomerDetails } from "./hooks/useCustomerDetails";
import { useAuth } from "@/contexts/AuthContext";

export default function CustomerDetailsScreen() {
  const { customerId } = useParams();
  const { currentUser } = useAuth();
  const { customer, isLoading, error } = useCustomerDetails({ 
    currentUser,
    customerId 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading customer details: {error.message}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4">
        <p className="text-default-500">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <CustomerHeader customer={customer} />
      <CustomerDetails customer={customer} />
    </div>
  );
}
