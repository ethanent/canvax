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

		this.element.addEventListener('mousedown', (e) => this.sendEvent(e))
		this.element.addEventListener('mouseup', (e) => this.sendEvent(e))
	}

	sendEvent (e) {
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].processCanvasEvent(e, this)
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