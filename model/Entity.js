import EventEmitter from "./EventEmitter"

export default class Entity extends EventEmitter {
	constructor () {
		super()

		this.listen(['click', 'mousedown', 'mousein', 'mouseout'])
	}

	getEventPosition (e, renderer) {
		const rect = renderer.element.getBoundingClientRect()

		return {
			'x': e.clientX - rect.left,
			'y': e.clientY - rect.top
		}
	}
}