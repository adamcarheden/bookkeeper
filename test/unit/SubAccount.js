import test from 'tape'
import SubAccount from '../BookKeeper/SubAccount'
import ACCOUNT_TYPE from '../BookKeeper/ACCOUNT_TYPE'
import {randInt, randDollarArr } from './fixtures'
import Path from 'path'

let file = Path.basename(__filename)

test(`Debit normal (${file})`, (t) => {
	let sa = new SubAccount('test', ACCOUNT_TYPE.DEBIT_NORMAL)

	let debitCnt = randInt(1,30)
	let creditCnt = randInt(1,10)

	let dlist = randDollarArr(1,10000, debitCnt)
	t.equal(dlist.list.length, debitCnt, 'Test generated wrong number of debits')
	let clist = randDollarArr(1,1000, creditCnt)
	t.equal(clist.list.length, creditCnt, 'Test generated wrong number of credits')

	let d1 = dlist.list.shift()
	sa.debit(d1)
	if (sa.debits.length === 1) {
		t.equal(sa.debits[0], d1, 'Debit amount is correct')
	} else { t.fail('Only one debit') }
	t.equal(sa.credits.length, 0, 'No credits')
	t.equal(sa.balance, d1, 'Balance is correct after first debit')

	let c1 = clist.list.shift()
	sa.credit(c1)
	if (sa.credits.length === 1) {
		t.equal(sa.credits[0], c1, 'Credit amount is correct')
	} else { t.fail('Only one credit') }
	t.equal(sa.debits.length, 1, 'Still only one debit')
	t.equal(sa.balance, d1-c1, 'Balance is correct after first credit')

	let c,d
	while ((d = dlist.list.shift())) sa.debit(d)
	while ((c = clist.list.shift())) sa.credit(c)

	t.equal(sa.debits.length, debitCnt, `Correct number of debits`)
	t.equal(sa.credits.length, creditCnt, `Correct number of credits`)
	t.equal(sa.debits.reduce((t, d) => { return t+d }, 0), dlist.total, `Correct debit list.total`)
	t.equal(sa.credits.reduce((t, c) => { return t+c }, 0), clist.total, `Correct credit list.total`)
	t.equal(Math.fround(sa.balance), Math.fround(dlist.total - clist.total), `Correct balance`)
	t.end()
})
test(`Credit normal (${file})`, (t) => {
	let sa = new SubAccount('test', ACCOUNT_TYPE.CREDIT_NORMAL)

	let debitCnt = randInt(1,10)
	let creditCnt = randInt(1,30)

	let dlist = randDollarArr(1,1000, debitCnt)
	t.equal(dlist.list.length, debitCnt, 'Test generated wrong number of debits')
	let clist = randDollarArr(1,10000, creditCnt)
	t.equal(clist.list.length, creditCnt, 'Test generated wrong number of credits')

	let c1 = clist.list.shift()
	sa.credit(c1)
	if (sa.credits.length === 1) {
		t.equal(sa.credits[0], c1, 'Credit amount is correct')
	} else { t.fail('Only one credit') }
	t.equal(sa.debits.length, 0, 'No debits')
	t.equal(sa.balance, c1, 'Balance is correct after first credit')

	let d1 = dlist.list.shift()
	sa.debit(d1)
	if (sa.debits.length === 1) {
		t.equal(sa.debits[0], d1, 'Debit amount is correct')
	} else { t.fail('Only one debit') }
	t.equal(sa.credits.length, 1, 'Still only one credit')
	t.equal(sa.balance, c1-d1, 'Balance is correct after first credit')

	let c,d
	while ((d = dlist.list.shift())) sa.debit(d)
	while ((c = clist.list.shift())) sa.credit(c)

	t.equal(sa.debits.length, debitCnt, `Correct number of debits`)
	t.equal(sa.credits.length, creditCnt, `Correct number of credits`)
	t.equal(sa.debits.reduce((t, d) => { return t+d }, 0), dlist.total, `Correct debit list.total`)
	t.equal(sa.credits.reduce((t, c) => { return t+c }, 0), clist.total, `Correct credit list.total`)
	t.equal(Math.fround(sa.balance), Math.fround(clist.total - dlist.total), `Correct balance`)
	t.end()
})
