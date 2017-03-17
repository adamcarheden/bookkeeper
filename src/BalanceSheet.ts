import Account from './Account'
import ChartOfAccounts from './ChartOfAccounts'
import Report from './Report'

export default class BalanceSheet extends Report {

	private _netWorth: number = 0

	constructor(readonly coa: ChartOfAccounts) {
		super(coa.assets.balance - coa.liabilities.balance, [coa.assets, coa.liabilities], [coa.equity])
	}
	get netWorth() { return this.balance }
	toString() {
		return this.print('Net Worth', 'Equity')
	}
}
