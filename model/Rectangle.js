module.exports = class Rectangle {
	constructor (options) {
		this.type = 'rectangle'

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