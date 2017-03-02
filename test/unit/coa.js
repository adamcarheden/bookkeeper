const Path = require('path')
import { test, BookKeeper } from './fixtures'

test(`Generate Financial Statements (${Path.basename(__filename)})`, (t) => {
	const wages = new BookKeeper.CreditAccount('Wages')
	const checking = new BookKeeper.DebitAccount('Checking')
	const earnings = new BookKeeper.CreditAccount('Retained Earnings')
	const coa = new BookKeeper.ChartOfAccounts() // eslint-disable-line no-unused-vars
	const p = new BookKeeper.Period(2016, coa, function() {
		coa.journalEntry(p, 'Close Wages', wages.balance, wages, earnings)
	})
	coa.incomeStatementAccount(wages)
	coa.balanceSheetAccount(checking)
	coa.equityAccount(earnings)

	coa.journalEntry(p, 'Payday', 1099.99, checking, wages)

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
	t.equal(balanceSheet.assetsTotal, assets, 'Assets total is sum of assets')
	t.equal(balanceSheet.liabilitiesTotal, liabilities, 'Liabilities total is sum of liabilities')
	t.equal(balanceSheet.netWorth, nw, 'Net Worth is assets - liabilities')

	const incomeStatement = p.incomeStatement
	let income = 0
	for (let key in incomeStatement.income) {
		income += incomeStatement.income[key]
	}
	let expenses = 0
	for (let key in incomeStatement.expenses) {
		expenses += incomeStatement.expenses[key]
	}
	let roo = income - expenses
	t.equal(incomeStatement.incomeTotal, income, 'Income total is sum of income')
	t.equal(incomeStatement.expensesTotal, expenses, 'Expenses total is sum of expenses')
	console.log({income: income, expenses: expenses, roo: roo, bs: balanceSheet, is: incomeStatement})
	t.equal(incomeStatement.netIncome, roo, 'Net Income is income - expenses')

	t.end()
})
