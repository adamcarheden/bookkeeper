import test from 'tape'
import Path from 'path'
import SummaryAccount from '../BookKeeper/SummaryAccount'
import {snapshotAccount, formatSnapshots} from '../BookKeeper/Report'
import ACCOUNT_TYPE from '../BookKeeper/ACCOUNT_TYPE'
const file = Path.basename(__filename)

test(`SubAccountsByName and subAccounts match (${file})`, (t) => {

	// Create some accounts
	let assets = new SummaryAccount('Assets', ACCOUNT_TYPE.DEBIT_NORMAL)
	let ar = assets.subAccount('Accounts Receivable') // eslint-disable-line no-unused-vars
	let cash = assets.subAccount('Cash') // eslint-disable-line no-unused-vars
	let snap = snapshotAccount(assets)

	t.equal(2, snap.subAccounts.length, `subAccounts has 2 records`)
	t.equal(2, Object.keys(snap.subAccountsByName).length, `subAccountsByName has 2 records`)
	for (let a of snap.subAccounts) {
		t.equal(a, snap.subAccountsByName[a.name],`account '${a.name}' exists in both subAccountsand subAccountsByName`)
	}
	t.end()
})
test(`Formats correctly (${file})`, (t) => {

	// Create some accounts
	let expenses = new SummaryAccount('Expenses', ACCOUNT_TYPE.CREDIT_NORMAL)
	let assets = new SummaryAccount('Assets', ACCOUNT_TYPE.DEBIT_NORMAL)
	let cogs = expenses.subAccount('Cost of Goods Sold')
	let ar = assets.subAccount('Accounts Receivable')
	let cash = assets.subAccount('Cash')
	cogs.credit(1000)
	ar.debit(1000)
	ar.credit(5000) // So we get a negative
	cogs.credit(100)
	cash.debit(100)
	let accts = {assets: [snapshotAccount(assets)], revenue: [snapshotAccount(expenses)]}
	let fmtd = formatSnapshots(accts)

	// Verify returned data structure
	if (typeof fmtd === 'object') {
		t.equal(Object.keys(fmtd).length, Object.keys(accts).length, `formatAccounts returns an object with the same number of keys as the object passed in`)
		Object.keys(accts).forEach((k) => {
			if (k in fmtd) {
				if (Array.isArray(fmtd[k])) {
					for (let i=0; i<fmtd[k].length; i++) {
						t.equal(typeof fmtd[k][i], 'string', `formatAccounts returns a for key '${k}' index '${i}'`)
					}
				} else t.fail(`formatAccounts returns an object with an array for key '${k}'`)
			} else t.fail(`formatAccounts returns an object witk key '${k}'`)
		})
	} else {
		t.fail(`formatAccounts returns an object`)
	}
	let res = '\n'
	Object.keys(fmtd).forEach((k) => {
		res += `${fmtd[k].join('\n')}\n`
	})
	console.log(res)
	t.equal(res,`
Assets                $(3,900.00)
  Accounts Receivable $(4,000.00)
  Cash                $   100.00 
Expenses              $ 1,100.00 
  Cost of Goods Sold  $ 1,100.00 
`,`Accounts properly aligned`)

	t.end()
})
