export default class Account {
	constructor(name) {
		if (new.target === Account) throw new Error('Account is abstract. You may not use it directly. Please subclass and implement the balance() method instead.')
		//if (typeof this.balance !== 'function') throw new Error(`this.balance is a ${typeof this.balance}. You have not implemented the balance() method. Please do so by subclassing Account().`)

		this.name = name
		this.debits = []
		this.debit_total = 0
		this.credits = []
		this.credit_total = 0
	}
	debit(je) {
		this.debits.push(je)
		this.debit_total += je.amount
	}
	credit(je) {
		this.credits.push(je)
		this.credit_total += je.amount
	}
}
