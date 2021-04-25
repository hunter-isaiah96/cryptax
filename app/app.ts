import {
  TransactionTypes,
  CashappTransactionTypes,
  Transaction,
} from './models/Transaction.model'

import csv from 'csv-parser'
import express from 'express'
import fs from 'fs'

const app = express()

const transactions: Transaction[] = []

const readCashApp = () => {
  fs.createReadStream('./app/cashapp.csv')
    .pipe(csv())
    .on('data', (data) => {
      const newTransaction: Transaction = {
        date: new Date(data['Date']),
        type: (<any>CashappTransactionTypes)[
          data['Transaction Type'].split(' ')[1]
        ],
        currency: 'USD',
        amount: Number(data['Amount'].replace('$', '').replace(',', '')),
        fee: Number(data['Fee'].replace('$', '')),
        asset: data['Asset Type'],
        asset_price: Number(
          data['Asset Price'].replace('$', '').replace(',', '')
        ),
        net_amount: Number(
          data['Net Amount'].replace('$', '').replace(',', '')
        ),
        asset_amount: Number(
          data['Asset Amount'].replace('$', '').replace(',', '')
        ),
      }
      transactions.push(newTransaction)
      //   console.log(Number(data['Amount'].replace('$', ''))
    })
    .on('end', () => {
      const items = transactions
        .sort((a, b) => <any>new Date(a.date) - <any>new Date(b.date))
        .slice(0, 4)
      const pools = []
      let newPool = {}
      let buys: Transaction[] = []
      let sellsCostBasis: number[] = []
      items.forEach((transaction, index) => {
        switch (transaction.type) {
          case TransactionTypes.Buy:
            buys.push(transaction)
            break
          case TransactionTypes.Sell:
            // console.log(transaction.asset_price)
            let totalUSD = buys.reduce(
              (total, next) => total + next.net_amount + next.fee,
              0
            )

            let totalCoins = buys.reduce(
              (total, next) => total + next.asset_amount,
              0
            )

            console.log(totalUSD / totalCoins)

            // let transactionCostBasis =
            //   (totalUSD / totalCoins) * transaction.asset_amount

            // console.log(transactionCostBasis)

            // console.log(totalUSD)

            // console.log(totalUSD)
            // console.log(transactionCostBasis)
            // sellsCostBasis.push(transactionCostBasis)

            break
          case TransactionTypes.Reward:
            break
          case TransactionTypes.Exchange:
            break
        }
      })

      // const basis = sellsCostBasis.reduce((a, b) => a - b)
      // console.log(basis)
    })
}

readCashApp()

// console.log(500 * 0.00182148)

// const transaction: Transaction = {
//   date: new Date(1616559562),
//   type: TransactionType.Buy,
//   currency: 'USD',
//   amount: -195.97,
//   fee: -4.03,
//   asset: 'BTC',
//   asset_amount: 0.01833605,
//   asset_price: $10,687.69
// }

// console.log(transaction)
