const Path = require('path')
import test from 'tape'
import Account from '../BookKeeper/Account'
import ACCOUNT_TYPE from '../BookKeeper/ACCOUNT_TYPE'
import JournalEntry from '../BookKeeper/JournalEntry'

let fixtures = function() {
	return { 
		to: new Account('to', ACCOUNT_TYPE.DEBIT_NORMAL),
		from: new Account('from', ACCOUNT_TYPE.CREDIT_NORMAL),
		to2: new Account('to2', ACCOUNT_TYPE.DEBIT_NORMAL),
		from2: new Account('from2', ACCOUNT_TYPE.CREDIT_NORMAL),
		to3: new Account('to3', ACCOUNT_TYPE.DEBIT_NORMAL),
		from3: new Account('from3', ACCOUNT_TYPE.CREDIT_NORMAL),
	}
}

test(`Good Journal Entry (${Path.basename(__filename)})`, (t) => {

	let accts = fixtures()
	let amount = 50
	t.doesNotThrow(() => {
		let je = new JournalEntry(
			'test entry',
			[{amount: amount, account: accts.to}], 
			[{amount: amount, account: accts.from}]
		)
		t.equal(je.debits.length, 1, `Has one debit`)
		t.equal(je.debits[0].amount, amount, `Debit amount is ${amount}`)
		t.equal(je.credits.length, 1, `Has one credit`)
		t.equal(je.credits[0].amount, amount, `Credit amount is ${amount}`)
	},`Simple balance journal entry doesn't throw`)
	t.end()
})

test(`Good Complex Journal Entry (${Path.basename(__filename)})`, (t) => {

	let accts = fixtures()
	let d1 = 12
	let d2 = 18
	let c1 = 10
	let c2 = 11
	let c3 = 9
	t.equal(d1+d2,c1+c2+c3,`Test values are balanced`)
	t.doesNotThrow(() => {
		let je = new JournalEntry(
			'test entry',
			[
				{amount: d1, account: accts.to2},
				{amount: d2, account: accts.to3},
			],
			[
				{amount: c1, account: accts.from},
				{amount: c2, account: accts.from2},
				{amount: c3, account: accts.from3},
			]
		)
		t.equal(je.debits.length, 2, `Has two debits`)
		t.equal(je.credits.length, 3, `Has three credits`)
	},`Complex balance journal entry doesn't throw`)
	t.end()
})

test(`Bad Journal Entry (${Path.basename(__filename)})`, (t) => {

	let accts = fixtures()
	let debit = 50
	let credit = debit+10
	t.throws(() => {
		let je = new JournalEntry( // eslint-disable-line no-unused-vars
			'test entry',
			[{amount: debit, account: accts.to}], 
			[{amount: credit, account: accts.from}]
		)
	},new RegExp(`^Error: Debits (.*) != Credits (.*)$`),`Simple unbalanced journal entries throw an exception`)
	t.end()
})

test(`Bad Complex Journal Entry (${Path.basename(__filename)})`, (t) => {

	let accts = fixtures()
	let d1 = 12
	let d2 = 18
	let c1 = 25
	let c2 = 13
	let c3 = 1
	t.notEqual(d1+d2,c1+c2+c3,`Test values aren't balanced`)
	t.throws(() => {
		let je = new JournalEntry( // eslint-disable-line no-unused-vars
			'test entry',
			[
				{amount: d1, account: accts.to2},
				{amount: d2, account: accts.to3},
			],
			[
				{amount: c1, account: accts.from},
				{amount: c2, account: accts.from2},
				{amount: c3, account: accts.from3},
			]
		)
	},new RegExp(`^Error: Debits (.*) != Credits (.*)$`),`Complex unbalanced journal entries throw an exception`)
	t.end()
})


