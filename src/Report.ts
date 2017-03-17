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
		bal = bal.replace(/\$/,'$ ')
		if (item.balance < 0) {
			bal = bal.replace(/-/,'').replace(/ /,'(') + ')'
		} else {
			bal = `${bal} `
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
	readonly equityAccounts: { [id: string] : Account } = {}

	constructor(readonly balance: number, accts: Account[], equityAccts: Account[]) {
		for (let i in accts) {
			this.subAccounts[accts[i].name] = accts[i].statement
		}
		for (let i in equityAccts) {
			this.equityAccounts[equityAccts[i].name] = equityAccts[i].statement
		}
	}	

	print(summary: string = 'Total', equity: string = 'Equity') {
		let accts: lineItem[] = []
		Object.keys(this.subAccounts).forEach((acct) => {
			accts.push({name: acct, balance: this.subAccounts[acct].balance })
		})
		accts.push({ name: summary, balance: this.balance })
		let eqSummary = 0
		Object.keys(this.equityAccounts).forEach((acct) => {
			eqSummary += this.equityAccounts[acct].balance
		})
		accts.push({ name: equity, balance: eqSummary })
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
