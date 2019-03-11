module.exports = class Rectangle extends (typeof Entity === 'object' || typeof require !== 'function' ? Entity : require(require('path').join(__dirname, 'Entity.js'))) {
	constructor (options) {
		super()

		this.type = 'rectangle'

		this.clicked = false
		this.mouseOver = false

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
		else if (e.type === 'mousemove') {
			if (this.touchesPoint(point)) {
				if (!this.mouseOver) {
					this.emit('mousein')

					this.mouseOver = true
				}
			}
			else {
				if (this.mouseOver) {
					this.emit('mouseout')

					this.mouseOver = false
				}
			}
		}
	}

	render (ctx) {
		if (typeof this.backgroundColor === 'string') {
			ctx.fillStyle = this.backgroundColor
			
			ctx.fillRect(this.x, this.y, this.width, this.height)
		}

		if (typeof this.borderColor === 'string' && typeof this.borderWeight === 'number' && this.borderWeight > 0) {
			ctx.strokeStyle = this.borderColor
			ctx.lineWidth = this.borderWeight

			ctx.strokeRect(this.x, this.y, this.width, this.height)
		}
	}

	getBounds () {
		return {
			'l': this.x,
			't': this.y,
			'r': this.x + this.width,
			'b': this.y - this.height
		}
	}

	touchesPoint (point) {
		return point.x > this.x && point.x < this.x + this.width && point.y > this.y && point.y < this.y + this.height
	}

	touches (entity) {
		if (entity.type === 'rectangle' || entity.type === 'image') {
			const a = this.getBounds()
			const b = entity.getBounds()

			return (a.l < b.r && a.r > b.l && a.t > b.b && a.b < b.t)
		}
		else if (entity.type === 'circle') {
			// Adapted from https://yal.cc/rectangle-circle-intersection-test/

			const deltaX = entity.x - Math.max(this.x, Math.min(entity.x, this.x + this.width))
			const deltaY = entity.y - Math.max(this.y, Math.min(entity.y, this.y + this.height))

			return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) < Math.pow(entity.radius, 2)
		}
		else throw new Error('Cannot check touches for type ' + entity.type + '.')
	}
}