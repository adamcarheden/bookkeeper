var BookKeeper = require('./BookKeeper').default

var coa = new BookKeeper.ChartOfAccounts()

// Period (2016 below) is an arbitrary value that you choose
var period = new BookKeeper.Period('2016', coa)

period.journalEntry(
	'Sale', 
	100.00,     // The amount
	coa.assets, // The account to debit
	coa.income  // The account to credit
)

console.log(period.incomeStatement)
console.log(period.balanceSheet)
