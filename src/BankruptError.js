export default class BankruptError extends Error {
	constructor(message, period) {
		super(message)
		this.period = period
	}
}
