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
