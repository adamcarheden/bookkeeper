import JournalEntry from './JournalEntry'
import Account from './Account'
import Period from './Period'
export default class ChartOfAccounts {

	bsaccts: Account[] = []
	isaccts: Account[] = []
	eqaccts: Account[] = []
	journal: JournalEntry[] = []
	total:number = 0

	get incomeStatementAccounts() { return this.isaccts }
	get balanceSheetAccounts() { return this.bsaccts }
	get equityAccounts() { return this.eqaccts }
	get accounts() {
		return this.bsaccts.concat(this.isaccts,this.eqaccts)
	}
	incomeStatementAccount(acct: Account) {
		this.isaccts.push(acct)
	}
	balanceSheetAccount(acct: Account) {
		this.bsaccts.push(acct)
	}
	equityAccount(acct: Account) {
		this.eqaccts.push(acct)
	}
	journalEntry(period: Period, descr: string, amount: number, debit: Account, credit: Account) {
		return new JournalEntry(
			this,
			period,
			descr,
			amount,
			debit,
			credit,
		)
	}
	logJournalEntry(je: JournalEntry) {
		this.journal.push(je)
		this.total += je.amount
	}
}
