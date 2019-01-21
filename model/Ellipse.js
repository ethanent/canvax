module.exports = class Ellipse {
	constructor (options) {
		this.type = 'ellipse'

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'width': 100,
			'height': 100,
			'backgroundColor': null,
			'borderColor': '#E74C3C',
			'borderWeight': 0
		}, options)
	}

	render (ctx) {
		var kappa = .5522847493
		var ox = (this.width / 2) * kappa
		var oy = (this.height / 2) * kappa
		var xe = this.x + this.width
		var ye = this.y + this.height
		var xm = this.x + this.width / 2
		var ym = this.y + this.height / 2

		ctx.beginPath()
		ctx.moveTo(this.x, ym)
		ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y)
		ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym)
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
		ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym)
		ctx.closePath()

		if (typeof this.backgroundColor === 'string') {
			ctx.fillStyle = this.backgroundColor

			ctx.fill()
		}

		if (typeof this.borderColor === 'string' && typeof this.borderWeight === 'number' && this.borderWeight > 0) {
			ctx.strokeStyle = this.borderColor
			ctx.lineWidth = this.borderWeight
			
			ctx.stroke()
		}
	}

	touches (entity) {
		throw new Error('Cannot check touches for type ' + this.type + '.')
	}
}