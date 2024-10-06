import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  if (!auth) {
    console.error("Auth context is undefined");
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    console.error("Current user is undefined");
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl mb-8">Welcome, {currentUser.email} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">$45,231.89</p>
                <p className="text-sm text-muted-foreground mt-1">+20.1% from last month</p>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscriptions</p>
                <p className="text-3xl font-bold mt-2">+2350</p>
                <p className="text-sm text-muted-foreground mt-1">+180.1% from last month</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sales</p>
                <p className="text-3xl font-bold mt-2">+12,234</p>
                <p className="text-sm text-muted-foreground mt-1">+19% from last month</p>
              </div>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                <p className="text-3xl font-bold mt-2">+573</p>
                <p className="text-sm text-muted-foreground mt-1">+201 since last hour</p>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card className="recentOrders">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
            <Button variant="ghost" className="text-sm text-muted-foreground">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Recent transactions from your store.</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Liam Johnson", email: "liam@example.com", amount: "$250.00" },
                  { name: "Olivia Smith", email: "olivia@example.com", amount: "$150.00" },
                  { name: "Noah Williams", email: "noah@example.com", amount: "$350.00" },
                  { name: "Emma Brown", email: "emma@example.com", amount: "$450.00" },
                  { name: "Liam Johnson", email: "liam@example.com", amount: "$550.00" },
                ].map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>{transaction.name}</div>
                      <div className="text-sm text-muted-foreground">{transaction.email}</div>
                    </TableCell>
                    <TableCell className="text-right">{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
                { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
                { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
                { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
                { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" }
              ].map((sale, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${sale.name}`} alt={sale.name} />
                    <AvatarFallback>{sale.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">{sale.email}</p>
                  </div>
                  <div className="ml-auto font-medium"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}