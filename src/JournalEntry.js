export default class JournalEntry {
	constructor(coa, period, description, amount, debit, credit) {
		this.amount = amount
		this.description = description
		this.period = period
		debit.debit(this)
		credit.credit(this)
		period.logJournalEntry(this)
		coa.logJournalEntry(this)
	}
}
