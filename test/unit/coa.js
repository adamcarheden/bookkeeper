const Path = require('path')
import { test, BookKeeper } from './fixtures'

test(`Generate Financial Statements (${Path.basename(__filename)})`, (t) => {

	const PAYCHECK = 1099.99

	const coa = new BookKeeper.ChartOfAccounts()
	const wages = coa.income.subAccount('Wages', BookKeeper.ACCOUNT_TYPE.CREDIT_NORMAL)
	const checking = coa.assets.subAccount('Checking', BookKeeper.ACCOUNT_TYPE.DEBIT_NORMAL)
	const earnings = coa.equity.subAccount('Retained Earnings', BookKeeper.ACCOUNT_TYPE.CREDIT_NORMAL)
	const p = new BookKeeper.Period(2016, coa, function(period) {
		p.journalEntry('Close Wages', wages.balance, wages, earnings)
	})
	p.journalEntry('Payday', PAYCHECK, checking, wages)

	let roo = coa.income.balance - coa.expenses.balance

	const balanceSheet = p.balanceSheet
	let assets = 0
	for (let key in balanceSheet.assets) {
		assets += balanceSheet.assets[key]
	}
	let liabilities = 0
	for (let key in balanceSheet.liabilities) {
		liabilities += balanceSheet.liabilities[key]
	}
	let nw = assets - liabilities
	t.equal(balanceSheet.balance, PAYCHECK, 'Balance sheet contains assets earned')
	t.equal(balanceSheet.netWorth, coa.assets.balance - coa.liabilities.balance, 'Net Worth is assets - liabilities')

	const incomeStatement = p.incomeStatement
	t.equal(incomeStatement.netIncome, roo, 'Net Income is income - expenses')

	t.end()
})
