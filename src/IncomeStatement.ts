import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import { AccountSnapshot, snapshotAccount, formatSnapshots } from './Report'

export default class IncomeStatement {

	readonly income: AccountSnapshot
	readonly expenses: AccountSnapshot 
	readonly contraEquity: AccountSnapshot
	readonly netIncome: number

	constructor(coa: ChartOfAccounts) {
		this.income = snapshotAccount(coa.income)
		this.expenses = snapshotAccount(coa.expenses)
		this.contraEquity = snapshotAccount(coa.contraEquity)
		this.netIncome = this.income.balance - this.expenses.balance
	}
	toString() {
		let report = formatSnapshots({
			income: [this.income],
			expenses: [this.expenses],
			contraEquity: [this.contraEquity],
		})
		return `Income:
${report.income.join('\n')}
Expenses:
${report.expenses.join('\n')}
Profit/(Loss): $${this.netIncome}
Payments to/from Owners:
${report.contraEquity.join('\n')}
`
	}
}
