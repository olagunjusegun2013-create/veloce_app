export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF';

export interface CurrencyAccount {
  id: string;
  currency: CurrencyCode;
  currencyName: string;
  symbol: string;
  balance: number;
  usdEquivalent: number;
  rateToUSD: number;
  accountNumber: string;
  iban: string;
  flag: string;
  change24h: number;
  apy?: number;
}

export type TransactionType = 'inbound' | 'outbound' | 'exchange' | 'card_spend' | 'yield';
export type TransactionStatus = 'completed' | 'pending' | 'hold' | 'declined';

export interface Transaction {
  id: string;
  reference: string;
  title: string;
  merchantOrBeneficiary: string;
  category: 'Infrastructure' | 'Payroll' | 'Revenue' | 'Travel' | 'SaaS' | 'Investment' | 'Treasury';
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: CurrencyCode;
  usdAmount: number;
  timestamp: string;
  rail: 'FedNow' | 'SEPA Instant' | 'SWIFT' | 'ACH' | 'Internal';
  fee: number;
  note?: string;
  counterpartyAvatar?: string;
  cardLast4?: string;
}

export interface Card {
  id: string;
  name: string;
  type: 'titanium' | 'virtual_saas' | 'travel_multi' | 'custom';
  theme: 'titanium' | 'purple' | 'emerald';
  cardNumber: string;
  last4: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardholder: string;
  spendLimit: number;
  currentSpend: number;
  currency: CurrencyCode;
  isFrozen: boolean;
  allowOnline: boolean;
  allowInternational: boolean;
  allowAtm: boolean;
  pin: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  organization: string;
  avatar: string;
  email: string;
  routingNumber: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
  currency: CurrencyCode;
  defaultRail: 'FedNow' | 'SEPA Instant' | 'SWIFT';
  category: string;
}

export interface FXRate {
  pair: string;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  change24h: number;
  high: number;
  low: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'security' | 'transaction' | 'rate_alert' | 'system';
  read: boolean;
  badge?: string;
}
