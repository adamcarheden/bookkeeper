import ChartOfAccounts from './ChartOfAccounts'
import JournalEntry from './JournalEntry'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'

export default class Account {

	private _debits: JournalEntry[] = []
	private _debit_total: number = 0
	private _credits: JournalEntry[] = []
	private _credit_total: number = 0
	readonly subAccounts: Account[] = []

	constructor(readonly name: string, readonly accountType : ACCOUNT_TYPE) {}

	debit(je: JournalEntry) {
		this.debits.push(je)
		this._debit_total += je.amount
	}
	get debit_total() {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + subAcct._debit_total
		}, this._debit_total)
	}
	get debits() : JournalEntry[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.debits)
		}, [])
	//	}, this._debits)
	}
	credit(je: JournalEntry) {
		this.credits.push(je)
		this._credit_total += je.amount
	}
	get credits() : JournalEntry[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.credits)
		}, this._credits)
	}
	get credit_total() {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + subAcct._credit_total
		}, this._credit_total)
	}
	subAccount(name: string, acctType: ACCOUNT_TYPE) {
		let sub = new Account(name, acctType)
		this.subAccounts.push(sub)
		return sub
	}
	private _balance() {
		let bal
		switch (this.accountType) {
			case ACCOUNT_TYPE.CREDIT_NORMAL:
				bal = this._credit_total - this._debit_total
				break;
			case ACCOUNT_TYPE.DEBIT_NORMAL:
				bal = this._debit_total - this._credit_total
				break;
			default:
				throw new Error(`Unknown account type: ${this.accountType}`)
		}
		return bal
	}
	get balance() : number {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + subAcct.balance
		}, this._balance())
	}
	get statement() : any {
		let stmt : any = {
			balance: this._balance(),
			subAccounts: {}
		}
		for (let i=0; i<this.subAccounts.length; i++) {
			stmt.subAccounts[this.subAccounts[i].name] = this.subAccounts[i].statement
			stmt.balance += stmt.subAccounts[this.subAccounts[i].name].balance
		}
		return stmt
	}

}
