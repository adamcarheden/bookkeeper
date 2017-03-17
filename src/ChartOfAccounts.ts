import Account from './Account'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import Period from './Period'
export default class ChartOfAccounts {

	readonly generalLedger: Account
	readonly assets:        Account
	readonly liabilities:   Account
	readonly income:        Account
	readonly expenses:      Account
	readonly equity:        Account
	readonly contraEquity:  Account

	constructor() { 
		this.generalLedger = new Account('GeneralLedger', ACCOUNT_TYPE.DEBIT_NORMAL)
		// https://en.wikipedia.org/wiki/Normal_balance
		this.assets       = this.generalLedger.subAccount('Assets',        ACCOUNT_TYPE.DEBIT_NORMAL)
		this.liabilities  = this.generalLedger.subAccount('Liabilities',   ACCOUNT_TYPE.CREDIT_NORMAL)
		this.equity       = this.generalLedger.subAccount('Equity',        ACCOUNT_TYPE.CREDIT_NORMAL)
		this.income       = this.generalLedger.subAccount('Income',        ACCOUNT_TYPE.CREDIT_NORMAL)
		this.expenses     = this.generalLedger.subAccount('Expenses',      ACCOUNT_TYPE.DEBIT_NORMAL)
		this.contraEquity = this.generalLedger.subAccount('Contra Equity', ACCOUNT_TYPE.DEBIT_NORMAL)
	}

	toString() {
		return this.generalLedger.print('')
	}

}
