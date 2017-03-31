import Account from './Account'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import AccountEntry from './AccountEntry'

export default class SubAccount extends Account {

	public readonly debits: number[] = []
	public readonly credits: number[] = []
	private debitTotal: number = 0
	private creditTotal: number = 0
	private cachedBalance: number = 0

	public debit(amount: number) {
		this.debits.push(amount)
		this.debitTotal += amount
		this.cachedBalance += (this.accountType === ACCOUNT_TYPE.DEBIT_NORMAL) ? amount : -amount
	}
	public credit(amount: number) {
		this.credits.push(amount)
		this.creditTotal += amount
		this.cachedBalance += (this.accountType === ACCOUNT_TYPE.CREDIT_NORMAL) ? amount : -amount
	}
	get balance() {
		return this.cachedBalance
	}
}
