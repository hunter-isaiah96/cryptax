export enum TransactionTypes {
  Buy = 'buy',
  Sell = 'sell',
  Send = 'send',
  Reward = 'reward',
  Exchange = 'exchange',
}

export enum CashappTransactionTypes {
  Buy = 'buy',
  Sale = 'sell',
}

export interface Transaction {
  date: Date
  type: string
  currency: string
  amount: number
  fee: number
  net_amount: number
  asset: string
  asset_price: number
  asset_amount: number
  cost_basis?: number
}
