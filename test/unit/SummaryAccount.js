import test from 'tape'
import SummaryAccount from '../BookKeeper/SummaryAccount'
import ACCOUNT_TYPE from '../BookKeeper/ACCOUNT_TYPE'
import {randInt, randDollarArr} from './fixtures'
import Path from 'path'
const file = Path.basename(__filename)

test(`Same types ${file}`, (t) => {
	let parent = new SummaryAccount('test', ACCOUNT_TYPE.DEBIT_NORMAL)
	let kid1 = parent.subAccount('kid 1')
	let kid2 = parent.subAccount('kid 2')

	let dlist = randDollarArr(1, 10000, randInt(1,30))
	let clist = randDollarArr(1, 10000, randInt(1,30))
	let balance = dlist.total - clist.total

	for (let i=0; i<dlist.list.length; i++) {
		if (i % 2 === 0) {
			kid1.debit(dlist.list[i])
		} else {
			kid2.debit(dlist.list[i])
		}
	}
	for (let i=0; i<clist.list.length; i++) {
		if (i % 2 === 0) {
			kid1.credit(clist.list[i])
		} else {
			kid2.credit(clist.list[i])
		}
	}

	t.equal(dlist.list.length, parent.debits.length, `Correct number of debits`)
	t.equal(clist.list.length, parent.credits.length, `Correct number of credits`)
	t.equal(Math.fround(dlist.total), Math.fround(parent.debits.reduce((a, i) => { return a+i },0)), `Correct debit total`)
	t.equal(Math.fround(clist.total), Math.fround(parent.credits.reduce((a, i) => { return a+i },0)), `Correct credit total`)
	t.equal(Math.fround(balance), Math.fround(parent.balance), `Correct balance`)

	t.end()
})

test(`Mixed types ${file}`, (t) => {
	let parent = new SummaryAccount('test', ACCOUNT_TYPE.CREDIT_NORMAL)
	let kid1 = parent.subAccount('kid 1', ACCOUNT_TYPE.DEBIT_NORMAL)
	let kid2 = parent.subAccount('kid 2')

	let dlist = randDollarArr(1, 10000, randInt(1,30))
	let clist = randDollarArr(1, 10000, randInt(1,30))
	let balance = clist.total - dlist.total
	
	for (let i=0; i<dlist.list.length; i++) {
		if (i % 2 === 0) {
			kid1.debit(dlist.list[i])
		} else {
			kid2.debit(dlist.list[i])
		}
	}
	for (let i=0; i<clist.list.length; i++) {
		if (i % 2 === 0) {
			kid1.credit(clist.list[i])
		} else {
			kid2.credit(clist.list[i])
		}
	}

	t.equal(dlist.list.length, parent.debits.length, `Correct number of debits`)
	t.equal(clist.list.length, parent.credits.length, `Correct number of credits`)
	t.equal(Math.fround(dlist.total), Math.fround(parent.debits.reduce((a, i) => { return a+i },0)), `Correct debit total`)
	t.equal(Math.fround(clist.total), Math.fround(parent.credits.reduce((a, i) => { return a+i },0)), `Correct credit total`)
	t.equal(Math.fround(parent.balance), Math.fround(balance), `Correct balance`)

	t.end()
})
