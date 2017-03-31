import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import { AccountSnapshot, formatSnapshots, snapshotAccount, snapshotBalance } from './Report'

export default class IncomeStatement {

	public readonly income: AccountSnapshot
	public readonly expenses: AccountSnapshot
	public readonly changesToEquity: AccountSnapshot
	public readonly netIncome: number

	constructor(coa: ChartOfAccounts) {
		this.income = snapshotAccount(coa.income)
		this.expenses = snapshotAccount(coa.expenses)
		this.changesToEquity = snapshotAccount(coa.changesToEquity)
		this.netIncome = this.income.balance - this.expenses.balance
	}
	public toString() {
		let report = formatSnapshots({
			changesToEquity: [this.changesToEquity],
			expenses: [this.expenses],
			income: [this.income],
			pnl: [snapshotBalance('Profit/(Loss):', this.netIncome)],
		})
		return `${report.income.join('\n')}
${report.expenses.join('\n')}
${report.pnl.join('\n')}
${report.changesToEquity.join('\n')}
`
	}
}
