var BookKeeper = require('./BookKeeper').default

var coa = new BookKeeper.ChartOfAccounts()

// http://accountinginfo.com/study/inventory/inventory-110.htm

// Equity
var ownersEquity = coa.equity.subAccount('Owner\'s Equity')
var retainedEarnings = coa.equity.subAccount('Retained Earnings')
var draw = coa.contraEquity.subAccount('Owner\'s Draw')
// Assets
var cash = coa.assets.subAccount('Cash')
var inventory = coa.assets.subAccount('Inventory of Widgets')
var ar = coa.assets.subAccount('Acconts Receivable')
// Liabilities
var ap = coa.liabilities.subAccount('Accounts Payable')
let loan = {
	amount: 20000,
	apr: 0.065,
	payments: 5 * 12,
}
var loanPayable = coa.liabilities.subAccount(`Bank Loan (${loan.payments} months @ ${(loan.apr * 100).toFixed(1)}%)`)
// Income
var sales = coa.income.subAccount('Sales')
var incomeSummary = coa.income.subAccount('Income Summary')
// Expenses
var rent = coa.expenses.subAccount('Rent')
var interest = coa.expenses.subAccount('Interest Expense')
var cogs = coa.expenses.subAccount('Cost of Goods Sold')

// Open the business
var p0 = new BookKeeper.Period('0', coa)
p0.journalEntry('Owner\'s Starting Capital', 10000, cash, ownersEquity)
p0.journalEntry('Bank Loan', loan.amount, cash, loanPayable)
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
p1.journalEntry('Buy widgets', 8000, inventory, ap)
// Sell something
let profitMargin = 0.3
let sale = 7000
let merch = sale * (1-profitMargin)
p1.compoundJournalEntry('Credit Sale', 
	[
		{amount: sale, account: ar},
		{amount: merch, account: cogs },
	],
	[
		{amount: sale, account: sales },
		{amount: merch, account: inventory },
	],
)
sale = 3000
merch = sale * (1-profitMargin)
p1.compoundJournalEntry('Cash Sale', 
	[
		{amount: sale, account: cash},
		{amount: merch, account: cogs },
	],
	[
		{amount: sale, account: sales },
		{amount: merch, account: inventory },
	],
)
// Pay bills
p1.journalEntry('Pay first Month\'s rent', 1500, rent, cash)
// http://homeguides.sfgate.com/calculate-principal-interest-mortgage-2409.html
let pInt = loan.apr / 12
let payment = Math.round(100 * loan.amount * pInt*Math.pow(1+pInt,loan.payments)/(Math.pow(1+pInt,loan.payments)-1)) / 100
let intr = Math.round(100 * loanPayable.balance * pInt) / 100
let principal = Math.round(100 * (payment - intr)) / 100
p1.compoundJournalEntry('Loan Payment',
	// Debits
	[
		{amount: principal, account: loanPayable},
		{amount: intr, account: interest}
	],
	// Credits
	[{amount: payment, account: cash}]
)
p1.journalEntry('Bill Payment', ap.balance, ap, cash)
// Take some profits
p1.journalEntry('Withdrawl profit', 1000, draw, cash)

// Close the books
var close = function() {
	if (cash.balance < 0) throw new Error(`You're bankrupt`)
	p1.journalEntry('Close: Summarize Income', sales.balance, sales, incomeSummary)
	p1.compoundJournalEntry('Close: Summarize Expenses',
		[{amount: rent.balance+interest.balance+cogs.balance, account: incomeSummary}],
		[
			{amount: rent.balance, account: rent },
			{amount: interest.balance, account: interest},
			{amount: cogs.balance, account: cogs},
		]
	)
	if (incomeSummary.balance > 0) { // Profit!
		p1.journalEntry('Close: Retain earnings', incomeSummary.balance, incomeSummary, retainedEarnings)
	} else if (incomeSummary.balance < 0) { // Loss :(
		p1.journalEntry('Close: Withdrawl loss from equity', -incomeSummary.balance, retainedEarnings, incomeSummary)
	}

	if (draw.balance > coa.equity.balance) throw new Error(`Company policy doesn't allow you to take a loan from the business.`)
	p1.journalEntry(`Close: Owner's Draw`, draw.balance, retainedEarnings, draw)

}
p1.close(close)
console.log('-= Results of first month of operation =-')
console.log('Income Statement:\n'+p1.incomeStatement+'\n')
/*
-= Results of first month of operation =-
Income Statement:
Income          $ 10,000.00 
Expenses        $  8,608.33 
Profit/(Loss)   $  1,391.67 
Profits Taken   $  1,000.00 
*/
console.log('Balance Sheet:\n'+p1.balanceSheet+'\n')
/*
Balance Sheet:
Assets          $ 30,108.68 
Liabilities     $ 19,717.01 
Net Worth       $ 10,391.67 
Equity          $ 10,391.67
*/
console.log(`-= General Ledger =-\n${coa}`)
/*
-= General Ledger =-
GeneralLedger                   $ 60,217.36 
  Assets                        $ 30,108.68 
    Cash                        $ 22,108.68 
    Inventory of Widgets        $  1,000.00 
    Acconts Receivable          $  7,000.00 
  Liabilities                   $ 19,717.01 
    Accounts Payable            $      0.00 
    Bank Loan (60 mo @ 6.5%)    $ 19,717.01 
  Income                        $      0.00 
    Sales                       $      0.00 
    Income Summary              $      0.00 
  Expenses                      $      0.00 
    Rent                        $      0.00 
    Interest Expense            $      0.00 
    Cost of Goods Sold          $      0.00 
  Equity                        $ 10,391.67 
    Owner's Equity              $ 10,000.00 
    Retained Earnings           $    391.67 
  Contra Equity                 $      0.00 
    Owner's Draw                $      0.00
*/
