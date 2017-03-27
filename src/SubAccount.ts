import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import Account from './Account'
import AccountEntry from './AccountEntry'

export default class SubAccount extends Account {

	private _debits: number[] = []
	private _debit_total: number = 0
	private _credits: number[] = []
	private _credit_total: number = 0
	private _balance: number = 0

	debit(amount: number) {
		this._debits.push(amount)
		this._debit_total += amount
		this._balance += (this.accountType === ACCOUNT_TYPE.DEBIT_NORMAL) ? amount : -amount
	}
	get debits() : number[] {
		return this._debits
	}
	credit(amount: number) {
		this._credits.push(amount)
		this._credit_total += amount
		this._balance += (this.accountType === ACCOUNT_TYPE.CREDIT_NORMAL) ? amount : -amount
	}
	get credits() : number[] {
		return this._credits
	}
	get balance() : number { return this._balance }
}
