module.exports = class Entity extends (typeof EventEmitter === 'object' || typeof require !== 'function' ? EventEmitter : require(require('path').join(__dirname, 'EventEmitter.js'))) {
	constructor () {
		super()

		this.listeners = {
			'mousedown': [],
			'click': [],
			'mousein': [],
			'mouseout': []
		}
	}

	getEventPosition (e, renderer) {
		const rect = renderer.element.getBoundingClientRect()

		return {
			'x': e.clientX - rect.left,
			'y': e.clientY - rect.top
		}
	}
}