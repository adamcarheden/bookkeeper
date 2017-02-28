import JournalEntry from './JournalEntry'
import CreditAccount from './CreditAccount'
export default class ChartOfAccounts {
	constructor() {
		this.bsaccts = []
		this.isaccts = []
		this.eqaccts = []
		this.journal = []
		this.total = 0
	}
	get incomeStatementAccounts() { return this.isaccts }
	get balanceSheetAccounts() { return this.bsaccts }
	get equityAccounts() { return this.eqaccts }
	get accounts() {
		return this.bsaccts.concat(this.isaccts,this.eqaccts)
	}
	incomeStatementAccount(acct) {
		this.isaccts.push(acct)
	}
	balanceSheetAccount(acct) {
		this.bsaccts.push(acct)
	}
	equityAccount(acct) {
		if (!(acct instanceof CreditAccount)) {
			throw new Error(`Equity accounts must be Credit Accounts`)
		}
		this.eqaccts.push(acct)
	}
	journalEntry(period, descr, amount, debit, credit) {
		return new JournalEntry(
			this,
			period,
			descr,
			amount,
			debit,
			credit,
		)
	}
	logJournalEntry(je) {
		this.journal.push(je)
		this.total += je.amount
	}
}
