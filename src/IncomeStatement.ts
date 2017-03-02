import Account from './Account'
import CreditAccount from './CreditAccount'
import DebitAccount from './DebitAccount'

declare var cl: any
export default class IncomeStatement {

	income: any = {}
	incomeTotal: number = 0
	expenses: any = {}
	expensesTotal:number = 0
	netIncome: number = 0

	constructor(isaccts: Account[]) {
		for (let i in isaccts) {
			let acct = isaccts[i]
			if (acct instanceof CreditAccount) {
				this.income[acct.name] = acct.balance
				this.incomeTotal += acct.balance
			} else if (acct instanceof DebitAccount) {
				this.expenses[acct.name] = acct.balance
				this.expensesTotal += acct.balance
			} else {
				cl = acct.constructor
				throw new Error(`Unknown account type: ${cl.name}`)
			}
		}	
		this.netIncome = this.incomeTotal - this.expensesTotal
	}

}
