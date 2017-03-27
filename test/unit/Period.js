const Path = require('path')
import { test, BookKeeper } from './fixtures'

test(`Generate Financial Statements (${Path.basename(__filename)})`, (t) => {

	const PAYCHECK = 1099.99

	const coa = new BookKeeper.ChartOfAccounts()
	const wages = coa.income.subAccount('Wages')
	const checking = coa.assets.subAccount('Checking')
	const earnings = coa.equity.subAccount('Retained Earnings')
	const p = new BookKeeper.Period(2016, coa, function(period) {
		p.journalEntry('Close Wages', wages.balance, wages, earnings)
	})
	p.journalEntry('Payday', PAYCHECK, checking, wages)

	let roo = coa.income.balance - coa.expenses.balance

	const balanceSheet = p.balanceSheet
	const incomeStatement = p.incomeStatement

	console.log(`-= Journal =-\n${p}\n------------------------\n`)
	console.log(`-= Chart of Accounts =-\n${coa}\n-----------------\n`)
	console.log(`-= Income Statement =-\n${incomeStatement}\n----------------------\n`)
	console.log(`-= Balance Sheet =-\n${balanceSheet}\n-----------------------------\n`)

	t.equal(balanceSheet.netWorth, coa.assets.balance - coa.liabilities.balance, 'Net Worth is assets - liabilities')

	t.equal(incomeStatement.netIncome, roo, 'Net Income is income - expenses')

	t.end()
})
