import { Icon } from "@iconify/react";

export default function TransactionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
          <Icon
            icon="solar:card-transfer-bold"
            className="text-5xl text-purple-600"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Transactions
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          View your payment history, earnings, and financial activity.
        </p>
        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500">
            No transactions yet. Your payment history will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}
