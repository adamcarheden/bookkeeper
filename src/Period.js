import DebitAccount from './DebitAccount'
import CreditAccount from './CreditAccount'
export default class Period {
	constructor(period, coa, autoClose) {
		this.period = period
		this.coa = coa
		this.journal = []
		this.total = 0
		this.autoClose = typeof autoClose === 'function'
			? autoClose
			: function() { throw new Error('You called balanceSheet or incomeStatement prior to closing the period, but you did not provide an autoClose function at instantiation') }
		this.closed = false
	}
	logJournalEntry(je) {
		this.journal.push(je)
		this.total += je.amount
	}
	close(closer) {
		const incomeStatement = {
			income: {},
			incomeTotal: 0,
			expenses: {},
			expensesTotal: 0,
			netIncome: 0
		}
		for (let i in this.coa.incomeStatementAccounts) {
			let acct = this.coa.incomeStatementAccounts[i]
			console.log({i: i, acct: acct})
			if (acct instanceof CreditAccount) {
				incomeStatement.income[acct.name] = acct.balance
				incomeStatement.incomeTotal += acct.balance
			} else if (acct instanceof DebitAccount) {
				incomeStatement.expenses[acct.name] = acct.balance
				incomeStatement.expensesTotal += acct.balance
			} else {
				throw new Error(`Unknown account type: ${acct.constructor.name}`)
			}
		}
		incomeStatement.netIncome = incomeStatement.incomeTotal - incomeStatement.expensesTotal
		closer()
		for (let i in this.coa.incomeStatementAccounts) {
			let acct = this.coa.incomeStatementAccounts[i]
			if (acct.balance !== 0) throw new Error(`Income Statement account ${acct.name} has non-zero balance after close`)
		}
		let balanceSheet = {
			assets: {},
			assetsTotal: 0,
			liabilities: {},
			liabilitiesTotal: 0,
			equity: {},
			equityTotal: 0,
			netWorth: 0
		}
		for (let i in this.coa.balanceSheetAccounts) {
			let acct = this.coa.balanceSheetAccounts[i]
			console.log({i: i, acct: acct})
			if (acct instanceof CreditAccount) {
				balanceSheet.liabilities[acct.name] = acct.balance
				balanceSheet.liabilitiesTotal += acct.balance
			} else if (acct instanceof DebitAccount) {
				balanceSheet.assets[acct.name] = acct.balance
				balanceSheet.assetsTotal += acct.balance
			} else {
				throw new Error(`Unknown account type: ${acct.constructor.name}`)
			}
		}
		balanceSheet.netWorth = balanceSheet.assetsTotal - balanceSheet.liabilitiesTotal
		for (let i in this.coa.equityAccounts) {
			let acct = this.coa.equityAccounts[i]
			console.log({i: i, acct: acct})
			if (acct instanceof CreditAccount) {
				balanceSheet.equity[acct.name] = acct.balance
				balanceSheet.equityTotal += acct.balance
			} else if (acct instanceof DebitAccount) {
				throw new Error(`Equity account ${acct.name} is a ${acct.constructor.name}. It should be a credit.`)
			} else {
				throw new Error(`Unknown account type: ${acct.constructor.name}`)
			}
		}
		this.closed = {
			incomeStatement: incomeStatement,
			balanceSheet: balanceSheet
		}
	}
	get balanceSheet() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.closed.balanceSheet
	}
	get incomeStatement() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.closed.incomeStatement
	}
}
