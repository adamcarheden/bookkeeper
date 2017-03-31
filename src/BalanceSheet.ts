import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import { AccountSnapshot, formatSnapshots, snapshotAccount, snapshotBalance } from './Report'

export default class BalanceSheet {

	public readonly assets: AccountSnapshot
	public readonly liabilities: AccountSnapshot
	public readonly equity: AccountSnapshot
	public readonly netWorth: number

	constructor(coa: ChartOfAccounts) {
		this.assets = snapshotAccount(coa.assets)
		this.liabilities = snapshotAccount(coa.liabilities)
		this.equity = snapshotAccount(coa.equity)
		this.netWorth = this.assets.balance - this.liabilities.balance
	}
	public toString() {
		let report = formatSnapshots({
			assets: [this.assets],
			equity: [this.equity],
			liabilities: [this.liabilities],
			netWorth: [snapshotBalance('Net Worth', this.netWorth)],
		})
		return `${report.assets.join('\n')}
${report.liabilities.join('\n')}
${report.netWorth.join('\n')}
${report.equity.join('\n')}
`
	}
}
