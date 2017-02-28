import Account from './Account'
export default class CreditAccount extends Account {
	get balance() {
		return this.credit_total - this.debit_total
	}
}
