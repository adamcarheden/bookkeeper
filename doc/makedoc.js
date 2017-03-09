// Includes files in markdown in order to pull running and tested examples into docs

const Path = require('path')

const infile = process.argv[2]
const fs = require('fs')
if (!fs.existsSync(infile)) {
	console.error("'"+infile+"': No such file")
	process.exit(1)
}
const stat = fs.statSync(infile)
if (!stat.isFile()) {
	console.error("'"+infile+"' is not a file")
	process.exit(1)
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(infile)
});

const path = require('path')
lineReader.on('line', function (line) {
	var matches
	if (matches = line.trim().match(/^{{{(.*)}}}$/)) {
		const incl = path.dirname(infile)+"/"+matches[1]
		if (fs.existsSync(incl)) {
			const istat = fs.statSync(incl)
			if (istat.isFile()) {
				var content = fs.readFileSync(incl, {encoding: 'utf-8'})
				if (incl.match(/.js$/)) content = "```javascript\n"+content+"```"
				if (incl.match(/.html/)) content = "```html\n"+content+"```"
				console.log("_*"+Path.basename(incl)+"*_\n"+content)
				return
			}
		}
	}
	console.log(line)
});
