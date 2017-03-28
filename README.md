# BookKeeper

BookKeeper is a low-level library you can use to implement more complicated double-entry accounting applications. It has a very basic chart of accounts and facilities for making journal entries, closing accounting periods and generating data structures suitable for creating an income statement and balance sheet. It's up to you to define a more compliex chart of accounts and implement the flows of money through the system.

## Blackground
You should have a basic knowledge of accounting to use BookKeeper. If you don't, start with the great [Accounting for Developers](http://subledger.com/how-to/) tutorials from the good folks at [subledger.com](http://subledger.com).

## Suitability
Don't use BookKeeper to manage real money. It's not thorougly tested and I'm not an accountant. If you're managing real money, try [SubLedger](http://subledger.com/).

*Note: I have no relationship with subledger at all. I just really like their tutorial.*

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
var period = new BookKeeper.Period('2017', coa)

var cash = coa.assets.subAccount('Cash')
var sales = coa.income.subAccount('Sales')
var supplies = coa.expenses.subAccount('supplies')
var incomeSummary = coa.income.subAccount('Income Summary')
var retainedEarnings = coa.equity.subAccount('Retained Earnings')

period.journalEntry(
	'Made a sale', 
	100.00,     // The amount
	cash,       // The account to debit
	sales,      // The account to credit
)

period.journalEntry(
	'Bought supplies', 
	50.00,        // The amount
	supplies,     // The account to debit
	cash          // The account to credit
)

console.log(`-= Chart Of Accounts (Before close) =-\n${coa}\n`)
/*
-= Chart Of Accounts (Before close) =-
GeneralLedger         $ 200.00 
  Assets              $  50.00 
    Cash              $  50.00 
  Liabilities         $   0.00 
  Equity              $   0.00 
    Retained Earnings $   0.00 
  Income              $ 100.00 
    Sales             $ 100.00 
    Income Summary    $   0.00 
  Expenses            $  50.00 
    supplies          $  50.00 
  Changes to Equity   $   0.0
*/
console.log(`-= General Ledger (Before close) =-\n${period}\n`)
/*
-= General Ledger (Before close) =-
              Debits     Credits  Account
Made a sale
             $100.00              Cash
                         $100.00  Sales

Bought supplies
              $50.00              supplies
                          $50.00  Cash
*/
period.close(() => {
	period.journalEntry(
		'Close sales',
		sales.balance, // The amount
		sales,         // The account to debit
		incomeSummary, // The account to credit
	)
	period.journalEntry(
		'Close supplies',
		supplies.balance, // The amount
		incomeSummary,    // The account to debit
		supplies          // The account to credit
	)
	period.journalEntry(
		'Close income summary',
		incomeSummary.balance, // The amount
		incomeSummary,         // The account to debit
		retainedEarnings,      // The account to credit
	)
})
console.log(`-= Income Statement =-\n${period.incomeStatement}`)
/*
-= Income Statement =-
Income            $ 100.00 
  Sales           $ 100.00 
  Income Summary  $   0.00 
Expenses          $  50.00 
  supplies        $  50.00 
Profit/(Loss):    $  50.00 
Changes to Equity $   0.00
*/
console.log(`-= Balance Sheet =-\n${period.balanceSheet}`)
/*
-= Balance Sheet =-
Assets              $ 50.00 
  Cash              $ 50.00 
Liabilities         $  0.00 
Net Worth           $ 50.00 
Equity              $ 50.00 
  Retained Earnings $ 50.00
*/
console.log(`-= Chart Of Accounts (After close) =-\n${coa}\n`)
/*
-= Chart Of Accounts (After close) =-
GeneralLedger         $ 100.00 
  Assets              $  50.00 
    Cash              $  50.00 
  Liabilities         $   0.00 
  Equity              $  50.00 
    Retained Earnings $  50.00 
  Income              $   0.00 
    Sales             $   0.00 
    Income Summary    $   0.00 
  Expenses            $   0.00 
    supplies          $   0.00 
  Changes to Equity   $   0.00
*/
console.log(`-= General Ledger (After close) =-\n${period}`)
/*
-= General Ledger (After close) =-
              Debits     Credits  Account
Made a sale
             $100.00              Cash
                         $100.00  Sales

Bought supplies
              $50.00              supplies
                          $50.00  Cash

Close sales
             $100.00              Sales
                         $100.00  Income Summary

Close supplies
              $50.00              Income Summary
                          $50.00  supplies

Close income summary
              $50.00              Income Summary
                          $50.00  Retained Earnings
*/
// For programmers thinking thinking "for a simple example, this ain't so simple",
// don't blame me, I didn't invent accounting.
// For accountants thinking "No, no that's all wrong", stop being pedantic.
// Accounting need not be that complicated.
```

### Complex example
_*complex.js*_
```javascript
var BookKeeper = require('./BookKeeper').default

var coa = new BookKeeper.ChartOfAccounts()

// http://accountinginfo.com/study/inventory/inventory-110.htm

// Equity
var ownersEquity = coa.equity.subAccount('Owner\'s Equity')
var retainedEarnings = coa.equity.subAccount('Retained Earnings')
var draw = coa.changesToEquity.subAccount('Owner\'s Draw')
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
var p0 = new BookKeeper.Period(
	'0',          // An arbitrary name for the period. BookKeeper itself doesn't use this at present
	coa, () => {} // A function to close the period. (optional). It's called automatically if you access the income statement or balance sheet.
)
p0.journalEntry('Owner\'s Starting Capital', 10000, cash, ownersEquity)
p0.journalEntry('Bank Loan', loan.amount, cash, loanPayable)
console.log('-= Opening Balance =-\n'+p0.balanceSheet.toString()+'\n')
/*
-= Opening Balance =-
Assets                         $ 30,000.00 
  Cash                         $ 30,000.00 
  Inventory of Widgets         $      0.00 
  Acconts Receivable           $      0.00 
Liabilities                    $ 20,000.00 
  Accounts Payable             $      0.00 
  Bank Loan (60 months @ 6.5%) $ 20,000.00 
Net Worth                      $ 10,000.00 
Equity                         $ 10,000.00 
  Owner's Equity               $ 10,000.00 
  Retained Earnings            $      0.00 
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
console.log('=-=-=-=-= Results of first month of operation =-=-=-=-=')
console.log('-= Income Statement =-\n'+p1.incomeStatement+'')
/*
-= Income Statement =-
Income               $ 10,000.00 
  Sales              $ 10,000.00 
  Income Summary     $      0.00 
Expenses             $  8,608.33 
  Rent               $  1,500.00 
  Interest Expense   $    108.33 
  Cost of Goods Sold $  7,000.00 
Profit/(Loss):       $  1,391.67 
Changes to Equity    $  1,000.00 
  Owner's Draw       $  1,000.00
*/
console.log('-= Balance Sheet =-\n'+p1.balanceSheet+'')
/*
-= Balance Sheet =-
Assets                         $ 30,108.68 
  Cash                         $ 22,108.68 
  Inventory of Widgets         $  1,000.00 
  Acconts Receivable           $  7,000.00 
Liabilities                    $ 19,717.01 
  Accounts Payable             $      0.00 
  Bank Loan (60 months @ 6.5%) $ 19,717.01 
Net Worth                      $ 10,391.67 
Equity                         $ 10,391.67 
  Owner's Equity               $ 10,000.00 
  Retained Earnings            $    391.67
*/
console.log(`-= General Ledger =-\n${coa}`)
/*
GeneralLedger                    $ 60,217.36 
  Assets                         $ 30,108.68 
    Cash                         $ 22,108.68 
    Inventory of Widgets         $  1,000.00 
    Acconts Receivable           $  7,000.00 
  Liabilities                    $ 19,717.01 
    Accounts Payable             $      0.00 
    Bank Loan (60 months @ 6.5%) $ 19,717.01 
  Equity                         $ 10,391.67 
    Owner's Equity               $ 10,000.00 
    Retained Earnings            $    391.67 
  Income                         $      0.00 
    Sales                        $      0.00 
    Income Summary               $      0.00 
  Expenses                       $      0.00 
    Rent                         $      0.00 
    Interest Expense             $      0.00 
    Cost of Goods Sold           $      0.00 
  Changes to Equity              $      0.00 
    Owner's Draw                 $      0.00
*/
```

## Chart of Accounts
The BookKeeper ChartOfAccounts object contains the following accounts by default:

|Name            |Normal Balance|
|----------------|--------------|
|assets          |Debit         |
|liabilities     |Credit        |
|equity          |Credit        |
|income          |Credit        |
|expenses        |Debit         |
|changesToEquity |Debit         |

Assets, liabilities and equity end up on the balance sheet. Income, expenses and changes equity (investments and withdrawl of profits) end up on the income statement.

## Period End
Prior to generating a period's financial statements you must close that period. Closing a period means:
1. All temporary accounts (income, expenses and changes to equity) must have a zero balance. This usually means a journal entry to transfer the balance to a balance sheet account.
2. No additional journal entries may be made for that period.

You need not provide a closing function. Bookkeeper has a built-in one that does the right thing with it's default accounts. However, the whole point of accounting is a more granular tracking of how money flows through your business so you probably want to provide your own closing function that meets your reporting needs.

## Roadmap
Bookkeepr does what I want it to, so I have no plans to develop it further in the near future. It could use dates in the journal entries that auto-map to some predefined periods though. A more thorough unit testing regime would also probably be a good idea. PRs welcome.

## Current State

Alpha. It seems to work but has somewhat sparse unit testing. Also, I'm not an accountant, so "seems to work" for me is not necessarily GAAP compliant.

## Contributing
``` bash
git clone https://github.com/adamcarheden/bookkeeper.git
cd bookkeeper
npm install
npm run build
npm run test
npm run examples
```
PRs welcome.
