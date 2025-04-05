import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { WalletDashboard } from "@/components/expert/wallet-dashboard"


export default async function WalletPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = createClient()

  // Check if user is an expert
  const { data: expert } = await supabase.from("experts").select("id").eq("user_id", user.id).single()

  if (!expert) {
    redirect("/")
  }

  try {
    const wallet = await getExpertWallet()
    const transactions = await getWalletTransactions(20)
// Function to fetch withdrawal requests
async function getWithdrawalRequests() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch withdrawal requests: " + error.message);
  }

  return data;
}
    const withdrawalRequests = await getWithdrawalRequests()

    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Expert Wallet</h1>
        <WalletDashboard wallet={wallet} transactions={transactions} withdrawalRequests={withdrawalRequests} />
      </div>
    )
  } catch (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Expert Wallet</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error instanceof Error ? error.message : "Failed to load wallet data"}
        </div>
      </div>
    )
  }
}
async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && session.user) {
    return session.user;
  }

  return null;
}
async function getExpertWallet() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .single();

  if (error) {
    throw new Error("Failed to fetch expert wallet: " + error.message);
  }

  return data;
}
async function getWalletTransactions(limit: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Failed to fetch wallet transactions: " + error.message);
  }

  return data;
}

