# canvax
>Simple, lightweight, entity-based canvas library

---

### Use canvax

It's super simple, mate. Just insert the JS file like so.

```html
<!-- ... -->
<head>
	<script src="canvax.js" defer></script>
</head>
<!-- ... -->
```

### Really use Canvax

Okay, so the Canvax library is really simple to use. To create a new renderer, go ahead and attach the thing to the canvas element.

```js
var game = canvax.attach(document.querySelector("canvas"));
```

Let's render a rectangle on the canvas. Super simple.

```js
game.add(new canvax.Rectangle(0, 0, 100, 100, ""));
game.render();
```