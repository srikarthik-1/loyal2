export interface Admin {
  username: string;
  password: string; // In a real app, this should be a hash
  name: string; // The name of the business/admin
  customers: Customer[];
}

export interface TransactionHistory {
  date: string;
  bill: number;
  points: number;
}

export interface Customer {
  mobile: string;
  name: string;
  pin: string;
  points: number;
  totalSpent: number;
  history: TransactionHistory[];
}

export enum Section {
  Overview = 'overview',
  Transaction = 'transaction',
  Search = 'search',
  Customers = 'customers',
  Analytics = 'analytics',
  AiInsights = 'ai-insights',
}
