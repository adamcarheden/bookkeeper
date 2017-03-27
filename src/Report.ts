import Account from './Account'
import SummaryAccount from './SummaryAccount'

interface AccountSnapshot {
	name: string
	balance: number
	subAccounts: AccountSnapshot[]
}

const snapshotAccount = function(acct: Account): { name: string, balance: number, subAccounts: AccountSnapshot[] } {
	let snapshot: AccountSnapshot = {
		name: acct.name,
		balance: acct.balance,
		subAccounts: []
	}
	if (acct instanceof SummaryAccount) {
		let sa = acct as SummaryAccount
		for (let i=0; i<sa.subAccounts.length; i++) {
			snapshot.subAccounts.push(snapshotAccount(sa.subAccounts[i]))
		}
	}
	return snapshot
}

interface tmpAcct {
	name: string
	balance: number
	balanceStr: string
}

const formatSnapshots = function(accts : { [id: string]: AccountSnapshot[] } ) : { [id: string]: string[] } {
	let tmpAccts: { [id: string]: tmpAcct[]  } = {}
	let maxName = 0, maxBal = 0
	Object.keys(accts).forEach((k) => {
		tmpAccts[k] = []

		let makeTmp = function(acct: AccountSnapshot, indent = '') : void {
			let bal = acct.balance
			let a: tmpAcct = {name: indent+acct.name, balance: bal, balanceStr: bal.toFixed(2)}
			if (bal < 0) {
				a.balanceStr = a.balanceStr.replace(/-/,'(')+ ')'
			} else {
				a.balanceStr = ' '+a.balanceStr+' '
			}
			maxName = Math.max(maxName, a.name.length)
			maxBal = Math.max(maxBal, a.balanceStr.length)
			tmpAccts[k].push(a)
			for (let j=0; j<acct.subAccounts.length; j++) {
				makeTmp(acct.subAccounts[j], indent + '  ')
			}
		}

		for (let i=0; i<accts[k].length; i++) {
			makeTmp(accts[k][i])
		}
	})
	let namePad = ''
	while(namePad.length < maxName) namePad += ' '
	let balPad = ''
	while(balPad.length < maxBal) balPad += ' '
	let fmtd: { [id: string]: string[] } = {}
	Object.keys(accts).forEach((k: string) => {
		fmtd[k] = tmpAccts[k].map((acct) => {
			let str = ''
			str += (acct.name+namePad).slice(0,maxName)+' '
			str += '$'+(balPad+acct.balanceStr).slice(-maxBal)
			return str
		})
	})
	return fmtd
}


/*
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
*/

/*
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
*/
export {
	AccountSnapshot,
	snapshotAccount,
	formatSnapshots,
}
