import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCw,
} from "lucide-react";

interface WalletBalanceProps {
  balance: number;
  isLoading: boolean;
  onRefresh: () => void;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  balance,
  isLoading,
  onRefresh,
}) => {
  return (
    <Card className="w-full max-w-md bg-[#19191D] border-zinc-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-[#EDEDF0]">
          Your Balance
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Current available funds in your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold text-[#EDEDF0]">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#FD366E]" />
            ) : (
              `$${balance.toFixed(2)}`
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8 border-zinc-700 hover:bg-zinc-800 text-[#EDEDF0] bg-[#19191D]"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface Transaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  timestamp: Date;
  status: "COMPLETED" | "PENDING" | "FAILED";
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
}) => {
  const getTransactionIcon = (type: "CREDIT" | "DEBIT") => {
    return type === "CREDIT" ? (
      <ArrowUpCircle className="h-4 w-4 text-green-400" />
    ) : (
      <ArrowDownCircle className="h-4 w-4 text-[#FD366E]" />
    );
  };

  const getStatusBadgeVariant = (status: Transaction["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30";
      case "FAILED":
        return "bg-[#FD366E]/20 text-[#FD366E] hover:bg-[#FD366E]/30";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#19191D] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-[#EDEDF0]">Transaction History</CardTitle>
        <CardDescription className="text-zinc-400">
          Your recent wallet activity
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-[#FD366E]" />
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <p className="text-sm font-medium text-[#EDEDF0]">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${
                    transaction.type === "CREDIT"
                      ? "text-green-400"
                      : "text-[#FD366E]"
                  }`}
                >
                  {transaction.type === "CREDIT" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </span>
                <Badge className={getStatusBadgeVariant(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="outline"
          className="w-full border-zinc-700 hover:bg-zinc-800 text-[#EDEDF0] bg-[#19191D]"
        >
          View All Transactions
        </Button>
      </CardFooter>
    </Card>
  );
};

interface QuickActionsProps {
  onAddFunds: () => void;
  onWithdraw: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddFunds,
  onWithdraw,
}) => {
  return (
    <Card className="w-full max-w-md bg-[#19191D] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-[#EDEDF0]">Quick Actions</CardTitle>
        <CardDescription className="text-zinc-400">
          Manage your wallet funds
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button
          onClick={onAddFunds}
          className="w-full bg-[#FD366E] hover:bg-[#FD366E]/90 text-[#EDEDF0]"
        >
          <ArrowUpCircle className="mr-2 h-4 w-4" />
          Add Funds
        </Button>
        <Button
          onClick={onWithdraw}
          variant="outline"
          className="w-full border-zinc-700 hover:bg-zinc-800 text-[#EDEDF0] bg-[#19191D]"
        >
          <ArrowDownCircle className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
      </CardContent>
    </Card>
  );
};

const WalletDashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setBalance(1250.75);
      setTransactions([
        {
          id: "1",
          type: "CREDIT",
          amount: 500,
          description: "Added funds",
          timestamp: new Date(),
          status: "COMPLETED",
        },
        {
          id: "2",
          type: "DEBIT",
          amount: 50,
          description: "Purchase: Premium Skin",
          timestamp: new Date(Date.now() - 86400000),
          status: "COMPLETED",
        },
        {
          id: "3",
          type: "DEBIT",
          amount: 25,
          description: "Purchase: Game Credits",
          timestamp: new Date(Date.now() - 172800000),
          status: "PENDING",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAddFunds = () => {
    console.log("Add funds clicked");
  };

  const handleWithdraw = () => {
    console.log("Withdraw clicked");
  };

  return (
    <div className="grid gap-6 max-w-md mx-auto">
      <WalletBalance
        balance={balance}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
      <QuickActions onAddFunds={handleAddFunds} onWithdraw={handleWithdraw} />
      <TransactionList transactions={transactions} isLoading={isLoading} />
    </div>
  );
};

export default WalletDashboard;
