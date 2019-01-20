module.exports = class Image {
	constructor (options) {
		this.type = 'image'

		this._imageCache = {}

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'source': ''
		}, options)

		// 'width' and 'height' options will be undefined by default.
	}

	render (ctx) {
		ctx.rotate(this.rotation * Math.PI / 180)

		let imageSource

		if (this._imageCache.hasOwnProperty(this.source)) {
			if (this._imageCache[this.source] === false) return

			imageSource = this._imageCache[this.source]

			ctx.drawImage(imageSource, this.x, this.y, this.width, this.height)
		}
		else {
			this._imageCache[this.source] = false

			imageSource = new window.Image()
			imageSource.src = this.source

			imageSource.onload = () => {
				this._imageCache[this.source] = imageSource

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