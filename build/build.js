const path = require('path')
const fs = require('fs')

const modules = fs.readdirSync(path.join(__dirname, '..', 'model')).filter((name) => /\.js$/.test(name)).map((name) => [name, name.split(/\.js$/)[0]])
const loaded = []

console.log('> Removing previous build')

try {
	fs.unlinkSync(path.join(__dirname, '..', 'dist', 'canvax.js'))
}
catch (err) {
	console.log('Failed.')
}

console.log('\n> Loading modules')

for (let i = 0; i < modules.length; i++) {
	console.log('Loading ' + modules[i][1] + '...')

	loaded.push(fs.readFileSync(path.join(__dirname, '..', 'model', modules[i][0])))
}

console.log('\n> Building')

let build = 'const canvax = (() => {\nconst build = {}\n\nlet module = {}\n\n'

for (let i = 0; i < loaded.length; i++) {
	console.log('Bundling ' + modules[i][1] + '...')

	build += loaded[i] + '\n\nbuild[\'' + modules[i][1] + '\'] = module.exports\n\n'
}

build += 'return build\n\n})()'

console.log('\n> Saving build...')

fs.writeFileSync(path.join(__dirname, '..', 'dist', 'canvax.js'), build)

console.log('\n> Build complete! Enjoy! :)')