import ChartOfAccounts from '../BookKeeper/ChartOfAccounts'
import test from 'tape'
import Path from 'path'
const file = Path.basename(__filename)

test(`${file}`, (t) => {
	let coa = new ChartOfAccounts()

	console.log(`${coa}`)
	t.assert('assets' in coa, `Has assets`)
	t.assert('liabilities' in coa, `Has liabilities`)
	t.assert('equity' in coa, `Has equity`)
	t.assert('income' in coa, `Has income`)
	t.assert('expenses' in coa, `Has expenses`)
	t.assert('contraEquity' in coa, `Has contraEquity`)

	t.end()
})
