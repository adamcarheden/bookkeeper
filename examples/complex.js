var BookKeeper = require('./BookKeeper').default

var coa = new BookKeeper.ChartOfAccounts()


// Equity
var ownersEquity = coa.equity.subAccount('Owner\'s Equity')
var retainedEarnings = coa.equity.subAccount('Retained Earnings')
// Create a contra account
var draw = coa.equity.subAccount('Owner\'s Draw',BookKeeper.ACCOUNT_TYPE.DEBIT_NORMAL)
// Assets
var cash = coa.assets.subAccount('Cash')
var materials = coa.assets.subAccount('Inventory of Materials')
var widgets = coa.assets.subAccount('Inventory of Widgets')
var ar = coa.assets.subAccount('Acconts Receivable')
// Liabilities
var ap = coa.liabilities.subAccount('Accounts Payable')
var loan = coa.liabilities.subAccount('Bank Loan (60 mo @ 6.5%)')
// Income
var cashRevenue = coa.income.subAccount('Revenue - Cash')
var creditRevenue = coa.income.subAccount('Revenue - Credit')
var incomeSummary = coa.income.subAccount('Income Summary')
// Expenses
var rent = coa.expenses.subAccount('Rent')
var materialCost = coa.expenses.subAccount('Cost of Materials')
var interest = coa.expenses.subAccount('Interest Expense')

// Open the business
var p0 = new BookKeeper.Period('0', coa)
p0.journalEntry('Owner\'s Starting Capital', 10000, cash, ownersEquity)
p0.journalEntry('Owner\'s Starting Capital', 20000, cash, loan)
console.log('-= Opening Balance =-\n'+p0.balanceSheet.toString()+'\n')
/*
-= Opening Balance =-
Assets          $30,000.00
Liabilities     $20,000.00
Net Worth       $10,000.00
Equity          $10,000.00
*/

var p1 = new BookKeeper.Period('1', coa)
// Make something
p1.journalEntry('Buy materials on credit', 5000, materials, ap)
p1.journalEntry('Make widgets', 4000, materialCost, widgets)
// Sell something
p1.journalEntry('Cash sale', 1200, cash, cashRevenue)
p1.journalEntry('Credit sale', 3800, ar, creditRevenue)
// Pay bills
p1.journalEntry('Pay first Month\'s rent', 1500, rent, cash)
p1.compoundJournalEntry('Loan Payment',
	// Debits
	[
		{amount: 282.99, account: loan},
		{amount: 108.33, account: interest}
	],
	// Credits
	[{amount: 391.32, account: cash}]
)
p1.journalEntry('Bill Payment', 4000, ap, cash)

// Close the books
p1.close(function() {
	p1.compoundJournalEntry('Summarize Income',
		[
			{amount: cashRevenue.balance, account: cashRevenue},
			{amount: creditRevenue.balance, account: creditRevenue}
		],
		[{amount: cashRevenue.balance+creditRevenue.balance, account: incomeSummary}]
	)
	p1.compoundJournalEntry('Summarize Expenses',
		[{amount: rent.balance+materialCost.balance+interest.balance, account: incomeSummary}],
		[
			{amount: rent.balance, account: rent },
			{amount: materialCost.balance, account: materialCost},
			{amount: interest.balance, account: interest},
		]
	)
	if (incomeSummary.balance > 0) {
		let dividend = Math.round(incomeSummary.balance / 2)
		p1.compoundJournalEntry('Retain half of earnings',
			[{amount: incomeSummary.balance, account: incomeSummary}],
			[
				{amount: incomeSummary.balance - dividend, account: retainedEarnings},
				{amount: dividend, account: draw},
			]
		)
	} else if (incomeSummary.balance < 0) {
		p1.journalEntry('Loss', -incomeSummary.balance, ownersEquity, incomeSummary)
	}
})
console.log('-= Results of first month of operation =-')
console.log('Income Statement:\n'+p1.incomeStatement+'\n')
console.log('Balance Sheet:\n'+p1.balanceSheet)
/*
-= Results of first month of operation =-
Income Statement:
Income          $5,000.00
Expenses        $5,608.33
Profit/(Loss)   ($608.33)

Balance Sheet:
Assets          $30,108.68
Liabilities     $20,717.01
Net Worth       $ 9,391.67
Equity          $ 9,391.67
*/








