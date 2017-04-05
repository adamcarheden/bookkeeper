import test from 'tape'
import { ChartOfAccounts, Period } from '../BookKeeper/BookKeeper'

const setup = () => {
	return {}
}
const randInt = function(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min
}

const randDollarArr = function(min, max, count) {
	let list = []
	let total = 0
	for (let i=0; i<count; i++) {
		list.push(randInt(min*100,max*100)/100)
		total += list[list.length-1]
	}
	return {list: list, total: total}
}

export {
	setup,
	test,
	ChartOfAccounts,
	randInt,
	randDollarArr,
	Period,
}
