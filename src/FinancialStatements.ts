import IncomeStatement from './IncomeStatement'
import BalanceSheet from './BalanceSheet'

export default class FinancialStatements {

	incomeStatement: IncomeStatement
	balanceSheet: BalanceSheet

	constructor(is: IncomeStatement, bs: BalanceSheet) {
		this.incomeStatement = is
		this.balanceSheet = bs
	}

}
