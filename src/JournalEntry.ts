import Account from './Account'

export interface JournalEntryItem {
	amount: number
	account: Account
}

export default class JournalEntry {

	constructor(
		readonly description: string,
		readonly debits: JournalEntryItem[],
		readonly credits: JournalEntryItem[]
	) {
		let debit_total = 0
		for (let i=0; i<debits.length; i++) {
			debit_total += debits[i].amount
			debits[i].account.debit(debits[i].amount)
		}
		let credit_total = 0
		for (let i=0; i<credits.length; i++) {
			credit_total += credits[i].amount
			credits[i].account.credit(credits[i].amount)
		}
		if (debit_total != credit_total) throw new Error(`Debits (${debit_total}) != Credits (${credit_total})`)
	}
}
