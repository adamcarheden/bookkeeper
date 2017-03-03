import ChartOfAccounts from './ChartOfAccounts'
import Account from './Account'
import JournalEntry from './JournalEntry'
import IncomeStatement from './IncomeStatement'
import BalanceSheet from './BalanceSheet'
import FinancialStatements from './FinancialStatements'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'

export type closeFunction = () => void
export default class Period {

	journal: JournalEntry[] = []
	autoClose: closeFunction
	closed: boolean
	financialStatements: FinancialStatements

	constructor(readonly period: any, readonly coa: ChartOfAccounts, autoClose?: closeFunction) {
		this.autoClose = typeof autoClose === 'function'
			? autoClose
			: function() { throw new Error('You called balanceSheet or incomeStatement prior to closing the period, but you did not provide an autoClose function at instantiation') }
		this.closed = false
	}
	close(closer: closeFunction) {
		const incomeStatement = new IncomeStatement(this.coa)
		closer()
		let isaccts = [this.coa.income, this.coa.expenses]
		for (let i = 0; i<isaccts.length; i++) {
			if (isaccts[i].balance !== 0) throw new Error(`Income Statement account '${isaccts[i].name}' has non-zero balance after close`)
		}
		const balanceSheet = new BalanceSheet(this.coa)
		this.closed = true
		this.financialStatements = new FinancialStatements(incomeStatement, balanceSheet)
	}

	journalEntry(
		description: string,
		amount: number,
		debit: Account,
		credit: Account
	) {
		let je = new JournalEntry(description, amount, debit, credit)
		this.journal.push(je)
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
