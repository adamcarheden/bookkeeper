import JournalEntry from './JournalEntry'
abstract class Account {

	name: string
	debits: JournalEntry[] = []
	debit_total: number = 0
	credits: JournalEntry[] = []
	credit_total: number = 0

	constructor(name: string) { this.name = name }
	debit(je: JournalEntry) {
		this.debits.push(je)
		this.debit_total += je.amount
	}
	credit(je: JournalEntry) {
		this.credits.push(je)
		this.credit_total += je.amount
	}
	abstract get balance(): number
}

export default Account
