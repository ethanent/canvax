module.exports = class EventEmitter {
	constructor () {
		this.listeners = {}
	}

	on (event, call) {
		if (this.listeners.hasOwnProperty(event)) {
			this.listeners[event].push(call)
		}
		else throw new Error('This entity does not emit event \'' + event + '\'.')
	}

	emit (event, data) {
		if (this.listeners.hasOwnProperty(event)) {
			for (let i = 0; i < this.listeners[event].length; i++) {
				this.listeners[event][i](data)
			}
		}
		else throw new Error('This entity is not able to emit event \'' + event + '\'.')
	}

	listen (events) {
		for (let i = 0; i < events.length; i++) {
			this.listeners[events[i]] = []
		}
	}
}