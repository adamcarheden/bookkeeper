import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import { AccountSnapshot, snapshotAccount, snapshotBalance, formatSnapshots } from './Report'

export default class IncomeStatement {

	readonly income: AccountSnapshot
	readonly expenses: AccountSnapshot 
	readonly changesToEquity: AccountSnapshot
	readonly netIncome: number

	constructor(coa: ChartOfAccounts) {
		this.income = snapshotAccount(coa.income)
		this.expenses = snapshotAccount(coa.expenses)
		this.changesToEquity = snapshotAccount(coa.changesToEquity)
		this.netIncome = this.income.balance - this.expenses.balance
	}
	toString() {
		let report = formatSnapshots({
			income: [this.income],
			expenses: [this.expenses],
			pnl: [snapshotBalance('Profit/(Loss):', this.netIncome)],
			changesToEquity: [this.changesToEquity],
		})
		return `${report.income.join('\n')}
${report.expenses.join('\n')}
${report.pnl.join('\n')}
${report.changesToEquity.join('\n')}
`
	}
}
