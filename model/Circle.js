module.exports = class Circle extends (typeof Entity === 'object' || typeof require !== 'function' ? Entity : require(require('path').join(__dirname, 'Entity.js'))) {
	constructor (options) {
		super()

		this.type = 'circle'

		this.clicked = false

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'radius': 100,
			'backgroundColor': null,
			'borderColor': '#E74C3C',
			'borderWeight': 0
		}, options)
	}

	processCanvasEvent (e, renderer) {
		const point = this.getEventPosition(e, renderer)

		if (e.type === 'mousedown') {
			if (this.touchesPoint(point)) {
				this.emit('mousedown')

				this.clicked = true
			}
		}
		else if (e.type === 'mouseup') {
			if (this.touchesPoint(point) && this.clicked) {
				this.emit('click')
			}

			this.clicked = false
		}
	}

	render (ctx) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)

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

	touchesPoint (point) {
		return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)) <= this.radius
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