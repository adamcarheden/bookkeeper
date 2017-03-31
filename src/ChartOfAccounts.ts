import Account from './Account'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import Period from './Period'
import { formatSnapshots, snapshotAccount } from './Report'
import SummaryAccount from './SummaryAccount'
export default class ChartOfAccounts {

	public readonly assets: SummaryAccount
	public readonly liabilities: SummaryAccount
	public readonly income: SummaryAccount
	public readonly expenses: SummaryAccount
	public readonly equity: SummaryAccount
	public readonly changesToEquity: SummaryAccount
	public readonly generalLedger: SummaryAccount

	constructor() {
		// https://en.wikipedia.org/wiki/Normal_balance
		this.assets       = new SummaryAccount('Assets',        ACCOUNT_TYPE.DEBIT_NORMAL)
		this.liabilities  = new SummaryAccount('Liabilities',   ACCOUNT_TYPE.CREDIT_NORMAL)
		this.equity       = new SummaryAccount('Equity',        ACCOUNT_TYPE.CREDIT_NORMAL)
		this.income       = new SummaryAccount('Income',        ACCOUNT_TYPE.CREDIT_NORMAL)
		this.expenses     = new SummaryAccount('Expenses',      ACCOUNT_TYPE.DEBIT_NORMAL)
		this.changesToEquity = new SummaryAccount('Changes to Equity', ACCOUNT_TYPE.DEBIT_NORMAL)
		this.generalLedger = new SummaryAccount('GeneralLedger', ACCOUNT_TYPE.DEBIT_NORMAL, [
			this.assets,
			this.liabilities,
			this.equity,
			this.income,
			this.expenses,
			this.changesToEquity,
		])
	}

	public toString() {
		let report = formatSnapshots({gl: [snapshotAccount(this.generalLedger)]})
		return report.gl.join(`\n`)
	}

}
