import ACCOUNT_TYPE from './ACCOUNT_TYPE'

abstract class Account {
	constructor(readonly name: string, readonly accountType: ACCOUNT_TYPE) {}

	abstract get debits(): number[]
	abstract get credits(): number[]
	abstract get balance(): number
	toString() {
		return `${this.name}\t$${this.balance.toFixed(2)}`
	}
	print() : string {
		let maxWidth = 0
		let debits = []
		let balance = this.balance.toFixed(2)
		for (let i=0; i<this.debits.length; i++) {
			let e = `${this.debits[i].toFixed(2)}`
			maxWidth = Math.max(maxWidth, e.length)
			debits.push(e)
		}
		let credits = []
		for (let i=0; i<this.credits.length; i++) {
			let e = `${this.credits[i].toFixed(2)}`
			maxWidth = Math.max(maxWidth, e.length)
			credits.push(e)
		}
		maxWidth = Math.max(balance.length, maxWidth)
		let pad = ''
		while (pad.length < maxWidth) pad += ' '
		let ledger = 'Debits:\n'
		for (let i=0; i<debits.length; i++) {
			ledger += `\t$${(pad+debits[i]).slice(-maxWidth)}\n`
		}
		ledger += 'Credits:\n'
		for (let i=0; i<credits.length; i++) {
			ledger += `\t$${(pad+credits[i]).slice(-maxWidth)}\n`
		}
		ledger += 'Balance:\n'
		ledger += `\t$${(pad+balance).slice(-maxWidth)}\n`
		return ledger
	}

}

export default Account
