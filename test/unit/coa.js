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

	console.error(`${coa}`)
	console.error(`-= Journal =-\n${p}`)

	t.equal(balanceSheet.balance, PAYCHECK, 'Balance sheet contains assets earned')
	t.equal(balanceSheet.netWorth, coa.assets.balance - coa.liabilities.balance, 'Net Worth is assets - liabilities')

	const incomeStatement = p.incomeStatement
	t.equal(incomeStatement.netIncome, roo, 'Net Income is income - expenses')

	t.end()
})
