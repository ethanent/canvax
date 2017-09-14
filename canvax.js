/**
* Canvax library
* @public
* @global
*/
const canvax = {
	'_imageCache': {},
	/**
	* Tests if an object is an HTMLElement
	* @private
	* @function
	* @param {Object} obj - Object to test
	* @returns {Boolean}
	*/
	'_isElement': (obj) => {
		try {
			return obj instanceof HTMLElement
		}
		catch (err) {
			return (typeof obj === 'object' && obj.hasOwnProperty('nodeType'))
		}
	},
	'_pointDistance': (p1, p2) => { // [x, y] format
		return Math.sqrt(Math.pow(Math.abs(p1[0] - p2[0]), 2) + Math.pow(Math.abs(p1[1] - p2[1]), 2))
	},
	/**
	* Renders an entity to a renderer's canvas
	* @private
	* @function
	* @param {canvax.Renderer} renderer
	* @param {canvax.Rectangle|canvax.Circle} entity
	*/
	'_renderEntityToCanvas': (renderer, entity) => {
		var ctx = renderer.ctx

		ctx.save()

		switch (entity.type) {
			case 'Rectangle':
				if (entity.backgroundColor !== 'none') {
					ctx.fillStyle = entity.backgroundColor
					ctx.fillRect(entity.x, entity.y, entity.width, entity.height)
				}
				if (entity.borderWeight !== '0' && entity.borderColor !== 'none') {
					ctx.strokeStyle = entity.borderColor
					ctx.lineWidth = entity.borderWeight
					ctx.strokeRect(entity.x, entity.y, entity.width, entity.height)
				}
				break
			case 'Circle':
				ctx.beginPath()
				ctx.arc(entity.x, entity.y, entity.radius, 0, 2 * Math.PI, false)
				if (entity.backgroundColor !== 'none') {
					ctx.fillStyle = entity.backgroundColor
					ctx.fill()
				}
				if (entity.borderWeight !== '0' && entity.borderColor !== 'none') {
					ctx.strokeStyle = entity.borderColor
					ctx.lineWidth = entity.borderWeight
					ctx.stroke()
				}
				break
			case 'Ellipse':
				var kappa = .5522847493
				var ox = (entity.width / 2) * kappa
				var oy = (entity.height / 2) * kappa
				var xe = entity.x + entity.width
				var ye = entity.y + entity.height
				var xm = entity.x + entity.width / 2
				var ym = entity.y + entity.height / 2

				ctx.beginPath()
				ctx.moveTo(entity.x, ym)
				ctx.bezierCurveTo(entity.x, ym - oy, xm - ox, entity.y, xm, entity.y)
				ctx.bezierCurveTo(xm + ox, entity.y, xe, ym - oy, xe, ym)
				ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
				ctx.bezierCurveTo(xm - ox, ye, entity.x, ym + oy, entity.x, ym)
				ctx.closePath()

				if (entity.backgroundColor !== 'none') {
					ctx.fillStyle = entity.backgroundColor
					ctx.fill()
				}
				if (entity.borderWeight !== '0' && entity.borderColor !== 'none') {
					ctx.strokeStyle = entity.borderColor
					ctx.lineWidth = entity.borderWeight
					ctx.stroke()
				}
				break
			case 'Image':
				ctx.rotate(entity.rotation * Math.PI / 180)
				if (canvax._imageCache.hasOwnProperty(entity.source)) {
					var imageSource = canvax._imageCache[entity.source]
				}
				else {
					var imageSource = new Image()
					imageSource.src = entity.source

					canvax._imageCache[entity.source] = imageSource
				}
				ctx.drawImage(imageSource, entity.x, entity.y, entity.width, entity.height)
				break
			case 'Text':
				ctx.fillStyle = entity.color
				ctx.font = entity.font
				ctx.textAlign = entity.alignment
				ctx.fillText(entity.text, entity.x, entity.y, (entity.maxWidth === 'none' ? null : entity.maxWidth))
				break
			case 'CustomEntity':
				entity.entityMethod(ctx, entity.properties)
				break
			default:
				break
		}

		ctx.restore()
	},
	/**
	* Renders entities to canvas by passing them to _renderEntityToCanvas
	* @private
	* @function
	* @param {canvax.Renderer} renderer
	* @param {Array.<canvax.Rectangle|canvax.Circle>} entities
	*/
	'_renderEntitiesToCanvas': (renderer, entities) => {
		for (let i = 0; i < entities.length; i++) {
			canvax._renderEntityToCanvas(renderer, entities[i])
		}
	},
	'_clearCanvas': (renderer, element) => {
		renderer.ctx.clearRect(0, 0, element.width, element.height)
	},
	// TODO add collision detection method
	// Renderer class
	/**
	* Returns a renderer object for a canvas element.
	* @public
	* @function
	* @param {HTMLCanvasElement} canvas - Canvas element
	* @param {boolean} autoRender - Automatically render the canvas using window.requestAnimationFrame?
	* @property {Array.<canvax.Rectangle|canvax.Circle>} entities
	* @property {HTMLCanvasElement} element
	* @property {CanvasRenderingContext2D} ctx
	* @property {function} add - (renderEntity): Adds an entity to the canvax Renderer
	* @property {function} clear - (): Removes all entities from the canvax Renderer
	* @property {function} render - (): Renders all entities to the Renderer canvas
	* @property {number} fps - Current frame rate, read only.
	*/
	'Renderer': function(element, autoRender) {
		if (canvax._isElement(element) && element.getContext) {
			this.entities = []
			this.element = element
			this.ctx = element.getContext('2d')

			this.add = (renderEntity) => {
				this.entities.push(renderEntity)
			}

			this.clear = () => {
				this.entities = []
			}

			this.render = () => {
				canvax._clearCanvas(this, this.element)
				canvax._renderEntitiesToCanvas(this, this.entities)
				this._fpsCount++
			}

			this._fpsCount = 0

			this.fps = 0

			if (autoRender) {
				this._autoRenderFrame = () => {
					this.render()
					window.requestAnimationFrame(this._autoRenderFrame)
				}

				this._autoRenderFrame()
			}

			setInterval(() => {
				this.fps = this._fpsCount * 5 // Because Canvax calculates FPS every 200ms.
				this._fpsCount = 0
			}, 200)
		}
		else {
			throw new Error('element is not a canvas element.')
		}
	},
	// Entities
	/**
	* Returns a Rectangle entity.
	* @public
	* @class
	* @param {number} x
	* @param {number} y
	* @param {string} width
	* @param {string} height
	* @param {string} [backgroundColor=none] - Background color of entity ('none' to render no background)
	* @param {string} [borderColor=#000000]  - Border color of entity ('none' to render no border)
	* @param {number} [borderWeight=3] - Border weight of entity in space units ('0' to render no border)
	* @property {number} x
	* @property {number} y
	* @property {number} width
	* @property {number} height
	* @property {string} backgroundColor
	* @property {string} borderColor
	* @property {string} borderWeight
	* @property {function} setPosition - (x, y)
	* @property {function} setSize - (width, height)
	*/
	'Rectangle': function(x, y, width, height, backgroundColor, borderColor, borderWeight) {
		if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
			this.type = 'Rectangle'

			this.x = x
			this.y = y
			this.width = width
			this.height = height

			this.backgroundColor = (backgroundColor || 'none')
			this.borderColor = (borderColor || '#000000')
			this.borderWeight = (borderWeight || '0px')

			// Update methods

			this.setPosition = (xset, yset) => {
				this.x = xset
				this.y = yset
			}

			this.setSize = (widthSet, heightSet) => {
				this.width = widthSet
				this.height = heightSet
			}

			this.getBounds = () => {
				return {
					'l': this.x - this.width / 2,
					't': this.y + this.height / 2,
					'r': this.x + this.width / 2,
					'b': this.y - this.height / 2,
				}
			}
		}
		else {
			throw new Error('Missing position parameter.')
		}
	},
	/**
	* Returns a Circle entity.
	* @public
	* @class
	* @param {number} x
	* @param {number} y
	* @param {string} radius
	* @param {string} [backgroundColor=none] - Background color of entity ('none' to render no background)
	* @param {string} [borderColor=#000000]  - Border color of entity ('none' to render no border)
	* @param {number} [borderWeight=3] - Border weight of entity in space units ('0' to render no border)
	* @property {number} x
	* @property {number} y
	* @property {number} radius
	* @property {string} backgroundColor
	* @property {string} borderColor
	* @property {string} borderWeight
	* @property {function} setPosition - (x, y)
	*/
	'Circle': function(x, y, radius, backgroundColor, borderColor, borderWeight) {
		if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof radius !== 'undefined') {
			this.type = 'Circle'

			this.x = x
			this.y = y
			this.radius = radius

			this.backgroundColor = (backgroundColor || 'none')
			this.borderColor = (borderColor || '#000000')
			this.borderWeight = (borderWeight || '0px')

			// Update methods

			this.setPosition = (xset, yset) => {
				this.x = xset
				this.y = yset
			}

			this.getBounds = () => {
				var halfRadius = this.radius / 2
				return {
					'l': this.x - halfRadius,
					't': this.y + halfRadius,
					'r': this.x + halfRadius,
					'b': this.y - halfRadius,
				}
			}
		}
		else {
			throw new Error('Missing position parameter.')
		}
	},
	/**
	* Returns an Ellipse entity.
	* @public
	* @class
	* @param {number} x
	* @param {number} y
	* @param {number} width
	* @param {number} height
	* @param {string} [backgroundColor=none] - Background color of entity ('none' to render no background)
	* @param {string} [borderColor=#000000]  - Border color of entity ('none' to render no border)
	* @param {number} [borderWeight=3] - Border weight of entity in space units ('0' to render no border)
	* @property {number} x
	* @property {number} y
	* @property {number} width
	* @property {number} height
	* @property {string} backgroundColor
	* @property {string} borderColor
	* @property {string} borderWeight
	* @property {function} setPosition - (x, y)
	* @property {function} setSize - (width, height)
	*/
	'Ellipse': function(x, y, width, height, backgroundColor, borderColor, borderWeight) {
		if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined') {
			this.type = 'Ellipse'

			this.x = x
			this.y = y
			this.width = width
			this.height = height

			this.backgroundColor = (backgroundColor || 'none')
			this.borderColor = (borderColor || '#000000')
			this.borderWeight = (borderWeight || '0px')

			// Update methods

			this.setPosition = (xset, yset) => {
				this.x = xset
				this.y = yset
			}

			this.setSize = (widthSet, heightSet) => {
				this.width = widthSet
				this.height = heightSet
			}

			this.getBounds = () => {
				return {
					'l': this.x - this.width / 2,
					't': this.y + this.height / 2,
					'r': this.x + this.width / 2,
					'b': this.y - this.height / 2,
				}
			}
		}
		else {
			throw new Error('Missing position parameter.')
		}
	},
	/**
	* Returns an Image entity.
	* @public
	* @class
	* @param {number} x - X coordinate of top left corner of image location
	* @param {number} y - Y coordinate of top left corner of image location
	* @param {number} width
	* @param {number} height
	* @param {string} source
	* @param {number} [rotation=0] - Rotation in degrees
	* @property {number} x - X coordinate of top left corner of image location
	* @property {number} y - Y coordinate of top left corner of image location
	* @property {number} width
	* @property {number} height
	* @property {string} source - Image source
	* @property {function} setPosition - (x, y)
	* @property {function} setSize - (width, height)
	*/
	'Image': function(x, y, width, height, source, rotation) {
		if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof width !== 'undefined' && typeof height !== 'undefined' && source) {
			this.type = 'Image'

			this.x = x
			this.y = y
			this.width = width
			this.height = height
			this.source = source
			this.rotation = rotation || 0

			// Update methods

			this.setPosition = (xset, yset) => {
				this.x = xset
				this.y = yset
			}

			this.setSize = (widthSet, heightSet) => {
				this.width = widthSet
				this.height = heightSet
			}

			this.getBounds = () => {
				return {
					'l': this.x,
					't': this.y,
					'r': this.x + this.width,
					'b': this.y - this.height,
				}
			}
		}
		else {
			throw new Error('Missing required Image configuration parameter.')
		}
	},
	/**
	* Returns a Text entity.
	* @public
	* @class
	* @param {number} x
	* @param {number} y
	* @param {number} text
	* @param {string} [font=30px Arial] - Text font and size
	* @param {string} [color=#000000] - Text color
	* @param {string} [alignment=start] - Text alignment ('start', 'end', 'left', 'right', or 'center')
	* @param {number|string} [maxWidth=none] - Maximum width of text
	* @property {number} x
	* @property {number} y
	* @property {string} text
	* @property {number} alignment
	* @property {function} setPosition - (x, y)
	*/
	'Text': function(x, y, text, font, color, alignment, maxWidth) {
		if (typeof x !== 'undefined' && typeof y !== 'undefined' && typeof text !== 'undefined') {
			this.type = 'Text'

			this.x = x
			this.y = y
			this.maxWidth = maxWidth || 'none'
			this.font = font || '30px Arial'
			this.text = text
			this.alignment = alignment || 'start'
			this.color = color || '#000000'

			// Update methods

			this.setPosition = (xset, yset) => {
				this.x = xset
				this.y = yset
			}
		}
		else {
			throw new Error('Missing required Text configuration parameter.')
		}
	},
	/**
	* Returns a custom entity.
	* @public
	* @class
	* @param {function} customEntityMethod - (CanvasRenderingContext2D, properties)
	* @param {Object} properties - Set of custom properties to pass to customEntityMethod on render
	*/
	'Entity': function(customEntityMethod, properties) {
		if (customEntityMethod) {
			this.type = 'CustomEntity'

			this.entityMethod = customEntityMethod

			this.properties = properties || {}
		}
		else {
			throw new Error('Missing entity method.')
		}
	}
}