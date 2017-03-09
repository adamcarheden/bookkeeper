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
```

### Custom Chart of Acounts

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

## Current State

Alpha. It seems to work but has somewhat sparse unit testing. It's also missing featres like dates -- journal entries fall in a specific period, but don't have a specific date associated with them.

## Contributing
``` bash
git clone https://github.com/adamcarheden/bookkeeper.git
cd bookkeeper
npm run build
npm run test
```
PRs welcome.
