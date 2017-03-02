import ChartOfAccounts from './ChartOfAccounts'
import Period from './Period'
import Account from './Account'
export default class JournalEntry {

	amount: number
	description: string
	period: Period

	constructor(coa: ChartOfAccounts, period: Period, description: string, amount: number, debit: Account, credit: Account) {
		this.amount = amount
		this.description = description
		this.period = period
		debit.debit(this)
		credit.credit(this)
		period.logJournalEntry(this)
		coa.logJournalEntry(this)
	}
}
