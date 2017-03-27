import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import { AccountSnapshot, snapshotAccount, formatSnapshots } from './Report'

export default class BalanceSheet {

	readonly assets: AccountSnapshot
	readonly liabilities: AccountSnapshot 
	readonly equity: AccountSnapshot
	readonly netWorth: number

	constructor(coa: ChartOfAccounts) {
		this.assets = snapshotAccount(coa.assets)
		this.liabilities = snapshotAccount(coa.liabilities)
		this.equity = snapshotAccount(coa.equity)
		this.netWorth = this.assets.balance - this.liabilities.balance
	}
	toString() {
		let report = formatSnapshots({
			assets: [this.assets],
			liabilities: [this.liabilities],
			equity: [this.equity],
		})
		return `Assets:
${report.assets.join('\n')}
Liabilities:
${report.liabilities.join('\n')}
Net Worth: $${this.netWorth}
Owner's Equity:
${report.equity.join('\n')}
`
	}
}
