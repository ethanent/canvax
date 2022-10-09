'use strict';

class EventEmitter {
	constructor () {
		this.listeners = {};
	}

	on (event, call) {
		if (this.listeners.hasOwnProperty(event)) {
			this.listeners[event].push(call);
		}
		else throw new Error('This entity does not emit event \'' + event + '\'.')
	}

	emit (event, data) {
		if (this.listeners.hasOwnProperty(event)) {
			for (let i = 0; i < this.listeners[event].length; i++) {
				this.listeners[event][i](data);
			}
		}
		else throw new Error('This entity is not able to emit event \'' + event + '\'.')
	}

	listen (events) {
		for (let i = 0; i < events.length; i++) {
			this.listeners[events[i]] = [];
		}
	}
}

class Entity extends EventEmitter {
	constructor () {
		super();

		this.listen(['click', 'mousedown', 'mousein', 'mouseout']);
	}

	getEventPosition (e, renderer) {
		const rect = renderer.element.getBoundingClientRect();

		return {
			'x': e.clientX - rect.left,
			'y': e.clientY - rect.top
		}
	}
}

class Circle extends Entity {
	constructor (options) {
		super();

		this.type = 'circle';

		this.clicked = false;
		this.mouseOver = false;

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'radius': 100,
			'backgroundColor': null,
			'borderColor': '#E74C3C',
			'borderWeight': 0
		}, options);
	}

	processCanvasEvent (e, renderer) {
		const point = this.getEventPosition(e, renderer);

		if (e.type === 'mousedown') {
			if (this.touchesPoint(point)) {
				this.emit('mousedown');

				this.clicked = true;
			}
		}
		else if (e.type === 'mouseup') {
			if (this.touchesPoint(point) && this.clicked) {
				this.emit('click');
			}

			this.clicked = false;
		}
		else if (e.type === 'mousemove') {
			if (this.touchesPoint(point)) {
				if (!this.mouseOver) {
					this.emit('mousein');

					this.mouseOver = true;
				}
			}
			else {
				if (this.mouseOver) {
					this.emit('mouseout');

					this.mouseOver = false;
				}
			}
		}
	}

	render (ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);

		if (typeof this.backgroundColor === 'string') {
			ctx.fillStyle = this.backgroundColor;
			
			ctx.fill();
		}

		if (typeof this.borderColor === 'string' && typeof this.borderWeight === 'number' && this.borderWeight > 0) {
			ctx.strokeStyle = this.borderColor;
			ctx.lineWidth = this.borderWeight;

			ctx.stroke();
		}
	}

	touchesPoint (point) {
		return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)) <= this.radius
	}

	touches (entity) {
		if (entity.type === 'circle') {
			return this._pointDistance([this.x, this.y], [entity.x, entity.y]) < this.radius + entity.radius
		}
		else if (entity.type === 'rectangle' || entity.type === 'image') {
			// Adapted from https://yal.cc/rectangle-circle-intersection-test/

			const deltaX = this.x - Math.max(entity.x, Math.min(this.x, entity.x + entity.width));
			const deltaY = this.y - Math.max(entity.y, Math.min(this.y, entity.y + entity.height));

			return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) < Math.pow(this.radius, 2)
		}
		else throw new Error('Cannot check touches for type ' + entity.type + '.')
	}

	_pointDistance (p1, p2) {
		return Math.sqrt(Math.pow(Math.abs(p1[0] - p2[0]), 2) + Math.pow(Math.abs(p1[1] - p2[1]), 2))
	}
}

