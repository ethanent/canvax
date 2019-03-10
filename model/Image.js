const __canvaxImageCache = {}

module.exports = class Image extends (typeof Entity === 'object' || typeof require !== 'function' ? Entity : require(require('path').join(__dirname, 'Entity.js'))) {
	constructor (options) {
		super()

		this.type = 'image'

		this.clicked = false

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'source': ''
		}, options)

		// 'width' and 'height' options will be undefined by default.
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
		ctx.rotate(this.rotation * Math.PI / 180)

		let imageSource

		if (__canvaxImageCache.hasOwnProperty(this.source)) {
			if (__canvaxImageCache[this.source] === false) return

			imageSource = __canvaxImageCache[this.source]

			ctx.drawImage(imageSource, this.x, this.y, this.width, this.height)
		}
		else {
			__canvaxImageCache[this.source] = false

			imageSource = document.createElement('img')
			imageSource.src = this.source

			imageSource.onload = () => {
				__canvaxImageCache[this.source] = imageSource

				ctx.drawImage(imageSource, this.x, this.y, this.width, this.height)
			}
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
			const myBounds = this.getBounds()
			const checkBounds = entity.getBounds()

			return !(myBounds.t < checkBounds.b || myBounds.b > checkBounds.t || myBounds.r < checkBounds.l || myBounds.l > checkBounds.r)
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