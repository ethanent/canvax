<p align="center" style="text-align: center;"><img src="https://raw.githubusercontent.com/ethanent/canvax/master/media/canvax-textIncluded.png" width="300" alt="canvax logo"/></p>

---

> Simple, lightweight, entity-based canvas library

[Full documentation](https://ethanent.github.io/canvax/) | [GitHub](https://github.com/Ethanent/canvax) | [NPM](https://www.npmjs.com/package/canvaxjs)

## Using canvax

The canvax library is super simple to use. To create a new renderer, go ahead and attach a new renderer to a canvas element.

```javascript
var game = new canvax.Renderer(document.querySelector("canvas"));
```

Let's render a rectangle on the canvas. Super simple.

```javascript
game.add(new canvax.Rectangle(0, 0, 100, 100));
game.render();
```

## Install canvax

```
npm install canvaxjs
```

... and then simply include the library in your page like so...

```html
<script src="node_modules/canvaxjs/canvax.min.js"></script>
```

## Full documentation

You can find the full documentation over [here](https://ethanent.github.io/canvax/). Have a look at the full docs for detailed library usage information.