class Ellipse extends Entity {
	constructor (options) {
		super();

		this.type = 'ellipse';

		this.listeners = {};

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'width': 100,
			'height': 100,
			'backgroundColor': null,
			'borderColor': '#E74C3C',
			'borderWeight': 0
		}, options);
	}

	processCanvasEvent (e, renderer) {}

	render (ctx) {
		var kappa = .5522847493;
		var ox = (this.width / 2) * kappa;
		var oy = (this.height / 2) * kappa;
		var xe = this.x + this.width;
		var ye = this.y + this.height;
		var xm = this.x + this.width / 2;
		var ym = this.y + this.height / 2;

		ctx.beginPath();
		ctx.moveTo(this.x, ym);
		ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
		ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
		ctx.closePath();

		if (typeof this.backgroundColor === 'string') {
			ctx.fillStyle = this.backgroundColor;

			ctx.fill();
		}

		if (typeof this.borderColor === 'string' && typeof this.borderWeight === 'number' && this.borderWeight > 0) {
			ctx.strokeStyle = this.borderColor;
			ctx.lineWidth = this.borderWeight;
			
			ctx.stroke();
		}
	}

	touches (entity) {
		throw new Error('Cannot check touches for type ' + this.type + '.')
	}
}

class Text extends Entity {
	constructor (options) {
		super();

		this.type = 'text';

		this.listeners = {};

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'text': '',
			'color': '#000000',
			'font': '20px Arial',
			'alignment': 'start'
		}, options);

		// 'maxWidth' option will be undefined by default.
	}

	processCanvasEvent (e, renderer) {}

	render (ctx) {
		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.textAlign = this.alignment;
		
		ctx.fillText(this.text, this.x, this.y, this.maxWidth);
	}

	touches (entity) {
		throw new Error('Cannot check touches for type ' + this.type + '.')
	}
}

const __canvaxImageCache = {};

class Image extends Entity {
	constructor (options) {
		super();

		this.type = 'image';

		this.clicked = false;
		this.mouseOver = false;

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'source': ''
		}, options);

		// 'width' and 'height' options will be undefined by default.
	}

	processCanvasEvent (e, renderer) {
		const point = this.getEventPosition(e, renderer);

		if (e.type === 'mousedown') {
			if (this.touchesPoint(point)) {
				this.emit('mousedown');

				this.clicked = true;
			}
		}
		else if (e.type === 'mouseup') {
			if (this.touchesPoint(point) && this.clicked) {
				this.emit('click');
			}

			this.clicked = false;
		}
		else if (e.type === 'mousemove') {
			if (this.touchesPoint(point)) {
				if (!this.mouseOver) {
					this.emit('mousein');

					this.mouseOver = true;
				}
			}
			else {
				if (this.mouseOver) {
					this.emit('mouseout');

					this.mouseOver = false;
				}
			}
		}
	}

	render (ctx) {
		ctx.rotate(this.rotation * Math.PI / 180);

		let imageSource;

		if (__canvaxImageCache.hasOwnProperty(this.source)) {
			if (__canvaxImageCache[this.source] === false) return

			imageSource = __canvaxImageCache[this.source];

			ctx.drawImage(imageSource, this.x, this.y, this.width, this.height);
		}
		else {
			__canvaxImageCache[this.source] = false;

			imageSource = document.createElement('img');
			imageSource.src = this.source;

			imageSource.onload = () => {
				__canvaxImageCache[this.source] = imageSource;

				ctx.drawImage(imageSource, this.x, this.y, this.width, this.height);
			};
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
			const myBounds = this.getBounds();
			const checkBounds = entity.getBounds();

			return !(myBounds.t < checkBounds.b || myBounds.b > checkBounds.t || myBounds.r < checkBounds.l || myBounds.l > checkBounds.r)
		}
		else if (entity.type === 'circle') {
			// Adapted from https://yal.cc/rectangle-circle-intersection-test/

			const deltaX = entity.x - Math.max(this.x, Math.min(entity.x, this.x + this.width));
			const deltaY = entity.y - Math.max(this.y, Math.min(entity.y, this.y + this.height));

			return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) < Math.pow(entity.radius, 2)
		}
		else throw new Error('Cannot check touches for type ' + entity.type + '.')
	}
}

class Rectangle extends Entity {
	constructor (options) {
		super();

		this.type = 'rectangle';

		this.clicked = false;
		this.mouseOver = false;

		Object.assign(this, {
			'x': 0,
			'y': 0,
			'width': 100,
			'height': 100,
			'backgroundColor': null,
			'borderColor': '#E74C3C',
			'borderWeight': 0
		}, options);
	}

