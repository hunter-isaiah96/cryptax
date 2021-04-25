"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_model_1 = require("./models/Transaction.model");
var csv_parser_1 = __importDefault(require("csv-parser"));
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
var transactions = [];
var readCashApp = function () {
    fs_1.default.createReadStream('./app/cashapp.csv')
        .pipe(csv_parser_1.default())
        .on('data', function (data) {
        var newTransaction = {
            date: new Date(data['Date']),
            type: Transaction_model_1.CashappTransactionTypes[data['Transaction Type'].split(' ')[1]],
            currency: 'USD',
            amount: Number(data['Amount'].replace('$', '').replace(',', '')),
            fee: Number(data['Fee'].replace('$', '')),
            asset: data['Asset Type'],
            asset_price: Number(data['Asset Price'].replace('$', '').replace(',', '')),
            net_amount: Number(data['Net Amount'].replace('$', '').replace(',', '')),
            asset_amount: Number(data['Asset Amount'].replace('$', '').replace(',', '')),
        };
        transactions.push(newTransaction);
        //   console.log(Number(data['Amount'].replace('$', ''))
    })
        .on('end', function () {
        var items = transactions
            .sort(function (a, b) { return new Date(a.date) - new Date(b.date); })
            .slice(0, 4);
        var pools = [];
        var newPool = {};
        var buys = [];
        var sellsCostBasis = [];
        items.forEach(function (transaction, index) {
            switch (transaction.type) {
                case Transaction_model_1.TransactionTypes.Buy:
                    buys.push(transaction);
                    break;
                case Transaction_model_1.TransactionTypes.Sell:
                    // console.log(transaction.asset_price)
                    var totalUSD = buys.reduce(function (total, next) { return total + next.net_amount + next.fee; }, 0);
                    var totalCoins = buys.reduce(function (total, next) { return total + next.asset_amount; }, 0);
                    console.log(totalUSD / totalCoins);
                    // let transactionCostBasis =
                    //   (totalUSD / totalCoins) * transaction.asset_amount
                    // console.log(transactionCostBasis)
                    // console.log(totalUSD)
                    // console.log(totalUSD)
                    // console.log(transactionCostBasis)
                    // sellsCostBasis.push(transactionCostBasis)
                    break;
                case Transaction_model_1.TransactionTypes.Reward:
                    break;
                case Transaction_model_1.TransactionTypes.Exchange:
                    break;
            }
        });
        // const basis = sellsCostBasis.reduce((a, b) => a - b)
        // console.log(basis)
    });
};
readCashApp();
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
