import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import { AccountSnapshot, snapshotAccount, snapshotBalance, formatSnapshots } from './Report'

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
			netWorth: [snapshotBalance('Net Worth', this.netWorth)],
			equity: [this.equity],
		})
		return `${report.assets.join('\n')}
${report.liabilities.join('\n')}
${report.netWorth.join('\n')}
${report.equity.join('\n')}
`
	}
}
