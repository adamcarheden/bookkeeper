import Account from './Account'
import SummaryAccount from './SummaryAccount'

interface AccountSnapshot {
	name: string
	balance: number
	subAccounts: AccountSnapshot[]
	subAccountsByName: { [id: string]: AccountSnapshot}
}

const formatCurrency = (amount: number): string => {
	try {
		return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	} catch (e) {
		if (e.name !== 'RangeError') { throw e }
	}
	return amount.toFixed(2)
}
const snapshotAccount = (acct: Account): AccountSnapshot => {
	let snapshot: AccountSnapshot = {
		balance: acct.balance,
		name: acct.name,
		subAccounts: [],
		subAccountsByName: {},
	}
	if (acct instanceof SummaryAccount) {
		let sa = acct as SummaryAccount
		for (let i of sa.subAccounts) {
			let sub = snapshotAccount(i)
			snapshot.subAccounts.push(sub)
			snapshot.subAccountsByName[i.name] = sub
		}
	}
	return snapshot
}

interface TmpAcct {
	name: string
	balance: number
	balanceStr: string
}
const snapshotBalance = (name: string, balance: number): AccountSnapshot => {
	let snapshot: AccountSnapshot = {
		name,
		balance,
		subAccounts: [],
		subAccountsByName: {},
	}
	return snapshot
}

const formatSnapshots = (accts: { [id: string]: AccountSnapshot[] } ): { [id: string]: string[] } => {
	let tmpAccts: { [id: string]: TmpAcct[]  } = {}
	let maxName = 0
	let maxBal = 0
	Object.keys(accts).forEach((k) => {
		tmpAccts[k] = []

		let makeTmp = (acct: AccountSnapshot, indent = '') : void => {
			let bal = acct.balance
			let a: TmpAcct = {name: indent + acct.name, balance: bal, balanceStr: formatCurrency(bal)}
			if (bal < 0) {
				a.balanceStr = a.balanceStr.replace(/-/, '(') + ')'
			} else {
				a.balanceStr = ' ' + a.balanceStr + ' '
			}
			maxName = Math.max(maxName, a.name.length)
			maxBal = Math.max(maxBal, a.balanceStr.length)
			tmpAccts[k].push(a)
			for (let j of acct.subAccounts) {
				makeTmp(j, indent + '  ')
			}
		}

		for (let i of accts[k]) {
			makeTmp(i)
		}
	})
	let namePad = ''
	while (namePad.length < maxName) { namePad += ' ' }
	let balPad = ''
	while (balPad.length < maxBal) { balPad += ' ' }
	let fmtd: { [id: string]: string[] } = {}
	Object.keys(accts).forEach((k: string) => {
		fmtd[k] = tmpAccts[k].map((acct) => {
			let str = ''
			str += (acct.name + namePad).slice(0, maxName) + ' '
			str += '$' + (balPad + acct.balanceStr).slice(-maxBal)
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
