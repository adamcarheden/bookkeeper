import DebitAccount from './DebitAccount'
import CreditAccount from './CreditAccount'
import ChartOfAccounts from './ChartOfAccounts'
import JournalEntry from './JournalEntry'
import IncomeStatement from './IncomeStatement'
import BalanceSheet from './BalanceSheet'
import FinancialStatements from './FinancialStatements'

export default class Period {

	period: any
	coa: ChartOfAccounts
	journal: JournalEntry[] = []
	total: number = 0
	autoClose: () => never
	closed: boolean
	financialStatements: FinancialStatements

	constructor(period: any, coa: ChartOfAccounts, autoClose: boolean) {
		this.period = period
		this.coa = coa
		this.autoClose = typeof autoClose === 'function'
			? autoClose
			: function() { throw new Error('You called balanceSheet or incomeStatement prior to closing the period, but you did not provide an autoClose function at instantiation') }
		this.closed = false
	}
	logJournalEntry(je: JournalEntry) {
		this.journal.push(je)
		this.total += je.amount
	}
	close(closer: () => never) {
		const incomeStatement = new IncomeStatement(this.coa.incomeStatementAccounts)
		closer()
		for (let i in this.coa.incomeStatementAccounts) {
			let acct = this.coa.incomeStatementAccounts[i]
			if (acct.balance !== 0) throw new Error(`Income Statement account ${acct.name} has non-zero balance after close`)
		}
		const balanceSheet = new BalanceSheet(this.coa.balanceSheetAccounts, this.coa.equityAccounts)
		this.closed = true
		this.financialStatements = new FinancialStatements(incomeStatement, balanceSheet)
	}
	get balanceSheet() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.financialStatements.balanceSheet
	}
	get incomeStatement() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.financialStatements.incomeStatement
	}
}
