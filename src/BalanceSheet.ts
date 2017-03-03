import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'

export default class BalanceSheet {

	readonly subAccounts: any = {}
	private _netWorth: number = 0

	constructor(coa: ChartOfAccounts) {
		let bsaccts = [coa.assets, coa.liabilities, coa.equity]
		for (let i in bsaccts) {
			let acct = bsaccts[i]
			this.subAccounts[bsaccts[i].name] = bsaccts[i].statement
		}
		this._netWorth = this.subAccounts[coa.assets.name].balance - this.subAccounts[coa.liabilities.name].balance
	}
	get netWorth() { return this._netWorth }
	get balance() { return this._netWorth }
}
