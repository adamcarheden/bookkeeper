import JournalEntry from './JournalEntry'
import Account from './Account'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import Period from './Period'
export default class ChartOfAccounts {

	readonly assets:      Account = new Account('Assets',      ACCOUNT_TYPE.DEBIT_NORMAL)
	readonly liabilities: Account = new Account('Liabilities', ACCOUNT_TYPE.CREDIT_NORMAL)
	readonly income:      Account = new Account('Income',      ACCOUNT_TYPE.CREDIT_NORMAL)
	readonly expenses:    Account = new Account('Expenses',    ACCOUNT_TYPE.DEBIT_NORMAL)
	readonly equity:      Account = new Account('Equity',      ACCOUNT_TYPE.DEBIT_NORMAL)

}
