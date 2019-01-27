const canvax = (() => {
const build = {}

let module = {}

module.exports = class Circle {
	constructor (options) {
		this.type = 'circle'

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'radius': 100,
			'backgroundColor': null,
			'borderColor': '#E74C3C',
			'borderWeight': 0
		}, options)
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

build['Circle'] = module.exports

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

build['Ellipse'] = module.exports

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

build['Image'] = module.exports

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

build['Rectangle'] = module.exports

module.exports = class Renderer {
	constructor (element, autoRender = false) {
		this.element = element

		this.ctx = this.element.getContext('2d')
		this.entities = []

		if (autoRender) {
			this._repeatRender = () => {
				this.render()

				window.requestAnimationFrame(this._repeatRender)
			}

			this._repeatRender()
		}
	}

	render () {
		this._clearCanvas()

		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].render(this.ctx)
		}
	}

	add (entity) {
		this.entities.push(entity)
	}

	clear () {
		this.entities = []
	}

	_clearCanvas () {
		this.ctx.save()

		this.ctx.setTransform(1, 0, 0, 1, 0, 0)
		
		this.ctx.clearRect(0, 0, this.element.width, this.element.height)

		this.ctx.restore()
	}
}

build['Renderer'] = module.exports

module.exports = class Text {
	constructor (options) {
		this.type = 'text'

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

build['Text'] = module.exports

return build

})()