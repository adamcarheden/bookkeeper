import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'

export default class IncomeStatement {

	readonly subAccounts: any = {}
	private _netIncome: number = 0

	constructor(coa: ChartOfAccounts) {
		let isaccts = [coa.income, coa.expenses]
		for (let i in isaccts) {
			let acct = isaccts[i]
			this.subAccounts[isaccts[i].name] = isaccts[i].statement
		}	
		this._netIncome = this.subAccounts[coa.income.name].balance - this.subAccounts[coa.expenses.name].balance
	}
	get netIncome() { return this._netIncome }
	get balance() { return this._netIncome }

}
