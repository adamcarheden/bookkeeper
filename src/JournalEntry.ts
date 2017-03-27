import SubAccount from './SubAccount'

export interface JournalEntryItem {
	amount: number
	account: SubAccount
}

export default class JournalEntry {

	constructor(
		readonly description: string,
		readonly debits: JournalEntryItem[],
		readonly credits: JournalEntryItem[]
	) {
		let debit_total = 0
		for (let i=0; i<debits.length; i++) {
			debit_total += debits[i].amount
			debits[i].account.debit(debits[i].amount)
		}
		let credit_total = 0
		for (let i=0; i<credits.length; i++) {
			credit_total += credits[i].amount
			credits[i].account.credit(credits[i].amount)
		}
		if (debit_total != credit_total) throw new Error(`Debits (${debit_total}) != Credits (${credit_total})`)
	}

	print(maxLen: number = 12, decimals: number = 2, indent: string = `\t`) {
		let placeholder = ''
		while (placeholder.length < maxLen) placeholder += ' '

		let fmtNum = function(num: number) {
			let fmtd = num.toLocaleString('en-US', {style: 'currency', currency: 'USD' })
			fmtd = fmtd.substring(0,Math.max(fmtd.length, maxLen))
			while (fmtd.length < maxLen) fmtd = ` ${fmtd}`
			return fmtd
		}

		let je = `${this.description}\n`
		for (let i=0; i<this.debits.length; i++) {
			let v = this.debits[i]
			je += `${indent}${fmtNum(v.amount)}${placeholder}  ${v.account.name}\n`
		}
		for (let i=0; i<this.credits.length; i++) {
			let v = this.credits[i]
			je += `${indent}${placeholder}${fmtNum(v.amount)}  ${v.account.name}\n`
		}
		return je
	}
	toString() { return this.print() }

}
