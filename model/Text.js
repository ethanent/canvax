module.exports = class Text {
	constructor (options) {
		this.type = 'text'

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'text': '',
			'color': '#000000',
			'font': '30px Arial',
			'alignment': 'start'
		}, options)

		// 'maxWidth' option will be undefined by default.
	}

	render (ctx) {
		ctx.fillStyle = this.color
		ctx.font = this.font
		ctx.textAlign = this.alignment
		
		ctx.fillText(this.text, this.x, this.y, this.maxWidth)
	}

	touches (entity) {
		throw new Error('Cannot check touches for type ' + this.type + '.')
	}
}