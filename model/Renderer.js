module.exports = class Renderer extends (typeof EventEmitter === 'object' || typeof require !== 'function' ? EventEmitter : require(require('path').join(__dirname, 'EventEmitter.js'))) {
	constructor (element, autoRender = false) {
		super()

		this.listen(['resize'])

		this.element = element

		this.ctx = this.element.getContext('2d')
		this.entities = []

		this._f = 0
		this.fps = 0

		setInterval(() => {
			this.fps = this._f
			this._f = 0
		}, 1000)

		this.fullPageMode = false

		if (autoRender) {
			this._repeatRender = () => {
				this.render()

				window.requestAnimationFrame(this._repeatRender)
			}

			this._repeatRender()
		}

		this.element.addEventListener('mousedown', (e) => this.sendEvent(e))
		this.element.addEventListener('mouseup', (e) => this.sendEvent(e))
		this.element.addEventListener('mousemove', (e) => this.sendEvent(e))
	}

	sendEvent (e) {
		for (let i = 0; i < this.entities.length; i++) {
			if (typeof this.entities[i] !== 'function') {
				this.entities[i].processCanvasEvent(e, this)
			}
		}
	}

	render () {
		this._clearCanvas()

		for (let i = 0; i < this.entities.length; i++) {
			if (typeof this.entities[i] === 'function') {
				this.entities[i]().render(this.ctx)
			}
			else this.entities[i].render(this.ctx)
		}

		if (this.fullPageMode) {
			if (this.element.height !== window.innerHeight || this.element.width !== window.innerWidth) {
				this.element.height = window.innerHeight

				this.element.width = window.innerWidth

				this.emit('resize')
			}
		}

		this._f++
	}

	add (entity) { // Can be Entity or dynamic entity
		this.entities.push(entity)
	}

	remove (entity) { // Can be Entity or dynamic entity
		const idx = this.entities.indexOf(entity)

		if (idx !== -1) {
			this.entities.splice(idx, 1)

			return true
		}

		return false
	}

	clear () {
		this.entities = []
	}

	fullPage () {
		document.body.style.margin = '0'
		document.body.style.padding = '0'

		this.element.style.display = 'block'
		
		this.fullPageMode = true
	}

	_clearCanvas () {
		this.ctx.save()

		this.ctx.setTransform(1, 0, 0, 1, 0, 0)
		
		this.ctx.clearRect(0, 0, this.element.width, this.element.height)

		this.ctx.restore()
	}
}