var game = new canvax.Renderer(document.getElementById("gameCanvas"));

var fishURL = (Math.floor(Math.random() * 2) === 1 ? "https://media.giphy.com/media/tucMx1XCeZlOo/giphy.gif" : "http://piq.codeus.net/static/media/userpics/piq_164380_400x400.png");

var fish = new canvax.Rectangle(50, 600, 400 / 4, 400 / 4, fishURL);

var fps = new canvax.Text(30, 100, "Hey", "80px Arial");

//game.add(fps);
game.add(fish);

var renderFrame = () => {
	game.render();
	requestAnimationFrame(renderFrame);
};

renderFrame();

document.addEventListener("keypress", (e) => {
	var key = e.key.toLowerCase();

	if (key === " ") {
		velY = 5;
	}
});

var velY = 10;

setInterval(() => {
	velY += -0.1;

	fish.y -= velY;

	if (fish.y > game.element.height || fish.y < 0) {
		//console.log("Game over!");
	}
}, 8);

var Pipe = function () {
	this.x = game.element.width + 50;
	this.randomOffset = Math.floor(Math.random() * 100);
	this.gapSize = 440 + Math.floor(Math.random() * 50);
	this.rectTop = new canvax.Rectangle(this.x, this.randomOffset + this.gapSize, 120, 700, "#01C200", "#003600", 5);
	this.rectBottom = new canvax.Rectangle(this.x, this.randomOffset - this.gapSize, 120, 700, "#01C200", "#003600", 5);

	setInterval(() => {
		this.x -= 3;
		this.rectTop.x = this.x;
		this.rectBottom.x = this.x;

		var tb = this.rectTop.getBounds();

		var bb = this.rectBottom.getBounds();

		if (this.rectTop.intersects(fish) || this.rectBottom.intersects(fish)) {
			this.x = 1000
		}
	}, 10);
};

setInterval(() => {
	console.log("adding pipe");
	var pipeGen = new Pipe();
	game.add(pipeGen.rectTop);
	game.add(pipeGen.rectBottom);
}, 2000);