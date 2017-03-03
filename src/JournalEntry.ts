import Account from './Account'
export default class JournalEntry {

	constructor(
		readonly description: string,
		readonly amount: number,
		readonly debit: Account,
		readonly credit: Account
	) {
		debit.debit(this)
		credit.credit(this)
	}
}
