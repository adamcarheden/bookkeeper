import ChartOfAccounts from './ChartOfAccounts'
import Account from './Account'
import {default as JournalEntry, JournalEntryItem } from './JournalEntry'
import IncomeStatement from './IncomeStatement'
import BalanceSheet from './BalanceSheet'
import FinancialStatements from './FinancialStatements'
import ACCOUNT_TYPE from './ACCOUNT_TYPE'

export type closeFunction = () => void
export default class Period {

	journal: JournalEntry[] = []
	autoClose: closeFunction
	closed: boolean
	financialStatements: FinancialStatements

	constructor(readonly period: any, readonly coa: ChartOfAccounts, autoClose?: closeFunction) {
		this.autoClose = typeof autoClose === 'function'
			? autoClose
			: () => { 
				let debits = [{amount: coa.income.balance, account: coa.income }]
				let credits = [{amount: coa.expenses.balance, account: coa.expenses }]
				let pnl = coa.income.balance - coa.expenses.balance
				if (pnl > 0) {
					credits.push({amount: pnl, account: coa.equity})
				} else if (pnl < 0) {
					if (coa.assets.balance < -pnl) throw new Error(`You're bankrupt!`)
					debits.push({amount: pnl, account: coa.equity})
				}
				this.journalEntryComplex('Close Period', debits, credits)
			}
		this.closed = false
	}
	close(closer: closeFunction) {
		const incomeStatement = new IncomeStatement(this.coa)
		closer()
		let isaccts = [this.coa.income, this.coa.expenses]
		for (let i = 0; i<isaccts.length; i++) {
			if (isaccts[i].balance !== 0) throw new Error(`Income Statement account '${isaccts[i].name}' has non-zero balance $${isaccts[i].balance} after close`)
		}
		const balanceSheet = new BalanceSheet(this.coa)
		this.closed = true
		this.financialStatements = new FinancialStatements(incomeStatement, balanceSheet)
	}

	journalEntry(
		description: string,
		amount: number,
		debit: Account,
		credit: Account
	) {
		this.journalEntryComplex(
			description,
			[{ amount: amount, account: debit }],
			[{ amount: amount, account: credit }],
		)
	}
	journalEntryComplex(
		description: string,
		debits: JournalEntryItem[],
		credits: JournalEntryItem[]
	) {
		this.journal.push(new JournalEntry(description, debits, credits))
	}

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
