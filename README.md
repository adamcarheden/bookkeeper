# BookKeeper

BookKeeper is a low-level library you can use to implement more complicated double-entry accounting applications. It has a very basic chart of accounts and facilities for making journal entries, closing accounting periods and generating an income statement and balance sheet. It's up to you to define a more compliex chart of accounts and implement the flows of money through the system.

## Blackground
You should have a basic knowledge of accounting to use BookKeeper. If you don't, start with the great [Accounting for Developers](http://subledger.com/how-to/) tutorials from the good folks at [subledger.com](http://subledger.com). *Note: I have no relationship with subledger at all. I just really like their tutorial.*

## Suitability
Don't use BookKeeper to manage real money. It's not thorougly tested and I'm not an accountant. If you're managing real money, try [SubLedger](http://subledger.com/).

## Live Demo
(Comming soon)


## Install
```bash
npm install bookkeeper --save-dev
```
or
```bash
git clone https://github.com/adamcarheden/bookkeeper.git
```

## Usage

### Basic
_*basic.js*_
```javascript
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

period.journalEntry(
	'Supplies', 
	50.00,     // The amount
	coa.expenses, // The account to debit
	coa.assets  // The account to credit
)

console.log(`-= Chart Of Accounts (Before close) =-\n${coa}\n`)
/*
-= Chart Of Accounts (Before close) =-
GeneralLedger   $200.00
  Assets        $ 50.00
  Liabilities   $  0.00
  Equity        $  0.00
  Income        $100.00
  Expenses      $ 50.00
*/
console.log(`-= General Ledger (Before close) =-\n${period}\n`)
/*
-= General Ledger (Before close) =-
              Debits     Credits  Account
Sale
             $100.00              Assets
                         $100.00  Income

Supplies
              $50.00              Expenses
                          $50.00  Assets
*/
console.log(`-= Income Statement =-\n${period.incomeStatement}\n`)
/*
-= Income Statement =-
Income          $100.00
Expenses        $ 50.00
Profit/(Loss)   $ 50.00
*/
console.log(`-= Balance Sheet =-\n${period.balanceSheet}\n`)
/*
-= Balance Sheet =-
Assets          $50.00
Liabilities     $ 0.00
Net Worth       $50.00
Equity          $50.00
*/
console.log(`-= Chart Of Accounts (After close) =-\n${coa}\n`)
/*
-= Chart Of Accounts (After close) =-
GeneralLedger   $100.00
  Assets        $ 50.00
  Liabilities   $  0.00
  Equity        $ 50.00
  Income        $  0.00
  Expenses      $  0.00
*/
console.log(`-= General Ledger (After close) =-\n${period}\n`)
/*
-= General Ledger (After close) =-
              Debits     Credits  Account
Sale
             $100.00              Assets
                         $100.00  Income

Supplies
              $50.00              Expenses
                          $50.00  Assets

Close Period
             $100.00              Income
                          $50.00  Expenses
                          $50.00  Equity
*/
```

### Complete example
_*complex.js*_
```javascript
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








```

### Custom Chart of Acounts
**TO BE WRITTE**

## Chart of Accounts
The BookKeeper ChartOfAccounts object contains the following accounts:

|Name       |Normal Balance|
|-----------|--------------|
|assets     |Debit         |
|liabilities|Credit        |
|equity     |Credit        |
|income     |Credit        |
|expenses   |Debit         |

Assets, liabilities and equity end up on the balance sheet. Income and expenses end up on the income statement and should be zeroed out to balance sheet accounts at close.

## Roadmap
It does what I want it to, so I have no plans to develop it further. It could use dates in the journal entries that auto-map to some predefined periods though. A more thorough unit testing regime would also probably be a good idea.

## Current State

Alpha. It seems to work but has somewhat sparse unit testing.

## Contributing
``` bash
git clone https://github.com/adamcarheden/bookkeeper.git
cd bookkeeper
npm run build
npm run examples
npm run test
```
PRs welcome.
