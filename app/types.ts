export type TransactionType = 'expense' | 'transfer';

export interface ExpenseShares {
  [member: string]: number;
}

export interface ExpenseTransaction {
  _id: string;
  type: 'expense';
  timestamp: number;
  value: number;
  payer: string;
  name: string;
  method: 1 | 2; // 1 = 平均分攤, 2 = 指定金額
  shares: ExpenseShares;
}

export interface TransferTransaction {
  _id: string;
  type: 'transfer';
  timestamp: number;
  value: number;
  payer: string;
  receiver: string;
}

export type Transaction = ExpenseTransaction | TransferTransaction;

export interface EventData {
  name: string;
  accounts: string[];
}

export interface SettleItem {
  debtor: string;
  creditor: string;
  settledAmount: number;
}
