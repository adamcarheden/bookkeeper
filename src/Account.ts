import ChartOfAccounts from './ChartOfAccounts'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import { printReport, lineItem } from './Report'

export default class Account {

	private _debits: number[] = []
	private _debit_total: number = 0
	private _credits: number[] = []
	private _credit_total: number = 0
	readonly subAccounts: Account[] = []

	constructor(readonly name: string, readonly accountType : ACCOUNT_TYPE) {}

	debit(amount: number) {
		this.debits.push(amount)
		this._debit_total += amount
	}
	get debits() : number[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.debits)
		}, this._debits)
	}
	get debit_total() {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + subAcct._debit_total
		}, this._debit_total)
	}

	credit(amount: number) {
		this.credits.push(amount)
		this._credit_total += amount
	}
	get credits() : number[] {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc.concat(subAcct.credits)
		}, this._credits)
	}
	get credit_total() {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + subAcct._credit_total
		}, this._credit_total)
	}

	subAccount(name: string, accountType?: ACCOUNT_TYPE) {
		if (arguments.length < 2) accountType = this.accountType
		let sub = new Account(name, accountType)
		this.subAccounts.push(sub)
		return sub
	}
	private _balance() {
		let bal
		switch (this.accountType) {
			case ACCOUNT_TYPE.CREDIT_NORMAL:
				bal = this._credit_total - this._debit_total
				break;
			case ACCOUNT_TYPE.DEBIT_NORMAL:
				bal = this._debit_total - this._credit_total
				break;
			default:
				throw new Error(`Unknown account type: ${this.accountType}`)
		}
		return bal
	}
	get balance() : number {
		return this.subAccounts.reduce((acc, subAcct, i) => {
			return acc + subAcct.balance
		}, this._balance())
	}
	get statement() : any {
		let stmt : any = {
			balance: this._balance(),
			subAccounts: {}
		}
		for (let i=0; i<this.subAccounts.length; i++) {
			stmt.subAccounts[this.subAccounts[i].name] = this.subAccounts[i].statement
			stmt.balance += stmt.subAccounts[this.subAccounts[i].name].balance
		}
		return stmt
	}

	private _prepForPrint(prefix: string = '', indent: string = '  ') {
		let acct: lineItem[] = [{ name: `${prefix}${this.name}`, balance: this.balance }]
		for (let i=0; i<this.subAccounts.length; i++) {
			acct = acct.concat(this.subAccounts[i]._prepForPrint(`${prefix}${indent}`, indent))
		}
		return acct
	}
	print(prefix: string = '', indent: string = '  ') {
		return printReport(this._prepForPrint(prefix, indent))
	}

	toString() {
		return this.print()
	}

}
