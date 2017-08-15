# canvax
>Simple, lightweight, entity-based canvas library

---

[Full documentation](https://ethanent.github.io/canvax/) | [GitHub](https://github.com/Ethanent/canvax) | [NPM](https://www.npmjs.com/package/canvaxjs)

### Use canvax

It's really simple! Just insert the JS file like so after installing.

```html
<!-- ... -->
<head>
	<script src="node_modules/canvaxjs/canvax.min.js"></script>
</head>
<!-- ... -->
```

### Really use Canvax

Okay, so the Canvax library is really simple to use. To create a new renderer, go ahead and attach the thing to the canvas element.

```javascript
var game = new canvax.Renderer(document.querySelector("canvas"));
```

Let's render a rectangle on the canvas. Super simple.

```javascript
game.add(new canvax.Rectangle(0, 0, 100, 100));
game.render();
```

### Full Documentation

You can find the full documentation over [here](https://ethanent.github.io/canvax/)!

### Install canvax

```
npm install canvaxjs
```

... and then simply include the library in your page like so...

```html
<script src="node_modules/canvaxjs/canvax.min.js"></script>
```
