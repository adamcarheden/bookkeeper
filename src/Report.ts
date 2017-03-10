import Account from './Account'

interface lineItem {
	name: string,
	balance: number,
}

let digits = function(num: number) {
	return num.toFixed(2).split(/\./)[0].length
}

let printReport = function(items: lineItem[]) {
	let max = 0
	let balMax = 0
	return items.map((item: lineItem) => {
		let bal = item.balance.toLocaleString('en-US', {style: 'currency', currency: 'USD' })
		if (item.balance < 0) {
			bal = bal.replace(/-/,'(')
			bal += ')'
		}
		let i = { 
			name: item.name,
			balance: bal,
		}
		max = Math.max(max, item.name.length)
		balMax = Math.max(balMax, i.balance.length)
		return i
	}).map((item: { name: string, balance: string }) => {
		let lbl = item.name
		while (lbl.length < max) lbl += ' '
		let padLen = balMax - item.balance.length
		let pad = ''
		while (pad.length < padLen) pad += ' '
		let bal = item.balance.replace(/\$/,`$${pad}`)
		return `${lbl.substring(0, max)}\t${bal}`
	}).join(`\n`)
}

abstract class Report {

	readonly subAccounts: { [id: string] : Account } = {}

	constructor(readonly balance: number, accts: Account[]) {
		for (let i in accts) {
			let acct = accts[i]
			this.subAccounts[accts[i].name] = accts[i].statement
		}
	}	

	print(summary: string = 'Total', postTotalAccounts: lineItem[] = []) {
		let accts: lineItem[] = []
		Object.keys(this.subAccounts).forEach((acct) => {
			accts.push({name: acct, balance: this.subAccounts[acct].balance })
		})
		accts.push({ name: summary, balance: this.balance })
		accts = accts.concat(postTotalAccounts)
		return printReport(accts)
	}
	toString() {
		return this.print()
	}
}
export {
	Report as default,
	lineItem,	
	printReport,
}
