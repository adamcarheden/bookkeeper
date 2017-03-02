import IncomeStatement from './IncomeStatement'
import BalanceSheet from './BalanceSheet'

export default class FinancialStatements {

	constructor(readonly incomeStatement: IncomeStatement, readonly balanceSheet: BalanceSheet) { }

}
