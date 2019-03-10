module.exports = class Text extends (Entity ? Entity : require('path').join(__dirname, 'Entity.js')) {
	constructor (options) {
		super()

		this.type = 'text'

		this.listeners = {}

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'text': '',
			'color': '#000000',
			'font': '20px Arial',
			'alignment': 'start'
		}, options)

		// 'maxWidth' option will be undefined by default.
	}

	processCanvasEvent (e, renderer) {}

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