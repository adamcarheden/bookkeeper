import ChartOfAccounts from './ChartOfAccounts'
import Period from './Period'
import Account from './Account'
export default class JournalEntry {

	constructor(coa: ChartOfAccounts, readonly period: Period, readonly description: string, readonly amount: number, readonly debit: Account, readonly credit: Account) {
		debit.debit(this)
		credit.credit(this)
		period.logJournalEntry(this)
		coa.logJournalEntry(this)
	}
}
