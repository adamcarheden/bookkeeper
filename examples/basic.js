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
GeneralLedger   $ 200.00 
  Assets        $  50.00 
  Liabilities   $   0.00 
  Equity        $   0.00 
  Income        $ 100.00 
  Expenses      $  50.00 
  Contra Equity $   0.00
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
Income          $ 100.00 
Expenses        $  50.00 
Profit/(Loss)   $  50.00 
Profits Taken   $   0.00
*/
console.log(`-= Balance Sheet =-\n${period.balanceSheet}\n`)
/*
-= Balance Sheet =-
Assets          $ 50.00 
Liabilities     $  0.00 
Net Worth       $ 50.00 
Equity          $ 50.00
*/
console.log(`-= Chart Of Accounts (After close) =-\n${coa}\n`)
/*
-= Chart Of Accounts (After close) =-
GeneralLedger   $ 100.00 
  Assets        $  50.00 
  Liabilities   $   0.00 
  Equity        $  50.00 
  Income        $   0.00 
  Expenses      $   0.00 
  Contra Equity $   0.00
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
