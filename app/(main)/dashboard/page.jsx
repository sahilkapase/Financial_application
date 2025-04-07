import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";

export default async function DashboardPage() {
  // Wrap in try/catch to handle any potential errors
  try {
    // Get accounts and transactions
    const [accounts, transactions] = await Promise.all([
      getUserAccounts().catch(e => {
        console.error("Error fetching accounts:", e);
        return [];
      }),
      getDashboardData().catch(e => {
        console.error("Error fetching dashboard data:", e);
        return [];
      }),
    ]);

    // Ensure we have arrays even if API returns undefined
    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    // Get default account
    const defaultAccount = safeAccounts.find((account) => account.isDefault);

    // Get budget for default account if it exists
    let budgetData = { budget: null, currentExpenses: 0 };
    if (defaultAccount?.id) {
      try {
        budgetData = await getCurrentBudget(defaultAccount.id);
      } catch (e) {
        console.error("Error fetching budget:", e);
      }
    }

    return (
      <div className="space-y-8">
        {/* Budget Progress */}
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />

        {/* Dashboard Overview */}
        <DashboardOverview
          accounts={safeAccounts}
          transactions={safeTransactions}
        />

        {/* Accounts Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                <Plus className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          {safeAccounts.length > 0 &&
            safeAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}