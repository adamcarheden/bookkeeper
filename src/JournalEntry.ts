import SubAccount from './SubAccount'

export interface JournalEntryItem {
	amount: number
	account: SubAccount
}

export default class JournalEntry {

	constructor(
		readonly description: string,
		readonly debits: JournalEntryItem[],
		readonly credits: JournalEntryItem[],
	) {
		let debitTotal = 0
		for (let i of debits) {
			debitTotal += i.amount
			i.account.debit(i.amount)
		}
		let creditTotal = 0
		for (let i of credits) {
			creditTotal += i.amount
			i.account.credit(i.amount)
		}
		if (debitTotal !== creditTotal) {
			throw new Error(`Debits (${debitTotal}) != Credits (${creditTotal})`)
		}
	}

	public print(maxLen: number = 12, decimals: number = 2, indent: string = `\t`) {
		let placeholder = ''
		while (placeholder.length < maxLen) { placeholder += ' ' }

		let fmtNum = (num: number) => {
			let fmtd = num.toLocaleString('en-US', {style: 'currency', currency: 'USD' })
			fmtd = fmtd.substring(0, Math.max(fmtd.length, maxLen))
			while (fmtd.length < maxLen) { fmtd = ` ${fmtd}` }
			return fmtd
		}

		let je = `${this.description}\n`
		for (let v of this.debits) {
			je += `${indent}${fmtNum(v.amount)}${placeholder}  ${v.account.name}\n`
		}
		for (let v of this.credits) {
			je += `${indent}${placeholder}${fmtNum(v.amount)}  ${v.account.name}\n`
		}
		return je
	}
	public toString() { return this.print() }

}
