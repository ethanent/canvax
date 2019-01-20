const path = require('path')
const fs = require('fs')

const modelDir = path.join(__dirname, 'model')
const modelFiles = fs.readdirSync(modelDir).filter((name) => /\.js$/.test(name))

const canvax = {}

for (let i = 0; i < modelFiles.length; i++) {
	canvax[modelFiles[i].split(/\.js$/)[0]] = require(path.join(modelDir, modelFiles[i]))
}

module.exports = canvax