	processCanvasEvent (e, renderer) {
		const point = this.getEventPosition(e, renderer);

		if (e.type === 'mousedown') {
			if (this.touchesPoint(point)) {
				this.emit('mousedown');

				this.clicked = true;
			}
		}
		else if (e.type === 'mouseup') {
			if (this.touchesPoint(point) && this.clicked) {
				this.emit('click');
			}

			this.clicked = false;
		}
		else if (e.type === 'mousemove') {
			if (this.touchesPoint(point)) {
				if (!this.mouseOver) {
					this.emit('mousein');

					this.mouseOver = true;
				}
			}
			else {
				if (this.mouseOver) {
					this.emit('mouseout');

					this.mouseOver = false;
				}
			}
		}
	}

	render (ctx) {
		if (typeof this.backgroundColor === 'string') {
			ctx.fillStyle = this.backgroundColor;
			
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}

		if (typeof this.borderColor === 'string' && typeof this.borderWeight === 'number' && this.borderWeight > 0) {
			ctx.strokeStyle = this.borderColor;
			ctx.lineWidth = this.borderWeight;

			ctx.strokeRect(this.x, this.y, this.width, this.height);
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
			const a = this.getBounds();
			const b = entity.getBounds();

			return (a.l < b.r && a.r > b.l && a.t > b.b && a.b < b.t)
		}
		else if (entity.type === 'circle') {
			// Adapted from https://yal.cc/rectangle-circle-intersection-test/

			const deltaX = entity.x - Math.max(this.x, Math.min(entity.x, this.x + this.width));
			const deltaY = entity.y - Math.max(this.y, Math.min(entity.y, this.y + this.height));

			return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) < Math.pow(entity.radius, 2)
		}
		else throw new Error('Cannot check touches for type ' + entity.type + '.')
	}
}

class Renderer extends EventEmitter {
	constructor (element, autoRender = false) {
		super();

		this.listen(['resize']);

		this.element = element;

		this.ctx = this.element.getContext('2d');
		this.entities = [];

		this._f = 0;
		this.fps = 0;

		setInterval(() => {
			this.fps = this._f;
			this._f = 0;
		}, 1000);

		this.fullPageMode = false;

		if (autoRender) {
			this._repeatRender = () => {
				this.render();

				window.requestAnimationFrame(this._repeatRender);
			};

			this._repeatRender();
		}

		this.element.addEventListener('mousedown', (e) => this.sendEvent(e));
		this.element.addEventListener('mouseup', (e) => this.sendEvent(e));
		this.element.addEventListener('mousemove', (e) => this.sendEvent(e));
	}

	sendEvent (e) {
		for (let i = 0; i < this.entities.length; i++) {
			if (typeof this.entities[i] !== 'function') {
				this.entities[i].processCanvasEvent(e, this);
			}
		}
	}

	render () {
		this._clearCanvas();

		for (let i = 0; i < this.entities.length; i++) {
			if (typeof this.entities[i] === 'function') {
				this.entities[i]().render(this.ctx);
			}
			else this.entities[i].render(this.ctx);
		}

		if (this.fullPageMode) {
			if (this.element.height !== window.innerHeight || this.element.width !== window.innerWidth) {
				this.element.height = window.innerHeight;

				this.element.width = window.innerWidth;

				this.emit('resize');
			}
		}

		this._f++;
	}

	add (entity) { // Can be Entity or dynamic entity
		this.entities.push(entity);
	}

	remove (entity) { // Can be Entity or dynamic entity
		const idx = this.entities.indexOf(entity);

		if (idx !== -1) {
			this.entities.splice(idx, 1);

			return true
		}

		return false
	}

	clear () {
		this.entities = [];
	}

	fullPage () {
		document.body.style.margin = '0';
		document.body.style.padding = '0';

		this.element.style.display = 'block';
		
		this.fullPageMode = true;
	}

	_clearCanvas () {
		this.ctx.save();

		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		this.ctx.clearRect(0, 0, this.element.width, this.element.height);

		this.ctx.restore();
	}
}

const canvax = {Entity, Circle, Ellipse, Text, Image, Rectangle, EventEmitter, Renderer};

module.exports = canvax;
