import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import Account from './Account'
import SubAccount from './SubAccount'

export default class SummaryAccount extends Account {

	readonly subAccounts: Account[]

	constructor(readonly name: string, readonly defaultSubAccountType: ACCOUNT_TYPE, subAccounts: Account[] = []) {
		super(name, defaultSubAccountType)
		this.subAccounts = subAccounts
	}
	get debits() : number[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.debits)
		}, [])
	}
	get credits() : number[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.credits)
		}, [])
	}
	get balance() : number {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + ((subAcct instanceof SubAccount && subAcct.accountType !== this.accountType) ? -subAcct.balance : subAcct.balance)
		}, 0)
	}
	subAccount(name: string, accountType: ACCOUNT_TYPE = this.accountType) {
		let sub = new SubAccount(name, accountType)
		this.subAccounts.push(sub)
		return sub
	}
}
