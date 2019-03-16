const path = require('path')
const fs = require('fs')

const modules = ['EventEmitter', 'Renderer', 'Entity', 'Circle', 'Ellipse', 'Rectangle', 'Image', 'Text']
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
	console.log('Loading ' + modules[i] + '...')

	loaded.push(fs.readFileSync(path.join(__dirname, '..', 'model', modules[i] + '.js')))
}

console.log('\n> Building')

let build = `const canvax = (() => {
	const build = {}

	let module = {}
`

for (let i = 0; i < loaded.length; i++) {
	console.log('Bundling ' + modules[i] + '...')

	build += loaded[i] + '\n\nbuild[\'' + modules[i] + '\'] = module.exports\n'

	build += 'const ' + modules[i] + ' = build[\'' + modules[i] + '\']\n\n'
}

build += 'return build\n\n})()'

console.log('\n> Saving build...')

fs.writeFileSync(path.join(__dirname, '..', 'dist', 'canvax.js'), build)

console.log('\n> Build complete! Enjoy! :)')