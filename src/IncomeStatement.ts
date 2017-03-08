import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import Report from './Report'

export default class IncomeStatement extends Report {

	private _netIncome: number = 0

	constructor(coa: ChartOfAccounts) {
		super(coa.income.balance - coa.expenses.balance, [coa.income, coa.expenses])
	}
	get netIncome() { return this.balance }
	toString() {
		return this.print('Profit/(Loss)')
	}
}
