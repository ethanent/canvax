/*

Canvax.JS

License information (OMv2-FO): https://github.com/omnent/omnent-licenses/blob/master/licenses/OMv2-FO.txt

Copyright 2017 Ethan Davis

Permission is hereby granted, for free, to any person obtaining a copy of this software and associated documentation files (collectively "the Software" or "THE SOFTWARE"), to (without restriction) use, modify, copy, publish, execute, distribute, sublicense, and sell the Software and to allow people who gain access to the Software to do the same as long as this entire license and the above copyright notice are included in all copies or portions of the Software.

NOTWITHSTANDING ANYTHING IN CONTRADICTION, THE AUTHORS AND COPYRIGHT HOLDERS OF THE SOFTWARE SHALL UNDER NO CIRCUMSTANCES BE HELD LIABLE FOR ANY DAMAGES, CLAIM, OR OTHER LIABILITY RELATED TO, IN CONNECTION WITH, OR CAUSED BY USE OR DISTRIBUTION OF THE SOFTWARE. THE SOFTWARE IS PROVIDED "AS-IS" AND IS NOT PROVIDED WITH WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NONINFRINGEMENT, AND ANY WARRANTY ARISING OUR OF PRIOR COURSE OF DEALING AND USAGE OF TRADE.

*/

/**
* Canvax library
* @public
* @namespace
*/
const canvax = {
	/**
	* Tests if an object is an HTMLElement
	* @private
	* @function
	* @param {Object} obj - Object to test
	* @returns {Boolean}
	*/
	"_isElement": (obj) => {
		try {
			return obj instanceof HTMLElement;
		}
		catch (err) {
			return (typeof obj === "object" && obj.hasOwnProperty("nodeType"));
		}
	},
	/**
	* Renders an entity to a renderer's canvas
	* @private
	* @function
	* @param {canvax.Renderer} renderer
	* @param {canvax.Rectangle|canvax.Circle} entity
	*/
	"_renderEntityToCanvas": (renderer, entity) => {
		// TODO render whatever

		var ctx = renderer.ctx;

		switch (entity.type) {
			case "Rectangle":
				if (entity.backgroundColor !== "none") {
					ctx.fillStyle = entity.backgroundColor;
					ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
				}
				if (entity.borderWeight !== "0" && entity.borderColor !== "none") {
					ctx.strokeStyle = entity.borderColor;
					ctx.lineWidth = entity.borderWeight;
					ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);
				}
				break;
			case "Circle":
				ctx.beginPath();
				ctx.arc(entity.x, entity.y, entity.radius, 0, 2 * Math.PI, false);
				if (entity.backgroundColor !== "none") {
					ctx.fillStyle = entity.backgroundColor;
					ctx.fill();
				}
				if (entity.borderWeight !== "0" && entity.borderColor !== "none") {
					ctx.strokeStyle = entity.borderColor;
					ctx.lineWidth = entity.borderWeight;
					ctx.stroke();
				}
				break;
			case "CustomEntity":
				entity.entityMethod(ctx);
				break;
		}
	},
	/**
	* Renders entities to canvas by passing them to _renderEntityToCanvas
	* @private
	* @function
	* @param {canvax.Renderer} renderer
	* @param {Array.<canvax.Rectangle|canvax.Circle>} entities
	*/
	"_renderEntitiesToCanvas": (renderer, entities) => {
		for (let i = 0; i < entities.length; i++) {
			canvax._renderEntityToCanvas(renderer, entities[i]);
		}
	},
	"_clearCanvas": (renderer, element) => {
		renderer.ctx.clearRect(0, 0, element.width, element.height);
	},
	/**
	* Returns a renderer object for a canvas element.
	* @public
	* @function
	* @param {HTMLCanvasElement} canvas - Canvas element
	* @property {Array.<canvax.Rectangle|canvax.Circle>} entities
	* @property {HTMLCanvasElement} element
	* @property {CanvasRenderingContext2D} ctx
	* @property {function} add - (renderEntity): Adds an entity to the canvax Renderer
	* @property {function} clear - (): Removes all entities from the canvax Renderer
	* @property {function} render - (): Renders all entities to the Renderer canvas
	*/
	"Renderer": function(element) {
		if (canvax._isElement(element) && element.getContext) {
			this.entities = [];
			this.element = element;
			this.ctx = element.getContext("2d");
			this.add = (renderEntity) => {
				this.entities.push(renderEntity);
			};
			this.clear = () => {
				this.entities = [];
			};
			this.render = () => {
				canvax._clearCanvas(this, this.element);
				canvax._renderEntitiesToCanvas(this, this.entities);
			}
		}
		else {
			throw new Error("element is not a canvas element.");
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
	"Rectangle": function(x, y, width, height, backgroundColor, borderColor, borderWeight) {
		if (x && y && width && height) {
			this.type = "Rectangle";

			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;

			this.backgroundColor = (backgroundColor || "none");
			this.borderColor = (borderColor || "#000000");
			this.borderWeight = (borderWeight || "0px");

			// Update methods

			this.setPosition = (xset, yset) => {
				this.x = xset;
				this.y = yset;
			};

			this.setSize = (width, height) => {
				this.width = width;
				this.height = height;
			};
		}
		else {
			throw new Error("Missing position parameter.");
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
	"Circle": function(x, y, radius, backgroundColor, borderColor, borderWeight) {
		if (x && y && radius) {
			this.type = "Circle";

			this.x = x;
			this.y = y;
			this.radius = radius;

			this.backgroundColor = (backgroundColor || "none");
			this.borderColor = (borderColor || "#000000");
			this.borderWeight = (borderWeight || "0px");

			// Update methods

			this.setPosition = (xset, yset) => {
				this.x = xset;
				this.y = yset;
			};
		}
		else {
			throw new Error("Missing position parameter.");
		}
	},
	/**
	* Returns a custom entity.
	* @public
	* @class
	* @param {function} customEntityMethod
	*/
	"Entity": function(customEntityMethod) {
		if (customEntityMethod) {
			this.type = "CustomEntity";

			this.entityMethod = customEntityMethod;
		}
		else {
			throw new Error("Missing entity method.");
		}
	}
};