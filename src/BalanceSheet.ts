import Account from './Account'
import CreditAccount from './CreditAccount'
import DebitAccount from './DebitAccount'

declare var cl: any
export default class BalanceSheet {

	assets: any = {}
	assetsTotal: number = 0
	liabilities: any = {}
	liabilitiesTotal: number = 0
	equity: any = {}
	equityTotal: number = 0
	netWorth: number = 0

	constructor(bsaccts: Account[], eqaccts: Account[]) {

		for (let i in bsaccts) {
			let acct = bsaccts[i]
			if (acct instanceof CreditAccount) {
				this.liabilities[acct.name] = acct.balance
				this.liabilitiesTotal += acct.balance
			} else if (acct instanceof DebitAccount) {
				this.assets[acct.name] = acct.balance
				this.assetsTotal += acct.balance
			} else {
				cl = acct.constructor
				throw new Error(`Unknown account type: ${cl.name}`)
			}
		}
		this.netWorth = this.assetsTotal - this.liabilitiesTotal
		for (let i in eqaccts) {
			let acct = eqaccts[i]
			console.log({i: i, acct: acct})
			if (acct instanceof CreditAccount) {
				this.equity[acct.name] = acct.balance
				this.equityTotal += acct.balance
			} else if (acct instanceof DebitAccount) {
				cl = acct.constructor
				throw new Error(`Equity account ${acct.name} is a ${cl.name}. It should be a credit.`)
			} else {
				cl = acct.constructor
				throw new Error(`Unknown account type: ${cl.name}`)
			}
		}
	}
}
