import Account from './Account'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import SubAccount from './SubAccount'

export default class SummaryAccount extends Account {

	public readonly subAccounts: Account[]

	constructor(readonly name: string, readonly defaultSubAccountType: ACCOUNT_TYPE, subAccounts: Account[] = []) {
		super(name, defaultSubAccountType)
		this.subAccounts = subAccounts
	}
	get debits(): number[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.debits)
		}, [])
	}
	get credits(): number[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.credits)
		}, [])
	}
	get balance(): number {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + ((subAcct instanceof SubAccount && subAcct.accountType !== this.accountType) ? -subAcct.balance : subAcct.balance)
		}, 0)
	}
	public subAccount(name: string, isSummary: boolean = false, accountType: ACCOUNT_TYPE = this.accountType) {
		let sub
		if (isSummary) {
			sub = new SummaryAccount(name, accountType)
		} else {
			sub = new SubAccount(name, accountType)
		}
		this.subAccounts.push(sub)
		return sub
	}
	public eachAccount(fun: (acct: Account) => any) {
		for (let acct of this.subAccounts) {
			if (acct instanceof SummaryAccount) {
				let sa = acct as SummaryAccount
				sa.eachAccount(fun)
			} else {
				fun(acct)
			}
		}
	}
}
