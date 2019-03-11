module.exports = class Entity {
	constructor () {
		this.listeners = {
			'mousedown': [],
			'click': [],
			'mousein': [],
			'mouseout': []
		}
	}

	on (event, call) {
		if (this.listeners.hasOwnProperty(event)) {
			this.listeners[event].push(call)
		}
		else throw new Error('This entity does not emit event \'' + event + '\'.')
	}

	emit (event, data) {
		for (let i = 0; i < this.listeners[event].length; i++) {
			this.listeners[event][i](data)
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