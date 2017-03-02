import Period from './Period'
export default class BankruptError extends Error {
	constructor(message: string, readonly period: Period) {
		super(message)
	}
}
