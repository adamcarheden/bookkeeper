import Account from './Account'
export default class DebitAccount extends Account {
	get balance() {
		return this.debit_total - this.credit_total
	}
}
