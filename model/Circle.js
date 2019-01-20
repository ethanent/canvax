module.exports = class Circle {
	constructor (options) {
		this.type = 'circle'

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'radius': 100,
			'backgroundColor': '#3498DB',
			'borderColor': '#E74C3C',
			'borderWeight': 5
		}, options)
	}

	render (ctx) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)

		if (typeof this.backgroundColor === 'string') {
			ctx.fillStyle = this.backgroundColor
			
			ctx.fill()
		}

		if (typeof this.borderColor === 'string') {
			ctx.strokeStyle = this.borderColor
			ctx.lineWidth = this.borderWeight

			ctx.stroke()
		}
	}

	touches (entity) {
		if (entity.type === 'circle') {
			return this._pointDistance([this.x, this.y], [entity.x, entity.y]) < this.radius + entity.radius
		}
		else if (entity.type === 'rectangle' || entity.type === 'image') {
			// Adapted from https://yal.cc/rectangle-circle-intersection-test/

			const deltaX = this.x - Math.max(entity.x, Math.min(this.x, entity.x + entity.width))
			const deltaY = this.y - Math.max(entity.y, Math.min(this.y, entity.y + entity.height))

			return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) < Math.pow(this.radius, 2)
		}
		else throw new Error('Cannot check touches for type ' + entity.type + '.')
	}

	_pointDistance (p1, p2) {
		return Math.sqrt(Math.pow(Math.abs(p1[0] - p2[0]), 2) + Math.pow(Math.abs(p1[1] - p2[1]), 2))
	}
}