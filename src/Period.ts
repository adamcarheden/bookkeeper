import ChartOfAccounts from './ChartOfAccounts'
import SubAccount from './SubAccount'
import {default as JournalEntry, JournalEntryItem } from './JournalEntry'
import IncomeStatement from './IncomeStatement'
import BalanceSheet from './BalanceSheet'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'

export type closeFunction = () => void
export default class Period {

	journal: JournalEntry[] = []
	autoClose: closeFunction
	closed: boolean = false
	private _financialStatements: { balanceSheet: BalanceSheet|null , incomeStatement: IncomeStatement|null } = { balanceSheet: null, incomeStatement: null }

	constructor(readonly period: any, readonly coa: ChartOfAccounts, autoClose?: closeFunction) {
		this.autoClose = arguments.length >= 3 ? autoClose : () => { throw new Error(`You must either provide an autoClose function at instantiation or close explicitly prior to accessing financial statements`) }
	}
	close(closer?: closeFunction) {
		const incomeStatement = new IncomeStatement(this.coa)
		if (arguments.length >= 1) {
			closer()
		} else {
			this.autoClose()
		}
		let isaccts = [this.coa.income, this.coa.expenses]
		for (let i = 0; i<isaccts.length; i++) {
			if (isaccts[i].balance !== 0) throw new Error(`Income Statement account '${isaccts[i].name}' has non-zero balance $${isaccts[i].balance} after close`)
		}
		const balanceSheet = new BalanceSheet(this.coa)
		this.closed = true
		this._financialStatements = { incomeStatement: incomeStatement, balanceSheet: balanceSheet }
	}

	journalEntry(
		description: string,
		amount: number,
		debit: SubAccount,
		credit: SubAccount
	) {
		this.compoundJournalEntry(
			description,
			[{ amount: amount, account: debit }],
			[{ amount: amount, account: credit }],
		)
	}
	compoundJournalEntry(
		description: string,
		debits: JournalEntryItem[],
		credits: JournalEntryItem[]
	) {
		if (this.closed) throw new Error('This period has already been closed. You may not add any additional journal entires.')
		this.journal.push(new JournalEntry(description, debits, credits))
	}

	get financialStatements() { return this._financialStatements }
	get balanceSheet() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.financialStatements.balanceSheet
	}
	get incomeStatement() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.financialStatements.incomeStatement
	}
	printJournal() {
		//               $xXXX,XXX.XX $xXXX,XXX.XX 
		let journal: string[] = [`\t      Debits     Credits  Account`]
		for (let i=0; i<this.journal.length; i++) {
			journal.push(this.journal[i].print(12,2,`\t`))
		}
		return journal.join(`\n`)
	}
	toString() { return this.printJournal() }

}
