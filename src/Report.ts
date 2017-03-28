import Account from './Account'
import SummaryAccount from './SummaryAccount'

interface AccountSnapshot {
	name: string
	balance: number
	subAccounts: AccountSnapshot[]
}

const formatCurrency = function(amount: number): string { 
	try {
		return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	} catch (e) {
		if (e.name !== 'RangeError') throw e
	}
	return amount.toFixed(2) 
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
const snapshotBalance = function(name: string, balance: number): AccountSnapshot {
	let snapshot: AccountSnapshot = {
		name: name,
		balance: balance,
		subAccounts: [],
	}
	return snapshot
}

const formatSnapshots = function(accts : { [id: string]: AccountSnapshot[] } ) : { [id: string]: string[] } {
	let tmpAccts: { [id: string]: tmpAcct[]  } = {}
	let maxName = 0, maxBal = 0
	Object.keys(accts).forEach((k) => {
		tmpAccts[k] = []

		let makeTmp = function(acct: AccountSnapshot, indent = '') : void {
			let bal = acct.balance
			let a: tmpAcct = {name: indent+acct.name, balance: bal, balanceStr: formatCurrency(bal)}
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

export {
	AccountSnapshot,
	snapshotAccount,
	snapshotBalance,
	formatSnapshots,
	formatCurrency,
}
