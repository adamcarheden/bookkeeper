import ACCOUNT_TYPE from './ACCOUNT_TYPE'
import BalanceSheet from './BalanceSheet'
import ChartOfAccounts from './ChartOfAccounts'
import IncomeStatement from './IncomeStatement'
import {default as JournalEntry, JournalEntryItem } from './JournalEntry'
import SubAccount from './SubAccount'

export type closeFunction = () => void
export default class Period {

	public readonly journal: JournalEntry[] = []
	public readonly autoClose: closeFunction
	private closed: boolean = false
	private finStmts: {
		balanceSheet: BalanceSheet|null,
		incomeStatement: IncomeStatement|null } =
	{ balanceSheet: null, incomeStatement: null }

	constructor(readonly period: any, readonly coa: ChartOfAccounts, autoClose?: closeFunction) {
		this.autoClose = arguments.length >= 3 ? autoClose : () => {
			throw new Error(`You must either provide an autoClose function at instantiation or close explicitly prior to accessing financial statements`)
		}
	}
	public close(closer?: closeFunction) {
		const incomeStatement = new IncomeStatement(this.coa)
		if (arguments.length >= 1) {
			closer()
		} else {
			this.autoClose()
		}
		let isaccts = [this.coa.income, this.coa.expenses]
		for (let i of isaccts) {
			if (i.balance !== 0) {
				throw new Error(`Income Statement account '${i.name}' has non-zero balance $${i.balance} after close`)
			}
		}
		const balanceSheet = new BalanceSheet(this.coa)
		this.closed = true
		this.finStmts = { incomeStatement, balanceSheet }
	}
	get financialStatements() {
		return this.finStmts
	}
	get isClosed() { return this.closed }

	public journalEntry(
		description: string,
		amount: number,
		debit: SubAccount,
		credit: SubAccount,
	) {
		this.compoundJournalEntry(
			description,
			[{ amount, account: debit }],
			[{ amount, account: credit }],
		)
	}
	public compoundJournalEntry(
		description: string,
		debits: JournalEntryItem[],
		credits: JournalEntryItem[],
	) {
		if (this.closed) {
			throw new Error('This period has already been closed. You may not add any additional journal entires.')
		}
		this.journal.push(new JournalEntry(description, debits, credits))
	}

	get balanceSheet() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.finStmts.balanceSheet
	}
	get incomeStatement() {
		if (this.closed === false) {
			this.close(this.autoClose)
		}
		return this.finStmts.incomeStatement
	}
	public printJournal() {
		let journal: string[] = [`\t      Debits     Credits  Account`]
		for (let i of this.journal) {
			journal.push(i.print(12, 2, `\t`))
		}
		return journal.join(`\n`)
	}
	public toString() { return this.printJournal() }

}
